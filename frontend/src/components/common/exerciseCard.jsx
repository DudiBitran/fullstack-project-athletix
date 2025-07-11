function ExerciseCardList({ exercises }) {
  return (
    <div className="exercise-card-grid">
      {exercises.map((ex) => (
        <div className="exercise-card" key={ex._id}>
          <h4>{ex.name}</h4>
          <p>
            <strong>Sets:</strong> {ex.sets}
          </p>
          <p>
            <strong>Reps:</strong> {ex.reps}
          </p>
          <p>
            <strong>Rest:</strong> {ex.restSeconds} sec
          </p>
          {ex.notes && (
            <p>
              <strong>Notes:</strong> {ex.notes}
            </p>
          )}
          {ex.attachment?.url && (
            <a
              href={ex.attachment.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Attachment
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

export default ExerciseCardList;
