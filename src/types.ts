export enum IpcMessage {
  /* Generic messages */
  WindowControl = "windowControl",

  /* Settings messages */

  // Renderer: Get full settings
  GetSettings = "getSettings",
  // Renderer: Set full settings
  SetSettings = "setSettings",

  /* Manga messages */

  // Renderer: fetch manga
  FetchManga = "fetchManga",
  // Renderer: fetch manga pages
  FetchMangaPages = "fetchMangaPages",
  // Main: get manga currently being read in renderer
  GetCurrentManga = "getCurrentManga",

  /* WebSocket messages */

  // Renderer: start websocket server in main
  StartWebSocketServer = "startWebSocketServer",
  // Renderer: stop websocket
  StopWebSocketServer = "stopWebSocketServer",
  // Main: new client connected
  WebSocketConnected = "webSocketConnected",
  // Main: websocket error
  WebSocketError = "webSocketError",
  // Main: websocket closed
  WebSocketClose = "webSocketClose",
  // Main: connection to websocket closed
  WebSocketClientClose = "webSocketClientClose",
  // Renderer: send waiting state to clients (if host)/websocket (if client)
  WebSocketWaiting = "webSocketWaiting",
  // Renderer: set waiting state of all clients
  SetOthersWaiting = "setOthersWaiting",
  // Main: get waiting state of host
  GetWaiting = "getWaiting",
  // fRenderer: send manga currently being read to clients
  WebSocketCurrentManga = "webSocketCurrentManga",
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
  waiting: Array<boolean>;
}
