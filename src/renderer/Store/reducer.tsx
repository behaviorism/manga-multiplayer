import { IpcMessage, Manga, Settings } from "../../types";

export enum ActionType {
  AddOrEditManga,
  RemoveManga,
  SetBookmark,
  SetSettings,
}

export interface AddOrEditMangaAction {
  type: ActionType.AddOrEditManga;
  manga: Manga;
}

export interface RemoveMangaAction {
  type: ActionType.RemoveManga;
  name: string;
}

export interface SetBookmarkAction {
  type: ActionType.SetBookmark;
  name: string;
  bookmark: Manga["bookmark"];
}

export interface SetSettingsAction {
  type: ActionType.SetSettings;
  settings: Settings;
}

export type Action =
  | AddOrEditMangaAction
  | RemoveMangaAction
  | SetBookmarkAction
  | SetSettingsAction;

const addOrEditManga = (state: Settings, action: AddOrEditMangaAction) => {
  const newState = { ...state };
  const mangaIndex = newState.mangas.findIndex(
    (manga) => manga.name === action.manga.name
  );

  if (mangaIndex > -1) {
    newState.mangas[mangaIndex] = action.manga;
  } else {
    newState.mangas.unshift(action.manga);
  }

  return newState;
};

const removeManga = (state: Settings, action: RemoveMangaAction) => {
  const newState = { ...state };
  const manga = newState.mangas.find((manga) => manga.name === action.name);

  if (manga) {
    newState.mangas.splice(newState.mangas.indexOf(manga), 1);
  }

  return newState;
};

const setBookmark = (state: Settings, action: SetBookmarkAction) => {
  const newState = { ...state };
  const manga = newState.mangas.find((manga) => manga.name === action.name);

  if (manga) {
    manga.bookmark = action.bookmark;
  }

  return newState;
};

export const reducer: React.Reducer<Settings, Action> = (
  state: Settings,
  action: Action
) => {
  var newState: Settings;

  switch (action.type) {
    case ActionType.AddOrEditManga:
      newState = addOrEditManga(state, action);
      break;
    case ActionType.RemoveManga:
      newState = removeManga(state, action);
      break;
    case ActionType.SetBookmark:
      newState = setBookmark(state, action);
      break;
    case ActionType.SetSettings:
      newState = action.settings;
      break;
    default:
      return state;
  }

  window.ipc.send(IpcMessage.SetSettings, newState);

  return newState;
};
