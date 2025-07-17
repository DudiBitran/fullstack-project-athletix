import { useState, useEffect } from "react";
import "../../style/trainerDash/programDetails.css";
import { useAuth } from "../../context/auth.context";
import AssignProgramModal from "./assignProgramModal";
import ConfirmationModal from "../common/confirmationModal";
import { Navigate } from "react-router";
function ProgramDetails({ program, setProgram }) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [availableClients, setAvailableClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const {
    getAllAvailableClients,
    assignClientToProgram,
    unassignClientToProgram,
    getProgramById,
    getClientById,
    user,
  } = useAuth();
  useEffect(() => {
    if (showAssignModal) {
      const getClients = async () => {
        try {
          const res = await getAllAvailableClients();
          const unassignedClients = res.data.filter(
            (client) => !client.assignedTo
          );
          setAvailableClients(unassignedClients);
        } catch (err) {
          throw err;
        }
      };
      getClients();
    }
  }, [showAssignModal]);

  useEffect(() => {
    if (!program || !program.assignedTo) return;
    const getClientDetails = async () => {
      const response = await getClientById(program.assignedTo);
      setSelectedClientId(response.data);
      console.log(response.data);
    };
    getClientDetails();
  }, [program]);

  const handleAssignProgram = async (programId, clientId) => {
    try {
      await assignClientToProgram(programId, clientId);
      const response = await getProgramById(programId);
      setProgram(response.data);
      setShowAssignModal(false);
      setSelectedClientId("");
    } catch (err) {
      throw err;
    }
  };

  const handleUnAssignProgram = async () => {
    try {
      const programId = program._id;
      const clientId = program.assignedTo;
      await unassignClientToProgram(programId, clientId);
      const response = await getProgramById(programId);
      setProgram(response.data);
      setShowConfirmationModal(false);
    } catch (err) {
      throw err;
    }
  };

  if (!program) {
    return <p>Loading program details...</p>;
  }

  if (!user) return <Navigate to="/" />;

  if (user?.role !== "trainer" || program?.trainer !== user?._id)
    return <Navigate to="/trainer/my-programs" />;

  return (
    <main className="programDetails-wrapper">
      <div className="program-details-container">
        <h1 className="program-title">{program.title}</h1>
        <p className="program-description">
          {program.description || "No description."}
        </p>

        <div className="program-meta">
          <div>
            <strong>Duration:</strong> {program.durationWeeks} week
            {program.durationWeeks > 1 ? "s" : ""}
          </div>
          <div>
            <strong>Difficulty:</strong> {program.difficulty || "N/A"}
          </div>
          <div>
            <strong>Assigned To:</strong>{" "}
            {program.assignedTo
              ? `${selectedClientId?.firstName} ${selectedClientId?.lastName}`
              : "Not assigned"}
          </div>
        </div>

        <section className="program-days">
          <h2>Workout Days</h2>
          {program.days?.length > 0 ? (
            <ul className="days-list">
              {program.days.map(({ day, exercises }) => (
                <li key={day} className="day-item">
                  <h3 className="day-name">{day}</h3>
                  {exercises?.length > 0 ? (
                    <ul className="exercises-list">
                      {exercises.map((ex) => (
                        <li key={ex._id} className="exercise-item">
                          <div className="exercise-name">{ex.name}</div>
                          <div className="exercise-details">
                            Sets: {ex.sets}, Reps: {ex.reps}, Rest:{" "}
                            {ex.restSeconds}s
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No exercises for this day.</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No workout days defined.</p>
          )}
        </section>

        {/* Footer with Assign button */}
        <footer className="program-footer">
          <button
            className="btn btn-success"
            onClick={() => setShowAssignModal(true)}
            disabled={!!program.assignedTo}
          >
            Assign Program to Client
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setShowConfirmationModal(true)}
            disabled={!program.assignedTo}
          >
            UnAssign Program to Client
          </button>
          <AssignProgramModal
            show={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            onAssign={handleAssignProgram}
            programId={program._id}
          />
          <ConfirmationModal
            show={showConfirmationModal}
            onCancel={() => setShowConfirmationModal(false)}
            onConfirm={handleUnAssignProgram}
          />
        </footer>
      </div>
    </main>
  );
}

export default ProgramDetails;
