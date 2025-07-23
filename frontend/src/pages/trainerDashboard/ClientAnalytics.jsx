import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import trainerService from "../../services/trainerService";
import userService from "../../services/userService";
import "../../style/userDashboard/myProgram.css";

function ClientAnalytics() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [allTimeProgress, setAllTimeProgress] = useState(null);
  const [allTimeLoading, setAllTimeLoading] = useState(true);
  const [weekly, setWeekly] = useState(null);
  const [weeklyLoading, setWeeklyLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchAnalytics = async () => {
      setProgressLoading(true);
      setAllTimeLoading(true);
      setWeeklyLoading(true);
      setError(null);
      try {
        // This week progress for client
        const prog = await trainerService.getUserWeekProgressAnalytics(userId);
        setProgress(prog.data);
      } catch {
        setProgress(null);
        setError("User has no program.");
      } finally {
        setProgressLoading(false);
      }
      try {
        // All time progress for client
        const allTime = await trainerService.getUserAllTimeProgressAnalytics(userId);
        setAllTimeProgress(allTime.data);
      } catch {
        setAllTimeProgress(null);
      } finally {
        setAllTimeLoading(false);
      }
      try {
        // Weekly activity for client
        const week = await trainerService.getUserWeeklyActivityAnalytics(userId);
        setWeekly(week.data);
      } catch {
        setWeekly(null);
      } finally {
        setWeeklyLoading(false);
      }
    };
    fetchAnalytics();
  }, [userId]);

  return (
    <div className="myPrograms-container">
      <section className="dashboard-analytics-section">
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>&larr; Back</button>
        <h2>Client Analytics</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="progress-analytics">
          <h4>This Week</h4>
          {progressLoading ? (
            <p>Loading progress...</p>
          ) : progress ? (
            <div>
              <div>Completed Days: {progress.completedDays} / 7</div>
              <div>Progress: {progress.percentage}%</div>
              <div style={{ background: '#444', borderRadius: 8, height: 16, width: 200, margin: '8px 0' }}>
                <div style={{ background: '#ffe600', height: '100%', width: `${progress.percentage}%`, borderRadius: 8 }}></div>
              </div>
            </div>
          ) : (
            <p>No progress data.</p>
          )}
        </div>
        <div className="progress-analytics">
          <h4>All Time</h4>
          {allTimeLoading ? (
            <p>Loading all-time progress...</p>
          ) : allTimeProgress ? (
            <div>
              <div>Completed Days: {allTimeProgress.completedDays} / {allTimeProgress.totalDays}</div>
              <div>Progress: {allTimeProgress.percentage}%</div>
              <div style={{ background: '#444', borderRadius: 8, height: 16, width: 200, margin: '8px 0' }}>
                <div style={{ background: '#ffe600', height: '100%', width: `${allTimeProgress.percentage}%`, borderRadius: 8 }}></div>
              </div>
            </div>
          ) : (
            <p>No all-time progress data.</p>
          )}
        </div>
        <div className="weekly-analytics">
          <h4>Weekly Activity</h4>
          {weeklyLoading ? (
            <p>Loading weekly activity...</p>
          ) : weekly ? (
            <table className="weekly-table">
              <thead>
                <tr>
                  {weekDaysOrder.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {weekDaysOrder.map((day) => (
                    <td key={day} className={day === todayDayName ? 'current-day' : ''}>{weekly[day] ?? 0}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No weekly data.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ClientAnalytics; 