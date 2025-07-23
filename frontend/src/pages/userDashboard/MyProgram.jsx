import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import UserProgramDetails from "./UserProgramDetails";
import userService from "../../services/userService";
import "../../style/userDashboard/myProgram.css";

function MyProgram() {
  const { user, getProgramById } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [allTimeProgress, setAllTimeProgress] = useState(null);
  const [allTimeLoading, setAllTimeLoading] = useState(true);
  const [weekly, setWeekly] = useState(null);
  const [weeklyLoading, setWeeklyLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!user || !user.programs || user.programs.length === 0) {
        setPrograms([]);
        setLoading(false);
        return;
      }
      try {
        const programDetails = await Promise.all(
          user.programs.map(async (programId) => {
            const res = await getProgramById(programId);
            return res.data;
          })
        );
        setPrograms(programDetails);
      } catch (err) {
        setError("Failed to fetch program(s).");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [user, getProgramById]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setProgressLoading(true);
      setAllTimeLoading(true);
      setWeeklyLoading(true);
      try {
        const prog = await userService.getProgressAnalytics();
        setProgress(prog.data);
      } catch {
        setProgress(null);
      } finally {
        setProgressLoading(false);
      }
      try {
        const allTime = await userService.getAllTimeProgressAnalytics();
        setAllTimeProgress(allTime.data);
      } catch {
        setAllTimeProgress(null);
      } finally {
        setAllTimeLoading(false);
      }
      try {
        const week = await userService.getWeeklyActivityAnalytics();
        setWeekly(week.data);
      } catch {
        setWeekly(null);
      } finally {
        setWeeklyLoading(false);
      }
    };
    fetchAnalytics();
  }, [user]);

  const weekDaysOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayDayName = new Date().toLocaleDateString(undefined, { weekday: 'long' });

  return (
    <div className="myPrograms-container">
      <h2>My Program{programs.length > 1 ? 's' : ''}</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && !error && (!programs || programs.length === 0) && (
        <div className="no-program-message">No program found.</div>
      )}
      {!loading && !error && programs && programs.length > 0 && programs.map((program) => (
        <div key={program._id} className="program-details-wrapper">
          <UserProgramDetails program={program} />
        </div>
      ))}
    </div>
  );
}

export default MyProgram; 