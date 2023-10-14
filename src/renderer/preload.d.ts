declare global {
  interface Window {
    ipc: {
      send: typeof Electron.ipcRenderer.send;
      invoke: typeof Electron.ipcRenderer.invoke;
      on: typeof Electron.ipcRenderer.on;
      addEventListener: typeof Electron.ipcRenderer.addListener;
      removeEventListener: typeof Electron.ipcRenderer.removeAllListeners;
      removeAllListeners: typeof Electron.ipcRenderer.removeAllListeners;
    };
  }
}

export {};
