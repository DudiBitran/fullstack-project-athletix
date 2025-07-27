import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import { Link } from "react-router-dom";
import "../../style/adminDash/adminExercises.css";

const EXERCISES_PER_PAGE = 10;

function AllExercises() {
  const { getAllExercises } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllExercises();
        setExercises(res.data || []);
      } catch (err) {
        setError(err.response?.data || "Failed to load exercises");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [getAllExercises]);

  // Filter exercises based on search term and filters
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = searchTerm === "" || 
      exercise.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || exercise.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || exercise.difficulty === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter, difficultyFilter]);

  // Get unique categories and difficulties for filter options
  const categories = [...new Set(exercises.map(ex => ex.category).filter(Boolean))];
  const difficulties = [...new Set(exercises.map(ex => ex.difficulty).filter(Boolean))];

  if (loading) return <div className="admin-exercises-loading-message">Loading exercises...</div>;
  if (error) return (
    <div className="admin-exercises-error-message">
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
  const totalPages = Math.ceil(filteredExercises.length / EXERCISES_PER_PAGE);
  const paginatedExercises = filteredExercises.slice((page - 1) * EXERCISES_PER_PAGE, page * EXERCISES_PER_PAGE);

  const getDifficultyBadge = (difficulty) => {
    const difficultyClass = `admin-exercises-difficulty-badge admin-exercises-difficulty-${difficulty?.toLowerCase()}`;
    return <span className={difficultyClass}>{difficulty}</span>;
  };

  const getCategoryBadge = (category) => {
    const categoryClass = `admin-exercises-category-badge admin-exercises-category-${category?.toLowerCase().replace(/\s+/g, '-')}`;
    return <span className={categoryClass}>{category}</span>;
  };

  return (
    <div className="admin-exercises-wrapper">
      <div className="admin-exercises-header">
        <h1>All Exercises</h1>
        <p>Manage and view all exercises in the database</p>
      </div>

      {/* Search and Filter Section */}
      <div className="admin-exercises-controls">
        <div className="admin-exercises-search-filter-container">
          <div className="admin-exercises-search-box">
            <input
              type="text"
              placeholder="Search by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-exercises-search-input"
            />
            <span className="admin-exercises-search-icon">🔍</span>
          </div>
          
          <div className="admin-exercises-filter-box">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="admin-exercises-filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="admin-exercises-filter-box">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="admin-exercises-filter-select"
            >
              <option value="all">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="admin-exercises-results-info">
          Showing {filteredExercises.length} of {exercises.length} exercises
        </div>
      </div>

      <div className="admin-exercises-table-container">
        <table className="admin-exercises-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Description</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExercises.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin-exercises-no-results">
                  {searchTerm || categoryFilter !== "all" || difficultyFilter !== "all"
                    ? "No exercises found matching your criteria" 
                    : "No exercises available"}
                </td>
              </tr>
            ) : (
              paginatedExercises.map(exercise => (
                <tr key={exercise._id || exercise.id}>
                  <td className="admin-exercises-name-cell">
                    <strong>{exercise.name}</strong>
                  </td>
                  <td>{getCategoryBadge(exercise.category)}</td>
                  <td>{getDifficultyBadge(exercise.difficulty)}</td>
                  <td className="admin-exercises-description-cell">
                    {exercise.description ? 
                      (exercise.description.length > 100 
                        ? `${exercise.description.substring(0, 100)}...` 
                        : exercise.description)
                      : "No description"
                    }
                  </td>
                  <td>{exercise.createdBy?.firstName} {exercise.createdBy?.lastName}</td>
                  <td className="admin-exercises-actions-cell">
                    <div className="admin-exercises-table-actions">
                      <Link 
                        to={`/admin/exercises/${exercise._id}`} 
                        className="admin-exercises-action-btn admin-exercises-view-btn"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/admin/exercises/${exercise._id}/edit`} 
                        className="admin-exercises-action-btn admin-exercises-edit-btn"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="admin-exercises-pagination-container">
          <div className="admin-exercises-pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`admin-exercises-pagination-btn ${page === i + 1 ? 'active' : ''}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AllExercises; 