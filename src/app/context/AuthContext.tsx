import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
<<<<<<< HEAD
<<<<<<< HEAD
import { apiRequest } from "../lib/api";
import { clearAuthToken, loadAuthToken, storeAuthToken } from "../lib/auth-storage";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

type SignUpPayload = SignInPayload & {
  name: string;
};

type AuthContextValue = {
=======
=======
>>>>>>> e91372e (initial commit)
import api from "../lib/api";
import {
  clearAuthToken,
  loadAuthToken,
  storeAuthToken,
} from "../lib/auth-storage";
import type { ApiEnvelope, User } from "../types";

interface AuthResponse {
  user: User;
  token: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload extends SignInPayload {
  name: string;
}

interface AuthContextValue {
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  signIn: (payload: SignInPayload) => Promise<User>;
  signUp: (payload: SignUpPayload) => Promise<User>;
  signOut: () => void;
<<<<<<< HEAD
<<<<<<< HEAD
};
=======
  refreshSession: () => Promise<void>;
}
>>>>>>> e91372e (initial commit)
=======
  refreshSession: () => Promise<void>;
}
>>>>>>> e91372e (initial commit)

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
<<<<<<< HEAD
<<<<<<< HEAD
  const [token, setToken] = useState<string | null>(() =>
    typeof window === "undefined" ? null : loadAuthToken(),
  );
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(token));

  function applyAuth(data: { user: User; token: string }) {
    storeAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
=======
=======
>>>>>>> e91372e (initial commit)
  const [token, setToken] = useState<string | null>(() => loadAuthToken());
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(loadAuthToken()));

  function applyAuth(response: AuthResponse) {
    storeAuthToken(response.token);
    setToken(response.token);
    setUser(response.user);
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  }

  function signOut() {
    clearAuthToken();
    setToken(null);
    setUser(null);
  }

<<<<<<< HEAD
<<<<<<< HEAD
  async function signIn(payload: SignInPayload) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    applyAuth(response.data);
    return response.data.user;
  }

  async function signUp(payload: SignUpPayload) {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    applyAuth(response.data);
    return response.data.user;
=======
=======
>>>>>>> e91372e (initial commit)
  async function refreshSession() {
    if (!token) {
      setUser(null);
      return;
    }

    const response = await api.get<ApiEnvelope<{ user: User }>>("/auth/me");
    setUser(response.data.data.user);
  }

  async function signIn(payload: SignInPayload) {
    const response = await api.post<ApiEnvelope<AuthResponse>>("/auth/login", payload);
    applyAuth(response.data.data);

    return response.data.data.user;
  }

  async function signUp(payload: SignUpPayload) {
    const response = await api.post<ApiEnvelope<AuthResponse>>("/auth/register", payload);
    applyAuth(response.data.data);

    return response.data.data.user;
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  }

  useEffect(() => {
    let isMounted = true;

<<<<<<< HEAD
<<<<<<< HEAD
    async function bootstrap() {
=======
    async function bootstrapAuth() {
>>>>>>> e91372e (initial commit)
=======
    async function bootstrapAuth() {
>>>>>>> e91372e (initial commit)
      if (!token) {
        if (isMounted) {
          setIsBootstrapping(false);
        }
        return;
      }

      try {
<<<<<<< HEAD
<<<<<<< HEAD
        const response = await apiRequest("/auth/me");

        if (isMounted) {
          setUser(response.data.user);
        }
      } catch (_error) {
        if (isMounted) {
          signOut();
=======
=======
>>>>>>> e91372e (initial commit)
        const response = await api.get<ApiEnvelope<{ user: User }>>("/auth/me");

        if (isMounted) {
          setUser(response.data.data.user);
        }
      } catch (_error) {
        if (isMounted) {
          clearAuthToken();
          setToken(null);
          setUser(null);
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

<<<<<<< HEAD
<<<<<<< HEAD
    bootstrap();
=======
    bootstrapAuth();
>>>>>>> e91372e (initial commit)
=======
    bootstrapAuth();
>>>>>>> e91372e (initial commit)

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isBootstrapping,
        signIn,
        signUp,
        signOut,
<<<<<<< HEAD
<<<<<<< HEAD
=======
        refreshSession,
>>>>>>> e91372e (initial commit)
=======
        refreshSession,
>>>>>>> e91372e (initial commit)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
<<<<<<< HEAD
<<<<<<< HEAD
    throw new Error("useAuth must be used within AuthProvider.");
=======
    throw new Error("useAuth must be used within an AuthProvider.");
>>>>>>> e91372e (initial commit)
=======
    throw new Error("useAuth must be used within an AuthProvider.");
>>>>>>> e91372e (initial commit)
  }

  return context;
}
