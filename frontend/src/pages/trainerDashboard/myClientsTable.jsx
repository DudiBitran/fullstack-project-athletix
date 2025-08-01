import { getUserImageUrl } from "../../utils/imageUtils";

function MyClientsTableBody({ clients, onUnassign, onViewAnalytics, onViewProgram }) {
  if (!clients || clients.length === 0) {
    return (
      <tr>
        <td colSpan="7">No clients assigned.</td>
      </tr>
    );
  }
  const baseUrl = "http://localhost:3000";
  return (
    <>
      {clients.map((client) => (
        <tr key={client._id}>
          <td>
            <img
              src={getUserImageUrl(client.image, baseUrl)}
              alt={`${client.firstName} ${client.lastName}`}
              style={{ width: "33px", height: "33px", borderRadius: "50%" }}
            />
          </td>
          <td>
            {client.firstName} {client.lastName}
          </td>
          <td>{client.email}</td>
          <td>{client.age || "N/A"}</td>
          <td>{client.gender || "N/A"}</td>
          <td>
            {(client.stats?.weight === null || client.stats?.weight === undefined || client.stats?.weight === "") 
              ? "Not provided" 
              : `${client.stats.weight} KG`} | {(client.stats?.height === null || client.stats?.height === undefined || client.stats?.height === "") 
              ? "Not provided" 
              : `${client.stats.height} CM`}
          </td>
          <td>
            <button
              className="btn btn-info btn-sm me-2"
              onClick={() => onViewAnalytics(client._id)}
            >
              View Analytics
            </button>
            <button
              className="btn btn-primary btn-sm me-2"
              onClick={() => onViewProgram(client.programs)}
              disabled={!(client.programs && client.programs.length > 0)}
              title={client.programs && client.programs.length > 0 ? '' : 'No assigned program'}
            >
              View Program
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onUnassign(client._id)}
            >
              Unassign
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}

export default MyClientsTableBody;
