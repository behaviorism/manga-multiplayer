import { WebSocket, WebSocketServer } from "ws";
import logger from "./logger";
import {
  Room,
  createRoom,
  getCurrentManga,
  getRoom,
  joinRoom,
  removeUser,
} from "./rooms";
import {
  Manga,
  Service,
  WebSocketMessage,
  WebSocketMessageType,
} from "../../types";
import { stringifyWebSocketMessage } from "../../utils";

export interface Client extends WebSocket {
  isAlive: boolean;
  isWaiting: boolean;
  roomId: string;
}

export default (webSocketServer: WebSocketServer) => {
  webSocketServer.on("connection", async (client: Client) => {
    client.isAlive = true;
    client.isWaiting = false;

    client.on("message", async (message) => {
      try {
        if (message.toString() === "pong") {
          client.isAlive = true;
          return;
        }

        const json = JSON.parse(message.toString()) as WebSocketMessage;

        let room;

        try {
          switch (json.type) {
            case WebSocketMessageType.CreateRoom:
              const roomId = createRoom(client);
              client.send(
                stringifyWebSocketMessage(
                  WebSocketMessageType.CreateRoom,
                  roomId
                )
              );
              break;
            case WebSocketMessageType.JoinRoom:
              room = joinRoom(json.content, client);
              client.send(
                stringifyWebSocketMessage(WebSocketMessageType.JoinRoom)
              );

              if (room.guestsClients.length === 1) {
                const currentManga = await invoke<Manga | null>(
                  WebSocketMessageType.GetHostCurrentManga,
                  room.hostClient
                );
                client.send(
                  stringifyWebSocketMessage(
                    WebSocketMessageType.SetCurrentManga,
                    currentManga
                  )
                );
              }
              broadCastMessage(room, WebSocketMessageType.ClientConnected);
              broadcastAllWaiting(room);
              break;
            case WebSocketMessageType.SetCurrentManga:
              room = getRoom(client.roomId);
              room.currentManga = json.content;
              broadCastMessage(
                room,
                WebSocketMessageType.SetCurrentManga,
                room.currentManga
              );
              break;
            case WebSocketMessageType.GetHostCurrentManga:
              const currentManga = getCurrentManga(client);
              client.send(
                stringifyWebSocketMessage(
                  WebSocketMessageType.GetHostCurrentManga,
                  currentManga
                )
              );
              break;
            case WebSocketMessageType.SetClientWaiting:
              client.isWaiting = json.content;

              room = getRoom(client.roomId);

              if (areAllWaiting(room)) {
                setAllWaiting(false);
                broadCastMessage(room, WebSocketMessageType.Forward);
              } else {
                broadcastAllWaiting(room);
              }
              break;
            default:
              throw new Error("Invalid message type");
          }
        } catch (error: any) {
          client.send(stringifyWebSocketMessage(json.type, error.message));
          throw error;
        }
      } catch (error: any) {
        logger.error(Service.WebSocket, error.message);
      }
    });

    client.on("close", () => {
      const room = getRoom(client.roomId);
      removeUser(client);
      broadCastMessage(room, WebSocketMessageType.ClientDisconnected);
      broadcastAllWaiting(room);
      client.removeAllListeners();
    });
  });

  webSocketServer.on("error", (error) => {
    logger.error(Service.WebSocket, error.message);
  });

  setInterval(() => {
    for (let client of webSocketServer.clients as Set<Client>) {
      if (client.isAlive === false) {
        client.removeAllListeners();
        return client.terminate();
      }

      client.isAlive = false;
      client.send("ping");
    }
  }, 30000);

  const broadcastAllWaiting = async (room: Room) => {
    const allWaiting = getAllWaiting(room);

    [room.hostClient, ...room.guestsClients].forEach((client, index) => {
      const waitingStates = [...allWaiting];
      waitingStates.splice(index, 1);

      client.send(
        stringifyWebSocketMessage(
          WebSocketMessageType.ClientsWaitingStates,
          waitingStates
        )
      );
    });
  };

  const areAllWaiting = (room: Room) =>
    getAllWaiting(room).every((isWaiting) => isWaiting);

  const getAllWaiting = (room: Room) => {
    return [room.hostClient, ...room.guestsClients].map(
      (client) => client.isWaiting
    );
  };

  const setAllWaiting = (waiting: boolean) => {
    for (let client of webSocketServer.clients as Set<Client>) {
      client.isWaiting = waiting;
    }
  };

  const invoke = <T>(type: WebSocketMessageType, client: Client) => {
    return new Promise<T>((resolve) => {
      client.on("message", function handleMessage(_message) {
        try {
          const message = JSON.parse(_message.toString()) as WebSocketMessage;
          if (type === message.type) {
            client.removeListener("message", handleMessage);
            resolve(message.content as T);
          }
        } catch (_error: any) {}
      });
      client.send(stringifyWebSocketMessage(type));
    });
  };

  const broadCastMessage = (
    room: Room,
    type: WebSocketMessageType,
    content?: WebSocketMessage["content"]
  ) => {
    for (let client of [room.hostClient, ...room.guestsClients]) {
      client.send(JSON.stringify({ type, content }));
    }
  };
};
