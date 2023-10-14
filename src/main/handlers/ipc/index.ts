import SettingsIpc from "./settings";
import WebSocketIpc from "./websocket";
import WindowControlsIpc from "./windowControls";
import MangaIpc from "./manga";

const init = () => {
  SettingsIpc.init();
  WindowControlsIpc.init();
  MangaIpc.init();
  WebSocketIpc.init();
};

export default { init };
