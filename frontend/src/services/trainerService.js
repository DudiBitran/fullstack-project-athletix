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

const trainerService = {
  createProgram,
  getMyProgramsById,
  programDeleteById,
  getMyClients,
  getAvailableClients,
  assignClientToTrainer,
};

export default trainerService;
