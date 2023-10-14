import { useEffect, useState } from "react";
import { IpcMessage } from "../../types";

type OnStartServer = (address: string) => void;
type MessageHandlers = Array<[IpcMessage, (message: any) => void]>;

const useWebSocketProxy = (
  OnStartServer: OnStartServer,
  messageHandlers: MessageHandlers
) => {
  const [isAlive, setIsAlive] = useState(false);

  useEffect(() => {
    const initWebSocketServer = () => {
      window.ipc
        .invoke(IpcMessage.StartWebSocketServer)
        .then((address) => {
          setIsAlive(true);
          OnStartServer(address);
        })
        .catch((error: any) => {
          console.error(error.message);
          initWebSocketServer();
        });
    };

    initWebSocketServer();

    window.ipc.on(IpcMessage.WebSocketConnected, () =>
      console.info("A user has connected")
    );

    window.ipc.on(IpcMessage.WebSocketError, (_, error) =>
      console.error(error.message)
    );

    window.ipc.on(IpcMessage.WebSocketClientClose, () =>
      console.error("Another user has disconnected")
    );

    window.ipc.on(IpcMessage.WebSocketClose, () => {
      console.error("Host stopped. Retrying...");
      setIsAlive(false);
      initWebSocketServer();
    });

    for (let [channel, handler] of messageHandlers) {
      window.ipc.on(channel, handler);
    }

    return () => {
      window.ipc.removeAllListeners(IpcMessage.WebSocketConnected);
      window.ipc.removeAllListeners(IpcMessage.WebSocketError);
      window.ipc.removeAllListeners(IpcMessage.WebSocketClientClose);
      window.ipc.removeAllListeners(IpcMessage.WebSocketClose);

      for (let [channel] of messageHandlers) {
        window.ipc.removeAllListeners(channel);
      }
    };
  }, []);

  return isAlive;
};

export default useWebSocketProxy;
