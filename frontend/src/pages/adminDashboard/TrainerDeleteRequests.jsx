import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import "../../style/adminDash/adminPanel.css";



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

  return (
    <div className="admin-panel-section">
      <h2>Trainer Delete Requests</h2>
      
      {/* Simple filters */}
      <div style={{ 
        backgroundColor: "blue", 
        padding: "20px", 
        marginBottom: "20px",
        border: "5px solid orange"
      }}>
        <p style={{ color: "white", marginBottom: "10px" }}>FILTERS:</p>
        
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          style={{ 
            backgroundColor: "white", 
            color: "black", 
            padding: "10px", 
            marginRight: "10px",
            border: "3px solid green"
          }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        
        <select 
          value={dateSort} 
          onChange={e => setDateSort(e.target.value)}
          style={{ 
            backgroundColor: "white", 
            color: "black", 
            padding: "10px", 
            marginRight: "10px",
            border: "3px solid green"
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        
        <input 
          type="text" 
          placeholder="Search..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          style={{ 
            backgroundColor: "white", 
            color: "black", 
            padding: "10px",
            border: "3px solid green"
          }}
        />
      </div>
      
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="create-trainer-error">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Trainer Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFiltered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center" }}>No requests found</td></tr>
              ) : (
                sortedAndFiltered.map(req => (
                  <tr key={req._id}>
                    <td>{req.trainerName || "-"}</td>
                    <td>{req.trainerEmail || "-"}</td>
                    <td>{req.status}</td>
                    <td>{req.createdAt ? new Date(req.createdAt).toLocaleString() : "-"}</td>
                    <td>{req.reason || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TrainerDeleteRequests; 