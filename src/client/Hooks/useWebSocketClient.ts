import { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebSocketMessage, WebSocketMessageType } from "../../types";
import { stringifyWebSocketMessage } from "../../utils";
import toast from "../Helpers/toast";

type MessageHandlers = Array<[WebSocketMessageType, (message: any) => void]>;

const useWebSocketClient = (messageHandlers: MessageHandlers) => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef(socket);
  socketRef.current = socket;
  let cleanup = () => {};

  useEffect(() => {
    const url = window.location.origin
      .replace("https://", "wss://")
      .replace("http://", "ws://");

    const ws = new WebSocket(`${url}/websocket`);

    let pingTimeout: NodeJS.Timeout | undefined;

    const heartbeat = () => {
      clearTimeout(pingTimeout);
      pingTimeout = setTimeout(() => ws.close(), 30000 + 1000);
    };

    const controller = new AbortController();

    ws.addEventListener(
      "open",
      () => {
        toast.info("Connected to the server");
        heartbeat();
        setSocket(ws);
      },
      { signal: controller.signal }
    );

    ws.addEventListener("error", (error: any) => toast.error(error.message), {
      signal: controller.signal,
    });

    const handleGuestConnected = () => {
      toast.info("New user connected");
    };

    const handleGuestDisconnected = () => {
      toast.warning("A user has disconnected");
    };

    const handleRoomClosed = () => {
      toast.warning("Room was closed");
      cleanup();
      navigate("/link");
    };

    ws.addEventListener("message", ({ data }) => {
      if (data.toString() === "ping") {
        heartbeat();
        ws.send("pong");
      }
    });

    const _messageHandlers = [
      ...messageHandlers,
      [WebSocketMessageType.ClientConnected, handleGuestConnected],
      [WebSocketMessageType.ClientDisconnected, handleGuestDisconnected],
      [WebSocketMessageType.RoomClosed, handleRoomClosed],
    ] as MessageHandlers;

    for (let [webSocketMessageType, messageHandler] of _messageHandlers) {
      ws.addEventListener(
        "message",
        ({ data }) => {
          try {
            if (data.toString() === "ping") {
              return;
            }

            const json = JSON.parse(data.toString()) as WebSocketMessage;

            if (json.type === webSocketMessageType) {
              messageHandler(json);
            }
          } catch (error: any) {
            toast.error(error.message);
          }
        },
        { signal: controller.signal }
      );
    }

    cleanup = () => {
      controller.abort();
      clearTimeout(pingTimeout);
      navigate("/link");
    };

    ws.addEventListener(
      "close",
      () => {
        toast.error("Host connection closed");
        cleanup();
      },
      { signal: controller.signal }
    );

    return () => {
      ws.close();
      cleanup();
    };
  }, []);

  const sendMessage = (
    type: WebSocketMessageType,
    content?: WebSocketMessage["content"]
  ) => {
    socketRef.current?.send(stringifyWebSocketMessage(type, content));
  };

  const invoke = <T>(
    type: WebSocketMessageType,
    message?: WebSocketMessage["content"]
  ) => {
    return new Promise<T>((resolve, reject) => {
      socketRef.current?.addEventListener(
        "message",
        function handleMessage({ data }) {
          try {
            const json = JSON.parse(data.toString()) as WebSocketMessage;

            if (type === json.type) {
              socketRef.current?.removeEventListener("message", handleMessage);
              if ("error" in json) {
                reject(new Error(json.error));
              } else {
                resolve(json.content as T);
              }
            }
          } catch (_error: any) {}
        }
      );
      sendMessage(type, message);
    });
  };

  return { socket, sendMessage, cleanup, invoke };
};

export default useWebSocketClient;
