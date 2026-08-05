import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { clearUserPersistentCache } from "../api/persistentCache";
import { queryClient } from "../api/queryClient";
import type { User } from "../api/types";

const TOKEN_KEY = "auth.token";
const USER_KEY = "auth.user";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  expired: boolean;
  clearExpired: () => void;
  setSession: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function readStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [expired, setExpired] = useState(false);

  const setSession = useCallback((newUser: User, newToken: string) => {
    if (user && user.id !== newUser.id) {
      clearUserPersistentCache(user.id);
      queryClient.removeQueries({ queryKey: ["favlinks", user.id] });
      queryClient.removeQueries({ queryKey: ["folders", user.id] });
    }
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(TOKEN_KEY, newToken);
    setUser(newUser);
    setToken(newToken);
    setExpired(false);
  }, [user]);

  const logout = useCallback(() => {
    if (user) {
      clearUserPersistentCache(user.id);
      queryClient.removeQueries({ queryKey: ["favlinks", user.id] });
      queryClient.removeQueries({ queryKey: ["folders", user.id] });
    }
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  }, [user]);

  const clearExpired = useCallback(() => setExpired(false), []);

  useEffect(() => {
    const onExpired = () => {
      setExpired(true);
      logout();
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: user !== null && token !== null,
        expired,
        clearExpired,
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
