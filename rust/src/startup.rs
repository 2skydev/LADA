use std::env;

use auto_launch::{AutoLaunch, WindowsEnableMode};
use thiserror::Error;

use crate::config::APP_NAME;

#[derive(Debug, Error)]
pub enum StartupError {
    #[error("failed to resolve current executable: {0}")]
    CurrentExe(std::io::Error),
    #[error("current executable path is not valid utf-8")]
    InvalidExePath,
    #[error("auto launch failed: {0}")]
    AutoLaunch(#[from] auto_launch::Error),
}

pub struct StartupManager {
    auto_launch: AutoLaunch,
}

impl StartupManager {
    pub fn new() -> Result<Self, StartupError> {
        let exe = env::current_exe().map_err(StartupError::CurrentExe)?;
        let app_path = exe.to_str().ok_or(StartupError::InvalidExePath)?;
        let args: [&str; 0] = [];
        let auto_launch =
            AutoLaunch::new(APP_NAME, app_path, WindowsEnableMode::CurrentUser, &args);

        Ok(Self { auto_launch })
    }

    pub fn apply(&self, enabled: bool) -> Result<(), StartupError> {
        if enabled {
            if !self.auto_launch.is_enabled()? {
                self.auto_launch.enable()?;
            }
        } else if self.auto_launch.is_enabled()? {
            self.auto_launch.disable()?;
        }

        Ok(())
    }

    pub fn is_enabled(&self) -> Result<bool, StartupError> {
        Ok(self.auto_launch.is_enabled()?)
    }
}
