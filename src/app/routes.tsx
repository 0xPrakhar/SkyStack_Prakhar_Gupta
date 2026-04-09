import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import { Home } from "./pages/Home";
import { Explore } from "./pages/Explore";
import { EventDetail } from "./pages/EventDetail";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Admin } from "./pages/Admin";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { MyEvents } from "./pages/MyEvents";
import { Library } from "./pages/Library";
>>>>>>> e91372e (initial commit)
=======
import { MyEvents } from "./pages/MyEvents";
import { Library } from "./pages/Library";
>>>>>>> e91372e (initial commit)

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
<<<<<<< HEAD
<<<<<<< HEAD
=======
      { path: "my-events", Component: MyEvents },
      { path: "library", Component: Library },
>>>>>>> e91372e (initial commit)
=======
      { path: "my-events", Component: MyEvents },
      { path: "library", Component: Library },
>>>>>>> e91372e (initial commit)
    ],
  },
]);
