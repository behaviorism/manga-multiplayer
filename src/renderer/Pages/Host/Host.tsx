import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store/Store";
import Modal from "../../Components/Modal/Modal";
import Reader from "../../Components/Reader/Reader";
import useCurrentMangaChapter from "../../Hooks/useCurrentMangaChapter";
import useWaiter from "../../Hooks/useWaiter";
import Loader from "../../Components/Loader/Loader";
import MangaAdder from "../../Components/MangaAdder/MangaAdder";
import useWebSocketProxy from "../../Hooks/useWebSocketProxy";
import MangaPreview from "../../Components/MangaPreviewer/MangaPreviewer";
import { IpcMessage } from "../../../types";
import Menu from "../../Components/Menu/Menu";
import { setRecentManga } from "../../Store/dispatchers";

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

  const [webSocketAddress, setWebSocketAddress] = useState("");

  useEffect(() => {
    window.ipc.send(IpcMessage.WebSocketCurrentManga, currentManga);
  }, [currentManga]);

  const { progressManga, chapterPagesUrls, currentBookmark, loaded } =
    useCurrentMangaChapter(currentManga);

  const onWaiterStateChange = (waiterState: boolean) => {
    window.ipc.send(IpcMessage.WebSocketWaiting, waiterState);
  };

  const {
    userWaiting,
    userWaitingRef,
    othersWaiting,
    allOthersWaiting,
    toggleWaiting,
  } = useWaiter(
    progressManga,
    onWaiterStateChange,
    // proxy ws messages through backend
    window.ipc
  );

  const handleGetCurrentManga = () => {
    window.ipc.send(IpcMessage.GetCurrentManga, currentMangaRef.current);
  };

  const handleGetWaiting = () => {
    window.ipc.send(IpcMessage.GetWaiting, userWaitingRef.current);
  };

  const isWebSocketAlive = useWebSocketProxy(setWebSocketAddress, [
    [IpcMessage.GetCurrentManga, handleGetCurrentManga],
    [IpcMessage.GetWaiting, handleGetWaiting],
  ]);

  const handleStopHosting = () => {
    window.ipc.send(IpcMessage.StopWebSocketServer);
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

  if (!isWebSocketAlive) {
    return <Loader label="Starting host..." className="my-auto" />;
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
        onCopy={() => navigator.clipboard.writeText(webSocketAddress)}
        onExit={() => {
          // reset waiter state in main process
          window.ipc.send(IpcMessage.WebSocketWaiting, false);
          setCurrentMangaIndex(-1);
        }}
      />
    );
  }

  return (
    <>
      <Menu
        onCopy={() => navigator.clipboard.writeText(webSocketAddress)}
        onAdd={() => setShowMangaAdder(true)}
        onClose={handleStopHosting}
      />
      <div className="w-100 mr-28 text-white mt-12 ml-10 font-medium text-2xl self-start">
        Your Library
      </div>
      <hr className="ml-5 w-[calc(100%-2.75rem)] self-start h-px my-4 border-0 bg-gray-700" />
      <div className="w-[calc(100%-3rem)] flex justify flex-wrap overflow-scroll">
        {settings.mangas.map((manga, i) => (
          <div
            key={i}
            className="w-1/4 px-2 my-2 hover:cursor-pointer"
            onClick={() => handleMangaClick(i)}
          >
            <img
              className="rounded-lg shadow border-2 border-gray-500"
              src={manga.cover_url}
            />
            <div className="text-white px-2 pt-2 text-xs text-center font-semibold max-3-lines">
              {manga.name}
            </div>
          </div>
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
