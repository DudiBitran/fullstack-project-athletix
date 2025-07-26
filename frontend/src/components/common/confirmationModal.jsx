function ConfirmationModal({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  icon,
}) {

  return (
    <div
      className={`modal fade ${show ? "show d-block" : "d-none"}`}
      tabIndex="-1"
      role="dialog"
      style={{ 
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: show ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1050
      }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document" style={{ margin: "0 auto", maxHeight: "90vh" }}>
        <div
          className="modal-content d-flex flex-row"
          style={{ minHeight: "200px" }}
        >
          <div
            className="d-flex flex-column align-items-stretch"
            style={{ width: "120px", flexShrink: 0 }}
          >
            <div style={{ height: "6px", backgroundColor: "red" }}></div>
            <div
              className="d-flex justify-content-center align-items-center p-3 flex-grow-1"
              style={{
                backgroundColor: "#f8f9fa",
                borderRight: "1px solid #dee2e6",
              }}
            >
              <i className={icon}></i>
            </div>
          </div>

          <div className="flex-grow-1 d-flex flex-column">
            <div style={{ height: "6px", backgroundColor: "red" }}></div>
            <div className="modal-header">
              <h5 className="modal-title">{title || "Confirm Action"}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#222', fontWeight: 500, fontSize: '1.1rem', margin: 0, padding: '8px 0', wordBreak: 'break-word' }}>
                {message || "Are you sure you want to proceed?"}
              </p>
            </div>
            <div className="modal-footer mt-auto">
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                onClick={onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
