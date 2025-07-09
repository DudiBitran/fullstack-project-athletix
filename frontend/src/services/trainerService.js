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

const trainerService = {
  createProgram,
  getMyProgramsById,
  programDeleteById,
};

export default trainerService;
