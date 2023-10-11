import { useContext, useEffect, useState } from "react";
import { IpcMessage, Manga } from "../../types";
import { Store } from "../Store/Store";
import { addOrEditManga, setBookmark } from "../Store/dispatchers";

const useCurrentMangaChapter = (initialReference: Manga | null) => {
  const { settings, dispatch } = useContext(Store);
  const [loaded, setLoaded] = useState(false);
  const [chapterPagesUrls, setChapterPagesUrls] = useState<Array<string>>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [lastChapterPageIndex, setLastChapterPageIndex] = useState(0);

  const currentManga = settings.mangas.find(
    (_manga) => _manga.name === initialReference?.name
  );

  const currentBookmark = currentManga?.bookmark;

  const isLastChapter = currentManga
    ? currentManga.chapters.findIndex(
        (chapter) =>
          chapter === currentManga.chapters[currentBookmark!.chapterIndex]
      ) === currentManga.chapters.length
    : false;

  useEffect(() => {
    setLoaded(false);

    if (initialReference) {
      Promise.all([
        window.ipc
          .invoke(IpcMessage.FetchManga, initialReference.url)
          .then((manga: Manga) => addOrEditManga(manga, dispatch)),
        window.ipc
          .invoke(
            IpcMessage.FetchMangaPages,
            initialReference.url,
            initialReference.chapters[initialReference.bookmark.chapterIndex]
          )
          .then((pagesUrls: Array<string>) => {
            setLastChapterPageIndex(pagesUrls.length);
            setChapterPagesUrls(pagesUrls);
          }),
      ]).then(() => setLoaded(true));
    }
  }, [
    initialReference === null,
    initialReference?.bookmark.chapterIndex === currentBookmark?.chapterIndex,
  ]);

  const progressManga = () => {
    if (initialReference && currentBookmark) {
      if (currentBookmark.pageIndex < lastChapterPageIndex) {
        const newPageIndex = currentBookmark.pageIndex + 1;
        setBookmark(
          currentManga.name,
          { ...currentBookmark, pageIndex: newPageIndex },
          dispatch
        );
        setCurrentPageIndex(newPageIndex);
      } else if (!isLastChapter) {
        setBookmark(
          currentManga.name,
          { chapterIndex: currentBookmark.chapterIndex + 1, pageIndex: 0 },
          dispatch
        );
        setCurrentPageIndex(0);
        setChapterPagesUrls([]);
      }
    }
  };

  return {
    currentBookmark,
    isLastChapter,
    chapterPagesUrls,
    currentPageIndex,
    progressManga,
    loaded,
  };
};

export default useCurrentMangaChapter;
