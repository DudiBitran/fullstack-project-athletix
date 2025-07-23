import { useState } from "react";
import { Link } from "react-router";

function ExerciseTableBody({ exercises }) {
  const baseUrl = "http://localhost:3000";
  const [showAttachment, setShowAttachment] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const getAttachmentUrl = (url) => `${baseUrl}/${url.replace(/^\/+/, "")}`;

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
              <button
                type="button"
                style={{ color: '#ffe600', cursor: 'pointer', textDecoration: 'underline', background: 'none', border: 'none', padding: 0 }}
                onClick={() => {
                  setAttachmentUrl(getAttachmentUrl(ex.attachment.url));
                  setShowAttachment(true);
                }}
                title="View Attachment"
              >
                View Attachment
              </button>
            ) : (
              "No file"
            )}
          </td>
        </tr>
      ))}
      {showAttachment && (
        <tr>
          <td colSpan={6} style={{ padding: 0 }}>
            <div className="attachment-modal-overlay" onClick={() => setShowAttachment(false)}>
              <div className="attachment-modal" style={{ maxWidth: 400, width: '90%', margin: '5% auto', background: '#222', borderRadius: 8, padding: 16, position: 'relative' }} onClick={e => e.stopPropagation()}>
                <button className="close-modal-btn" style={{ position: 'absolute', top: 8, right: 12, fontSize: 24, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setShowAttachment(false)}>&times;</button>
                {attachmentUrl && (attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                  <img src={attachmentUrl} alt="Attachment" style={{ maxWidth: '100%', maxHeight: 300, display: 'block', margin: '0 auto', borderRadius: 4 }} />
                ) : (
                  <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#ffe600', wordBreak: 'break-all' }}>Open Attachment</a>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default ExerciseTableBody;
