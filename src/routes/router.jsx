import Root from "../layouts/Root";
import { createBrowserRouter } from "react-router";
import Home from "../pages/home/Home";
import Register from "../pages/registration/Register";
import Error from "../pages/error/Error";
import Login from "../pages/login/LogIn";
import SearchPage from "../pages/search/SearchPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
    ],
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Error />,
  },
]);
