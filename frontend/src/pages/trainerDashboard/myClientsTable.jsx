function MyClientsTableBody({ clients, onUnassign }) {
  if (!clients || clients.length === 0) {
    return (
      <tr>
        <td colSpan="6">No clients assigned.</td>
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
              src={
                client.image
                  ? `${baseUrl}/${client.image.replace(/^\/+/, "")}`
                  : `${baseUrl}/public/defaults/trainer-icon.jpg`
              }
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
            {client.stats.weight} KG | {client.stats.height} CM
          </td>
          <td>
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
