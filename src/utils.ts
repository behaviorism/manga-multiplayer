import { WebSocketMessage, WebSocketMessageType } from "./types";

export const stringifyWebSocketMessage = (
  type: WebSocketMessageType,
  rest?: { error?: string, content?: WebSocketMessage["content"] }
) => {
  return JSON.stringify({ type, ...rest });
};
