import { useAuth } from "../../context/auth.context";
import MyClientsTable from "../../components/common/myClientsTable";
import { useEffect, useState } from "react";
import "../../style/trainerDash/myClients.css";
import { Navigate, useNavigate } from "react-router";
import ConfirmationModal from "../../components/common/confirmationModal";
import { toast } from "react-toastify";
import trainerService from "../../services/trainerService";
function MyClients() {
  const [myClients, setMyClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const { user, getMyOwnClients, unAssignClient } = useAuth();
  const [serverError, setServerError] = useState(null);
  const [analyticsModal, setAnalyticsModal] = useState({ show: false, client: null, analytics: null, loading: false, error: null });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyClients = async () => {
      try {
        const response = await getMyOwnClients();
        setMyClients(response.data);
        return;
      } catch (err) {
        throw err;
      }
    };
    getMyClients();
  }, []);

  const handleAskUnassign = (clientId) => {
    setSelectedClientId(clientId);
    setShowModal(true);
  };

  const handleConfirmUnassign = async () => {
    try {
      await unAssignClient(selectedClientId);
      setMyClients((prev) =>
        prev.filter((client) => client._id !== selectedClientId)
      );
      toast.success("Client unassigned successfully!");
    } catch (err) {
      setServerError(err.response.data);
      toast.error(err.response?.data || "Failed to unassign client.");
      throw err;
    } finally {
      setShowModal(false);
      setSelectedClientId(null);
    }
  };

  const handleCancelUnassign = () => {
    setShowModal(false);
    setSelectedClientId(null);
  };

  const handleViewAnalytics = (clientId) => {
    navigate(`/trainer/client-analytics/${clientId}`);
  };

  const handleViewProgram = (programs) => {
    if (programs && programs.length > 0) {
      navigate(`/trainer/program/${programs[0]}`);
    } else {
      toast.info("This client has no assigned program.");
    }
  };

  const closeAnalyticsModal = () => setAnalyticsModal({ show: false, client: null, analytics: null, loading: false, error: null });

  // Filter clients by full name or email
  const filteredClients = myClients.filter(client => {
    if (!search) return true;
    const fullName = `${client.firstName || ''} ${client.lastName || ''}`.toLowerCase();
    const email = (client.email || '').toLowerCase();
    const searchLower = search.toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="myClients-container ">
      {/* Filters */}
      <div className="d-block d-lg-none mb-4 d-flex justify-content-center">
        <input
          type="text"
          className="form-control"
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
      </div>
      <section className="my-clients-section container">
        <h2>My Clients ({filteredClients.length})</h2>
        {serverError && (
          <div className="alert alert-danger" role="alert">
            {serverError}
          </div>
        )}
        <MyClientsTable
          clients={currentClients}
          onUnassign={handleAskUnassign}
          onViewAnalytics={handleViewAnalytics}
          onViewProgram={handleViewProgram}
        />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav aria-label="My clients pagination">
              <ul className="pagination pagination-dark">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Page Info */}
        {filteredClients.length > 0 && (
          <div className="text-center mt-2">
            <small className="text-muted">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredClients.length)} of {filteredClients.length} clients
            </small>
          </div>
        )}
      </section>
      <ConfirmationModal
        show={showModal}
        title="Unassign Client"
        message="Are you sure you want to unassign this client from you?"
        onCancel={handleCancelUnassign}
        onConfirm={handleConfirmUnassign}
        icon="bi bi-exclamation-triangle"
      />
      {analyticsModal.show && (
        <div className="attachment-modal-overlay" onClick={closeAnalyticsModal}>
          <div className="attachment-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeAnalyticsModal}>&times;</button>
            <h4>Client Analytics</h4>
            {analyticsModal.loading && <p>Loading...</p>}
            {analyticsModal.error && <p style={{ color: 'red' }}>{analyticsModal.error}</p>}
            {analyticsModal.analytics && (
              <div>
                <div>Completed Days: {analyticsModal.analytics.completedDays} / 7</div>
                <div>Progress: {analyticsModal.analytics.percentage}%</div>
                <div style={{ background: '#444', borderRadius: 8, height: 16, width: 200, margin: '8px 0' }}>
                  <div style={{ background: '#ffe600', height: '100%', width: `${analyticsModal.analytics.percentage}%`, borderRadius: 8 }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default MyClients;
