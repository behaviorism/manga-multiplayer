import { useContext, useEffect, useRef, useState } from "react";
import { Store } from "../Store/Store";
import { addOrEditManga, setBookmark } from "../Store/dispatchers";
import { Manga } from "../../types";
import { apiCall } from "../Helpers/api";
import toast from "../Helpers/toast";

const useCurrentMangaChapter = (currentManga: Manga | null) => {
  const { dispatch } = useContext(Store);

  const currentMangaRef = useRef(currentManga);
  currentMangaRef.current = currentManga;

  const [loaded, setLoaded] = useState(false);
  const [chapterPagesUrls, setChapterPagesUrls] = useState<Array<string>>([]);
  const lastChapterPageIndexRef = useRef(0);

  const isLastChapter =
    currentManga &&
    currentManga.chapters.findIndex(
      (chapter) =>
        chapter === currentManga.chapters[currentManga.bookmark!.chapterIndex]
    ) === currentManga.chapters.length;

  useEffect(() => {
    setLoaded(false);

    (function fetchManga() {
      const currentManga = currentMangaRef.current;

      if (currentManga) {
        Promise.all([
          apiCall("/fetchManga", { url: currentManga.url }).then(
            (manga: Manga) => addOrEditManga(manga, dispatch)
          ),
          apiCall("/fetchMangaPages", {
            url: currentManga.url,
            chapter:
              currentManga.chapters![currentManga.bookmark!.chapterIndex],
          }).then((pagesUrls: Array<string>) => {
            lastChapterPageIndexRef.current = pagesUrls.length - 1;
            setChapterPagesUrls(pagesUrls);
          }),
        ])
          .then(() => setLoaded(true))
          .catch((error: any) => {
            toast.error(error.message);
            fetchManga();
          });
      }
    })();
  }, [!currentManga, currentManga?.bookmark?.chapterIndex]);

  const progressManga = () => {
    const currentManga = currentMangaRef.current;

    if (currentManga?.bookmark) {
      if (currentManga.bookmark.pageIndex < lastChapterPageIndexRef.current) {
        const newPageIndex = currentManga.bookmark.pageIndex + 1;
        setBookmark(
          currentManga!.name,
          { ...currentManga.bookmark, pageIndex: newPageIndex },
          dispatch
        );
      } else if (!isLastChapter) {
        setBookmark(
          currentManga!.name,
          {
            chapterIndex: currentManga.bookmark.chapterIndex + 1,
            pageIndex: 0,
          },
          dispatch
        );
        setChapterPagesUrls([]);
      }
    }
  };

  return {
    currentBookmark: currentManga?.bookmark,
    isLastChapter,
    chapterPagesUrls,
    progressManga,
    loaded,
  };
};

export default useCurrentMangaChapter;
