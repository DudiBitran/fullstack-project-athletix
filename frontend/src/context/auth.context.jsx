import { createContext, useContext, useEffect, useState } from "react";
import userService from "../services/userService";

const AuthContext = createContext();
AuthContext.displayName = "Auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(userService.getJwt());
  const [profileImage, setProfileImage] = useState(undefined);

  useEffect(() => {
    if (!userToken) {
      return;
    }
    const getUser = async () => {
      try {
        const response = await userService.getMe();
        setUser(response.data);
        setProfileImage(response.data?.image);
        return;
      } catch (err) {
        setUser(null);
        throw new Error(err);
      }
    };
    getUser();
  }, [userToken]);

  const refreshUser = () => {
    setUserToken(userService.getJwt());
    return;
  };

  const createUser = async (credentials) => {
    try {
      const response = await userService.createUser(credentials);
      return response;
    } catch (err) {
      throw err;
    }
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
    setUser(null);
    setUserToken(null);
    refreshUser();
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, createUser, user, profileImage }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
