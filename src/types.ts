export enum IpcMessage {
  WindowControl = "windowControl",
  GetSettings = "getSettings",
  SetSettings = "setSettings",
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
  Mangakakalot,
  Mangatoto,
}

export interface Manga {
  name: string;
  url: string;
  source: MangaSource;
  bookmark: {
    chapter: string;
    page: string;
  };
}
