import Store from "electron-store";
import { Settings } from "../../types";

export const store = new Store<Settings>({ defaults: { mangas: [] } });
