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
import ConfirmationModal from "../../components/common/confirmationModal";
import AvailableClientsTableBody from "../../components/common/availableClientsTableBody";
import AssignProgramModal from "../../components/common/assignProgramModal";
import { toast } from "react-toastify";

function MyPrograms() {
  const [programs, setPrograms] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedClientIdToAssign, setSelectedClientIdToAssign] =
    useState(null);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [availableClients, setAvailableClients] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showAssignProgramModal, setShowAssignProgramModal] = useState(false);
  const [showUnAssignProgramModal, setShowUnAssignProgramModal] =
    useState(false);
  const {
    user,
    getMyProgramsById,
    programDeleteById,
    getMyOwnClients,
    getAllAvailableClients,
    assignClient,
    assignClientToProgram,
    unassignClientToProgram,
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
      toast.success("Program deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data || "Failed to delete program.");
      throw err;
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setProgramToDelete(null);
  };

  const handleAskAssign = (clientId) => {
    setSelectedClientIdToAssign(clientId);
    setShowAssignModal(true);
  };

  const handleConfirmAssign = async () => {
    try {
      await assignClient(selectedClientIdToAssign);
      const response = await getMyOwnClients();
      setAssignedUsers(response.data);
      setAvailableClients((prev) =>
        prev.filter((client) => client._id !== selectedClientIdToAssign)
      );
      toast.success("Client assigned successfully!");
    } catch (err) {
      toast.error(err.response?.data || "Failed to assign client.");
      throw err;
    } finally {
      setShowAssignModal(false);
      setSelectedClientIdToAssign(null);
    }
  };

  const handleCancelAssign = () => {
    setShowAssignModal(false);
    setSelectedClientIdToAssign(null);
  };

  const handleAssignToProgramClick = (programId) => {
    setSelectedProgramId(programId);
    setShowAssignProgramModal(true);
  };

  const handleAssignToProgram = async (programId, clientId) => {
    try {
      await assignClientToProgram(programId, clientId);
      const response = await getMyProgramsById(user._id);
      setPrograms(response.data);
      setAvailableClients((prev) => prev.filter((c) => c._id !== clientId));
      toast.success("Client assigned to program!");
    } catch (err) {
      toast.error(err.response?.data || "Failed to assign client to program.");
      console.error(err);
    } finally {
      setShowAssignProgramModal(false);
    }
  };

  const handleUnAssignProgram = async () => {
    try {
      const programId = selectedProgramId;
      const clientId = selectedClientId;
      await unassignClientToProgram(selectedProgramId, clientId);
      const response = await getMyProgramsById(user._id);
      setPrograms(response.data);
      setAvailableClients((prev) => prev.filter((c) => c._id !== clientId));
      toast.success("Client unassigned from program!");
    } catch (err) {
      toast.error(err.response?.data || "Failed to unassign client from program.");
      throw err;
    } finally {
      setShowUnAssignProgramModal(false);
      setSelectedProgramId(null);
      setSelectedClientId(null);
    }
  };

  const handleUnAssignClick = (programId, clientId) => {
    setSelectedProgramId(programId);
    setSelectedClientId(clientId);
    setShowUnAssignProgramModal(true);
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
              View clients details ➔
            </button>
          </Link>
        </section>

        {/* Programs section */}
        <section className="myProgram-content" style={{ flex: 1 }}>
          {programs.length === 0 ? (
            <p>No programs found.</p>
          ) : viewMode === "grid" ? (
            <ProgramCard
              programs={programs}
              onDeleteClick={handleDeleteClick}
              onAssignClick={handleAssignToProgramClick}
              onUnAssignClick={handleUnAssignClick}
            />
          ) : (
            <ProgramTable
              programs={programs}
              onDeleteClick={handleDeleteClick}
              onAssignClick={handleAssignToProgramClick}
              onUnAssignClick={handleUnAssignClick}
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
                onAssign={handleAskAssign}
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
      {/* assign confirmation modal */}
      <ConfirmationModal
        show={showAssignModal}
        title="Assign Client"
        message="Are you sure you want to assign this client to your clients list?"
        onCancel={handleCancelAssign}
        onConfirm={handleConfirmAssign}
        icon="bi bi-check-circle"
      />
      <ConfirmationModal
        show={showUnAssignProgramModal}
        title="UnAssign Client"
        message="Are you sure you want to Un-assign this client from your Program?"
        onCancel={() => setShowUnAssignProgramModal(false)}
        onConfirm={handleUnAssignProgram}
        icon="bi bi-check-circle"
      />
      <AssignProgramModal
        show={showAssignProgramModal}
        onClose={() => setShowAssignProgramModal(false)}
        onAssign={handleAssignToProgram}
        programId={selectedProgramId}
      />
    </main>
  );
}

export default MyPrograms;
