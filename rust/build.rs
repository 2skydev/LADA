fn main() {
    #[cfg(windows)]
    {
        let mut resource = winresource::WindowsResource::new();
        resource.set_icon("../resources/icons/logo@256.ico");
        resource.set("ProductName", "롤 자동 수락");
        resource.set("FileDescription", "롤 자동 수락");
        resource.set("OriginalFilename", "lol-auto-accpet.exe");
        resource
            .compile()
            .expect("failed to compile Windows resources");
    }
}
