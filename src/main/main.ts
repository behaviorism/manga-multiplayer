import { app, BrowserWindow, Menu, shell } from "electron";
import path from "path";
import * as Utils from "./helpers/utils";
import * as Ipc from "./handlers/ipc";

let mainWindow: BrowserWindow | null = null;

const initApp = () => {
  createWindow();

  Ipc.init();

  app.on("activate", () => {
    if (mainWindow === null) createWindow();
  });
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 600,
    height: 800,
    icon: Utils.getAssetPath("icon.png"),
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(Utils.resolveHtmlPath("index.html"));

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    mainWindow.show();
  });

  mainWindow.on("closed", () => (mainWindow = null));

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

import fs from "fs";

app.whenReady().then(initApp).catch(console.log);
