import net from "net";

declare global {
  interface Window {
    ipc: Electron.IpcRenderer;
    isIP: typeof net.isIP;
  }
}

export {};
