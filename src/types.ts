export enum Service {
  Server = "SERVER",
  WebSocket = "WEBSOCKET",
}

export enum WebSocketMessageType {
  // [From Host client to Server]: create room
  CreateRoom,
  // [From client tos Server]: join room request
  JoinRoom,
  // [From Server to client]: new client connected
  ClientConnected,
  // [From Server to Host client]: get current manga
  GetHostCurrentManga,
  // [From client to Server]: set client state to waiting
  SetClientWaiting,
  // [From Host client to Server]: send current manga
  SetCurrentManga,
  // [From Server to client]: cycle to next page/chapter
  Forward,
  // [From Server to client]: client disconnected
  ClientDisconnected,
  // [From Server to client]: all clients waiting states
  ClientsWaitingStates,
  // [From Server to client]: room closed
  RoomClosed,
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
  | CreateRoomMessage
  | JoinRoomMessage
  | GetHostCurrentMangaMessage
  | ClientConnectedMessage
  | ClientDisconnectedMessage
  | SetClientWaitingMessage
  | ClientsWaitingStatesMessage
  | SetCurrentMangaMessage
  | ForwardMessage
  | RoomClosedMessage;

interface CreateRoomMessage {
  type: WebSocketMessageType.CreateRoom;
  content: null;
  error?: string;
}

interface JoinRoomMessage {
  type: WebSocketMessageType.JoinRoom;
  content: string;
  error?: string;
}

interface GetHostCurrentMangaMessage {
  type: WebSocketMessageType.GetHostCurrentManga;
  content: null;
  error?: string;
}

interface ClientConnectedMessage {
  type: WebSocketMessageType.ClientConnected;
  content: null;
  error?: string;
}

interface ClientDisconnectedMessage {
  type: WebSocketMessageType.ClientDisconnected;
  content: null;
  error?: string;
}

interface SetClientWaitingMessage {
  type: WebSocketMessageType.SetClientWaiting;
  content: boolean;
  error?: string;
}

interface ClientsWaitingStatesMessage {
  type: WebSocketMessageType.ClientsWaitingStates;
  content: Array<boolean>;
  error?: string;
}

interface SetCurrentMangaMessage {
  type: WebSocketMessageType.SetCurrentManga;
  content: Manga | null;
  error?: string;
}

interface ForwardMessage {
  type: WebSocketMessageType.Forward;
  content: null;
  error?: string;
}

interface RoomClosedMessage {
  type: WebSocketMessageType.RoomClosed;
  content: null;
  error?: string;
}
