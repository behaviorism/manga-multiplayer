import { useEffect, useRef, useState } from "react";
import {
  IpcMessage,
  WebSocketMessage,
  WebSocketMessageType,
} from "../../types";

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
  const userWaitingRef = useRef(userWaiting);
  userWaitingRef.current = userWaiting;

  const { othersWaiting, allOthersWaiting, setOthersWaiting } = useOthers();

  const allOthersWaitingRef = useRef(allOthersWaiting);
  allOthersWaitingRef.current = allOthersWaiting;

  useEffect(() => {
    const handleMessage = ({ data }: MessageEvent<any>) => {
      try {
        const message = JSON.parse(data) as WebSocketMessage;

        if (message.type === WebSocketMessageType.Waiting) {
          const allOthersWaiting =
            message.waiting.length === 0 ||
            message.waiting.every((isWaiting) => isWaiting);

          if (userWaitingRef.current && allOthersWaiting) {
            setUserWaiting(false);
            userWaitingRef.current = false;
            setOthersWaiting(false);
            allOthersWaitingRef.current = false;
            onWaiterStateChange(false);
            next();
          } else {
            setOthersWaiting(message.waiting);
          }
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
    if (allOthersWaitingRef.current) {
      setOthersWaiting(false);
      allOthersWaitingRef.current = false;
      setUserWaiting(false);
      userWaitingRef.current = false;
      onWaiterStateChange(true);
      next();
    } else {
      setUserWaiting((userWaiting) => {
        userWaitingRef.current = !userWaiting;
        onWaiterStateChange(!userWaiting);
        return !userWaiting;
      });
    }
  };

  return {
    userWaiting,
    userWaitingRef,
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
      window.ipc.send(IpcMessage.SetOthersWaiting, newState);
    }
  };

  return { othersWaiting, allOthersWaiting, setOthersWaiting };
};

export default useWaiter;
