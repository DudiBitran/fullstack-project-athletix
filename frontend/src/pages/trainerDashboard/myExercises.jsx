import { useState, useEffect } from "react";
import ExerciseCardList from "../../components/common/exerciseCard";
import ExerciseTableBody from "../../components/common/exerciseTableBody";
import { FaCubes } from "react-icons/fa";
import { MdList } from "react-icons/md";
import { useAuth } from "../../context/auth.context";
import "../../style/trainerDash/myExercises.css";
import { Navigate } from "react-router";
import ConfirmationModal from "../../components/common/confirmationModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyExercises() {
  const [exercises, setExercises] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const { user, getMyExercises, deleteExerciseById } = useAuth();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  // Remove the redundant role check since route is protected
  // if (user?.role !== "trainer") return <Navigate to="/" />;

  useEffect(() => {
    const getExercises = async () => {
      try {
        const response = await getMyExercises();
        setExercises(response.data);
        return response;
      } catch (err) {
        throw err;
      }
    };
    getExercises();
  }, []);

  // Filter exercises by name
  const filteredExercises = exercises.filter(ex => !search || (ex.name && ex.name.toLowerCase().includes(search.toLowerCase())));

  function handleRemove(id) {
    setRemoveId(id);
    setShowRemoveModal(true);
  }

  async function confirmRemove() {
    try {
      await deleteExerciseById(removeId);
      setExercises(function(prev) {
        return prev.filter(function(ex) { return ex._id !== removeId; });
      });
      toast.success("Exercise deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete exercise.");
    }
    setShowRemoveModal(false);
    setRemoveId(null);
  }

  return (
    <main className="myExercises-container">
      {/* Mobile/Tablet search input */}
      <div className="d-block d-lg-none mb-4 d-flex justify-content-center">
        <input
          type="text"
          className="form-control"
          placeholder="Search exercises..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
      </div>
      <h2>My Exercises</h2>
      <div className="d-flex justify-content-between align-items-center mb-4 container">
        <div className="btn-group" role="group">
          <button
            className={`btn btn-outline-light ${
              viewMode === "grid" ? "active" : ""
            }`}
            onClick={() => setViewMode("grid")}
          >
            <FaCubes />
          </button>
          <button
            className={`btn btn-outline-light ${
              viewMode === "list" ? "active" : ""
            }`}
            onClick={() => setViewMode("list")}
          >
            <MdList />
          </button>
        </div>
      </div>

      <section className="w-100 px-3 px-lg-0 container-lg">
        {viewMode === "grid" ? (
          <ExerciseCardList exercises={filteredExercises} onRemove={async function(id) {
            try {
              await deleteExerciseById(id);
              setExercises(function(prev) {
                return prev.filter(function(ex) { return ex._id !== id; });
              });
              toast.success("Exercise deleted successfully!");
            } catch (err) {
              toast.error("Failed to delete exercise.");
            }
          }} />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-dark table-hover table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Sets</th>
                    <th>Reps</th>
                    <th>Rest</th>
                    <th>Notes</th>
                    <th>Attachment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <ExerciseTableBody
                    exercises={filteredExercises}
                    onRemove={handleRemove}
                  />
                </tbody>
              </table>
            </div>
            <ConfirmationModal
              show={showRemoveModal}
              title="Remove Exercise"
              message="Are you sure you want to remove this exercise?"
              onConfirm={confirmRemove}
              onCancel={function() { setShowRemoveModal(false); }}
              icon="fas fa-exclamation-triangle"
            />
            <toast.Container />
          </>
        )}
      </section>
    </main>
  );
}

export default MyExercises;
