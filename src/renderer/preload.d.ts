declare global {
  interface Window {
    ipc: Electron.IpcRenderer;
  }
}

export {};
