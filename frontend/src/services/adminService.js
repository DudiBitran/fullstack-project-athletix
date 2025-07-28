import httpService from "./httpService";

const getAllUsers = async () => {
  try {
    const response = await httpService.get("/users/admin/get-all-users");
    return response;
  } catch (err) {
    throw err;
  }
};

const getTrainerDeleteRequests = async () => {
  try {
    const response = await httpService.get("/users/admin/trainer-delete-requests");
    return response;
  } catch (err) {
    throw err;
  }
};

const handleTrainerDeleteRequest = async (trainerId, status) => {
  try {
    const response = await httpService.delete(`/users/admin/trainer/${trainerId}`, { data: { status } });
    return response;
  } catch (err) {
    throw err;
  }
};

const deleteUserById = async (userId) => {
  try {
    const response = await httpService.delete(`/users/admin/${userId}`);
    return response;
  } catch (err) {
    throw err;
  }
};

const updateUserById = async (userId, data) => {
  try {
    // Only send allowed fields
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };
    const response = await httpService.put(`/users/admin/${userId}`, payload);
    return response;
  } catch (err) {
    throw err;
  }
};

const createTrainer = async (formData) => {
  try {
    const response = await httpService.post("/users/admin/trainer", formData);
    return response;
  } catch (err) {
    throw err;
  }
};

const getAllExercises = async () => {
  try {
    const response = await httpService.get("/exercise/");
    return response;
  } catch (err) {
    throw err;
  }
};

const updateExercise = async (id, data) => {
  try {
    const response = await httpService.put(`/exercise/${id}`, data);
    return response;
  } catch (err) {
    throw err;
  }
};

// Get all programs (admin)
const getAllPrograms = async () => {
  try {
    const response = await httpService.get('/admin/program');
    return response;
  } catch (err) {
    throw err;
  }
};

// Update program (admin)
const adminUpdateProgram = async (id, data) => {
  try {
    const response = await httpService.put(`/admin/program/${id}`, data);
    return response;
  } catch (err) {
    throw err;
  }
};

// Add more admin-related methods as needed

const adminService = {
  getAllUsers,
  getTrainerDeleteRequests,
  handleTrainerDeleteRequest,
  deleteUserById,
  updateUserById,
  createTrainer,
  getAllExercises,
  updateExercise,
  getAllPrograms,
  adminUpdateProgram,
};

export default adminService; 