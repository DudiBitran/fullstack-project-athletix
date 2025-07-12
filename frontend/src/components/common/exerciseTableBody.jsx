import { Link } from "react-router";

function ExerciseTableBody({ exercises }) {
  const baseUrl = "http://localhost:3000";
  return (
    <>
      {exercises.map((ex) => (
        <tr key={ex._id}>
          <td>{ex.name}</td>
          <td>{ex.sets}</td>
          <td>{ex.reps}</td>
          <td>{ex.restSeconds}</td>
          <td>{ex.notes || "–"}</td>
          <td>
            {ex.attachment?.url ? (
              <Link
                className="attachment-btn"
                to={`${baseUrl}/${ex.attachment.url.replace(/^\/+/, "")}`}
              >
                View Attachment
              </Link>
            ) : (
              "No file"
            )}
          </td>
        </tr>
      ))}
    </>
  );
}

export default ExerciseTableBody;
