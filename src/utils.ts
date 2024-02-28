import { WebSocketMessage, WebSocketMessageType } from "./types";

export const stringifyWebSocketMessage = (
  type: WebSocketMessageType,
  content?: WebSocketMessage["content"]
) => {
  return JSON.stringify({ type, content });
};
