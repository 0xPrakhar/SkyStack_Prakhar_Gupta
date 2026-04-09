import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import { Home } from "./pages/Home";
import { Explore } from "./pages/Explore";
import { EventDetail } from "./pages/EventDetail";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Admin } from "./pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "explore", Component: Explore },
      { path: "event/:id", Component: EventDetail },
      { path: "signin", Component: SignIn },
      { path: "signup", Component: SignUp },
      { path: "admin", Component: Admin },
    ],
  },
]);
