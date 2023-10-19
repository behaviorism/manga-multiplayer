import { useContext, useState } from "react";
import { addOrEditManga, setBookmark } from "../Store/dispatchers";
import { Store } from "../Store/Store";
import Input from "./Input";
import Form from "./Form";
import { apiCall } from "../Helpers/api";
import toast from "../Helpers/toast";

interface Props {
  onSuccessfulSearch?: () => void;
}

const MangaAdder = ({ onSuccessfulSearch }: Props) => {
  const { dispatch } = useContext(Store);

  const [url, setUrl] = useState("");

  const handleSearch = async () => {
    try {
      const fetchedManga = await apiCall("/fetchManga", { url });
      addOrEditManga(fetchedManga, dispatch);
      setBookmark(
        fetchedManga.name,
        { chapterIndex: 0, pageIndex: 0 },
        dispatch
      );
      onSuccessfulSearch?.();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleValidate = (url: string) => {
    try {
      new URL(url);
    } catch (_error: any) {
      throw new Error("Invalid URL");
    }
  };

  return (
    <Form submitLabel="Search" onSubmit={handleSearch}>
      <Input
        label="Manga URL"
        value={url}
        setValue={setUrl}
        validate={handleValidate}
        placeholder="https://manganato.com/manga-ck979819"
        required
      />
    </Form>
  );
};

export default MangaAdder;
