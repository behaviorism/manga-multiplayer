import { useEffect, useState } from "react";
import { Manga } from "../../../types";

interface Props {
  toggleWaiting: () => void;
  userWaiting: boolean;
  othersWaiting: Array<boolean>;
  chapterPagesUrls: Array<string>;
  currentPageIndex: number;
  manga: Manga;
}

const Reader = ({
  toggleWaiting,
  userWaiting,
  othersWaiting,
  chapterPagesUrls,
  currentPageIndex,
  manga,
}: Props) => {
  const [clientCurrentPageIndex, setClientCurrentPageIndex] =
    useState(currentPageIndex);

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          if (clientCurrentPageIndex === currentPageIndex) {
            toggleWaiting();
          } else {
            setClientCurrentPageIndex(
              (clientCurrentPageIndex) => clientCurrentPageIndex + 1
            );
          }
          break;
        case "ArrowLeft":
          if (clientCurrentPageIndex > 0) {
            setClientCurrentPageIndex(
              (clientCurrentPageIndex) => clientCurrentPageIndex - 1
            );
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", keydownHandler);

    return () => window.removeEventListener("keydown", keydownHandler);
  }, []);

  const areOthersDone = othersWaiting.every((otherIsWaiting) => otherIsWaiting);

  return (
    <div>
      <div>
        {manga.name} Chapter {manga.chapters[manga.bookmark.chapterIndex]}
      </div>
      <img src={chapterPagesUrls[clientCurrentPageIndex]} />
      {othersWaiting.length > 0 && <div>{areOthersDone}</div>}
      <div>{userWaiting}</div>
      <div>{clientCurrentPageIndex + 1}</div>
    </div>
  );
};

export default Reader;
