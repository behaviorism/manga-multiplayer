import React, { createContext, useEffect, useReducer, useState } from "react";
import { Action, reducer } from "./reducer";
import { setSettings } from "./dispatchers";
import { Settings } from "../../types";

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
    const settingsString = window.localStorage.getItem("settings");

    setSettings(
      settingsString ? JSON.parse(settingsString) : initialState,
      dispatch
    );
  }, []);

  return (
    <Store.Provider value={{ settings, dispatch }}>{children}</Store.Provider>
  );
};
