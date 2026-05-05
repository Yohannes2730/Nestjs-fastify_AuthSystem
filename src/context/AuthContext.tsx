import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, authApi } from "@/services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  pendingEmail: string | null;
  setPendingEmail: (email: string | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [pendingEmail, setPendingEmailState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    const storedEmail = localStorage.getItem("auth_pending_email");
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }
    if (storedEmail) setPendingEmailState(storedEmail);

    if (storedToken && !storedUser) {
      authApi
        .profile()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("auth_user", JSON.stringify(res.data));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (tok: string, u: User) => {
    localStorage.setItem("auth_token", tok);
    localStorage.setItem("auth_user", JSON.stringify(u));
    setToken(tok);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_pending_email");
    setToken(null);
    setUser(null);
    setPendingEmailState(null);
  };

  const setPendingEmail = (email: string | null) => {
    if (email) localStorage.setItem("auth_pending_email", email);
    else localStorage.removeItem("auth_pending_email");
    setPendingEmailState(email);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, pendingEmail, setPendingEmail, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
