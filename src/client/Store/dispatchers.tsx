import { Manga, Settings } from "../../types";
import { Action, ActionType, SetBookmarkAction } from "./reducer";

export const setRecentManga = (
  manga: Manga,
  dispatch: React.Dispatch<Action>
) => {
  dispatch({
    type: ActionType.SetRecentManga,
    manga,
  });
};

export const addOrEditManga = (
  manga: Manga,
  dispatch: React.Dispatch<Action>
) => {
  dispatch({
    type: ActionType.AddOrEditManga,
    manga,
  });
};

export const removeManga = (manga: Manga, dispatch: React.Dispatch<Action>) => {
  dispatch({
    type: ActionType.RemoveManga,
    manga,
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
