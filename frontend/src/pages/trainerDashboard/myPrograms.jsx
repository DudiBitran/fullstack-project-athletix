import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import "../../style/trainerDash/myPrograms.css";
import "../../style/trainerDash/myCustomers.css";
import "../../style/trainerDash/availableClients.css";
import { MdList } from "react-icons/md";
import { FaCubes } from "react-icons/fa";
import ProgramCard from "../../components/common/programCard";
import ProgramTable from "../../components/common/programTable";
import { Navigate, Link } from "react-router";
import ConfirmationModal from "../../components/common/ConfiramtionModal";
import AvailableClientsTableBody from "./availableClientsTableBody";
function MyPrograms() {
  const [programs, setPrograms] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [availableClients, setAvailableClients] = useState([]);
  const {
    user,
    getMyProgramsById,
    programDeleteById,
    getMyOwnClients,
    getAllAvailableClients,
    assignClient,
  } = useAuth();

  if (user?.role !== "trainer") return <Navigate to="/" />;

  useEffect(() => {
    if (!user?._id) return;
    const getMyPrograms = async (trainerId) => {
      try {
        const response = await getMyProgramsById(trainerId);
        setPrograms(response.data);
      } catch (err) {
        throw err;
      }
    };
    getMyPrograms(user._id);
  }, [user]);

  useEffect(() => {
    const getMyClients = async () => {
      try {
        const response = await getMyOwnClients();
        setAssignedUsers(response.data);
        return response;
      } catch (err) {
        throw err;
      }
    };
    getMyClients();
  }, [user]);

  useEffect(() => {
    const getAvailableClients = async () => {
      try {
        const response = await getAllAvailableClients();
        setAvailableClients(response.data);
        return response;
      } catch (err) {
        throw err;
      }
    };
    getAvailableClients();
  }, []);

  const handleDeleteClick = (programId) => {
    setProgramToDelete(programId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await programDeleteById(programToDelete);
      setPrograms((prev) =>
        prev.filter((program) => program._id !== programToDelete)
      );
      setShowModal(false);
      setProgramToDelete(null);
    } catch (err) {
      throw err;
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setProgramToDelete(null);
  };

  const handleAssignClient = async (clientId) => {
    try {
      await assignClient(clientId);
      setAvailableClients((prev) =>
        prev.filter((client) => client._id !== clientId)
      );

      const response = await getMyOwnClients();
      setAssignedUsers(response.data);
    } catch (err) {
      throw err;
    }
  };

  return (
    <main className="myPrograms-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Programs</h2>
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-outline-dark ${
              viewMode === "grid" ? "active" : ""
            }`}
            onClick={() => setViewMode("grid")}
          >
            <FaCubes />
          </button>
          <button
            type="button"
            className={`btn btn-outline-dark ${
              viewMode === "list" ? "active" : ""
            }`}
            onClick={() => setViewMode("list")}
          >
            <MdList />
          </button>
        </div>
      </div>

      <div className="programs-layout">
        <section className="sidebar-users">
          <h3>My Clients: {assignedUsers.length}</h3>
          <ul>
            {assignedUsers.length === 0 ? (
              <li>No users assigned</li>
            ) : (
              assignedUsers.map((user) => (
                <li key={user._id}>
                  {user.firstName} {user.lastName}
                </li>
              ))
            )}
          </ul>
          <Link to="/trainer/my-customers">
            <button
              style={{ fontSize: "1.1rem", fontWeight: "600" }}
              className="btn btn-warning"
            >
              Go to my clients ➔
            </button>
          </Link>
        </section>

        {/* Programs section */}
        <section style={{ flex: 1 }}>
          {programs.length === 0 ? (
            <p>No programs found.</p>
          ) : viewMode === "grid" ? (
            <ProgramCard
              programs={programs}
              onDeleteClick={handleDeleteClick}
            />
          ) : (
            <ProgramTable
              programs={programs}
              onDeleteClick={handleDeleteClick}
            />
          )}
        </section>
      </div>

      {/* Available Clients Section (Below) */}
      <section className="available-users">
        <h3>Available Clients for Assignment: {availableClients.length}</h3>
        {availableClients.length === 0 ? (
          <p>No available clients found.</p>
        ) : (
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              <AvailableClientsTableBody
                clients={availableClients}
                onAssign={handleAssignClient}
              />
            </tbody>
          </table>
        )}
      </section>

      {/* Delete confirmation modal */}
      <ConfirmationModal
        show={showModal}
        title="Delete Program"
        message="Are you sure you want to delete this program?"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        icon="bi bi-exclamation-triangle"
      />
    </main>
  );
}

export default MyPrograms;
