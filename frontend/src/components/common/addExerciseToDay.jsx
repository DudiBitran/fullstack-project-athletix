import { useState } from "react";
import axios from "axios";
import "../../style/trainerDash/addExercise.css";

function AddExercisesPage({ programId, day }) {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const toggleExercise = (id) => {
    setSelectedExercises((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async () => {
    if (selectedExercises.length === 0) {
      setError("Please select at least one exercise.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await axios.post(`/api/programs/${programId}/days/${day}/exercises`, {
        exerciseIds: selectedExercises,
      });
      setLoading(false);
      setSuccessMsg("Exercises added successfully!");
      setSelectedExercises([]);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data || "Failed to add exercises.");
    }
  };

  return (
    <main className="addExercise-container">
      <div className="add-exercises-container">
        <h2 className="add-exercises-title">Add Exercises for {day}</h2>
        <ul className="exercise-list">
          {exercisesData.map(({ _id, name }) => (
            <li key={_id} className="exercise-list-item">
              <input
                type="checkbox"
                id={_id}
                className="exercise-checkbox"
                checked={selectedExercises.includes(_id)}
                onChange={() => toggleExercise(_id)}
              />
              <label htmlFor={_id} className="exercise-label">
                {name}
              </label>
            </li>
          ))}
        </ul>
        <button
          className="add-exercises-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Selected Exercises"}
        </button>
        {error && <p className="message error-message">{error}</p>}
        {successMsg && <p className="message success-message">{successMsg}</p>}
      </div>
    </main>
  );
}

export default AddExercisesPage;
