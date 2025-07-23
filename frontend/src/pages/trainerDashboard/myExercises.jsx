import { useState, useEffect } from "react";
import ExerciseCardList from "../../components/common/exerciseCard";
import ExerciseTableBody from "../../components/common/exerciseTableBody";
import { FaCubes } from "react-icons/fa";
import { MdList } from "react-icons/md";
import { useAuth } from "../../context/auth.context";
import "../../style/trainerDash/myExercises.css";
import { Navigate } from "react-router";

function MyExercises() {
  const [exercises, setExercises] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const { user, getMyExercises } = useAuth();

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
          <ExerciseCardList exercises={filteredExercises} />
        ) : (
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
                </tr>
              </thead>
              <tbody>
                <ExerciseTableBody exercises={filteredExercises} />
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default MyExercises;
