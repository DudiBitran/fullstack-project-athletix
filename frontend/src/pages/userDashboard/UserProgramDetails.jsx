import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import "../../style/userDashboard/myProgram.css";
import "./userProgramDetails.css";

function UserProgramDetails({ program }) {
  const { getUserById, getProgressAnalytics, getAllTimeProgressAnalytics, getWeeklyActivityAnalytics, getWorkoutStatuses, markWorkoutStatus } = useAuth();
  const [trainerName, setTrainerName] = useState("");
  const [trainerLoading, setTrainerLoading] = useState(false);
  const [trainerError, setTrainerError] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [allTimeProgress, setAllTimeProgress] = useState(null);
  const [allTimeLoading, setAllTimeLoading] = useState(true);
  const [weekly, setWeekly] = useState(null);
  const [weeklyLoading, setWeeklyLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [showAttachment, setShowAttachment] = useState(false);

  // Get today's date in YYYY-MM-DD
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const todayDayName = today.toLocaleDateString(undefined, { weekday: 'long' });

  // Fetch analytics helper
  const fetchAnalytics = async () => {
    setProgressLoading(true);
    setAllTimeLoading(true);
    setWeeklyLoading(true);
    try {
      const prog = await getProgressAnalytics();
      setProgress(prog.data);
    } catch {
      setProgress(null);
    } finally {
      setProgressLoading(false);
    }
    try {
      const allTime = await getAllTimeProgressAnalytics();
      setAllTimeProgress(allTime.data);
    } catch {
      setAllTimeProgress(null);
    } finally {
      setAllTimeLoading(false);
    }
    try {
      const week = await getWeeklyActivityAnalytics();
      setWeekly(week.data);
    } catch {
      setWeekly(null);
    } finally {
      setWeeklyLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line
  }, [program._id]);

  useEffect(() => {
    if (program.trainer) {
      setTrainerLoading(true);
      setTrainerError(null);
      getUserById(program.trainer)
        .then(res => setTrainerName(res.data.firstName + " " + res.data.lastName))
        .catch(() => setTrainerError("Failed to load trainer name."))
        .finally(() => setTrainerLoading(false));
    }
  }, [program.trainer]);

  useEffect(() => {
    const fetchStatusAndProgress = async () => {
      setLoadingStatus(true);
      setProgressLoading(true);
      // setError(null); // Suppress error
      try {
        // Get all workout statuses for this user
        const res = await getWorkoutStatuses();
        const status = res.data.statuses.find(
          (s) => s.date === todayStr
        );
        setTodayStatus(status ? status.completed : false);
      } catch (err) {
        // Suppress all errors
        setTodayStatus(false);
      } finally {
        setLoadingStatus(false);
      }
      try {
        const prog = await getProgressAnalytics();
        setProgress(prog.data);
      } catch (err) {
        setProgress(null);
      } finally {
        setProgressLoading(false);
      }
    };
    fetchStatusAndProgress();
  }, [program._id, todayStr]);

  const handleCheckboxChange = async (e) => {
    setLoadingStatus(true);
    // setError(null); // Suppress error
    try {
      await markWorkoutStatus({
        programId: program._id,
        date: todayStr,
        completed: e.target.checked,
      });
      setTodayStatus(e.target.checked);
      await fetchAnalytics();
    } catch (err) {
      // Suppress all errors
    } finally {
      setLoadingStatus(false);
    }
  };

  // Helper: 7 days of the week
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Helper: get exercises for a day
  const getExercisesForDay = (day) => {
    return program.days?.find((d) => d.day === day)?.exercises || [];
  };

  // Helper to get full attachment URL
  const getAttachmentUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3000/${url.replace(/^\/+/, '')}`;
  };

  return (
    <main className="user-program-details-wrapper">
      {/* Assigned Trainer Name Section */}
      {program.trainer && (
        <div className="assigned-trainer-section">
          <strong>Assigned Trainer:</strong>
          {trainerLoading && <span> Loading...</span>}
          {trainerError && <span style={{color:'red'}}> {trainerError}</span>}
          {trainerName && <span className="trainer-name"> {trainerName}</span>}
        </div>
      )}
      <div className="user-program-details-container">
        <h1 className="program-title">{program.title}</h1>
        <p className="program-description">
          {program.description || "No description."}
        </p>
        <div className="program-meta">
          <div>
            <strong>Duration:</strong> {program.durationWeeks} week
            {program.durationWeeks > 1 ? "s" : ""}
          </div>
          <div>
            <strong>Difficulty:</strong> {program.difficulty || "N/A"}
          </div>
        </div>

        {/* Analytics Section */}
        <section className="dashboard-analytics-section">
          <h3>My Analytics</h3>
          <div className="progress-analytics">
            <h4>This Week</h4>
            {progressLoading ? (
              <p>Loading progress...</p>
            ) : progress ? (
              <div>
                <div>Completed Days: {progress.completedDays} / {progress.totalDays}</div>
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
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
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

        <div className="workout-status-today">
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Today is: {todayDayName}</div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              className={`workout-btn${todayStatus === true ? ' active' : ''}`}
              disabled={loadingStatus}
              onClick={async () => {
                setLoadingStatus(true);
                setError(null);
                try {
                  await markWorkoutStatus({
                    programId: program._id,
                    date: todayStr,
                    completed: true,
                  });
                  setTodayStatus(true);
                  await fetchAnalytics();
                } catch (err) {
                  console.log(err);
                  
                  setError("Failed to update workout status.");
                } finally {
                  setLoadingStatus(false);
                }
              }}
            >
              I completed
            </button>
            <button
              className={`workout-btn${todayStatus === false ? ' active' : ''}`}
              disabled={loadingStatus}
              onClick={async () => {
                setLoadingStatus(true);
                setError(null);
                try {
                  await markWorkoutStatus({
                    programId: program._id,
                    date: todayStr,
                    completed: false,
                  });
                  setTodayStatus(false);
                  await fetchAnalytics();
                } catch (err) {
                  setError("Failed to update workout status.");
                } finally {
                  setLoadingStatus(false);
                }
              }}
            >
              I skipped
            </button>
            {loadingStatus && <span style={{ marginLeft: 10 }}>Updating...</span>}
          </div>
        </div>

        <section className="program-days">
          <h2>Workout Days</h2>
          <ul className="days-list">
            {weekDays.map((day) => (
              <li key={day} className="day-item">
                <h3 className="day-name">{day}</h3>
                {getExercisesForDay(day).length > 0 ? (
                  <ul className="exercises-list">
                    {getExercisesForDay(day).map((ex, idx) => (
                      <li key={day + '-' + (ex?._id || idx)} className="exercise-item">
                        <div className="exercise-name">{ex.name}</div>
                        <div className="exercise-details">
                          Sets: {ex.sets}, Reps: {ex.reps}, Rest: {ex.restSeconds}s
                        </div>
                        {ex.notes && <div className="exercise-notes">Notes: {ex.notes}</div>}
                        {ex.attachment && ex.attachment.url && (
                          <span
                            className="exercise-attachment-link"
                            onClick={() => {
                              setAttachmentUrl(getAttachmentUrl(ex.attachment.url));
                              setShowAttachment(true);
                            }}
                            style={{ color: '#ffe600', cursor: 'pointer', marginLeft: 8, textDecoration: 'underline' }}
                            title="View Attachment"
                          >
                            📎 Attachment
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{marginLeft:'1rem',color:'#aaa'}}>No exercises for this day.</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
      {showAttachment && (
        <div className="attachment-modal-overlay" onClick={() => setShowAttachment(false)}>
          <div className="attachment-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowAttachment(false)}>&times;</button>
            {attachmentUrl && (attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
              <img src={attachmentUrl} alt="Attachment" style={{ maxWidth: '100%', maxHeight: 350, display: 'block', margin: '0 auto' }} />
            ) : (
              <a href={attachmentUrl} target="_blank" rel="noopener noreferrer">Open Attachment</a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default UserProgramDetails; 