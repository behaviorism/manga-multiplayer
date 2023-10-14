import { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useCurrentMangaChapter from "../../Hooks/useCurrentMangaChapter";
import Reader from "../../Components/Reader/Reader";
import Loader from "../../Components/Loader/Loader";
import useWaiter from "../../Hooks/useWaiter";
import useWebSocketClient from "../../Hooks/useWebSocketClient";
import Menu from "../../Components/Menu/Menu";
import { Store } from "../../Store/Store";
import {
  addOrEditManga,
  setBookmark,
  setRecentManga,
} from "../../Store/dispatchers";
import {
  WebSocketCurrentMangaMessage,
  WebSocketMessage,
  WebSocketMessageType,
} from "../../../types";

const Connect = () => {
  const { settings, dispatch } = useContext(Store);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const host = searchParams.get("host")!;

  const [currentMangaIndex, setCurrentMangaIndex] = useState(-1);
  const currentManga = settings.mangas[currentMangaIndex];

  const { progressManga, chapterPagesUrls, currentBookmark, loaded } =
    useCurrentMangaChapter(currentManga);

  const handleCurrentManga = (message: WebSocketCurrentMangaMessage) => {
    if (message.manga) {
      const index = settings.mangas.findIndex(
        (manga) => manga.name === message.manga!.name
      );

      addOrEditManga(message.manga, dispatch);
      setBookmark(message.manga.name, message.manga.bookmark, dispatch);

      if (index > 0) {
        setRecentManga(settings.mangas[index], dispatch);
      }

      setCurrentMangaIndex(0);
    } else {
      setCurrentMangaIndex(-1);
    }
  };

  const { socket } = useWebSocketClient(host, [
    [WebSocketMessageType.CurrentManga, handleCurrentManga],
  ]);

  const onWaiterStateChange = (waiterState: boolean) => {
    socket!.send(
      JSON.stringify({
        type: WebSocketMessageType.Waiting,
        waiting: [waiterState],
      } as WebSocketMessage)
    );
  };

  const { userWaiting, othersWaiting, allOthersWaiting, toggleWaiting } =
    useWaiter(progressManga, onWaiterStateChange, socket);

  const handleExit = () => navigate("/link");

  if (!socket) {
    return <Loader label="Connecting to host..." className="my-auto" />;
  }

  if (!currentManga) {
    return (
      <>
        <Menu onClose={handleExit} />
        <Loader
          label="Waiting for host to select manga..."
          className="my-auto"
        />
      </>
    );
  }

  if (!loaded) {
    return <Loader label="Loading manga..." className="my-auto" />;
  }

  return (
    <Reader
      toggleWaiting={toggleWaiting}
      userWaiting={userWaiting}
      othersWaiting={othersWaiting}
      allOthersWaiting={allOthersWaiting}
      chapterPagesUrls={chapterPagesUrls}
      currentPageIndex={currentBookmark!.pageIndex}
      manga={currentManga}
      onExit={handleExit}
    />
  );
};

export default Connect;
