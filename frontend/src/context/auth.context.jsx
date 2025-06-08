import { createContext, useContext, useEffect, useState } from "react";
import userService from "../services/userService";

const AuthContext = createContext();
AuthContext.displayName = "Auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [userToken, setUserToken] = useState(undefined);

  /*   const loadUser = async () => {
    try {
      const response = await userService.getMe();
      setUser(response.data);
    } catch (err) {
      setUser(null);
      console.error("Failed to fetch user:", err.message);
    }
  };

  useEffect(() => {
    loadUser();
  }, []); */

  const refreshUser = () => {
    setUserToken(userService.getJwt());
    console.log(user);
    return;
  };

  const login = async (credentials) => {
    try {
      const response = await userService.login(credentials);
      refreshUser();
      return response;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    userService.logout();
    refreshUser();
  };

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
