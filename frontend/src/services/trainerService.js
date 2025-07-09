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

const trainerService = {
  createProgram,
  getMyProgramsById,
};

export default trainerService;
