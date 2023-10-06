import React, { createContext, useEffect, useReducer, useState } from "react";
import { IpcMessage, Settings } from "../../types";
import { Action, reducer } from "./reducer";
import { setSettings } from "./dispatchers";

interface Context {
  settings: Settings;
  dispatch: React.Dispatch<Action>;
}

const initialState: Settings = {
  mangas: [],
};

export const Store = createContext<Context>({
  settings: initialState,
  dispatch: () => {},
});

export const StoreProvider = ({ children }: React.PropsWithChildren) => {
  const [settings, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    window.ipc
      .invoke(IpcMessage.GetSettings)
      .then((loadedSettings) => setSettings(loadedSettings, dispatch));
  }, []);

  return (
    <Store.Provider value={{ settings, dispatch }}>{children}</Store.Provider>
  );
};
