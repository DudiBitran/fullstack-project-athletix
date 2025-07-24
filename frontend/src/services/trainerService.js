import httpService from "./httpService";

const createProgram = async (credentials) => {
  try {
    const response = await httpService.post("/program", credentials);
    return response;
  } catch (err) {
    throw err;
  }
};

// get own programs
const getMyProgramsById = async (trainerId) => {
  try {
    const response = await httpService.get(`/program/${trainerId}`);
    return response;
  } catch (err) {
    throw err;
  }
};

// delete own program by id
const programDeleteById = async (programId) => {
  try {
    const response = await httpService.delete(`/program/${programId}`);
    return response;
  } catch (err) {
    throw err;
  }
};

// update program by id
const updateProgram = async (programId, programData) => {
  try {
    const response = await httpService.put(`/program/${programId}`, programData);
    return response;
  } catch (err) {
    throw err;
  }
};

// get my own clients
const getMyClients = async () => {
  try {
    const response = await httpService.get("/users/trainers/my-clients");
    return response;
  } catch (err) {
    throw err;
  }
};

// get all available clients

const getAvailableClients = async () => {
  try {
    const response = await httpService.get("/users/trainers/available-clients");
    return response;
  } catch (err) {
    throw err;
  }
};

// assign client to trainer
const assignClientToTrainer = async (clientId) => {
  try {
    const response = await httpService.put(
      `/users/trainers/${clientId}/assign-trainer`
    );
    return response;
  } catch (err) {
    throw err;
  }
};

// unassign client from trainer
const unAssignClientToTrainer = async (clientId) => {
  try {
    const response = await httpService.delete(
      `/users/trainers/${clientId}/unassign-trainer`
    );
    return response;
  } catch (err) {
    throw err;
  }
};

// create exercise
const createExercise = async (credentials) => {
  try {
    const response = await httpService.post("/exercise", credentials);
    return response;
  } catch (err) {
    throw err;
  }
};

//get my exercise
const getMyExercises = async () => {
  try {
    const response = await httpService.get("/exercise/my-exercises");
    return response;
  } catch (err) {
    throw err;
  }
};

// get program by id
const getProgramById = async (programId) => {
  try {
    const response = await httpService.get(`/program/details/${programId}`);
    return response;
  } catch (err) {
    throw err;
  }
};

// assign client to program
const assignClientToProgram = async (programId, userId) => {
  try {
    const response = await httpService.patch(
      `/program/${programId}/${userId}/assign-user`
    );
    return response;
  } catch (err) {
    throw err;
  }
};

//unAssign Client To Program
const unAssignClientToProgram = async (programId, userId) => {
  try {
    const response = await httpService.patch(
      `/program/${programId}/${userId}/unassign-user`
    );
    return response;
  } catch (err) {
    throw err;
  }
};

// get client details by id
const getClientById = async (clientId) => {
  try {
    const response = await httpService.get(
      `/users/trainers/client-details/${clientId}`
    );
    return response;
  } catch (err) {
    throw err;
  }
};

// add exercise to day
const addExerciseToDay = async (programId, day, exerciseIds) => {
  try {
    const response = await httpService.post(`/program/${programId}/days/${day}/exercises`, { exerciseIds });
    return response;
  } catch (err) {
    throw err;
  }
};

// delete exercise(s) from a day in a program
const deleteExerciseFromDay = async (programId, day, exerciseIds) => {
  try {
    const response = await httpService.delete(
      `/program/${programId}/days/${day}/exercises`,
      { data: { exerciseIds } }
    );
    return response;
  } catch (err) {
    throw err;
  }
};

// send delete request for trainer account
const sendTrainerDeleteRequest = async () => {
  try {
    const response = await httpService.post("/users/trainers/me/delete-request", {
      role: "trainer"
    });
    return response;
  } catch (err) {
    throw err;
  }
};

const getUserCompletionAnalytics = async (userId) => {
  return httpService.get(`/analytics/completion/${userId}`);
};

const getUserWeekProgressAnalytics = async (userId) => {
  return httpService.get(`/analytics/progress/${userId}`);
};
const getUserAllTimeProgressAnalytics = async (userId) => {
  return httpService.get(`/analytics/progress-alltime/${userId}`);
};
const getUserWeeklyActivityAnalytics = async (userId) => {
  return httpService.get(`/analytics/weekly-activity/${userId}`);
};

// update exercise by id
const updateExercise = async (id, data) => {
  try {
    const response = await httpService.put(`/exercise/${id}`, data);
    return response;
  } catch (err) {
    throw err;
  }
};

// delete exercise by id
const deleteExerciseById = async (exerciseId) => {
  try {
    const response = await httpService.delete(`/exercise/${exerciseId}`);
    return response;
  } catch (err) {
    throw err;
  }
};

const trainerService = {
  createProgram,
  getMyProgramsById,
  programDeleteById,
  updateProgram,
  getMyClients,
  getAvailableClients,
  assignClientToTrainer,
  unAssignClientToTrainer,
  createExercise,
  getMyExercises,
  getProgramById,
  assignClientToProgram,
  unAssignClientToProgram,
  getClientById,
  addExerciseToDay,
  deleteExerciseFromDay,
  sendTrainerDeleteRequest,
  getUserCompletionAnalytics,
  getUserWeekProgressAnalytics,
  getUserAllTimeProgressAnalytics,
  getUserWeeklyActivityAnalytics,
  updateExercise,
  deleteExerciseById,
};

export default trainerService;
