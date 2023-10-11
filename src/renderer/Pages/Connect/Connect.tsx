import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Manga, WebSocketMessage, WebSocketMessageType } from "../../../types";
import useCurrentMangaChapter from "../../Hooks/useCurrentMangaChapter";
import Reader from "../../Components/Reader/Reader";
import Loader from "../../Components/Loader/Loader";

const Connect = () => {
  const [searchParams] = useSearchParams();
  const host = searchParams.get("host");

  const [socket, setSocket] = useState<WebSocket | null>();
  const [currentManga, setCurrentManga] = useState<Manga | null>(null);
  const [userWaiting, setUserWaiting] = useState(false);
  const [hostWaiting, setHostWaiting] = useState(false);

  const { progressManga, chapterPagesUrls, currentPageIndex, loaded } =
    useCurrentMangaChapter(currentManga);

  const toggleWaiting = () => {
    // If host is waiting, user can't be waiting
    // as well because otherwise they would be already
    // reading the next page, therefore the user is
    // currently reading. Hence, the user wants to toggle
    // the status to reading. As both users are waiting,
    // reset host state and go onto the next page.
    if (hostWaiting) {
      setHostWaiting(false);
      progressManga();
    } else {
      // If host is still reading user may be waiting or
      // reading, so just toggle the state.
      setUserWaiting((userWating) => !userWaiting);
    }

    socket!.send(
      JSON.stringify({
        type: WebSocketMessageType.Waiting,
        waiting: !userWaiting,
      } as WebSocketMessage)
    );
  };

  useEffect(() => {
    const ws = new WebSocket(`ws:/${host}`);

    ws.onopen = () => setSocket(ws);
    ws.onerror = (error) => console.log(error);

    ws.onmessage = ({ data }) => {
      const message = JSON.parse(data) as WebSocketMessage;

      switch (message.type) {
        case WebSocketMessageType.CurrentManga:
          setCurrentManga(message.manga);
          break;
        case WebSocketMessageType.Waiting:
          // If user is waiting, host can't be
          // waiting as well (see above). Therefore
          // the host must want to move onto the next
          // page as well. So we reset user state and move
          // onto next page
          if (userWaiting) {
            setUserWaiting(false);
            progressManga();
          } else {
            setHostWaiting(message.waiting);
          }
          break;
        default:
          break;
      }
    };

    return () => ws.close();
  }, []);

  if (!socket) {
    return <Loader label="Connecting to host..." />;
  }

  if (!currentManga) {
    return <Loader label="Waiting for host to select manga..." />;
  }

  if (!loaded) {
    return <Loader label="Loading manga..." />;
  }

  return (
    <Reader
      toggleWaiting={toggleWaiting}
      userWaiting={userWaiting}
      othersWaiting={[hostWaiting]}
      chapterPagesUrls={chapterPagesUrls}
      currentPageIndex={currentPageIndex}
      manga={currentManga}
    />
  );
};

export default Connect;
