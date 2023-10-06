import { ipcMain, BrowserWindow } from "electron";
import { IpcMessage, Settings, WindowControl } from "../../types";
import { store } from "./store";

const init = () => {
  ipcMain.on(IpcMessage.WindowControl, handleWindowControl);
  ipcMain.handle(IpcMessage.GetSettings, () => store.store);
  ipcMain.on(IpcMessage.SetSettings, (_, settings: Settings) => {
    store.store = settings;
  });
};

const handleWindowControl = (
  _: Electron.IpcMainEvent,
  control: WindowControl
) => {
  const window = BrowserWindow.getFocusedWindow();

  if (!window) {
    return;
  }

  switch (control) {
    case WindowControl.Close:
      window.close();
      break;
    case WindowControl.Minimize:
      window.minimize();
      break;
    case WindowControl.Maximize:
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
      break;
    default:
      break;
  }
};

export { init };
