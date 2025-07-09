import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import "../../style/trainerDash/myPrograms.css";
import { MdList } from "react-icons/md";
import { FaCubes } from "react-icons/fa";
import ProgramCard from "../../components/common/programCard";
import ProgramTable from "../../components/common/programTable";
import { Navigate } from "react-router";

function MyPrograms() {
  const [programs, setPrograms] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const { user, getMyProgramsById } = useAuth();

  if (user.role !== "trainer") return <Navigate to="/" />;

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
        <ProgramCard programs={programs} />
      ) : (
        <ProgramTable programs={programs} />
      )}
    </main>
  );
}

export default MyPrograms;
