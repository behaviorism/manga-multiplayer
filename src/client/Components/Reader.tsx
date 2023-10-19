import { useEffect, useRef, useState } from "react";
import { Manga } from "../../types";
import Menu from "./Menu";

interface Props {
  toggleWaiting: () => void;
  userWaiting: boolean;
  othersWaiting: Array<boolean>;
  allOthersWaiting: boolean;
  chapterPagesUrls: Array<string>;
  currentPageIndex: number;
  manga: Manga;
  onCopy?: () => void;
  onExit: () => void;
}

const Reader = ({
  toggleWaiting,
  userWaiting,
  allOthersWaiting,
  othersWaiting,
  chapterPagesUrls,
  currentPageIndex,
  manga,
  onCopy,
  onExit,
}: Props) => {
  const [clientCurrentPageIndex, setClientCurrentPageIndex] =
    useState(currentPageIndex);
  const refs = useRef({
    currentPageIndex,
    clientCurrentPageIndex: currentPageIndex,
    setClientCurrentPageIndex,
  });
  refs.current = {
    currentPageIndex,
    clientCurrentPageIndex,
    setClientCurrentPageIndex,
  };

  useEffect(() => {
    setClientCurrentPageIndex(currentPageIndex);
  }, [currentPageIndex]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          if (
            refs.current.clientCurrentPageIndex ===
            refs.current.currentPageIndex
          ) {
            toggleWaiting();
          } else {
            refs.current.setClientCurrentPageIndex(
              refs.current.clientCurrentPageIndex + 1
            );
          }

          break;
        case "ArrowLeft":
          if (refs.current.clientCurrentPageIndex > 0) {
            refs.current.setClientCurrentPageIndex(
              refs.current.clientCurrentPageIndex - 1
            );
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);

    const handleTouch = (event: TouchEvent) => {
      const isRight =
        event.changedTouches[0].clientX > document.body.clientWidth / 2;

      if (isRight) {
        if (
          refs.current.clientCurrentPageIndex === refs.current.currentPageIndex
        ) {
          toggleWaiting();
        } else {
          refs.current.setClientCurrentPageIndex(
            refs.current.clientCurrentPageIndex + 1
          );
        }
      } else {
        if (refs.current.clientCurrentPageIndex > 0) {
          refs.current.setClientCurrentPageIndex(
            refs.current.clientCurrentPageIndex - 1
          );
        }
      }
    };

    window.addEventListener("touchend", handleTouch);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("touchend", handleTouch);
    };
  }, []);

  const doneCount = othersWaiting.filter((isWaiting) => isWaiting).length;

  return (
    <>
      <Menu onCopy={onCopy} onBack={onExit} />
      <div className="w-100 mr-28 text-white mt-5 ml-5 font-medium text-lg self-start">
        <span className="text-base font-medium mr-2 px-2.5 py-0.5 rounded bg-gray-700 text-blue-400 border border-blue-400">
          {manga.chapters[manga.bookmark.chapterIndex]}
        </span>
        {manga.name}
      </div>
      <hr className="ml-5 w-[calc(100%-2.75rem)] self-start h-px my-4 border-0 bg-gray-700" />
      {chapterPagesUrls.map((chapterPageUrl, i) => (
        <img
          className={
            "max-h-[calc(100%-8rem)] max-w-[calc(100%-3rem)]" +
            (i !== clientCurrentPageIndex ? " hidden" : "")
          }
          key={i}
          src={chapterPageUrl}
        />
      ))}
      <div className="mb-3 mt-auto flex justify-center">
        {othersWaiting.length > 0 && (
          <span
            className={
              "text-sm font-medium px-2.5 py-0.5 rounded " +
              (userWaiting
                ? "bg-green-900 text-green-300"
                : "bg-yellow-900 text-yellow-300")
            }
          >
            {userWaiting ? "Waiting" : "Reading"}...
          </span>
        )}
        <span className="text-white font-medium mx-3">
          {clientCurrentPageIndex + 1} / {chapterPagesUrls.length}
        </span>
        {othersWaiting.length > 0 && (
          <span
            className={
              "text-sm font-medium px-2.5 py-0.5 rounded " +
              (allOthersWaiting
                ? "bg-green-900 text-green-300"
                : "bg-yellow-900 text-yellow-300")
            }
          >
            {doneCount} / {othersWaiting.length} waiting...
          </span>
        )}
      </div>
    </>
  );
};

export default Reader;
