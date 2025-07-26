import { FaLink } from "react-icons/fa";
import { Link } from "react-router-dom";
function ProgramTable({
  programs,
  onEditClick,
  onDeleteClick,
  onAssignClick,
  onUnAssignClick,
}) {
  return (
    <section className="table-responsive container">
      <table className="table table-dark table-hover table-striped">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Duration (weeks)</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Description</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr key={program._id}>
              <td>{program.title}</td>
              <td>{program.durationWeeks}</td>
              <td>{program.difficulty}</td>
              <td>{program.description}</td>
              <td className="d-flex justify-content-center gap-2 flex-wrap">
                <button
                  className="btn btn-sm btn-outline-warning flex-fill me-2"
                  onClick={() => onEditClick(program)}
                >
                  ✏️ Edit
                </button>
                {!program.assignedTo ? (
                  <button
                    onClick={() => onAssignClick(program._id)}
                    className="btn btn-sm btn-outline-success flex-fill me-2"
                  >
                    <FaLink /> Assign
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      onUnAssignClick(program._id, program.assignedTo)
                    }
                    className="btn btn-sm btn-outline-danger flex-fill me-2"
                  >
                    <FaLink /> UnAssign
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-danger flex-fill me-2"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ProgramTable;
