use std::{net::TcpListener, sync::Arc, thread};

use tao::{
    event::Event,
    event_loop::{ControlFlow, EventLoopBuilder},
};
use thiserror::Error;
use tokio::sync::watch;
use tracing::{error, info};
use tray_icon::menu::MenuEvent;

use crate::{
    auto_accept::{self, BackendStatus},
    config::{AppConfig, ConfigError, ConfigStore},
    startup::{StartupError, StartupManager},
    tray::{TrayAction, TrayApp, TrayError, action_from_menu_event},
};

const SINGLE_INSTANCE_ADDRESS: &str = "127.0.0.1:51241";

#[derive(Debug, Error)]
pub enum AppError {
    #[error("config error: {0}")]
    Config(#[from] ConfigError),
    #[error("startup error: {0}")]
    Startup(#[from] StartupError),
    #[error("tray error: {0}")]
    Tray(#[from] TrayError),
}

#[derive(Debug)]
pub enum AppEvent {
    Menu(MenuEvent),
    Status(BackendStatus),
}

pub fn run() -> Result<(), AppError> {
    tracing_subscriber::fmt().with_target(false).init();

    let Some(instance_guard) = acquire_single_instance_guard() else {
        info!("another 롤 자동 수락 instance is already running");
        return Ok(());
    };

    let store = ConfigStore::new(ConfigStore::default_path()?);
    let mut config = store.load_or_create()?;

    let startup = StartupManager::new()?;
    if let Err(error) = startup.apply(config.start_with_windows) {
        error!("failed to apply startup setting: {error}");
    }
    if let Ok(enabled) = startup.is_enabled() {
        config.start_with_windows = enabled;
        store.save(&config)?;
    }

    let event_loop = EventLoopBuilder::<AppEvent>::with_user_event().build();
    let proxy = event_loop.create_proxy();
    MenuEvent::set_event_handler(Some(move |event| {
        let _ = proxy.send_event(AppEvent::Menu(event));
    }));

    let backend_proxy = event_loop.create_proxy();
    let status_callback = Arc::new(move |status| {
        let _ = backend_proxy.send_event(AppEvent::Status(status));
    });

    let (config_tx, config_rx) = watch::channel(config.clone());
    let (shutdown_tx, shutdown_rx) = watch::channel(false);
    let runtime_thread = thread::spawn(move || {
        match tokio::runtime::Builder::new_multi_thread()
            .enable_all()
            .build()
        {
            Ok(runtime) => {
                runtime.block_on(auto_accept::run(config_rx, shutdown_rx, status_callback))
            }
            Err(error) => error!("failed to start async runtime: {error}"),
        }
    });

    let tray = TrayApp::new(&config)?;

    event_loop.run(move |event, _, control_flow| {
        let _keep_instance_guard_alive = &instance_guard;
        let _keep_runtime_thread_alive = &runtime_thread;
        *control_flow = ControlFlow::Wait;

        match event {
            Event::UserEvent(AppEvent::Status(status)) => tray.update_status(status),
            Event::UserEvent(AppEvent::Menu(menu_event)) => {
                handle_tray_action(
                    action_from_menu_event(&menu_event),
                    TrayActionContext {
                        config: &mut config,
                        store: &store,
                        startup: &startup,
                        tray: &tray,
                        config_tx: &config_tx,
                        shutdown_tx: &shutdown_tx,
                        control_flow,
                    },
                );
            }
            _ => {}
        }
    })
}

struct TrayActionContext<'a> {
    config: &'a mut AppConfig,
    store: &'a ConfigStore,
    startup: &'a StartupManager,
    tray: &'a TrayApp,
    config_tx: &'a watch::Sender<AppConfig>,
    shutdown_tx: &'a watch::Sender<bool>,
    control_flow: &'a mut ControlFlow,
}

fn handle_tray_action(action: TrayAction, context: TrayActionContext<'_>) {
    match action {
        TrayAction::ToggleAutoAccept => {
            context.config.enabled = !context.config.enabled;
            save_and_broadcast(
                context.config,
                context.store,
                context.tray,
                context.config_tx,
            );
        }
        TrayAction::SetDelay(delay) => {
            context.config.delay_seconds = delay;
            context.config.normalize();
            save_and_broadcast(
                context.config,
                context.store,
                context.tray,
                context.config_tx,
            );
        }
        TrayAction::ToggleStartWithWindows => {
            context.config.start_with_windows = !context.config.start_with_windows;
            if let Err(error) = context.startup.apply(context.config.start_with_windows) {
                error!("failed to update startup setting: {error}");
                context.config.start_with_windows = !context.config.start_with_windows;
            }
            save_and_broadcast(
                context.config,
                context.store,
                context.tray,
                context.config_tx,
            );
        }
        TrayAction::Quit => {
            let _ = context.shutdown_tx.send(true);
            *context.control_flow = ControlFlow::Exit;
        }
        TrayAction::None => {}
    }
}

fn save_and_broadcast(
    config: &AppConfig,
    store: &ConfigStore,
    tray: &TrayApp,
    config_tx: &watch::Sender<AppConfig>,
) {
    tray.update_config(config);
    if let Err(error) = store.save(config) {
        error!("failed to save config: {error}");
    }
    let _ = config_tx.send(config.clone());
}

fn acquire_single_instance_guard() -> Option<TcpListener> {
    TcpListener::bind(SINGLE_INSTANCE_ADDRESS).ok()
}
