import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/common/confirmationModal";
import "../../style/adminDash/adminUsersTable.css";

const USERS_PER_PAGE = 10;

function AllUsersTable() {
  const { getAllUsers, deleteUserById } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getAllUsers]);

  const handleDelete = async () => {
    if (!userToDelete) return;
    setShowDeleteModal(false);
    setDeletingId(userToDelete._id);
    try {
      await deleteUserById(userToDelete._id);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
    } catch (err) {
      alert(err.response?.data || "Failed to delete user");
    } finally {
      setDeletingId(null);
      setUserToDelete(null);
    }
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, roleFilter]);

  if (loading) return <div className="loading-message">Loading users...</div>;
  if (error) return (
    <div className="error-message">
      {typeof error === "string"
        ? error
        : error.message
          ? <>
              {error.message}
              {Array.isArray(error.details) && (
                <ul>
                  {error.details.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              )}
            </>
          : JSON.stringify(error)}
    </div>
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  return (
    <>
      {/* Search and Filter Section */}
      <div className="table-controls">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-box">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="role-filter-select"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="trainer">Trainer</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
        
        <div className="results-info">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      <div className="admin-users-table-container">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-results">
                  {searchTerm || roleFilter !== "all" 
                    ? "No users found matching your criteria" 
                    : "No users available"}
                </td>
              </tr>
            ) : (
              paginatedUsers.map(user => (
                <tr key={user._id || user.id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="table-actions">
                      <Link 
                        to={`/admin/users/${user._id}`} 
                        className="action-btn view-btn"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/admin/users/${user._id}/edit`} 
                        className="action-btn edit-btn"
                      >
                        Edit
                      </Link>
                      {user.role === "user" && (
                        <button
                          className="action-btn delete-btn"
                          onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                          disabled={deletingId === user._id}
                        >
                          {deletingId === user._id ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <ConfirmationModal
        show={showDeleteModal}
        title="Delete User"
        message={`Are you sure you want to delete this user? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => { setShowDeleteModal(false); setUserToDelete(null); }}
        icon="fas fa-trash-alt text-danger"
      />
    </>
  );
}

export default AllUsersTable; 