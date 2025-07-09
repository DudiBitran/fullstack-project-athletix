import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import "../../style/trainerDash/myPrograms.css";
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
  const { user, getMyProgramsById, programDeleteById } = useAuth();

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

      {programs.length === 0 ? (
        <p>No programs found.</p>
      ) : viewMode === "grid" ? (
        <ProgramCard programs={programs} onDeleteClick={handleDeleteClick} />
      ) : (
        <ProgramTable programs={programs} onDeleteClick={handleDeleteClick} />
      )}

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
