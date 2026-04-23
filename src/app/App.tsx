import { RouterProvider } from "react-router";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/AuthContext";
import { EventsProvider } from "./context/EventsContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { UserActivityProvider } from "./context/UserActivityContext";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <NotificationsProvider>
          <EventsProvider>
            <UserActivityProvider>
              <RouterProvider router={router} />
              <Toaster />
            </UserActivityProvider>
          </EventsProvider>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
