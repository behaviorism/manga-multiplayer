import { app, BrowserWindow, Menu, net, protocol, shell } from "electron";
import path from "path";
import Ipc from "./handlers/ipc";
import WebSocketIpc from "./handlers/ipc/websocket";
import { getAssetPath, resolveHtmlPath } from "./helpers/utils";

export let mainWindow: BrowserWindow | null = null;

const initApp = () => {
  createWindow();

  Ipc.init();

  app.on("activate", () => {
    if (mainWindow === null) createWindow();
  });

  protocol.handle("manganato", (request) => {
    request.headers.set("referer", "https://chapmanganato.com/");
    return net.fetch(request.url.replace("manganato://", "https://"), request);
  });
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    show: false,
    maxWidth: 600,
    maxHeight: 800,
    icon: getAssetPath("icon.png"),
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(resolveHtmlPath("index.html"));

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    mainWindow.show();
  });

  mainWindow.once("closed", () => {
    mainWindow = null;
    WebSocketIpc.cleanup();
  });

  Menu.setApplicationMenu(null);

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.whenReady().then(initApp).catch(console.error);
