import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            setUser(response.data.data);
          } else {
            localStorage.removeItem("authToken");
          }
        } catch (err) {
          localStorage.removeItem("authToken");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        setError(null);
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          const { token, user } = response.data.data;
          localStorage.setItem("authToken", token);
          setUser(user);
          return true;
        } else {
          setError(response.data.error);
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof axios.AxiosError
            ? err.response?.data?.error || err.message
            : "Erro ao registrar";
        setError(errorMessage);
        return false;
      }
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        });

        if (response.data.success) {
          const { token, user } = response.data.data;
          localStorage.setItem("authToken", token);
          setUser(user);
          return true;
        } else {
          setError(response.data.error);
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof axios.AxiosError
            ? err.response?.data?.error || err.message
            : "Erro ao fazer login";
        setError(errorMessage);
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
