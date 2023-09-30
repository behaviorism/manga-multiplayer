import path from "path";
import { app, BrowserWindow, shell } from "electron";

let mainWindow: BrowserWindow | null = null;

const resolveHtmlPath = (htmlFileName: string) => {
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, "..", "renderer", htmlFileName)}`;
};
const getAssetPath = (...paths: string[]): string => {
  return path.join(
    app.isPackaged
      ? path.join(process.resourcesPath, "assets")
      : path.join(__dirname, "..", "..", "assets"),
    ...paths
  );
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 600,
    height: 800,
    icon: getAssetPath("icon.png"),
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath("index.html"));

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    mainWindow.show();
  });

  mainWindow.on("closed", () => (mainWindow = null));

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

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on("activate", () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
