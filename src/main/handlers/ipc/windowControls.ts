import { BrowserWindow, ipcMain } from "electron";
import { IpcMessage, WindowControl } from "../../../types";

const init = () => {
  ipcMain.on(IpcMessage.WindowControl, handleWindowControl);
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

export default { init };
