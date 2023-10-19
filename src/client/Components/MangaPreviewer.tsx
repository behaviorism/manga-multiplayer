import { useContext, useEffect, useReducer, useRef } from "react";
import { addOrEditManga, removeManga, setBookmark } from "../Store/dispatchers";
import { Store } from "../Store/Store";
import ActionIcon from "./ActionIcon";
import { Manga } from "../../types";
import { apiCall } from "../Helpers/api";

interface Props {
  manga: Manga;
  onChapterSelect?: () => void;
  onMangaRemove?: () => void;
}

const MangaPreviewer = ({ manga, onChapterSelect, onMangaRemove }: Props) => {
  const { dispatch } = useContext(Store);

  const bookmarkedChapterRef = useRef<HTMLDivElement>(null);

  const handleRefresh = async () => {
    try {
      const fetchedManga = await apiCall("/fetchManga", { url: manga.url });
      addOrEditManga(fetchedManga, dispatch);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleRemove = () => {
    removeManga(manga, dispatch);
    onMangaRemove?.();
  };

  const handleChapterSelect = (chapterIndex: number) => {
    setBookmark(manga.name, { chapterIndex, pageIndex: 0 }, dispatch);

    if (onChapterSelect) {
      onChapterSelect();
    }
  };

  useEffect(() => {
    bookmarkedChapterRef.current?.scrollIntoView(false);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="h-full w-1/3">
          <img
            className="h-full w-full shadow border-2 border-gray-500 rounded-lg"
            src={manga.cover_url}
          />
        </div>
        <div className="w-2/3 flex items-start justify-end pt-2">
          <ActionIcon onClick={handleRefresh} width="3" height="3">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"
            />
          </ActionIcon>
          <ActionIcon onClick={handleRemove} width="3" height="3">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
            />
          </ActionIcon>
        </div>
      </div>
      <hr className="w-full h-px mt-4 mb-2 border-0 bg-gray-500" />
      <span className="text-white font-medium py-2 text-lg">Chapters</span>
      <div className="max-h-48 overflow-auto">
        {[...manga.chapters].reverse().map((chapter, i) => {
          const actualIndex = manga.chapters.length - 1 - i;

          return (
            <div
              key={i}
              onClick={() => handleChapterSelect(actualIndex)}
              ref={
                actualIndex === manga.bookmark.chapterIndex
                  ? bookmarkedChapterRef
                  : undefined
              }
              className={
                "w-full text-white border-b py-2 border-gray-500 text-sm hover:cursor-pointer" +
                (actualIndex === manga.bookmark.chapterIndex
                  ? " !text-green-600"
                  : "")
              }
            >
              Chapter {chapter}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MangaPreviewer;
