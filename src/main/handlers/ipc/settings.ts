import { ipcMain } from "electron";
import store from "../store";
import { IpcMessage, Settings } from "../../../types";

const init = () => {
  ipcMain.handle(IpcMessage.GetSettings, () => store.store);
  ipcMain.on(
    IpcMessage.SetSettings,
    (_, settings: Settings) => (store.store = settings)
  );
};

export default { init };
