import { createContext, useContext, useState } from "react";

const TrainerSearchFilterContext = createContext();

export function TrainerSearchFilterProvider({ children }) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [weeksMin, setWeeksMin] = useState("");
  const [weeksMax, setWeeksMax] = useState("");

  return (
    <TrainerSearchFilterContext.Provider
      value={{ search, setSearch, difficulty, setDifficulty, weeksMin, setWeeksMin, weeksMax, setWeeksMax }}
    >
      {children}
    </TrainerSearchFilterContext.Provider>
  );
}

export function useTrainerSearchFilter() {
  return useContext(TrainerSearchFilterContext);
} 