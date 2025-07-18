import { useAuth } from "../../context/auth.context";
import MyClientsTableBody from "./myClientsTable";
import { useEffect, useState } from "react";
import "../../style/trainerDash/myClients.css";
import { Navigate } from "react-router";
import ConfirmationModal from "../../components/common/confirmationModal";
import { toast } from "react-toastify";
function MyClients() {
  const [myClients, setMyClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const { user, getMyOwnClients, unAssignClient } = useAuth();
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const getMyClients = async () => {
      try {
        const response = await getMyOwnClients();
        setMyClients(response.data);
        return;
      } catch (err) {
        throw err;
      }
    };
    getMyClients();
  }, []);

  const handleAskUnassign = (clientId) => {
    setSelectedClientId(clientId);
    setShowModal(true);
  };

  const handleConfirmUnassign = async () => {
    try {
      await unAssignClient(selectedClientId);
      setMyClients((prev) =>
        prev.filter((client) => client._id !== selectedClientId)
      );
      toast.success("Client unassigned successfully!");
    } catch (err) {
      setServerError(err.response.data);
      toast.error(err.response?.data || "Failed to unassign client.");
      throw err;
    } finally {
      setShowModal(false);
      setSelectedClientId(null);
    }
  };

  const handleCancelUnassign = () => {
    setShowModal(false);
    setSelectedClientId(null);
  };

  if (user?.role !== "trainer") return <Navigate to="/" />;

  return (
    <main className="myClients-container ">
      <section className="table-responsive my-clients-table container">
        <h2>My Clients</h2>
        {serverError && (
          <div className="alert alert-danger" role="alert">
            {serverError}
          </div>
        )}
        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th></th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Stats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <MyClientsTableBody
              clients={myClients}
              onUnassign={handleAskUnassign}
            />
          </tbody>
        </table>
      </section>

      <ConfirmationModal
        show={showModal}
        title="Unassign Client"
        message="Are you sure you want to unassign this client from you?"
        onCancel={handleCancelUnassign}
        onConfirm={handleConfirmUnassign}
        icon="bi bi-exclamation-triangle"
      />
    </main>
  );
}

export default MyClients;
