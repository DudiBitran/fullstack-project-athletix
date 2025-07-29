import { useState, useEffect } from "react";
import ExerciseCardList from "../../components/common/exerciseCard";
import ExerciseTable from "../../components/common/exerciseTable";
import { FaCubes } from "react-icons/fa";
import { MdList } from "react-icons/md";
import { useAuth } from "../../context/auth.context";
import "../../style/trainerDash/myExercises.css";
import { Navigate, useNavigate } from "react-router";
import ConfirmationModal from "../../components/common/confirmationModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyExercises() {
  const [exercises, setExercises] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { user, getMyExercises, deleteExerciseById } = useAuth();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeId, setRemoveId] = useState(null);
  const navigate = useNavigate();

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

  // Filter exercises by name, difficulty, and category
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = !search || (ex.name && ex.name.toLowerCase().includes(search.toLowerCase()));
    
    // Handle difficulty filter with case-insensitive comparison and null/undefined values
    const matchesDifficulty = difficultyFilter === "all" || 
      (ex.difficulty && ex.difficulty.toLowerCase() === difficultyFilter.toLowerCase());
    
    // Handle category filter with case-insensitive comparison and null/undefined values
    const matchesCategory = categoryFilter === "all" || 
      (ex.category && ex.category.toLowerCase() === categoryFilter.toLowerCase());
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

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

  const handleEditClick = (exercise) => {
    navigate(`/trainer/update-exercise/${exercise._id}`);
  };

  return (
    <main className="myExercises-container">
      <h2>My Exercises</h2>
      
      {/* Search and Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          {/* Search by Title */}
          <div className="filter-group">
            <label htmlFor="searchInput">Search by Title:</label>
            <input
              id="searchInput"
              type="text"
              placeholder="Enter exercise title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="difficultyFilter">Difficulty:</label>
            <select
              id="difficultyFilter"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="categoryFilter">Category:</label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
              <option value="balance">Balance</option>
              <option value="sports">Sports</option>
              <option value="yoga">Yoga</option>
              <option value="pilates">Pilates</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        {/* Clear Filters Button */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => {
              setSearch("");
              setDifficultyFilter("all");
              setCategoryFilter("all");
            }}
            style={{
              background: 'var(--primary-color)',
              color: '#000',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Clear All Filters
          </button>
        </div>
      </div>

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
        {filteredExercises.length === 0 ? (
          <div className="no-exercises-message" style={{ textAlign: 'center', margin: '2rem 0' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Create your first exercise!</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/trainer/create-exercise')}
              style={{ fontWeight: 'bold', fontSize: '1rem' }}
            >
              Go to Create Exercise
            </button>
          </div>
        ) : viewMode === "grid" ? (
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
            <ExerciseTable
              exercises={filteredExercises}
              onEditClick={handleEditClick}
              onDeleteClick={handleRemove}
            />
            <ConfirmationModal
              show={showRemoveModal}
              title="Remove Exercise"
              message="Are you sure you want to remove this exercise?"
              onConfirm={confirmRemove}
              onCancel={function() { setShowRemoveModal(false); }}
              icon="fas fa-exclamation-triangle"
            />
            <ToastContainer />
          </>
        )}
      </section>
    </main>
  );
}

export default MyExercises;
