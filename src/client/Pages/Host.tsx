import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store/Store";
import Modal from "../Components/Modal";
import Reader from "../Components/Reader";
import useCurrentMangaChapter from "../Hooks/useCurrentMangaChapter";
import useWaiter from "../Hooks/useWaiter";
import Loader from "../Components/Loader";
import MangaAdder from "../Components/MangaAdder";
import MangaPreview from "../Components/MangaPreviewer";
import Menu from "../Components/Menu";
import { setRecentManga } from "../Store/dispatchers";
import useWebSocketClient from "../Hooks/useWebSocketClient";
import { WebSocketMessageType } from "../../types";

const Host = () => {
  const { settings, dispatch } = useContext(Store);

  const navigate = useNavigate();

  const [showMangaAdder, setShowMangaAdder] = useState(false);
  const [showMangaPreviewer, setShowMangaPreviewer] = useState(false);
  const [previewedMangaIndex, setPreviewedMangaIndex] = useState(-1);

  const [currentMangaIndex, setCurrentMangaIndex] = useState(-1);
  const currentManga = settings.mangas[currentMangaIndex];
  const currentMangaRef = useRef(currentManga);
  currentMangaRef.current = currentManga;

  const [roomId, setRoomId] = useState<string | null>(null);

  const handleGetCurrentManga = () => {
    sendMessage(
      WebSocketMessageType.GetHostCurrentManga,
      currentMangaRef.current
    );
  };

  const { socket, cleanup, invoke, sendMessage } = useWebSocketClient([
    [WebSocketMessageType.GetHostCurrentManga, handleGetCurrentManga],
  ]);

  useEffect(() => {
    if (socket) {
      invoke<string>(WebSocketMessageType.CreateRoom)
        .then((roomId) => setRoomId(roomId))
        .catch((error) => {
          console.error(error.message);
          navigate("/link");
        });
    }
  }, [socket]);

  useEffect(() => {
    sendMessage(WebSocketMessageType.SetCurrentManga, currentManga);
  }, [currentManga]);

  const { progressManga, chapterPagesUrls, currentBookmark, loaded } =
    useCurrentMangaChapter(currentManga);

  const onWaiterStateChange = (waiterState: boolean) => {
    sendMessage(WebSocketMessageType.SetClientWaiting, waiterState);
  };

  const { userWaiting, othersWaiting, allOthersWaiting, toggleWaiting } =
    useWaiter(progressManga, onWaiterStateChange, socket);

  const handleStopHosting = () => {
    cleanup();
    navigate("/link");
  };

  const handleMangaClick = (mangaIndex: number) => {
    setShowMangaPreviewer(true);
    setPreviewedMangaIndex(mangaIndex);
  };

  const handleChapterSelect = () => {
    setRecentManga(settings.mangas[previewedMangaIndex], dispatch);
    setCurrentMangaIndex(0);
    setPreviewedMangaIndex(-1);
    setShowMangaPreviewer(false);
  };

  const handleCopyRoomLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/#/connect?room_id=${roomId!}`
    );
  };

  if (!roomId) {
    return <Loader label="Creating room..." className="my-auto" />;
  }

  if (currentManga) {
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
        onCopy={handleCopyRoomLink}
        onExit={() => {
          sendMessage(WebSocketMessageType.SetClientWaiting, false);
          setCurrentMangaIndex(-1);
        }}
      />
    );
  }

  return (
    <>
      <Menu
        onCopy={handleCopyRoomLink}
        onAdd={() => setShowMangaAdder(true)}
        onClose={handleStopHosting}
      />
      <div className="w-100 mr-28 text-white mt-5 ml-10 font-medium text-2xl self-start">
        Your Library
      </div>
      <hr className="ml-5 w-[calc(100%-2.75rem)] self-start h-px my-4 border-0 bg-gray-700" />
      <div className="w-[calc(100%-3rem)] flex justify flex-wrap overflow-scroll">
        {settings.mangas.map((manga, i) => (
          <button
            key={i}
            className="w-1/4 md:w-[20%] lg:w-[12.5%] px-2 md:px-3 lg:px-4 my-2 hover:cursor-pointer flex flex-col items-center"
            onClick={() => handleMangaClick(i)}
          >
            <img className="rounded-lg shadow" src={manga.cover_url} />
            <div className="text-white px-2 pt-2 text-xs text-center font-semibold max-3-lines">
              {manga.name}
            </div>
          </button>
        ))}
      </div>
      <Modal
        title={settings.mangas[previewedMangaIndex]?.name}
        isOpen={showMangaPreviewer}
        setIsOpen={setShowMangaPreviewer}
        onClose={() => setPreviewedMangaIndex(-1)}
      >
        {previewedMangaIndex > -1 && (
          <MangaPreview
            manga={settings.mangas[previewedMangaIndex]}
            onChapterSelect={handleChapterSelect}
            onMangaRemove={() => setShowMangaPreviewer(false)}
          />
        )}
      </Modal>
      <Modal
        title="Add New Manga"
        isOpen={showMangaAdder}
        setIsOpen={setShowMangaAdder}
      >
        <MangaAdder onSuccessfulSearch={() => setShowMangaAdder(false)} />
      </Modal>
    </>
  );
};

export default Host;
