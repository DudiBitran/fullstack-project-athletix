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
    throw err; 
  }
};

const updateUser = async (userData) => {
  try {
    const response = await httpService.put("/users/me", userData);
    return response;
  } catch (err) {
    throw err; 
  }
};

const updateUserImage = async (imageFile) => {
  try {
    console.log("Creating FormData with image:", imageFile);
    const formData = new FormData();
    formData.append("image", imageFile);
    
    console.log("Sending image upload request...");
    const response = await httpService.put("/users/me/image", formData);
    console.log("Image upload response:", response);
    return response;
  } catch (err) {
    console.error("Error in updateUserImage:", err);
    throw err; 
  }
};

const removeUserImage = async () => {
  try {
    console.log("Removing user image...");
    const response = await httpService.delete("/users/me/image");
    console.log("Remove image response:", response);
    return response;
  } catch (err) {
    console.error("Error in removeUserImage:", err);
    throw err;
  }
};

const markWorkoutStatus = async ({ programId, date, completed }) => {
  return httpService.patch("/workout-status/", { programId, date, completed });
};

const getWorkoutStatuses = async () => {
  return httpService.get("/workout-status/");
};

const getProgressAnalytics = async () => {
  return httpService.get("/analytics/progress");
};

const getWeeklyActivityAnalytics = async () => {
  return httpService.get("/analytics/weekly-activity");
};

const getAllTimeProgressAnalytics = async () => {
  return httpService.get("/analytics/progress-alltime");
};

const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    const response = await httpService.patch("/users/me/change-password", { currentPassword, newPassword });
    return response;
  } catch (err) {
    throw err;
  }
};

const forgotPassword = async (email) => {
  return httpService.post('/auth/forgot-password', { email });
};

const resetPassword = async ({ token, password }) => {
  return httpService.post('/auth/reset-password', { token, password });
};

const getUserById = async (userId) => {
  try {
    const response = await httpService.get(`/users/${userId}`);
    return response;
  } catch (err) {
    throw err;
  }
};

const userService = {
  login,
  logout,
  createUser,
  getMe,
  updateUser,
  updateUserImage,
  removeUserImage,
  getJwt,
  markWorkoutStatus,
  getWorkoutStatuses,
  getProgressAnalytics,
  getWeeklyActivityAnalytics,
  getAllTimeProgressAnalytics,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserById,
};

export default userService;
