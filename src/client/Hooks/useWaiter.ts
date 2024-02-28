import { useEffect, useRef, useState } from "react";
import { WebSocketMessage, WebSocketMessageType } from "../../types";

type Next = () => void;
type OnWaiterStateChange = (newWaiterState: boolean) => void;
type EventEmitter = {
  addEventListener: any;
  removeEventListener: any;
};

const useWaiter = (
  next: Next,
  onWaiterStateChange: OnWaiterStateChange,
  socket: EventEmitter | null
) => {
  const [userWaiting, setUserWaiting] = useState(false);

  const { othersWaiting, allOthersWaiting, setOthersWaiting } = useOthers();

  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent<any>) => {
      try {
        const message = JSON.parse(data) as WebSocketMessage;

        switch (message.type) {
          case WebSocketMessageType.ClientsWaitingStates:
            setOthersWaiting(message.content);
            break;
          case WebSocketMessageType.Forward:
            setUserWaiting(false);
            setOthersWaiting(false);
            next();
            break;
          default:
            break;
        }
      } catch (_error) {}
    };

    if (socket) {
      socket.addEventListener("message", handleMessage);
    }

    return () => {
      socket?.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const toggleWaiting = () => {
    setUserWaiting((userWaiting) => {
      onWaiterStateChange(!userWaiting);
      return !userWaiting;
    });
  };

  return {
    userWaiting,
    othersWaiting,
    allOthersWaiting,
    toggleWaiting,
    setOthersWaiting,
  };
};

const useOthers = () => {
  const [othersWaiting, _setOthersWaiting] = useState<Array<boolean>>([]);

  const allOthersWaiting =
    othersWaiting.length > 0
      ? othersWaiting.every((isWaiting) => isWaiting)
      : true;

  const setOthersWaiting = (newState: Array<boolean> | boolean) => {
    if (newState instanceof Array) {
      _setOthersWaiting(newState);
    } else {
      _setOthersWaiting((othersWaiting) =>
        new Array(othersWaiting.length).fill(newState)
      );
    }
  };

  return { othersWaiting, allOthersWaiting, setOthersWaiting };
};

export default useWaiter;
