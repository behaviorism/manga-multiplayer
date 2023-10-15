import { useContext, useState } from "react";
import { IpcMessage, Manga } from "../../../types";
import { addOrEditManga } from "../../Store/dispatchers";
import { Store } from "../../Store/Store";
import Input from "../Input/Input";

interface Props {
  onSuccessfulSearch?: () => void;
}

const MangaAdder = ({ onSuccessfulSearch }: Props) => {
  const { dispatch } = useContext(Store);

  const [url, setUrl] = useState("");

  const handleSearch = async () => {
    try {
      handleValidate(url);

      const manga = await window.ipc.invoke(IpcMessage.FetchManga, url);
      addOrEditManga(manga, dispatch);
      onSuccessfulSearch?.();
    } catch (_error: any) {}
  };

  const handleValidate = (url: string) => {
    try {
      new URL(url);
    } catch (_error: any) {
      throw new Error("Invalid URL");
    }
  };

  return (
    <form className="space-y-6 block m-0" onSubmit={handleSearch}>
      <Input
        label="Manga URL"
        value={url}
        setValue={setUrl}
        validate={handleValidate}
        placeholder="https://manganato.com/manga-ck979819"
        className="w-[19rem]"
      />
      <button type="submit" className="w-full btn btn-primary">
        Search
      </button>
    </form>
  );
};

export default MangaAdder;
