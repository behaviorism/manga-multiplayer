import Store from "electron-store";
import { Settings } from "../../types";

const store = new Store<Settings>({ defaults: { mangas: [] } });

export default store;
