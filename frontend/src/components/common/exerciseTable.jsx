import { Link } from "react-router-dom";
import "../../style/trainerDash/exerciseTable.css";

function ExerciseTable({
  exercises,
  onEditClick,
  onDeleteClick,
}) {
  return (
    <div className="exercises-table-container">
      <table className="exercises-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Rest</th>
            <th>Notes</th>
            <th>Attachment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise) => (
            <tr key={exercise._id}>
              <td>{exercise.name}</td>
              <td>{exercise.sets}</td>
              <td>{exercise.reps}</td>
              <td>{exercise.restSeconds}s</td>
              <td>{exercise.notes || "No notes"}</td>
              <td>
                {exercise.attachment ? (
                  <a 
                    href={exercise.attachment} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="attachment-link"
                  >
                    View Attachment
                  </a>
                ) : (
                  "No attachment"
                )}
              </td>
              <td className="actions-cell">
                <button
                  className="action-btn edit-btn"
                  onClick={() => onEditClick(exercise)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => onDeleteClick(exercise._id)}
                >
                  🗑️ Delete
                </button>
                <Link
                  to={`/trainer/view-exercise/${exercise._id}`}
                  className="action-btn view-btn"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExerciseTable; 