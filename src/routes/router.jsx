import Root from "../layouts/Root";
import { createBrowserRouter } from "react-router";
import Home from "../pages/home/Home";
import Register from "../pages/registration/Register";
import Error from "../pages/error/Error";
import Login from "../pages/login/LogIn";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
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
