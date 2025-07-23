import { Link } from "react-router-dom";
import { useState } from "react";

function ExerciseCardList({ exercises }) {
  const baseUrl = "http://localhost:3000";
  const [showAttachment, setShowAttachment] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const getAttachmentUrl = (url) => `${baseUrl}/${url.replace(/^\/+/, "")}`;

  return (
    <>
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
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {showAttachment && (
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
      )}
    </>
  );
}

export default ExerciseCardList;
