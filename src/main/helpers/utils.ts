import { app } from "electron";
import path from "path";

export const resolveHtmlPath = (htmlFileName: string) => {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:${
      parseInt(process.env.PORT!) + 1
    }/${htmlFileName}`;
  }

  return `file://${path.resolve(__dirname, "..", "renderer", htmlFileName)}`;
};

export const getAssetPath = (...paths: string[]): string => {
  return path.join(
    app.isPackaged
      ? path.join(process.resourcesPath, "assets")
      : path.join(__dirname, "..", "..", "assets"),
    ...paths
  );
};
