import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import Pagination from "react-bootstrap/Pagination";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/common/confirmationModal";

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

  if (loading) return <div>Loading users...</div>;
  if (error) return (
    <div className="alert alert-danger mb-2">
      {typeof error === "string"
        ? error
        : error.message
          ? <>
              {error.message}
              {Array.isArray(error.details) && (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {error.details.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              )}
            </>
          : JSON.stringify(error)}
    </div>
  );

  // Pagination logic
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const paginatedUsers = users.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  return (
    <>
      <div className="table-scroll-hint">← Scroll to see actions →</div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user._id || user.id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <div className="table-actions">
                    <Link 
                      to={`/admin/users/${user._id}`} 
                      className="btn btn-secondary"
                    >
                      View
                    </Link>
                    <Link 
                      to={`/admin/users/${user._id}/edit`} 
                      className="btn btn-warning"
                    >
                      Edit
                    </Link>
                    {user.role === "user" && (
                      <button
                        className="btn btn-danger"
                        onClick={() => { setUserToDelete(user); setShowDeleteModal(true); }}
                        disabled={deletingId === user._id}
                      >
                        {deletingId === user._id ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={page === i + 1}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
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