import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import "../../style/trainerDash/myPrograms.css";
import "../../style/trainerDash/myCustomers.css";
import "../../style/trainerDash/availableClients.css";
import { MdList } from "react-icons/md";
import { FaCubes } from "react-icons/fa";
import ProgramCard from "../../components/common/programCard";
import ProgramTable from "../../components/common/programTable";
import { Navigate } from "react-router";
import ConfirmationModal from "../../components/common/ConfiramtionModal";

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

      {/* Main Layout: Sidebar + Programs */}
      <div className="programs-layout">
        {/* Sidebar with assigned clients */}
        <section className="sidebar-users">
          <h3>My Clients: {assignedUsers.length}</h3>
          <ul>
            {assignedUsers.length === 0 ? (
              <li>No users assigned</li>
            ) : (
              assignedUsers.map((user) => <li key={user._id}>{user.name}</li>)
            )}
          </ul>
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
        <ul>
          {availableClients.length === 0 ? (
            <li>No available clients found.</li>
          ) : (
            availableClients.map((client) => (
              <li key={client._id}>{client.firstName}</li>
            ))
          )}
        </ul>
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
