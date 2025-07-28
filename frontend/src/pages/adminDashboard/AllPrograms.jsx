import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import { Link } from "react-router-dom";
import "../../style/adminDash/adminExercises.css";

const PROGRAMS_PER_PAGE = 10;

function AllPrograms() {
  const { getAllPrograms } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllPrograms();
        setPrograms(res.data || []);
      } catch (err) {
        setError(err.response?.data || "Failed to load programs");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  // Filter programs based on search term and filters
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = searchTerm === "" || 
      program.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.difficulty?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || program.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, difficultyFilter]);

  // Get unique difficulties for filter options
  const difficulties = [...new Set(programs.map(p => p.difficulty).filter(Boolean))];

  if (loading) return <div className="admin-exercises-loading-message">Loading programs...</div>;
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
  const totalPages = Math.ceil(filteredPrograms.length / PROGRAMS_PER_PAGE);
  const paginatedPrograms = filteredPrograms.slice((page - 1) * PROGRAMS_PER_PAGE, page * PROGRAMS_PER_PAGE);

  const getCategoryBadge = (category) => {
    const categoryClass = `admin-exercises-category-badge admin-exercises-category-${category?.toLowerCase().replace(/\s+/g, '-')}`;
    return <span className={categoryClass}>{category}</span>;
  };

  return (
    <div className="admin-exercises-wrapper">
      <div className="admin-exercises-header">
        <h1>All Programs</h1>
        <p>Manage and view all programs in the database</p>
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
          Showing {filteredPrograms.length} of {programs.length} programs
        </div>
      </div>

      <div className="admin-exercises-table-container">
        <table className="admin-exercises-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPrograms.length === 0 ? (
              <tr>
                <td colSpan="4" className="admin-exercises-no-results">
                  {searchTerm || difficultyFilter !== "all"
                    ? "No programs found matching your criteria" 
                    : "No programs available"}
                </td>
              </tr>
            ) : (
              paginatedPrograms.map(program => (
                <tr key={program._id || program.id}>
                  <td className="admin-exercises-name-cell">
                    <strong>{program.title}</strong>
                  </td>
                  <td className="admin-exercises-description-cell">
                    {program.description ? 
                      (program.description.length > 100 
                        ? `${program.description.substring(0, 100)}...` 
                        : program.description)
                      : "No description"
                    }
                  </td>
                  <td>{program.trainer?.firstName} {program.trainer?.lastName}</td>
                  <td className="admin-exercises-actions-cell">
                    <div className="admin-exercises-table-actions">
                      <Link 
                        to={`/admin/programs/${program._id}`} 
                        className="admin-exercises-action-btn admin-exercises-view-btn"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/admin/programs/${program._id}/edit`} 
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

export default AllPrograms; 