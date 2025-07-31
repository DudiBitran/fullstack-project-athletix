import "../../style/trainerDash/myClientsTable.css";
import { getUserImageUrl } from "../../utils/imageUtils";

function MyClientsTable({
  clients,
  onUnassign,
  onViewAnalytics,
  onViewProgram,
}) {
  const baseUrl = "http://localhost:3000";

  if (!clients || clients.length === 0) {
    return (
      <div className="my-clients-table-container">
        <table className="my-clients-table">
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
            <tr>
              <td colSpan="7">No clients assigned.</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="my-clients-table-container">
      <table className="my-clients-table">
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
          {clients.map((client) => (
            <tr key={client._id}>
              <td>
                <img
                  src={getUserImageUrl(client.image, baseUrl)}
                  alt={`${client.firstName} ${client.lastName}`}
                  className="client-avatar"
                />
              </td>
              <td>
                {client.firstName} {client.lastName}
              </td>
              <td>{client.email}</td>
              <td>{client.age || "N/A"}</td>
              <td>{client.gender || "N/A"}</td>
              <td>
                {client.stats.weight} KG | {client.stats.height} CM
              </td>
              <td className="actions-cell">
                <button
                  className="action-btn analytics-btn"
                  onClick={() => onViewAnalytics(client._id)}
                >
                  📊 Analytics
                </button>
                <button
                  className="action-btn program-btn"
                  onClick={() => onViewProgram(client.programs)}
                  disabled={!(client.programs && client.programs.length > 0)}
                  title={client.programs && client.programs.length > 0 ? '' : 'No assigned program'}
                >
                  📋 Program
                </button>
                <button
                  className="action-btn unassign-btn"
                  onClick={() => onUnassign(client._id)}
                >
                  ❌ Unassign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyClientsTable; 