import { app } from "electron";
import path from "path";

const resolveHtmlPath = (htmlFileName: string) => {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:${process.env.PORT}/${htmlFileName}`;
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

export { resolveHtmlPath, getAssetPath };
