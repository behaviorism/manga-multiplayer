import { RouterProvider, createHashRouter } from "react-router-dom";
import WindowControls from "./Components/WindowControls/WindowControls";
import Link from "./Pages/Link/Link";
import Connect from "./Pages/Connect/Connect";
import Host from "./Pages/Host/Host";

const router = createHashRouter([
  {
    path: "/connect",
    element: <Connect />,
  },
  {
    path: "/host",
    element: <Host />,
  },
  {
    path: "/*",
    element: <Link />,
  },
]);

const App = () => {
  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-900">
      <WindowControls />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
