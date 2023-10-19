import { RouterProvider, createHashRouter } from "react-router-dom";
import Link from "./Pages/Link";
import Connect from "./Pages/Connect";
import Host from "./Pages/Host";
import { useEffect } from "react";

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
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 1);
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-900">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
