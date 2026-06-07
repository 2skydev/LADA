use std::{
    fmt, fs, io,
    path::{Path, PathBuf},
};

use base64::{Engine, engine::general_purpose::STANDARD};
use futures_util::{SinkExt, StreamExt};
use native_tls::TlsConnector;
use reqwest::{Client, StatusCode};
use serde_json::{Value, json};
use sysinfo::System;
use thiserror::Error;
use tokio_tungstenite::{
    Connector,
    tungstenite::{
        Message,
        client::IntoClientRequest,
        http::{
            HeaderValue,
            header::{AUTHORIZATION, HeaderName},
        },
    },
};

pub const READY_CHECK_PATH: &str = "/lol-matchmaking/v1/ready-check";
pub const READY_CHECK_ACCEPT_PATH: &str = "/lol-matchmaking/v1/ready-check/accept";
pub const READY_CHECK_TOPIC: &str = "OnJsonApiEvent_lol-matchmaking_v1_ready-check";
pub const CURRENT_SUMMONER_PATH: &str = "/lol-summoner/v1/current-summoner";
const WAMP_PROTOCOL: &str = "wamp";

#[derive(Debug, Error)]
pub enum LcuError {
    #[error("lockfile not found")]
    LockfileNotFound,
    #[error("failed to read lockfile: {0}")]
    ReadLockfile(#[from] io::Error),
    #[error("invalid lockfile format")]
    InvalidLockfile,
    #[error("invalid port in lockfile")]
    InvalidPort,
    #[error("invalid header value: {0}")]
    InvalidHeader(#[from] reqwest::header::InvalidHeaderValue),
    #[error("request failed: {0}")]
    Request(#[from] reqwest::Error),
    #[error("json failed: {0}")]
    Json(#[from] serde_json::Error),
    #[error("websocket failed: {0}")]
    WebSocket(#[from] tokio_tungstenite::tungstenite::Error),
    #[error("tls setup failed: {0}")]
    Tls(#[from] native_tls::Error),
    #[error("unexpected LCU status: {0}")]
    UnexpectedStatus(StatusCode),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Lockfile {
    pub path: PathBuf,
    pub process: String,
    pub pid: u32,
    pub port: u16,
    pub password: String,
    pub protocol: String,
}

impl Lockfile {
    pub fn parse(content: &str, path: PathBuf) -> Result<Self, LcuError> {
        let parts: Vec<&str> = content.trim().split(':').collect();
        if parts.len() != 5 {
            return Err(LcuError::InvalidLockfile);
        }

        Ok(Self {
            path,
            process: parts[0].to_string(),
            pid: parts[1].parse().map_err(|_| LcuError::InvalidLockfile)?,
            port: parts[2].parse().map_err(|_| LcuError::InvalidPort)?,
            password: parts[3].to_string(),
            protocol: parts[4].to_string(),
        })
    }

    pub fn read(path: impl Into<PathBuf>) -> Result<Self, LcuError> {
        let path = path.into();
        Self::parse(&fs::read_to_string(&path)?, path)
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Credentials {
    pub lockfile_path: PathBuf,
    pub port: u16,
    pub password: String,
    pub protocol: String,
}

impl Credentials {
    fn http_base_url(&self) -> String {
        format!(
            "{}://127.0.0.1:{}",
            self.protocol.trim_end_matches('/'),
            self.port
        )
    }

    fn websocket_url(&self) -> String {
        let scheme = if self.protocol.eq_ignore_ascii_case("http") {
            "ws"
        } else {
            "wss"
        };
        format!("{scheme}://127.0.0.1:{}/", self.port)
    }

    fn auth_header(&self) -> String {
        format!(
            "Basic {}",
            STANDARD.encode(format!("riot:{}", self.password))
        )
    }
}

impl From<Lockfile> for Credentials {
    fn from(value: Lockfile) -> Self {
        Self {
            lockfile_path: value.path,
            port: value.port,
            password: value.password,
            protocol: value.protocol,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ReadyCheck {
    pub player_response: PlayerResponse,
    pub timer: u64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PlayerResponse {
    None,
    Accepted,
    Declined,
    Other,
}

impl PlayerResponse {
    fn from_lcu(value: &str) -> Self {
        match value {
            "None" => Self::None,
            "Accepted" => Self::Accepted,
            "Declined" => Self::Declined,
            _ => Self::Other,
        }
    }
}

impl fmt::Display for PlayerResponse {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::None => formatter.write_str("None"),
            Self::Accepted => formatter.write_str("Accepted"),
            Self::Declined => formatter.write_str("Declined"),
            Self::Other => formatter.write_str("Other"),
        }
    }
}

#[derive(Clone)]
pub struct LcuClient {
    credentials: Credentials,
    http: Client,
}

impl LcuClient {
    pub fn new(credentials: Credentials) -> Result<Self, LcuError> {
        let http = Client::builder()
            .danger_accept_invalid_certs(true)
            .danger_accept_invalid_hostnames(true)
            .build()?;

        Ok(Self { credentials, http })
    }

    pub fn credentials(&self) -> &Credentials {
        &self.credentials
    }

    pub async fn is_ready(&self) -> Result<bool, LcuError> {
        let response = self
            .http
            .get(format!(
                "{}{}",
                self.credentials.http_base_url(),
                CURRENT_SUMMONER_PATH
            ))
            .header(AUTHORIZATION.as_str(), self.credentials.auth_header())
            .send()
            .await?;

        if !response.status().is_success() {
            return Ok(false);
        }

        let value: Value = response.json().await?;
        Ok(value.get("summonerId").and_then(Value::as_u64).is_some())
    }

    pub async fn ready_check(&self) -> Result<Option<ReadyCheck>, LcuError> {
        let response = self
            .http
            .get(format!(
                "{}{}",
                self.credentials.http_base_url(),
                READY_CHECK_PATH
            ))
            .header(AUTHORIZATION.as_str(), self.credentials.auth_header())
            .send()
            .await?;

        if response.status() == StatusCode::NOT_FOUND {
            return Ok(None);
        }

        if !response.status().is_success() {
            return Err(LcuError::UnexpectedStatus(response.status()));
        }

        let value = response.json().await?;
        Ok(parse_ready_check_data(&value))
    }

    pub async fn accept_ready_check(&self) -> Result<(), LcuError> {
        let response = self
            .http
            .post(format!(
                "{}{}",
                self.credentials.http_base_url(),
                READY_CHECK_ACCEPT_PATH
            ))
            .header(AUTHORIZATION.as_str(), self.credentials.auth_header())
            .send()
            .await?;

        if response.status().is_success() {
            Ok(())
        } else {
            Err(LcuError::UnexpectedStatus(response.status()))
        }
    }

    pub async fn ready_check_events(&self) -> Result<ReadyCheckEvents, LcuError> {
        let mut request = self.credentials.websocket_url().into_client_request()?;
        request.headers_mut().insert(
            AUTHORIZATION,
            HeaderValue::from_str(&self.credentials.auth_header())?,
        );
        request.headers_mut().insert(
            HeaderName::from_static("sec-websocket-protocol"),
            HeaderValue::from_static(WAMP_PROTOCOL),
        );

        let connector = if self.credentials.protocol.eq_ignore_ascii_case("http") {
            Connector::Plain
        } else {
            let tls = TlsConnector::builder()
                .danger_accept_invalid_certs(true)
                .danger_accept_invalid_hostnames(true)
                .build()?;
            Connector::NativeTls(tls)
        };

        let (mut socket, _) =
            tokio_tungstenite::connect_async_tls_with_config(request, None, false, Some(connector))
                .await?;

        socket
            .send(Message::Text(
                serde_json::to_string(&json!([5, READY_CHECK_TOPIC]))
                    .expect("ready-check subscription is serializable")
                    .into(),
            ))
            .await?;

        Ok(ReadyCheckEvents { socket })
    }
}

pub struct ReadyCheckEvents {
    socket: tokio_tungstenite::WebSocketStream<
        tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>,
    >,
}

impl ReadyCheckEvents {
    pub async fn next(&mut self, client: &LcuClient) -> Result<Option<ReadyCheck>, LcuError> {
        while let Some(message) = self.socket.next().await {
            match message? {
                Message::Text(text) => match parse_ready_check_event_message(text.as_ref())? {
                    ReadyCheckEventMessage::Ignored => {}
                    ReadyCheckEventMessage::Changed(Some(event)) => return Ok(Some(event)),
                    ReadyCheckEventMessage::Changed(None) => {
                        if let Some(event) = client.ready_check().await? {
                            return Ok(Some(event));
                        }
                    }
                },
                Message::Ping(payload) => self.socket.send(Message::Pong(payload)).await?,
                Message::Close(_) => return Ok(None),
                _ => {}
            }
        }

        Ok(None)
    }
}

pub fn discover_lockfile(league_dir: &str) -> Result<Lockfile, LcuError> {
    for path in lockfile_candidates(league_dir) {
        if path.exists() {
            return Lockfile::read(path);
        }
    }

    Err(LcuError::LockfileNotFound)
}

pub fn lockfile_candidates(league_dir: &str) -> Vec<PathBuf> {
    let mut candidates = Vec::new();

    let trimmed_dir = league_dir.trim();
    if !trimmed_dir.is_empty() {
        candidates.push(PathBuf::from(trimmed_dir).join("lockfile"));
    }

    candidates.extend(process_lockfile_candidates());
    candidates.push(PathBuf::from(r"C:\Riot Games\League of Legends\lockfile"));
    dedupe_paths(candidates)
}

pub fn parse_ready_check_event(message: &str) -> Result<Option<ReadyCheck>, serde_json::Error> {
    match parse_ready_check_event_message(message)? {
        ReadyCheckEventMessage::Ignored | ReadyCheckEventMessage::Changed(None) => Ok(None),
        ReadyCheckEventMessage::Changed(Some(event)) => Ok(Some(event)),
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum ReadyCheckEventMessage {
    Ignored,
    Changed(Option<ReadyCheck>),
}

fn parse_ready_check_event_message(
    message: &str,
) -> Result<ReadyCheckEventMessage, serde_json::Error> {
    let value: Value = serde_json::from_str(message)?;
    let Some(items) = value.as_array() else {
        return Ok(ReadyCheckEventMessage::Ignored);
    };

    if items.len() < 3 || items.first().and_then(Value::as_i64) != Some(8) {
        return Ok(ReadyCheckEventMessage::Ignored);
    }

    if items.get(1).and_then(Value::as_str) != Some(READY_CHECK_TOPIC) {
        return Ok(ReadyCheckEventMessage::Ignored);
    }

    let Some(data) = items.get(2).and_then(|payload| payload.get("data")) else {
        return Ok(ReadyCheckEventMessage::Changed(None));
    };

    Ok(ReadyCheckEventMessage::Changed(parse_ready_check_data(
        data,
    )))
}

fn parse_ready_check_data(data: &Value) -> Option<ReadyCheck> {
    let player_response = data
        .get("playerResponse")
        .and_then(Value::as_str)
        .map(PlayerResponse::from_lcu)?;
    let timer = data.get("timer").and_then(parse_timer).unwrap_or_default();

    Some(ReadyCheck {
        player_response,
        timer,
    })
}

fn parse_timer(value: &Value) -> Option<u64> {
    if let Some(timer) = value.as_u64() {
        return Some(timer);
    }

    if let Some(timer) = value.as_f64() {
        return Some(timer.max(0.0).floor() as u64);
    }

    value
        .as_str()
        .and_then(|timer| timer.parse::<f64>().ok())
        .map(|timer| timer.max(0.0).floor() as u64)
}

fn process_lockfile_candidates() -> Vec<PathBuf> {
    let system = System::new_all();
    let mut candidates = Vec::new();

    for process in system.processes().values() {
        let name = process.name().to_string_lossy();
        if !name.eq_ignore_ascii_case("LeagueClientUx.exe")
            && !name.eq_ignore_ascii_case("LeagueClient.exe")
        {
            continue;
        }

        if let Some(exe) = process.exe()
            && let Some(dir) = exe.parent()
        {
            candidates.push(dir.join("lockfile"));
        }

        for command in process.cmd() {
            if let Some(path) = command.to_str().and_then(extract_league_dir_from_command) {
                candidates.push(path.join("lockfile"));
            }
        }
    }

    candidates
}

fn extract_league_dir_from_command(command: &str) -> Option<PathBuf> {
    let path = Path::new(command.trim_matches('"'));
    if path
        .file_name()?
        .to_string_lossy()
        .eq_ignore_ascii_case("LeagueClientUx.exe")
        || path
            .file_name()?
            .to_string_lossy()
            .eq_ignore_ascii_case("LeagueClient.exe")
    {
        return path.parent().map(Path::to_path_buf);
    }

    None
}

fn dedupe_paths(paths: Vec<PathBuf>) -> Vec<PathBuf> {
    let mut result = Vec::new();
    for path in paths {
        if !result.iter().any(|existing: &PathBuf| existing == &path) {
            result.push(path);
        }
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_valid_lockfile() {
        let parsed = Lockfile::parse(
            "LeagueClient:1234:4567:secret:https",
            PathBuf::from("lockfile"),
        )
        .unwrap();

        assert_eq!(parsed.process, "LeagueClient");
        assert_eq!(parsed.pid, 1234);
        assert_eq!(parsed.port, 4567);
        assert_eq!(parsed.password, "secret");
        assert_eq!(parsed.protocol, "https");
    }

    #[test]
    fn rejects_invalid_lockfile() {
        assert!(matches!(
            Lockfile::parse("LeagueClient:1234:4567:secret", PathBuf::new()),
            Err(LcuError::InvalidLockfile)
        ));
    }

    #[test]
    fn parses_ready_check_wamp_event() {
        let message = r#"[8,"OnJsonApiEvent_lol-matchmaking_v1_ready-check",{"data":{"playerResponse":"None","timer":3},"eventType":"Update","uri":"/lol-matchmaking/v1/ready-check"}]"#;

        let event = parse_ready_check_event(message).unwrap().unwrap();

        assert_eq!(event.player_response, PlayerResponse::None);
        assert_eq!(event.timer, 3);
    }

    #[test]
    fn parses_ready_check_timer_as_float_or_string() {
        let float_message = r#"[8,"OnJsonApiEvent_lol-matchmaking_v1_ready-check",{"data":{"playerResponse":"None","timer":3.9}}]"#;
        let string_message = r#"[8,"OnJsonApiEvent_lol-matchmaking_v1_ready-check",{"data":{"playerResponse":"None","timer":"4.2"}}]"#;

        assert_eq!(
            parse_ready_check_event(float_message)
                .unwrap()
                .unwrap()
                .timer,
            3
        );
        assert_eq!(
            parse_ready_check_event(string_message)
                .unwrap()
                .unwrap()
                .timer,
            4
        );
    }

    #[test]
    fn ignores_ready_check_event_without_ready_check_data() {
        let message = r#"[8,"OnJsonApiEvent_lol-matchmaking_v1_ready-check",{"data":null}]"#;

        assert!(parse_ready_check_event(message).unwrap().is_none());
    }

    #[test]
    fn ignores_non_ready_check_wamp_event() {
        let message = r#"[8,"OnJsonApiEvent_lol-summoner_v1_current-summoner",{"data":{}}]"#;

        assert!(parse_ready_check_event(message).unwrap().is_none());
    }
}
