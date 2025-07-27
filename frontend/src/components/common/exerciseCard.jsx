import { Link } from "react-router-dom";
import { useState } from "react";
import ConfirmationModal from "./confirmationModal";

function ExerciseCardList(props) {
  const baseUrl = "http://localhost:3000";
  const [showAttachment, setShowAttachment] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [removeId, setRemoveId] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  function getAttachmentUrl(url) {
    return baseUrl + "/" + url.replace(/^\/+/, "");
  }

  function handleRemove(id) {
    setRemoveId(id);
    setShowRemoveModal(true);
  }

  function confirmRemove() {
    if (props.onRemove) {
      props.onRemove(removeId);
    }
    setShowRemoveModal(false);
    setRemoveId(null);
  }

  return (
    <>
      <div className="exercise-card-grid">
        {props.exercises.map(function(ex) {
          return (
            <div className="exercise-card" key={ex._id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="exercise-name">{ex.name}</div>
              <div className="exercise-info"><span>Category: {ex.category || 'Not specified'}</span></div>
              <div className="exercise-info"><span>Difficulty: {ex.difficulty || 'Not specified'}</span></div>
              <div className="exercise-info"><span>Sets: {ex.sets}</span></div>
              <div className="exercise-info"><span>Reps: {ex.reps}</span></div>
              <div className="exercise-info">
                <span>Rest: {ex.restSeconds}s</span>
                <span>Created: {new Date(ex.createdAt).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
              </div>
              {ex.notes && <div className="exercise-notes">"{ex.notes}"</div>}
              {ex.attachment && (
                <div className="exercise-attachment">
                  📎{" "}
                  {ex.attachment.url && (
                    <button
                      type="button"
                      style={{ color: '#ffe600', cursor: 'pointer', textDecoration: 'underline', background: 'none', border: 'none', padding: 0 }}
                      onClick={function() {
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
              <div style={{ flex: 1 }} />
              <div className="exercise-card-actions">
                <Link to={"/trainer/edit-exercise/" + ex._id} className="btn btn-sm btn-warning" style={{ color: '#232323', fontWeight: 'bold' }} title="Edit Exercise">Edit</Link>
                <Link to={"/trainer/view-exercise/" + ex._id} className="btn btn-sm btn-info" style={{ color: '#fff', fontWeight: 'bold' }} title="View Exercise">View</Link>
                <button className="btn btn-sm btn-danger" style={{ fontWeight: 'bold' }} title="Remove Exercise" onClick={function() { handleRemove(ex._id); }}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>
      {showAttachment && (
        <div className="attachment-modal-overlay" onClick={function() { setShowAttachment(false); }}>
          <div className="attachment-modal" style={{ maxWidth: 400, width: '90%', margin: '5% auto', background: '#222', borderRadius: 8, padding: 16, position: 'relative' }} onClick={function(e) { e.stopPropagation(); }}>
            <button className="close-modal-btn" style={{ position: 'absolute', top: 8, right: 12, fontSize: 24, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={function() { setShowAttachment(false); }}>&times;</button>
            {attachmentUrl && (attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
              <img src={attachmentUrl} alt="Attachment" style={{ maxWidth: '100%', maxHeight: 300, display: 'block', margin: '0 auto', borderRadius: 4 }} />
            ) : (
              <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#ffe600', wordBreak: 'break-all' }}>Open Attachment</a>
            ))}
          </div>
        </div>
      )}
      <ConfirmationModal
        show={showRemoveModal}
        title="Remove Exercise"
        message="Are you sure you want to remove this exercise?"
        onConfirm={confirmRemove}
        onCancel={function() { setShowRemoveModal(false); }}
        icon="fas fa-exclamation-triangle"
      />
    </>
  );
}

export default ExerciseCardList;
