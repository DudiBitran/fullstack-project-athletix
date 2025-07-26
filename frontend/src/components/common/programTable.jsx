import { FaLink } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../style/trainerDash/programTable.css";

function ProgramTable({
  programs,
  onEditClick,
  onDeleteClick,
  onAssignClick,
  onUnAssignClick,
}) {
  return (
    <div className="programs-table-container">
      <table className="programs-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Duration (weeks)</th>
            <th>Difficulty</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr key={program._id}>
              <td>{program.title}</td>
              <td>{program.durationWeeks}</td>
              <td>{program.difficulty}</td>
              <td>{program.description}</td>
              <td className="actions-cell">
                <button
                  className="action-btn edit-btn"
                  onClick={() => onEditClick(program)}
                >
                  ✏️ Edit
                </button>
                {!program.assignedTo ? (
                  <button
                    onClick={() => onAssignClick(program._id)}
                    className="action-btn assign-btn"
                  >
                    <FaLink /> Assign
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      onUnAssignClick(program._id, program.assignedTo)
                    }
                    className="action-btn unassign-btn"
                  >
                    <FaLink /> UnAssign
                  </button>
                )}
                <button
                  className="action-btn delete-btn"
                  onClick={() => onDeleteClick(program._id)}
                >
                  🗑️ Delete
                </button>
                <Link
                  to={`/trainer/program/${program._id}`}
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

export default ProgramTable;
