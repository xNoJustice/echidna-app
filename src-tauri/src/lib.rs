use tauri::Window;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn set_always_on_top(window: Window, state: bool) -> Result<(), String> {
    window
        .set_always_on_top(state)
        .map_err(|e| format!("Failed to set always on top: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![set_always_on_top])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
