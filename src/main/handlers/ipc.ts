import { ipcMain } from "electron";
import { IpcMessage } from "../../types";

const init = () => {
  ipcMain.on(IpcMessage.WindowControl, (msg) => console.log(msg));
};

export { init };
