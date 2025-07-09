import { useState } from "react";

const AssignUserModal = ({
  show,
  onCancel,
  onConfirm,
  users = [],
  icon,
  title = "Assign User to Program",
  message = "Select a user to assign:",
}) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!selectedUserId) {
      setError("You must select a user.");
      return;
    }

    setError("");
    onConfirm(selectedUserId);
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : "d-none"}`}
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div
          className="modal-content d-flex flex-row"
          style={{ minHeight: "250px" }}
        >
          {/* Icon section */}
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

          {/* Content section */}
          <div className="flex-grow-1 d-flex flex-column">
            <div style={{ height: "6px", backgroundColor: "red" }}></div>
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setSelectedUserId("");
                  setError("");
                  onCancel();
                }}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <p>{message}</p>
              <select
                className={`form-select ${error ? "is-invalid" : ""}`}
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">-- Select user --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {error && <div className="invalid-feedback">{error}</div>}
            </div>

            <div className="modal-footer mt-auto">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedUserId("");
                  setError("");
                  onCancel();
                }}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignUserModal;
