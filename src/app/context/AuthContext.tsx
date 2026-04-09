import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { clearAuthToken, loadAuthToken, storeAuthToken } from "../lib/auth-storage";
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
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  signIn: (payload: SignInPayload) => Promise<User>;
  signUp: (payload: SignUpPayload) => Promise<User>;
  signOut: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => loadAuthToken());
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(loadAuthToken()));

  function applyAuth(response: AuthResponse) {
    storeAuthToken(response.token);
    setToken(response.token);
    setUser(response.user);
  }

  function signOut() {
    clearAuthToken();
    setToken(null);
    setUser(null);
  }

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
  }

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      if (!token) {
        if (isMounted) {
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        const response = await api.get<ApiEnvelope<{ user: User }>>("/auth/me");

        if (isMounted) {
          setUser(response.data.data.user);
        }
      } catch (_error) {
        if (isMounted) {
          clearAuthToken();
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrapAuth();

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
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
