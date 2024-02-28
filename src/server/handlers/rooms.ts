import { ROOM_ID_LENGTH } from "../../constants";
import { Manga, WebSocketMessageType } from "../../types";
import { stringifyWebSocketMessage } from "../../utils";
import { generateId } from "../helpers/utils";
import { Client } from "./websocket";

type RoomId = string;

export interface Room {
  hostClient: Client;
  guestsClients: Array<Client>;
  currentManga: Manga | null;
}

let rooms = new Map<RoomId, Room>();

export const createRoom = (hostClient: Client) => {
  const id = generateId(ROOM_ID_LENGTH);

  rooms.set(id, {
    hostClient,
    guestsClients: [],
    currentManga: null,
  });
  hostClient.roomId = id;

  return id;
};

export const joinRoom = (roomId: string, client: Client) => {
  const room = getRoom(roomId);

  room.guestsClients.push(client);
  client.roomId = roomId;

  return room;
};

export const getRoom = (id: string) => {
  const room = rooms.get(id);

  if (!room) {
    throw new Error("Room doesn't exist");
  }

  return room;
};

export const getCurrentManga = (client: Client) => {
  const room = getRoom(client.roomId);
  return room.currentManga;
};

export const removeUser = (client: Client) => {
  const room = rooms.get(client.roomId)!;

  if (room) {
    if (room.hostClient === client) {
      for (let client of room.guestsClients) {
        client.send(stringifyWebSocketMessage(WebSocketMessageType.RoomClosed));
        client.close();
      }

      rooms.delete(client.roomId);
    } else {
      room.guestsClients.splice(room.guestsClients.indexOf(client));
    }
  }

  client.close();
};
