import { useContext, useState } from "react";
import { IpcMessage, Manga } from "../../../types";
import { addOrEditManga } from "../../Store/dispatchers";
import { Store } from "../../Store/Store";

interface Props {
  onSuccessfulSearch?: () => void;
}

const MangaAdder = ({ onSuccessfulSearch }: Props) => {
  const { dispatch } = useContext(Store);

  const [url, setUrl] = useState("");

  const handleSearch = async () => {
    const manga = await window.ipc.invoke(IpcMessage.FetchManga, url);
    addOrEditManga(manga, dispatch);
    onSuccessfulSearch?.();
  };

  return (
    <form onSubmit={handleSearch}>
      <label>
        Manga URL
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
      </label>
      <button type="submit">Search</button>
    </form>
  );
};

export default MangaAdder;
