import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../context/auth.context";
import "../../style/trainerDash/createExercise.css";
import { FaDumbbell, FaArrowLeft } from "react-icons/fa";

function ViewExercise() {
  const { id } = useParams();
  const { getMyExercises } = useAuth();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const baseUrl = "http://localhost:3000";

  useEffect(() => {
    async function fetchExercise() {
      try {
        setLoading(true);
        const all = await getMyExercises();
        const found = all.data.find((ex) => ex._id === id);
        if (!found) {
          setError("Exercise not found");
        } else {
          setExercise(found);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load exercise");
        setLoading(false);
      }
    }
    fetchExercise();
  }, [id, getMyExercises]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="serverError">{error}</div>;
  if (!exercise) return null;

  return (
    <main className="createExercise-container">
      <div className="form-container" style={{ maxWidth: 600 }}>
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h2 className="form-title">
          <FaDumbbell /> {exercise.name}
        </h2>
        <div className="form-group">
          <label>Sets</label>
          <div>{exercise.sets}</div>
        </div>
        <div className="form-group">
          <label>Reps</label>
          <div>{exercise.reps}</div>
        </div>
        <div className="form-group">
          <label>Rest (seconds)</label>
          <div>{exercise.restSeconds}</div>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <div>{exercise.notes || <span style={{ color: '#aaa' }}>No notes</span>}</div>
        </div>
        <div className="form-group">
          <label>Created</label>
          <div>{new Date(exercise.createdAt).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" })}</div>
        </div>
        {exercise.attachment && exercise.attachment.url && (
          <div className="form-group">
            <label>Attachment</label>
            {exercise.attachment.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
              <img
                src={baseUrl + "/" + exercise.attachment.url.replace(/^\/+/, "")}
                alt="Attachment"
                style={{ maxWidth: 320, maxHeight: 320, borderRadius: 8, margin: '10px 0' }}
              />
            ) : (
              <a
                href={baseUrl + "/" + exercise.attachment.url.replace(/^\/+/, "")}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffe600', wordBreak: 'break-all' }}
              >
                Open Attachment
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default ViewExercise; 