export enum IpcMessage {
  WindowControl = "windowControl",
  GetSettings = "getSettings",
  SetSettings = "setSettings",
  FetchManga = "fetchManga",
  FetchMangaPages = "fetchMangaPages",
}

export enum WindowControl {
  Close,
  Minimize,
  Maximize,
}

export interface Settings {
  mangas: Array<Manga>;
}

export enum MangaSource {
  MangaNato,
  MangaToto,
}

export interface Manga {
  name: string;
  cover_url: string;
  url: string;
  source: MangaSource;
  chapters: Array<string>;
  bookmark: {
    chapterIndex: number;
    pageIndex: number;
  };
}

export type WebSocketMessage =
  | WebSocketCurrentMangaMessage
  | WebSocketWaitingMessage;

export enum WebSocketMessageType {
  CurrentManga,
  Waiting,
}

export interface WebSocketCurrentMangaMessage {
  type: WebSocketMessageType.CurrentManga;
  manga: Manga | null;
}

export interface WebSocketWaitingMessage {
  type: WebSocketMessageType.Waiting;
  waiting: boolean;
}
