use std::{future::Future, sync::Arc, time::Duration};

use thiserror::Error;
use tokio::{sync::watch, task::JoinHandle, time};
use tracing::{debug, error, info};

use crate::{
    config::AppConfig,
    lcu::{self, Credentials, LcuClient, PlayerResponse, ReadyCheck},
};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BackendStatus {
    Disconnected,
    Connected,
    Waiting,
    Accepted,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum AcceptDecision {
    Ignore,
    CancelPending,
    Schedule(Duration),
}

#[derive(Debug, Error)]
pub enum AutoAcceptError {
    #[error("LCU error: {0}")]
    Lcu(#[from] lcu::LcuError),
}

pub type StatusCallback = Arc<dyn Fn(BackendStatus) + Send + Sync + 'static>;

pub async fn run(
    mut config_rx: watch::Receiver<AppConfig>,
    mut shutdown_rx: watch::Receiver<bool>,
    status_callback: StatusCallback,
) {
    let mut last_credentials: Option<Credentials> = None;

    loop {
        if *shutdown_rx.borrow() {
            return;
        }

        let config = config_rx.borrow().clone();
        let lockfile = match lcu::discover_lockfile(&config.league_dir) {
            Ok(lockfile) => lockfile,
            Err(error) => {
                debug!("LCU lockfile not available: {error}");
                (status_callback)(BackendStatus::Disconnected);
                wait_for_retry_or_change(&mut config_rx, &mut shutdown_rx).await;
                continue;
            }
        };

        let credentials = Credentials::from(lockfile);
        if last_credentials.as_ref() != Some(&credentials) {
            info!("LCU credentials updated");
            last_credentials = Some(credentials.clone());
        }

        match run_session(
            credentials,
            &mut config_rx,
            &mut shutdown_rx,
            Arc::clone(&status_callback),
        )
        .await
        {
            Ok(()) => {}
            Err(error) => {
                debug!("LCU session ended: {error}");
                (status_callback)(BackendStatus::Disconnected);
                wait_for_retry_or_change(&mut config_rx, &mut shutdown_rx).await;
            }
        }
    }
}

async fn run_session(
    credentials: Credentials,
    config_rx: &mut watch::Receiver<AppConfig>,
    shutdown_rx: &mut watch::Receiver<bool>,
    status_callback: StatusCallback,
) -> Result<(), AutoAcceptError> {
    let client = LcuClient::new(credentials.clone())?;
    let mut events = client.ready_check_events().await?;
    let mut scheduler = AcceptScheduler::default();
    let mut lockfile_check = time::interval(Duration::from_secs(3));

    (status_callback)(BackendStatus::Connected);

    loop {
        tokio::select! {
            _ = shutdown_rx.changed() => {
                if *shutdown_rx.borrow() {
                    scheduler.cancel();
                    return Ok(());
                }
            }
            _ = config_rx.changed() => {}
            _ = lockfile_check.tick() => {
                if let Ok(current) = lcu::discover_lockfile(&config_rx.borrow().league_dir) {
                    if Credentials::from(current) != credentials {
                        scheduler.cancel();
                        return Ok(());
                    }
                } else {
                    scheduler.cancel();
                    return Ok(());
                }
            }
            next_event = events.next() => {
                let Some(event) = next_event? else {
                    scheduler.cancel();
                    return Ok(());
                };

                let config = config_rx.borrow().clone();
                scheduler.handle_ready_check(event, &config, client.clone(), Arc::clone(&status_callback));
            }
        }
    }
}

async fn wait_for_retry_or_change(
    config_rx: &mut watch::Receiver<AppConfig>,
    shutdown_rx: &mut watch::Receiver<bool>,
) {
    tokio::select! {
        _ = time::sleep(Duration::from_secs(2)) => {}
        _ = config_rx.changed() => {}
        _ = shutdown_rx.changed() => {}
    }
}

#[derive(Default)]
pub struct AcceptScheduler {
    pending: Option<JoinHandle<()>>,
}

impl AcceptScheduler {
    pub fn has_pending(&self) -> bool {
        self.pending
            .as_ref()
            .is_some_and(|handle| !handle.is_finished())
    }

    pub fn cancel(&mut self) {
        if let Some(handle) = self.pending.take() {
            handle.abort();
        }
    }

    pub fn handle_ready_check(
        &mut self,
        ready_check: ReadyCheck,
        config: &AppConfig,
        client: LcuClient,
        status_callback: StatusCallback,
    ) {
        if self.pending.as_ref().is_some_and(JoinHandle::is_finished) {
            self.pending = None;
        }

        match accept_decision(&ready_check, config, self.has_pending()) {
            AcceptDecision::Ignore => {}
            AcceptDecision::CancelPending => {
                self.cancel();
                (status_callback)(BackendStatus::Connected);
            }
            AcceptDecision::Schedule(delay) => {
                (status_callback)(BackendStatus::Waiting);
                self.pending = Some(tokio::spawn(schedule_accept(
                    delay,
                    client,
                    status_callback,
                )));
            }
        }
    }
}

pub fn accept_decision(
    ready_check: &ReadyCheck,
    config: &AppConfig,
    has_pending_accept: bool,
) -> AcceptDecision {
    if ready_check.player_response != PlayerResponse::None {
        return AcceptDecision::CancelPending;
    }

    if has_pending_accept {
        return AcceptDecision::Ignore;
    }

    let elapsed = ready_check.timer.min(config.delay_seconds as u64);
    AcceptDecision::Schedule(Duration::from_secs(config.delay_seconds as u64 - elapsed))
}

async fn schedule_accept(delay: Duration, client: LcuClient, status_callback: StatusCallback) {
    time::sleep(delay).await;

    match client.ready_check().await {
        Ok(Some(ready_check)) if ready_check.player_response == PlayerResponse::None => {
            match client.accept_ready_check().await {
                Ok(()) => {
                    info!("accepted ready check");
                    (status_callback)(BackendStatus::Accepted);
                }
                Err(error) => {
                    error!("failed to accept ready check: {error}");
                    (status_callback)(BackendStatus::Connected);
                }
            }
        }
        Ok(_) => {
            (status_callback)(BackendStatus::Connected);
        }
        Err(error) => {
            error!("failed to verify ready check before accepting: {error}");
            (status_callback)(BackendStatus::Connected);
        }
    }
}

pub async fn run_test_scheduler<F, Fut>(
    ready_check: ReadyCheck,
    config: AppConfig,
    accept: F,
) -> u32
where
    F: Fn() -> Fut,
    Fut: Future<Output = ()>,
{
    match accept_decision(&ready_check, &config, false) {
        AcceptDecision::Schedule(delay) => {
            time::sleep(delay).await;
            accept().await;
            1
        }
        _ => 0,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::lcu::PlayerResponse;

    fn ready_check(player_response: PlayerResponse, timer: u64) -> ReadyCheck {
        ReadyCheck {
            player_response,
            timer,
        }
    }

    #[test]
    fn schedules_once_when_ready_check_is_pending() {
        let config = AppConfig {
            delay_seconds: 3,
            ..AppConfig::default()
        };

        let decision = accept_decision(&ready_check(PlayerResponse::None, 1), &config, false);
        assert_eq!(decision, AcceptDecision::Schedule(Duration::from_secs(2)));

        let duplicate = accept_decision(&ready_check(PlayerResponse::None, 2), &config, true);
        assert_eq!(duplicate, AcceptDecision::Ignore);
    }

    #[test]
    fn cancels_when_player_responded() {
        let decision = accept_decision(
            &ready_check(PlayerResponse::Accepted, 0),
            &AppConfig::default(),
            true,
        );

        assert_eq!(decision, AcceptDecision::CancelPending);
    }

    #[test]
    fn legacy_enabled_field_does_not_disable_accept() {
        let config = AppConfig {
            enabled: false,
            ..AppConfig::default()
        };

        let decision = accept_decision(&ready_check(PlayerResponse::None, 0), &config, false);

        assert_eq!(decision, AcceptDecision::Schedule(Duration::from_secs(0)));
    }
}
