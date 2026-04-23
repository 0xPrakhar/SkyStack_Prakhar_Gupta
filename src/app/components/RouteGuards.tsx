import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

function buildSignInPath(pathname: string, search: string) {
  const redirect = encodeURIComponent(`${pathname}${search}`);
  return `/signin?redirect=${redirect}`;
}

export function RequireAuth() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 text-slate-300">
        Checking your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={buildSignInPath(location.pathname, location.search)}
        replace
      />
    );
  }

  return <Outlet />;
}

export function RequireAdmin() {
  const { isAuthenticated, isBootstrapping, user } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 text-slate-300">
        Checking admin access...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={buildSignInPath(location.pathname, location.search)}
        replace
      />
    );
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
