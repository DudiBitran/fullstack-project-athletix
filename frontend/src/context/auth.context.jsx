import { createContext, useContext, useEffect, useState } from "react";
import userService from "../services/userService";
import trainerService from "../services/trainerService";

const AuthContext = createContext();
AuthContext.displayName = "Auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(userService.getJwt());
  const [profileImage, setProfileImage] = useState(undefined);

  useEffect(() => {
    if (!userToken) {
      setUser(null);
      setProfileImage(undefined);
      return;
    }
    
    const getUser = async () => {
      try {
        const response = await userService.getMe();
        setUser(response.data);
        setProfileImage(response.data?.image);
      } catch (err) {
        setUser(null);
        setProfileImage(undefined);
        setUserToken(null);
      }
    };
    
    getUser();
  }, [userToken]);

  const refreshUser = () => {
    setUserToken(userService.getJwt());
    return;
  };

  const updateUserData = async () => {
    try {
      const response = await userService.getMe();
      setUser(response.data);
      console.log('Auth context - updating profileImage from:', profileImage, 'to:', response.data?.image);
      setProfileImage(response.data?.image);
      return response;
    } catch (err) {
      console.error("Failed to update user data:", err);
      throw err;
    }
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
      setUserToken(userService.getJwt());
      return response;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    setUserToken(null);
    setProfileImage(undefined);
  };

  const createProgram = async (credentials) => {
    try {
      const response = await trainerService.createProgram(credentials);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const getMyProgramsById = async (trainerId) => {
    try {
      const response = await trainerService.getMyProgramsById(trainerId);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const programDeleteById = async (programId) => {
    try {
      const response = await trainerService.programDeleteById(programId);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const updateProgram = async (programId, programData) => {
    try {
      const response = await trainerService.updateProgram(programId, programData);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const getMyOwnClients = async () => {
    try {
      const response = await trainerService.getMyClients();
      return response;
    } catch (err) {
      throw err;
    }
  };

  const getAllAvailableClients = async () => {
    try {
      const response = await trainerService.getAvailableClients();
      return response;
    } catch (err) {
      throw err;
    }
  };

  const assignClient = async (clientId) => {
    try {
      const response = await trainerService.assignClientToTrainer(clientId);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const unAssignClient = async (clientId) => {
    try {
      const response = await trainerService.unAssignClientToTrainer(clientId);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const createExercise = async (credentials) => {
    try {
      const response = await trainerService.createExercise(credentials);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const getMyExercises = async () => {
    try {
      const response = await trainerService.getMyExercises();
      return response;
    } catch (err) {
      throw err;
    }
  };

  const getProgramById = async (programId) => {
    try {
      const response = await trainerService.getProgramById(programId);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const assignClientToProgram = async (programId, userId) => {
    try {
      const response = await trainerService.assignClientToProgram(
        programId,
        userId
      );
      return response;
    } catch (err) {
      throw err;
    }
  };

  //unAssignClientToProgram

  const unassignClientToProgram = async (programId, userId) => {
    try {
      const response = await trainerService.unAssignClientToProgram(
        programId,
        userId
      );
      return response;
    } catch (err) {
      throw err;
    }
  };

  const getClientById = async (clientId) => {
    try {
      const response = await trainerService.getClientById(clientId);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const addExerciseToDay = async (programId, day, exerciseIds) => {

    try {
      const response = await trainerService.addExerciseToDay(programId, day, exerciseIds);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const deleteExerciseFromDay = async (programId, day, exerciseIds) => {
    try {
      const response = await trainerService.deleteExerciseFromDay(programId, day, exerciseIds);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const sendTrainerDeleteRequest = async () => {
    try {
      const response = await trainerService.sendTrainerDeleteRequest();
      return response;
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        createUser,
        user,
        profileImage,
        refreshUser,
        updateUserData,
        createProgram,
        getMyProgramsById,
        programDeleteById,
        updateProgram,
        getMyOwnClients,
        getAllAvailableClients,
        assignClient,
        unAssignClient,
        createExercise,
        getMyExercises,
        getProgramById,
        assignClientToProgram,
        unassignClientToProgram,
        getClientById,
        addExerciseToDay,
        deleteExerciseFromDay,
        sendTrainerDeleteRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
