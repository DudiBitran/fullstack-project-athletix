import { Link } from "react-router";

function ExerciseCardList({ exercises }) {
  const baseUrl = "http://localhost:3000";
  return (
    <div className="exercise-card-grid">
      {exercises.map((ex) => (
        <div className="exercise-card" key={ex._id}>
          <div className="exercise-name">{ex.name}</div>

          <div className="exercise-info">
            <span>Sets: {ex.sets}</span>
          </div>

          <div className="exercise-info">
            <span>Reps: {ex.reps}</span>
          </div>

          <div className="exercise-info">
            <span>Rest: {ex.restSeconds}s</span>
            <span>
              Created:{" "}
              {new Date(ex.createdAt).toLocaleDateString("he-IL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>

          {ex.notes && <div className="exercise-notes">"{ex.notes}"</div>}

          {ex?.attachment && (
            <div className="exercise-attachment">
              📎{" "}
              {ex.attachment?.url && (
                <Link
                  target="_blank"
                  to={`${baseUrl}/${ex.attachment.url.replace(/^\/+/, "")}`}
                >
                  View Attachment
                </Link>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ExerciseCardList;
