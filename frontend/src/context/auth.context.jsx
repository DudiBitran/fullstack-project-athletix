import { createContext, useContext, useEffect, useState } from "react";
import userService from "../services/userService";

const AuthContext = createContext();
AuthContext.displayName = "Auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(userService.getJwt());

    
  useEffect(()=>{
    if(!userToken){
      return;
    }
    const getUser = async () =>{
      try{
        const response = await userService.getMe();
        setUser(response.data);
        return;
      }catch(err){
        setUser(null);
        throw new Error(err)
      }
    }
    getUser();
  },[userToken])


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
    setUser(null);
    setUserToken(null);
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
