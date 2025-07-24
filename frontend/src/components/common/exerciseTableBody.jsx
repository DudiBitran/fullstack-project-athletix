import { useState } from "react";
import { Link } from "react-router-dom";

function ExerciseTableBody(props) {
  const baseUrl = "http://localhost:3000";
  const [showAttachment, setShowAttachment] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");

  function getAttachmentUrl(url) {
    return baseUrl + "/" + url.replace(/^\/+/, "");
  }

  return (
    <>
      {props.exercises.map(function(ex) {
        return (
          <tr key={ex._id}>
            <td>{ex.name}</td>
            <td>{ex.sets}</td>
            <td>{ex.reps}</td>
            <td>{ex.restSeconds}</td>
            <td>{ex.notes || "–"}</td>
            <td>
              {ex.attachment && ex.attachment.url ? (
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
              ) : (
                "No file"
              )}
            </td>
            <td>
              <Link to={"/trainer/edit-exercise/" + ex._id} className="btn btn-sm btn-warning me-2" style={{ color: '#232323', fontWeight: 'bold' }} title="Edit Exercise">Edit</Link>
              <Link to={"/trainer/view-exercise/" + ex._id} className="btn btn-sm btn-info me-2" style={{ color: '#fff', fontWeight: 'bold' }} title="View Exercise">View</Link>
              <button className="btn btn-sm btn-danger" style={{ fontWeight: 'bold' }} title="Remove Exercise" onClick={function() { props.onRemove(ex._id); }}>Remove</button>
            </td>
          </tr>
        );
      })}
      {showAttachment && (
        <tr>
          <td colSpan={7} style={{ padding: 0 }}>
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
          </td>
        </tr>
      )}
    </>
  );
}

export default ExerciseTableBody;
