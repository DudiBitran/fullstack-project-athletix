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
  const { user, getMyExercises } = useAuth();

  if (user?.role !== "trainer") return <Navigate to="/" />;

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

  return (
    <main className="myExercises-container">
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
          <ExerciseCardList exercises={exercises} />
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
                <ExerciseTableBody exercises={exercises} />
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default MyExercises;
