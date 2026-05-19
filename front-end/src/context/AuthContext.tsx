import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: number;
  name?: string;
  email: string;
  role: "CUSTOMER" | "ORGANIZER";
}

interface AuthContextType {
  user: User | null;

  token: string | null;

  login: (
    token: string,
    user: User
  ) => void;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  /////////////////////////////////////////////////////
  // LOAD FROM LOCAL STORAGE
  /////////////////////////////////////////////////////

  useEffect(() => {
    const savedToken =
      localStorage.getItem("token");

    const savedUser =
      localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);

      setUser(JSON.parse(savedUser));
    }
  }, []);

  /////////////////////////////////////////////////////
  // LOGIN
  /////////////////////////////////////////////////////

  const login = (
    token: string,
    user: User
  ) => {
    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setToken(token);

    setUser(user);
  };

  /////////////////////////////////////////////////////
  // LOGOUT
  /////////////////////////////////////////////////////

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem("user");

    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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