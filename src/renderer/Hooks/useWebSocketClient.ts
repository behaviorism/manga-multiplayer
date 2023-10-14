import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebSocketMessage, WebSocketMessageType } from "../../types";

type MessageHandlers = Array<[WebSocketMessageType, (message: any) => void]>;

const useWebSocketClient = (
  address: string,
  messageHandlers: MessageHandlers
) => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket;

    try {
      ws = new WebSocket(address);
    } catch (_error: any) {
      console.error("Invalid connection URL");
      navigate("/link");
      return;
    }

    let pingTimeout: NodeJS.Timeout | undefined;

    const heartbeat = () => {
      clearTimeout(pingTimeout);
      pingTimeout = setTimeout(() => ws.close(), 30000 + 1000);
    };

    const controller = new AbortController();

    ws.addEventListener(
      "open",
      () => {
        console.info("Connected to host");
        heartbeat();
        setSocket(ws);
      },
      { signal: controller.signal }
    );

    ws.addEventListener("error", (error) => console.error(error), {
      signal: controller.signal,
    });

    for (let [webSocketMessageType, messageHandler] of messageHandlers) {
      ws.addEventListener(
        "message",
        ({ data }) => {
          try {
            if (data.toString() === "ping") {
              heartbeat();
              ws.send("pong");
              return;
            }

            const json = JSON.parse(data.toString()) as WebSocketMessage;

            if (json.type === webSocketMessageType) {
              messageHandler(json);
            }
          } catch (error: any) {
            console.error(error.message);
          }
        },
        { signal: controller.signal }
      );
    }

    const cleanup = () => {
      controller.abort();
      clearTimeout(pingTimeout);
      navigate("/link");
    };

    ws.addEventListener(
      "close",
      () => {
        console.error("Host connection closed");
        cleanup();
      },
      { signal: controller.signal }
    );

    return () => {
      ws.close();
      cleanup();
    };
  }, []);

  return { socket };
};

export default useWebSocketClient;
