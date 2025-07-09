function ProgramTable({ programs }) {
  return (
    <table className="table table-hover table-bordered">
      <thead className="table-dark">
        <tr>
          <th>Title</th>
          <th>Duration (weeks)</th>
          <th>Difficulty</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {programs.map((program) => (
          <tr key={program._id}>
            <td>{program.title}</td>
            <td>{program.durationWeeks}</td>
            <td>{program.difficulty}</td>
            <td>{program.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProgramTable;
