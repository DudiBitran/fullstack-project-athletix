import { useState, useEffect } from "react";
import ExerciseCardList from "../../components/common/exerciseCard";
import ExerciseTableBody from "../../components/common/exerciseTableBody";
import { FaCubes } from "react-icons/fa";
import { MdList } from "react-icons/md";
import { useAuth } from "../../context/auth.context";
import "../../style/trainerDash/myExercises.css";
import { Navigate } from "react-router";
import { toast } from "react-toastify";

function MyExercises() {
  const [exercises, setExercises] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const { user, getMyExercises, deleteExercise } = useAuth();

  if (user?.role !== "trainer") return <Navigate to="/" />;

  useEffect(() => {
    const getExercises = async () => {
      try {
        const response = await getMyExercises();
        setExercises(response.data);
        return response;
      } catch (err) {
        toast.error(err.response?.data || "Failed to fetch exercises.");
        throw err;
      }
    };
    getExercises();
  }, []);

  // Example delete handler (if you have deleteExercise implemented)
  const handleDelete = async (exerciseId) => {
    try {
      await deleteExercise(exerciseId);
      setExercises((prev) => prev.filter((ex) => ex._id !== exerciseId));
      toast.success("Exercise deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data || "Failed to delete exercise.");
    }
  };

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
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                <ExerciseTableBody exercises={exercises} />
                {/* Example usage:
                {exercises.map((ex) => (
                  <tr key={ex._id}>
                    ...
                    <td>
                      <button onClick={() => handleDelete(ex._id)}>Delete</button>
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default MyExercises;
