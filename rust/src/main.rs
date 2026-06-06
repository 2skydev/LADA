#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    if let Err(error) = lol_auto_accpet::app::run() {
        eprintln!("롤 자동 수락 failed: {error}");
    }
}
