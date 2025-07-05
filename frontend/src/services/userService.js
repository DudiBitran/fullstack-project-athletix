import httpService from "./httpService";

const TOKEN_KEY = "token";

const createUser = async (credentials) => {
  const response = await httpService.post("/auth/register", credentials);
  return response;
};

const getJwt = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const refreshToken = () => {
  httpService.setDefaultCommonHeader("x-auth-token", getJwt());
};

refreshToken();

const setToken = (token) => {
  if (token === undefined) {
    localStorage.removeItem(TOKEN_KEY);
    refreshToken();
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
  refreshToken();
};

const login = async (credentials) => {
  const response = await httpService.post("/auth/login", credentials);
  setToken(response.data.token);
  return response;
};

const logout = () => {
  setToken(undefined);
};

const getMe = async () => {
  try {
    const response = await httpService.get("/users/me");
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

const userService = {
  login,
  logout,
  createUser,
  getMe,
  getJwt,
};

export default userService;
