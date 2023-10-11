import { RouterProvider, createBrowserRouter } from "react-router-dom";
import WindowControls from "./Components/WindowControls/WindowControls";
import Link from "./Pages/Link/Link";
import Connect from "./Pages/Connect/Connect";

const router = createBrowserRouter([
  {
    path: "/connect",
    element: <Connect />,
  },
  {
    path: "/*",
    element: <Link />,
  },
]);

const App = () => {
  return (
    <>
      <WindowControls />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
