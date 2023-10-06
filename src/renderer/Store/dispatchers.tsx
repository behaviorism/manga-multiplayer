import {
  Action,
  ActionType,
  AddMangaAction,
  RemoveMangaAction,
  SetBookmarkAction,
  SetSettingsAction,
} from "./reducer";

export const addManga = (
  action: Omit<AddMangaAction, "type">,
  dispatch: React.Dispatch<Action>
) => {
  dispatch({
    type: ActionType.AddManga,
    ...action,
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
  action: Omit<SetBookmarkAction, "type">,
  dispatch: React.Dispatch<Action>
) => {
  dispatch({
    type: ActionType.SetBookmark,
    ...action,
  });
};

export const setSettings = (
  action: Omit<SetSettingsAction, "type">,
  dispatch: React.Dispatch<Action>
) => {
  dispatch({
    type: ActionType.SetSettings,
    ...action,
  });
};
