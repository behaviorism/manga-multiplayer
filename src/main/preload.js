const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipc", {
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, listener) => ipcRenderer.on(channel, listener),
  addEventListener: (channel, listener) =>
    ipcRenderer.addListener(channel, (_, ...args) => listener(...args)),
  removeEventListener: (channel) => ipcRenderer.removeAllListeners(channel),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});
