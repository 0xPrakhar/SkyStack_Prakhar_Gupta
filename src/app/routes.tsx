import { Suspense, lazy, type ComponentType } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import { RequireAdmin, RequireAuth } from "./components/RouteGuards";

const Home = lazyPage(() => import("./pages/Home"), "Home");
const Explore = lazyPage(() => import("./pages/Explore"), "Explore");
const EventDetail = lazyPage(() => import("./pages/EventDetail"), "EventDetail");
const SignIn = lazyPage(() => import("./pages/SignIn"), "SignIn");
const SignUp = lazyPage(() => import("./pages/SignUp"), "SignUp");
const Admin = lazyPage(() => import("./pages/Admin"), "Admin");
const Library = lazyPage(() => import("./pages/Library"), "Library");
const MyEvents = lazyPage(() => import("./pages/MyEvents"), "MyEvents");

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "explore", Component: Explore },
      { path: "signin", Component: SignIn },
      { path: "signup", Component: SignUp },
      {
        Component: RequireAuth,
        children: [
          { path: "event/:id", Component: EventDetail },
          { path: "library", Component: Library },
          { path: "my-events", Component: MyEvents },
        ],
      },
      {
        Component: RequireAdmin,
        children: [{ path: "admin", Component: Admin }],
      },
    ],
  },
]);

function lazyPage<TModule extends Record<string, ComponentType>>(
  loader: () => Promise<TModule>,
  exportName: keyof TModule,
) {
  const LazyComponent = lazy(async () => {
    const module = await loader();
    return {
      default: module[exportName] as ComponentType,
    };
  });

  return function LazyPage() {
    return (
      <Suspense fallback={<RouteLoading />}>
        <LazyComponent />
      </Suspense>
    );
  };
}

function RouteLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 text-slate-300">
      Loading page...
    </div>
  );
}
