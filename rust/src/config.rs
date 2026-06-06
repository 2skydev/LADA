use std::{
    env, fs, io,
    path::{Path, PathBuf},
};

use directories::BaseDirs;
use serde::{Deserialize, Serialize};
use thiserror::Error;

pub const APP_NAME: &str = "롤 자동 수락";
pub const CONFIG_FILE_NAME: &str = "config.toml";
pub const MAX_DELAY_SECONDS: u8 = 8;

#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("could not locate a config directory")]
    ConfigDirectoryNotFound,
    #[error("failed to read config: {0}")]
    Read(#[from] io::Error),
    #[error("failed to parse config: {0}")]
    Parse(#[from] toml::de::Error),
    #[error("failed to serialize config: {0}")]
    Serialize(#[from] toml::ser::Error),
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AppConfig {
    #[serde(default = "default_enabled")]
    pub enabled: bool,
    #[serde(default)]
    pub delay_seconds: u8,
    #[serde(default = "default_start_with_windows")]
    pub start_with_windows: bool,
    #[serde(default)]
    pub league_dir: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            delay_seconds: 0,
            start_with_windows: true,
            league_dir: String::new(),
        }
    }
}

impl AppConfig {
    pub fn normalize(&mut self) {
        self.delay_seconds = clamp_delay(self.delay_seconds);
        self.league_dir = self.league_dir.trim().to_string();
    }
}

pub fn clamp_delay(delay_seconds: u8) -> u8 {
    delay_seconds.min(MAX_DELAY_SECONDS)
}

#[derive(Debug, Clone)]
pub struct ConfigStore {
    path: PathBuf,
}

impl ConfigStore {
    pub fn new(path: PathBuf) -> Self {
        Self { path }
    }

    pub fn default_path() -> Result<PathBuf, ConfigError> {
        if let Some(app_data) = env::var_os("APPDATA") {
            return Ok(PathBuf::from(app_data)
                .join(APP_NAME)
                .join(CONFIG_FILE_NAME));
        }

        BaseDirs::new()
            .map(|dirs| dirs.config_dir().join(APP_NAME).join(CONFIG_FILE_NAME))
            .ok_or(ConfigError::ConfigDirectoryNotFound)
    }

    pub fn path(&self) -> &Path {
        &self.path
    }

    pub fn load_or_create(&self) -> Result<AppConfig, ConfigError> {
        if !self.path.exists() {
            let config = AppConfig::default();
            self.save(&config)?;
            return Ok(config);
        }

        let mut config: AppConfig = toml::from_str(&fs::read_to_string(&self.path)?)?;
        config.normalize();
        self.save(&config)?;
        Ok(config)
    }

    pub fn save(&self, config: &AppConfig) -> Result<(), ConfigError> {
        if let Some(parent) = self.path.parent() {
            fs::create_dir_all(parent)?;
        }

        let mut normalized = config.clone();
        normalized.normalize();
        fs::write(&self.path, toml::to_string_pretty(&normalized)?)?;
        Ok(())
    }
}

fn default_enabled() -> bool {
    true
}

fn default_start_with_windows() -> bool {
    true
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn clamps_delay_to_eight_seconds() {
        assert_eq!(clamp_delay(0), 0);
        assert_eq!(clamp_delay(8), 8);
        assert_eq!(clamp_delay(9), 8);
    }

    #[test]
    fn load_or_create_writes_default_config() {
        let temp = tempfile::tempdir().unwrap();
        let store = ConfigStore::new(temp.path().join(CONFIG_FILE_NAME));

        let config = store.load_or_create().unwrap();

        assert_eq!(config, AppConfig::default());
        assert!(store.path().exists());
    }

    #[test]
    fn load_or_create_normalizes_loaded_config() {
        let temp = tempfile::tempdir().unwrap();
        let store = ConfigStore::new(temp.path().join(CONFIG_FILE_NAME));
        fs::write(
            store.path(),
            "enabled = true\ndelay_seconds = 99\nstart_with_windows = false\nleague_dir = \"  C:/Riot  \"\n",
        )
        .unwrap();

        let config = store.load_or_create().unwrap();

        assert_eq!(config.delay_seconds, MAX_DELAY_SECONDS);
        assert_eq!(config.league_dir, "C:/Riot");
    }
}
