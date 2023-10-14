import { ipcMain } from "electron";
import { scrapeManga, scrapeMangaPages } from "../../helpers/scraper";
import { IpcMessage } from "../../../types";

const init = () => {
  ipcMain.handle(IpcMessage.FetchManga, (_, url: string) => scrapeManga(url));
  ipcMain.handle(
    IpcMessage.FetchMangaPages,
    (_, url: string, chapter: string) => scrapeMangaPages(url, chapter)
  );
};

export default { init };
