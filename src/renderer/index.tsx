import { createRoot } from "react-dom/client";
import { StoreProvider } from "./Store/Store";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StoreProvider>
    <App />
  </StoreProvider>
);
