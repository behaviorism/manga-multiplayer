import { WebSocketMessage } from "../../types";

export const createMessage = (message: WebSocketMessage) => {
  return JSON.stringify(message);
};
