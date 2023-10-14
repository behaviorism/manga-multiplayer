import { useContext } from "react";
import { IpcMessage, Manga } from "../../../types";
import {
  addOrEditManga,
  removeManga,
  setBookmark,
} from "../../Store/dispatchers";
import { Store } from "../../Store/Store";

interface Props {
  manga: Manga;
  onChapterSelect?: () => void;
  onMangaRemove?: () => void;
}

const MangaPreviewer = ({ manga, onChapterSelect, onMangaRemove }: Props) => {
  const { dispatch } = useContext(Store);

  const handleRefresh = () => {
    window.ipc
      .invoke(IpcMessage.FetchManga, manga.url)
      .then((manga: Manga) => addOrEditManga(manga, dispatch));
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

  return (
    <div className="flex">
      <div className="h-full w-1/3">
        <img className="h-full w-full" src={manga.cover_url} />
      </div>
      <div className="w-2/3">
        <div>
          <span>{manga.name}</span>
          <button onClick={handleRefresh}>Refresh</button>
          <button onClick={handleRemove}>Remove manga</button>
        </div>
        <span>Chapters</span>
        {manga.chapters.map((chapter, i) => (
          <span
            key={i}
            onClick={() => handleChapterSelect(i)}
            className={
              i === manga.bookmark.chapterIndex ? "text-green-600" : ""
            }
          >
            Chapter {chapter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MangaPreviewer;
