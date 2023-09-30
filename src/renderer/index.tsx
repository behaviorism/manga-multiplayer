import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WindowControls from "./components/WindowControls/WindowControls";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div></div>,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <WindowControls />
    <RouterProvider router={router} />
  </>
);
