<<<<<<< HEAD
<<<<<<< HEAD
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from "./context/AuthContext";
=======
=======
>>>>>>> e91372e (initial commit)
import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { EventsProvider } from "./context/EventsContext";
import { UserActivityProvider } from "./context/UserActivityContext";
import { router } from "./routes";
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)

export default function App() {
  return (
    <AuthProvider>
<<<<<<< HEAD
<<<<<<< HEAD
      <RouterProvider router={router} />
=======
=======
>>>>>>> e91372e (initial commit)
      <UserActivityProvider>
        <EventsProvider>
          <RouterProvider router={router} />
          <Toaster closeButton position="top-right" richColors theme="dark" />
        </EventsProvider>
      </UserActivityProvider>
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
    </AuthProvider>
  );
}
