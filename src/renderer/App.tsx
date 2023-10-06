import { RouterProvider, createBrowserRouter } from "react-router-dom";
import WindowControls from "./Components/WindowControls/WindowControls";
import Link from "./Pages/Link/Link";

const router = createBrowserRouter([
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
