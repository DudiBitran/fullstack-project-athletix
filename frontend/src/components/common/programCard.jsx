import { FaLink, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
function ProgramCard({
  programs,
  onDeleteClick,
  onEditClick,
  onAssignClick,
  onUnAssignClick,
}) {
  return (
    <div className="container">
      <div className="row g-4">
        {programs.map((program) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={program._id}>
            <div className="card h-100 border-warning bg-light d-flex flex-column justify-content-between">
              <div>
                <div className="card-body">
                  <h5 className="card-title">{program.title}</h5>
                  <p className="card-text">{program.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    Duration: {program.durationWeeks} weeks
                  </li>
                  <li className="list-group-item">
                    Difficulty: {program.difficulty}
                  </li>
                </ul>
              </div>

              <div className="card-footer bg-transparent">
                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-sm btn-outline-warning d-flex align-items-center w-100 justify-content-center"
                    onClick={() => onEditClick(program)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <FaEdit style={{ marginRight: 4 }} /> Edit
                  </button>
                  {program.assignedTo && (
                    <button
                      onClick={() => onUnAssignClick(program._id, program.assignedTo)}
                      className="btn btn-sm btn-outline-danger d-flex align-items-center w-100 justify-content-center"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <FaLink style={{ marginRight: 4 }} /> UnAssign
                    </button>
                  )}
                  {!program.assignedTo && (
                    <button
                      onClick={() => onAssignClick(program._id)}
                      className="btn btn-sm btn-outline-success d-flex align-items-center w-100 justify-content-center"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <FaLink style={{ marginRight: 4 }} /> Assign
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteClick(program._id)}
                    className="btn btn-sm btn-outline-danger w-100"
                  >
                    🗑️ Delete
                  </button>
                  <Link
                    to={`/trainer/program/${program._id}`}
                    className="btn btn-sm btn-outline-info w-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgramCard;
