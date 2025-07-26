import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import { useTrainerSearchFilter } from "../../context/trainerSearchFilter.context";
import "../../style/trainerDash/myPrograms.css";
import "../../style/trainerDash/myCustomers.css";
import "../../style/trainerDash/availableClients.css";
import { MdList } from "react-icons/md";
import { FaCubes } from "react-icons/fa";
import ProgramCard from "../../components/common/programCard";
import ProgramTable from "../../components/common/programTable";
import { Navigate, Link, useNavigate } from "react-router";
import ConfirmationModal from "../../components/common/confirmationModal";
import AvailableClientsTableBody from "../../components/common/availableClientsTableBody";
import AssignProgramModal from "../../components/common/assignProgramModal";
import { toast } from "react-toastify";

function MyPrograms() {
  const [programs, setPrograms] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedClientIdToAssign, setSelectedClientIdToAssign] = useState(null);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [availableClients, setAvailableClients] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showAssignProgramModal, setShowAssignProgramModal] = useState(false);
  const [showUnAssignProgramModal, setShowUnAssignProgramModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [weeksMin, setWeeksMin] = useState("");
  const [weeksMax, setWeeksMax] = useState("");
  const [availableClientsSearch, setAvailableClientsSearch] = useState("");
  const navigate = useNavigate();
  const { search, setSearch } = useTrainerSearchFilter();
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

  // Remove the redundant role check since route is protected
  // if (user?.role !== "trainer") return <Navigate to="/" />;

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

  const handleEditClick = (program) => {
    navigate(`/trainer/update-program/${program._id}`);
  };

  // Filter programs based on search and filters
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = !search || (program.title && program.title.toLowerCase().includes(search.toLowerCase()));
    const matchesDifficulty = !difficulty || (program.difficulty && program.difficulty.toLowerCase() === difficulty);
    const min = weeksMin ? parseInt(weeksMin, 10) : null;
    const max = weeksMax ? parseInt(weeksMax, 10) : null;
    const weeks = program.durationWeeks;
    const matchesWeeks = (
      (!min || (weeks >= min)) &&
      (!max || (weeks <= max))
    );
    return matchesSearch && matchesDifficulty && matchesWeeks;
  });

  // Filter available clients by search
  const filteredAvailableClients = availableClients.filter(client => {
    if (!availableClientsSearch) return true;
    const fullName = `${client.firstName || ''} ${client.lastName || ''}`.toLowerCase();
    const email = (client.email || '').toLowerCase();
    const searchLower = availableClientsSearch.toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  return (
    <main className="myPrograms-container">
      {/* Mobile/Tablet search input */}
      <div className="d-block d-lg-none mb-4">
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
      </div>
      {/* Filter Button and Filters */}
      <div className="d-flex flex-wrap align-items-center filter-controls-row mt-0 mt-4 mt-lg-0 mb-4" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <button
          className="btn btn-outline-secondary"
          style={{ margin: 0, padding: '6px 12px' }}
          type="button"
          onClick={() => setShowFilters(f => !f)}
        >
          {showFilters ? "Hide Filters" : "Filter"}
        </button>
        {showFilters && (
          <>
            <select
              className="form-select"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              style={{ maxWidth: 140, minWidth: 110, fontSize: '1rem', display: 'inline-block', margin: 0 }}
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <input
              type="number"
              className="form-control"
              placeholder="Min weeks"
              value={weeksMin}
              min={1}
              onChange={e => setWeeksMin(e.target.value)}
              style={{ maxWidth: 110, minWidth: 90, fontSize: '1rem', padding: '', display: 'inline-block' }}
            />
            <span style={{margin: '0 2px', fontSize: '1rem'}}>–</span>
            <input
              type="number"
              className="form-control"
              placeholder="Max weeks"
              value={weeksMax}
              min={1}
              onChange={e => setWeeksMax(e.target.value)}
              style={{ maxWidth: 110, minWidth: 90, fontSize: '1rem', padding: '', display: 'inline-block' }}
            />
            <button
              className="btn btn-outline-danger btn-sm ms-2"
              type="button"
              onClick={() => {
                setDifficulty("");
                setWeeksMin("");
                setWeeksMax("");
              }}
            >
              Clear
            </button>
          </>
        )}
      </div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mt-0">My Programs</h2>
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
          {filteredPrograms.length === 0 ? (
            <p>No programs found.</p>
          ) : viewMode === "grid" ? (
            <ProgramCard
              programs={filteredPrograms}
              onDeleteClick={handleDeleteClick}
              onEditClick={handleEditClick}
              onAssignClick={handleAssignToProgramClick}
              onUnAssignClick={handleUnAssignClick}
            />
          ) : (
            <ProgramTable
              programs={filteredPrograms}
              onDeleteClick={handleDeleteClick}
              onEditClick={handleEditClick}
              onAssignClick={handleAssignToProgramClick}
              onUnAssignClick={handleUnAssignClick}
            />
          )}
        </section>
      </div>

      {/* Available Clients Section (Below) */}
      <section className="available-users">
        <h3>Available Clients for Assignment: {availableClients.length}</h3>
        <div className="d-flex justify-content-center mb-3">
          <div style={{ position: 'relative', maxWidth: 260, width: '100%' }}>
            <input
              type="text"
              className="styled-search-input"
              placeholder="Search available clients..."
              value={availableClientsSearch}
              onChange={e => setAvailableClientsSearch(e.target.value)}
              style={{ maxWidth: 260, width: '100%' }}
            />
            <span className="styled-search-icon">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="7" stroke="#aaa" strokeWidth="2"/><line x1="14.4142" y1="14" x2="18" y2="17.5858" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
          </div>
        </div>
        {availableClients.length === 0 ? (
          <p>No available clients found.</p>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="d-none d-md-block">
              <div className="table-responsive">
                <table className="table table-striped table-dark">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Age</th>
                      <th scope="col">Assign</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AvailableClientsTableBody
                      clients={filteredAvailableClients}
                      onAssign={handleAskAssign}
                    />
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="d-md-none">
              {filteredAvailableClients.map((client, index) => (
                <div key={client._id} className="card mb-3 bg-dark text-light">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-8">
                        <h6 className="card-title mb-1">
                          #{index + 1} - {client.firstName} {client.lastName}
                        </h6>
                        <p className="card-text mb-1">
                          <small style={{ color: '#fff' }}>{client.email}</small>
                        </p>
                        <p className="card-text mb-0">
                          <small>Age: {client.age}</small>
                        </p>
                      </div>
                      <div className="col-4 d-flex align-items-center justify-content-end">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleAskAssign(client._id)}
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
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
