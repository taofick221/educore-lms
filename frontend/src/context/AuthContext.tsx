import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getProfile,
  login as loginApi,
  logout as logoutApi,
} from "../api/accounts";

import type {
  LoginData,
  User,
} from "../types/auth";

import {
  clearTokens,
  getRefreshToken,
  saveTokens,
} from "../utils/storage";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (data: LoginData) => {
    const tokens = await loginApi(data);

    saveTokens(tokens);

    const profile = await getProfile();

    setUser(profile);
  };

  const logout = async () => {
    const refresh = getRefreshToken();

    try {
      if (refresh) {
        await logoutApi(refresh);
      }
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}