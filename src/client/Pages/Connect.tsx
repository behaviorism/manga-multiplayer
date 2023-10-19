import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useCurrentMangaChapter from "../Hooks/useCurrentMangaChapter";
import Reader from "../Components/Reader";
import Loader from "../Components/Loader";
import useWaiter from "../Hooks/useWaiter";
import useWebSocketClient from "../Hooks/useWebSocketClient";
import Menu from "../Components/Menu";
import { Store } from "../Store/Store";
import {
  addOrEditManga,
  setBookmark,
  setRecentManga,
} from "../Store/dispatchers";
import { Manga, WebSocketMessage, WebSocketMessageType } from "../../types";

const Connect = () => {
  const { settings, dispatch } = useContext(Store);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const roomId = useMemo(() => {
    return searchParams.get("room_id")!;
  }, []);

  const [currentMangaIndex, setCurrentMangaIndex] = useState(-1);
  const currentManga = settings.mangas[currentMangaIndex];

  const { progressManga, chapterPagesUrls, currentBookmark, loaded } =
    useCurrentMangaChapter(currentManga);

  const handleCurrentManga = (message: WebSocketMessage) => {
    const manga = message.content as Manga | null;

    if (manga) {
      const index = settings.mangas.findIndex(
        (_manga) => _manga.name === manga!.name
      );

      addOrEditManga(manga, dispatch);
      setBookmark(manga.name, manga.bookmark, dispatch);

      if (index > 0) {
        setRecentManga(settings.mangas[index], dispatch);
      }

      setCurrentMangaIndex(0);
    } else {
      setCurrentMangaIndex(-1);
    }
  };

  const { socket, sendMessage, invoke } = useWebSocketClient([
    [WebSocketMessageType.SetCurrentManga, handleCurrentManga],
  ]);

  useEffect(() => {
    if (socket) {
      invoke(WebSocketMessageType.JoinRoom, roomId).catch((error) => {
        console.error(error.message);
        navigate("/link");
      });
    }
  }, [socket]);

  const onWaiterStateChange = (waiterState: boolean) => {
    sendMessage(WebSocketMessageType.SetClientWaiting, waiterState);
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
