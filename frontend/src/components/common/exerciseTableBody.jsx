function ExerciseTableBody({ exercises }) {
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
              <a href={ex.attachment.url} target="_blank" rel="noreferrer">
                View
              </a>
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
