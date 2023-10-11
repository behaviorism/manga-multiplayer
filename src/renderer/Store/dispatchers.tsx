import { Manga, Settings } from "../../types";
import {
  Action,
  ActionType,
  RemoveMangaAction,
  SetBookmarkAction,
} from "./reducer";

export const addOrEditManga = (
  manga: Manga,
  dispatch: React.Dispatch<Action>
) => {
  dispatch({
    type: ActionType.AddOrEditManga,
    manga,
  });
};

export const removeManga = (
  action: Omit<RemoveMangaAction, "type">,
  dispatch: React.Dispatch<Action>
) => {
  dispatch({
    type: ActionType.RemoveManga,
    ...action,
  });
};

export const setBookmark = (
  name: string,
  bookmark: SetBookmarkAction["bookmark"],
  dispatch: React.Dispatch<Action>
) => {
  dispatch({
    type: ActionType.SetBookmark,
    name,
    bookmark,
  });
};

export const setSettings = (
  settings: Settings,
  dispatch: React.Dispatch<Action>
) => {
  dispatch({
    type: ActionType.SetSettings,
    settings,
  });
};
