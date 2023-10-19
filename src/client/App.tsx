import { RouterProvider, createHashRouter } from "react-router-dom";
import Link from "./Pages/Link";
import Connect from "./Pages/Connect";
import Host from "./Pages/Host";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <RouterProvider router={router} />
      <ToastContainer autoClose={5000} hideProgressBar={true} />
    </div>
  );
};

export default App;
