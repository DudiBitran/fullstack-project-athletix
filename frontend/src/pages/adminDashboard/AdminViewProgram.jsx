import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../context/auth.context";
import "../../style/trainerDash/createExercise.css";
import { FaDumbbell, FaArrowLeft } from "react-icons/fa";

function AdminViewProgram() {
  const { id } = useParams();
  const { getAllPrograms } = useAuth();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProgram() {
      try {
        setLoading(true);
        const all = await getAllPrograms();
        const found = all.data.find((prog) => prog._id === id);
        if (!found) {
          setError("Program not found");
        } else {
          setProgram(found);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load program");
        setLoading(false);
      }
    }
    fetchProgram();
  }, [id, getAllPrograms]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="serverError">{error}</div>;
  if (!program) return null;

  return (
    <main className="createExercise-container">
      <div className="form-container" style={{ maxWidth: 600 }}>
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h2 className="form-title">
          <FaDumbbell /> {program.title}
        </h2>
        <div className="form-group">
          <label>Description</label>
          <div>{program.description || <span style={{ color: '#aaa' }}>No description</span>}</div>
        </div>
        <div className="form-group">
          <label>Difficulty</label>
          <div>{program.difficulty || <span style={{ color: '#aaa' }}>Not specified</span>}</div>
        </div>
        <div className="form-group">
          <label>Duration (weeks)</label>
          <div>{program.durationWeeks || <span style={{ color: '#aaa' }}>Not specified</span>}</div>
        </div>
        <div className="form-group">
          <label>Created By</label>
          <div>
            {program.trainer ? 
              `${program.trainer.firstName} ${program.trainer.lastName}` : 
              <span style={{ color: '#aaa' }}>Unknown</span>
            }
          </div>
        </div>
        <div className="form-group">
          <label>Created</label>
          <div>{new Date(program.createdAt).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" })}</div>
        </div>
        <div className="form-group">
          <label>Days</label>
          <div>
            {program.days && program.days.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {program.days.map((day, index) => (
                  <li key={index} style={{ 
                    marginBottom: '12px', 
                    padding: '12px', 
                    backgroundColor: '#2a2a2a', 
                    borderRadius: '8px',
                    border: '1px solid #444',
                    color: '#fff'
                  }}>
                    <strong>{day.day}</strong>
                    {day.exercises && day.exercises.length > 0 && (
                      <div style={{ marginTop: '6px', fontSize: '0.9em', color: '#ffe600' }}>
                        {day.exercises.length} exercise(s)
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <span style={{ color: '#aaa', fontStyle: 'italic' }}>No days configured</span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminViewProgram; 