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
    console.log("ok");
    setTimeout(() => {
      window.scrollTo(0, 1);
    });
  }, [window.location.pathname]);

  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-900">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
