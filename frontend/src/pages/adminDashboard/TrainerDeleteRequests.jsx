import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import "../../style/adminDash/trainerDeleteRequests.css";

function TrainerDeleteRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateSort, setDateSort] = useState("newest");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminService.getTrainerDeleteRequests();
        setRequests(res.data || []);
      } catch (err) {
        setError("Failed to load delete requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: newStatus } : req
      ));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filtered = requests.filter(req => {
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesSearch =
      req.trainerName?.toLowerCase().includes(search.toLowerCase()) ||
      req.trainerEmail?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && (!search || matchesSearch);
  });

  // Sort the filtered results by date
  const sortedAndFiltered = [...filtered].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    
    if (dateSort === "newest") {
      return dateB - dateA; // Newest first
    } else {
      return dateA - dateB; // Oldest first
    }
  });

  const getStatusBadge = (status) => {
    const statusClass = `status-badge status-${status.toLowerCase()}`;
    return <span className={statusClass}>{status}</span>;
  };

  // Use filtered and sorted data
  const displayData = sortedAndFiltered;

  if (loading) return <div className="loading-message">Loading delete requests...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="trainer-delete-requests-section">
      <h2>Trainer Delete Requests</h2>
      
      {/* Filters */}
      <div className="filter-container">
        <div className="filter-group">
          <label className="filter-label">Status Filter</label>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Sort By Date</label>
          <select 
            value={dateSort} 
            onChange={e => setDateSort(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Search</label>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>
      
      <div className="trainer-delete-table-container">
        <table className="trainer-delete-table">
          <thead>
            <tr>
              <th>Trainer Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Requested At</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayData.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-results">
                  No requests found
                </td>
              </tr>
            ) : (
              displayData.map(req => (
                <tr key={req._id}>
                  <td>{req.trainerName || "-"}</td>
                  <td>{req.trainerEmail || "-"}</td>
                  <td>{getStatusBadge(req.status)}</td>
                  <td>{req.createdAt ? new Date(req.createdAt).toLocaleString() : "-"}</td>
                  <td>{req.reason || "-"}</td>
                  <td className="actions-cell">
                    {req.status === "pending" && (
                      <div className="table-actions">
                        <button
                          className="action-btn approve-btn"
                          onClick={() => handleStatusUpdate(req._id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="action-btn reject-btn"
                          onClick={() => handleStatusUpdate(req._id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {req.status !== "pending" && (
                      <span className="no-actions">No actions available</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrainerDeleteRequests; 