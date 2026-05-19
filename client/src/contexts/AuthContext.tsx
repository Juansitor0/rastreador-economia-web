import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthContextData {
  user: User | null;
  signup: (
    name: string,
    email: string,
    password: string
  ) => boolean;
  login: (
    email: string,
    password: string
  ) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("current-user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function signup(
    name: string,
    email: string,
    password: string
  ) {
    const users: User[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const userAlreadyExists = users.find(
      (u) => u.email === email
    );

    if (userAlreadyExists) {
      return false;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };

    users.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    localStorage.setItem(
      "current-user",
      JSON.stringify(newUser)
    );

    setUser(newUser);

    return true;
  }

  function login(
    email: string,
    password: string
  ) {
    const users: User[] = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const foundUser = users.find(
      (u) =>
        u.email === email &&
        u.password === password
    );

    if (!foundUser) {
      return false;
    }

    localStorage.setItem(
      "current-user",
      JSON.stringify(foundUser)
    );

    setUser(foundUser);

    return true;
  }

  function logout() {
    localStorage.removeItem("current-user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}