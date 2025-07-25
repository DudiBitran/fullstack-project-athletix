import React, { useEffect, useState } from "react";
import "../../style/adminDash/adminPanel.css";
import "../../style/adminDash/trainerDeleteRequests.css";
import AllUsersTable from "./AllUsersTable";
import { useAuth } from "../../context/auth.context";
import ConfirmationModal from "../../components/common/confirmationModal";
import CreateTrainer from "./CreateTrainer";

function AdminPanel() {
  const { getTrainerDeleteRequests, handleTrainerDeleteRequest } = useAuth();
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowLoading, setRowLoading] = useState({});
  const [acceptModal, setAcceptModal] = useState({ show: false, trainerId: null, trainerName: "" });
  const [rejectModal, setRejectModal] = useState({ show: false, trainerId: null, trainerName: "" });
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" for newest first, "asc" for oldest first
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTrainerDeleteRequests();
      setDeleteRequests(res.data);
    } catch (err) {
      setError(err.response?.data || "Failed to load delete requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [getTrainerDeleteRequests]);

  const handleAccept = (trainerId, trainerName) => {
    setAcceptModal({ show: true, trainerId, trainerName });
  };
  const handleReject = (trainerId, trainerName) => {
    setRejectModal({ show: true, trainerId, trainerName });
  };

  const handleConfirmAccept = async () => {
    const { trainerId } = acceptModal;
    setRowLoading(prev => ({ ...prev, [trainerId]: true }));
    setAcceptModal({ show: false, trainerId: null, trainerName: "" });
    try {
      await handleTrainerDeleteRequest(trainerId, "approve");
      await fetchRequests();
    } catch (err) {
      alert(err.response?.data || err.message || "Action failed");
    } finally {
      setRowLoading(prev => ({ ...prev, [trainerId]: false }));
    }
  };
  const handleConfirmReject = async () => {
    const { trainerId } = rejectModal;
    setRowLoading(prev => ({ ...prev, [trainerId]: true }));
    setRejectModal({ show: false, trainerId: null, trainerName: "" });
    try {
      await handleTrainerDeleteRequest(trainerId, "reject");
      await fetchRequests();
    } catch (err) {
      alert(err.response?.data || err.message || "Action failed");
    } finally {
      setRowLoading(prev => ({ ...prev, [trainerId]: false }));
    }
  };
  const handleCancelAccept = () => setAcceptModal({ show: false, trainerId: null, trainerName: "" });
  const handleCancelReject = () => setRejectModal({ show: false, trainerId: null, trainerName: "" });

  // Sort delete requests based on sortOrder and createdAt
  const filteredAndSortedDeleteRequests = [...deleteRequests]
    .filter(request => {
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      const matchesSearch = 
        request.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        request.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        request.status?.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && (!search || matchesSearch);
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="admin-panel-wrapper">
      <h1>Admin Panel</h1>
      <p>Welcome, Admin! This is your dashboard.</p>
      <section className="admin-panel-section">
        <CreateTrainer />
      </section>
      <section className="admin-panel-section">
        <h2>All Users</h2>
        <AllUsersTable />
      </section>
      <section className="admin-panel-section trainer-delete-requests-section">
        <h2>Trainer Delete Requests</h2>
        
        {/* Filter Controls */}
        <div className="filter-container">
          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Sort by Date:</label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Search:</label>
            <input
              type="text"
              placeholder="Search by name or status..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="loading-message">Loading delete requests...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <table className="trainer-delete-table">
            <thead>
              <tr>
                <th>Trainer Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedDeleteRequests.map(deleteRequest => (
                <tr key={deleteRequest._id}>
                  <td>{deleteRequest.firstName} {deleteRequest.lastName}</td>
                  <td>{deleteRequest.status}</td>
                  <td>
                    <button
                      className="action-btn btn-success"
                      disabled={rowLoading[deleteRequest.trainerId] || deleteRequest.status !== "pending"}
                      onClick={() => handleAccept(deleteRequest.trainerId, `${deleteRequest.firstName} ${deleteRequest.lastName}`)}
                    >
                      {rowLoading[deleteRequest.trainerId] && deleteRequest.status === "pending" ? "Processing..." : "Accept"}
                    </button>
                    <button
                      className="action-btn btn-danger"
                      disabled={rowLoading[deleteRequest.trainerId] || deleteRequest.status !== "pending"}
                      onClick={() => handleReject(deleteRequest.trainerId, `${deleteRequest.firstName} ${deleteRequest.lastName}`)}
                    >
                      {rowLoading[deleteRequest.trainerId] && deleteRequest.status === "pending" ? "Processing..." : "Reject"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <ConfirmationModal
        show={acceptModal.show}
        title="Approve Delete Request"
        message={`Are you sure you want to approve this delete request? This will permanently delete the trainer account for ${acceptModal.trainerName}.`}
        onConfirm={handleConfirmAccept}
        onCancel={handleCancelAccept}
        icon="fas fa-check-circle text-success"
      />
      <ConfirmationModal
        show={rejectModal.show}
        title="Reject Delete Request"
        message={`Are you sure you want to reject this delete request for ${rejectModal.trainerName}?`}
        onConfirm={handleConfirmReject}
        onCancel={handleCancelReject}
        icon="fas fa-times-circle text-danger"
      />
    </div>
  );
}

export default AdminPanel; 