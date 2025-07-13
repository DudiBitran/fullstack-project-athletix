import { FaLink } from "react-icons/fa";
import { Link } from "react-router";
function ProgramTable({
  programs,
  onEditClick,
  onDeleteClick,
  onAssignClick,
  onUnAssignClick,
}) {
  return (
    <div className="program-table-wrapper">
      <table className="table table-hover table-bordered">
        <thead className="table-dark">
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
              <td>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => onEditClick(program)}
                  >
                    ✏️ Edit
                  </button>
                  {!program.assignedTo ? (
                    <button
                      onClick={() => onAssignClick(program._id)}
                      className="btn btn-sm btn-outline-success"
                    >
                      <FaLink /> Assign
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        onUnAssignClick(program._id, program.assignedTo)
                      }
                      className="btn btn-sm btn-outline-danger"
                    >
                      <FaLink /> UnAssign
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDeleteClick(program._id)}
                  >
                    🗑️ Delete
                  </button>
                  <Link
                    to={`/trainer/program/${program._id}`}
                    className="btn btn-sm btn-outline-info"
                  >
                    View Details
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProgramTable;
