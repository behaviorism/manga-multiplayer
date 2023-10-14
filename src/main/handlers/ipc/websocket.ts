import { ipcMain } from "electron";
import { WebSocketServer, WebSocket } from "ws";
import localtunnel, { Tunnel } from "localtunnel";
import { mainWindow } from "../../main";
import {
  IpcMessage,
  Manga,
  WebSocketMessage,
  WebSocketMessageType,
} from "../../../types";

interface Socket extends WebSocket {
  isAlive: boolean;
  waiting: boolean;
}

let tunnel: Tunnel | undefined;
let ws: WebSocketServer | undefined;

const init = () => {
  ipcMain.handle(IpcMessage.StartWebSocketServer, handleStartWebSocketServer);
  ipcMain.on(IpcMessage.StopWebSocketServer, cleanup);
  ipcMain.on(IpcMessage.WebSocketWaiting, (_, waiting) =>
    broadcastWaiting(waiting)
  );
  ipcMain.on(IpcMessage.SetOthersWaiting, (_, waiting) => {
    if (!ws) {
      return;
    }

    for (let client of ws.clients as Set<Socket>) {
      client.waiting = waiting;
    }
  });
  ipcMain.on(IpcMessage.WebSocketCurrentManga, (_, manga) => {
    if (!ws) {
      return;
    }

    for (let client of ws.clients) {
      client.send(
        JSON.stringify({
          type: WebSocketMessageType.CurrentManga,
          manga,
        } as WebSocketMessage)
      );
    }
  });
};

const handleStartWebSocketServer = async () => {
  try {
    let port = parseInt(process.env.PORT!);

    while (!ws) {
      try {
        ws = new WebSocketServer({ port });
      } catch (error) {
        port = Math.floor(Math.random() * 9999 + 1);
      }
    }

    ws.on("connection", async (socket: Socket) => {
      socket.isAlive = true;

      mainWindow?.webContents.send(IpcMessage.WebSocketConnected);

      // proxy websocket messages to client
      socket.on("message", (message) => {
        try {
          if (message.toString() === "pong") {
            socket.isAlive = true;
            return;
          }

          const json = JSON.parse(message.toString()) as WebSocketMessage;

          if (json.type === WebSocketMessageType.Waiting) {
            socket.waiting = json.waiting[0];
            broadcastWaiting();
          } else {
            mainWindow?.webContents.send("message", {
              data: message.toString(),
            });
          }
        } catch (error: any) {
          console.error(error.message);
        }
      });

      socket.on("close", () => {
        mainWindow?.webContents.send(IpcMessage.WebSocketClientClose);
        socket.removeAllListeners();
      });

      const currentManga = await invoke<Manga | null>(
        IpcMessage.GetCurrentManga
      );

      socket.waiting = false;
      broadcastWaiting();

      socket.send(
        JSON.stringify({
          type: WebSocketMessageType.CurrentManga,
          manga: currentManga,
        })
      );
    });

    ws.on("error", (error) =>
      mainWindow?.webContents.send(IpcMessage.WebSocketError, error)
    );

    const interval = setInterval(() => {
      if (!ws) {
        return;
      }

      for (let client of ws!.clients as Set<Socket>) {
        if (client.isAlive === false) {
          client.removeAllListeners();
          return client.terminate();
        }

        client.isAlive = false;
        client.send("ping");
      }
    }, 30000);

    ws.on("close", () => {
      mainWindow?.webContents.send(IpcMessage.WebSocketClose);
      clearInterval(interval);
      cleanup();
    });

    tunnel = await localtunnel(port);

    tunnel.on("error", (error) =>
      mainWindow?.webContents.send(IpcMessage.WebSocketError, error)
    );

    tunnel.once("close", () => {
      mainWindow?.webContents.send(IpcMessage.WebSocketClose);

      tunnel!.removeAllListeners();
      tunnel = undefined;

      cleanup();
    });

    return tunnel.url.replace("https://", "ws://");
  } catch (err: any) {
    throw new Error(`Error while starting host: ${err.message}`);
  }
};

const broadcastWaiting = async (force?: boolean) => {
  const othersWaiting = getWaiting();
  const allOthersWaiting = othersWaiting.every((isWaiting) => isWaiting);

  let _waiting =
    force !== undefined ? force : await invoke(IpcMessage.GetWaiting);
  _waiting = allOthersWaiting && _waiting ? false : _waiting;

  Array.from(ws!.clients).forEach((client, index) => {
    const waiting = [...othersWaiting, _waiting];
    waiting.splice(index, 1);

    client.send(
      JSON.stringify({
        type: WebSocketMessageType.Waiting,
        waiting,
      } as WebSocketMessage)
    );
  });

  mainWindow?.webContents.send("message", {
    data: JSON.stringify({
      type: WebSocketMessageType.Waiting,
      waiting: getWaiting(),
    } as WebSocketMessage),
  });
};

const getWaiting = () => {
  return Array.from(ws!.clients as Set<Socket>).map((client) => client.waiting);
};

const invoke = <T>(channel: IpcMessage, ...args: any) => {
  return new Promise<T>((resolve) => {
    ipcMain.on(channel, function handleMessage(_, response: T) {
      ipcMain.removeListener(channel, handleMessage);
      resolve(response);
    });
    mainWindow?.webContents.send(channel, ...args);
  });
};

const cleanup = () => {
  if (!ws) {
    return;
  }

  for (let client of ws.clients) {
    client.close();
  }

  ws.removeAllListeners();
  ws.close();
  ws = undefined;
};

export default { init, cleanup };
