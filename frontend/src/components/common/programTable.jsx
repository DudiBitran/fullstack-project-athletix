function ProgramTable({ programs, onEditClick, onDeleteClick }) {
  return (
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
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => onEditClick(program)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDeleteClick(program._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProgramTable;
