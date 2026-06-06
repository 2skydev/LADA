use std::path::PathBuf;

use thiserror::Error;
use tray_icon::{
    BadIcon, Icon, TrayIcon, TrayIconBuilder,
    menu::{CheckMenuItem, Menu, MenuEvent, MenuId, MenuItem, PredefinedMenuItem, Submenu},
};

use crate::{
    auto_accept::BackendStatus,
    config::{APP_NAME, AppConfig},
};

const MENU_START_WITH_WINDOWS: &str = "start_with_windows";
const MENU_QUIT: &str = "quit";
const MENU_DELAY_PREFIX: &str = "delay_";

pub enum TrayAction {
    SetDelay(u8),
    ToggleStartWithWindows,
    Quit,
    None,
}

#[derive(Debug, Error)]
pub enum TrayError {
    #[error("menu error: {0}")]
    Menu(#[from] tray_icon::menu::Error),
    #[error("icon error: {0}")]
    Icon(#[from] BadIcon),
    #[error("tray error: {0}")]
    Tray(#[from] tray_icon::Error),
}

pub struct TrayApp {
    _tray_icon: TrayIcon,
    status_item: MenuItem,
    start_with_windows_item: CheckMenuItem,
    delay_items: Vec<CheckMenuItem>,
}

impl TrayApp {
    pub fn new(config: &AppConfig) -> Result<Self, TrayError> {
        let tray_menu = Menu::new();
        let status_item = MenuItem::new("상태: 연결 안 됨", false, None);
        let delay_menu = Submenu::new("대기시간", true);
        let mut delay_items = Vec::new();

        for seconds in 0..=8 {
            let item = CheckMenuItem::with_id(
                delay_menu_id(seconds),
                format!("{seconds}초"),
                true,
                config.delay_seconds == seconds,
                None,
            );
            delay_menu.append(&item)?;
            delay_items.push(item);
        }

        let start_with_windows_item = CheckMenuItem::with_id(
            MENU_START_WITH_WINDOWS,
            "부팅 시 앱 자동 실행",
            true,
            config.start_with_windows,
            None,
        );
        let quit_item = MenuItem::with_id(MENU_QUIT, "앱 종료", true, None);

        tray_menu.append(&status_item)?;
        tray_menu.append(&PredefinedMenuItem::separator())?;
        tray_menu.append(&delay_menu)?;
        tray_menu.append(&start_with_windows_item)?;
        tray_menu.append(&PredefinedMenuItem::separator())?;
        tray_menu.append(&quit_item)?;

        let tray_icon = TrayIconBuilder::new()
            .with_menu(Box::new(tray_menu))
            .with_tooltip(APP_NAME)
            .with_icon(app_icon()?)
            .build()?;

        Ok(Self {
            _tray_icon: tray_icon,
            status_item,
            start_with_windows_item,
            delay_items,
        })
    }

    pub fn update_config(&self, config: &AppConfig) {
        self.start_with_windows_item
            .set_checked(config.start_with_windows);
        for (seconds, item) in self.delay_items.iter().enumerate() {
            item.set_checked(config.delay_seconds as usize == seconds);
        }
    }

    pub fn update_status(&self, status: BackendStatus) {
        self.status_item.set_text(format!(
            "상태: {}",
            match status {
                BackendStatus::Disconnected => "연결 안 됨",
                BackendStatus::Connected => "연결됨",
                BackendStatus::Waiting => "대기 중",
                BackendStatus::Accepted => "수락됨",
            }
        ));
    }
}

pub fn action_from_menu_event(event: &MenuEvent) -> TrayAction {
    let id = event.id.as_ref();

    if id == MENU_START_WITH_WINDOWS {
        return TrayAction::ToggleStartWithWindows;
    }

    if id == MENU_QUIT {
        return TrayAction::Quit;
    }

    if let Some(delay) = id
        .strip_prefix(MENU_DELAY_PREFIX)
        .and_then(|value| value.parse::<u8>().ok())
    {
        return TrayAction::SetDelay(delay);
    }

    TrayAction::None
}

fn delay_menu_id(seconds: u8) -> MenuId {
    MenuId::new(format!("{MENU_DELAY_PREFIX}{seconds}"))
}

fn app_icon() -> Result<Icon, BadIcon> {
    #[cfg(windows)]
    {
        Icon::from_resource(1, Some((32, 32)))
            .or_else(|_| Icon::from_path(resource_icon_path(), Some((32, 32))))
    }

    #[cfg(not(windows))]
    {
        Icon::from_rgba(Vec::new(), 0, 0)
    }
}

fn resource_icon_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("resources")
        .join("icons")
        .join("logo@256.ico")
}
