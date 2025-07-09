function ProgramCard({ programs }) {
  return (
    <div className="container">
      <div className="row g-4">
        {programs.map((program) => (
          <div
            className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
            key={program._id}
          >
            <div className="card h-100 border-warning bg-light">
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgramCard;
