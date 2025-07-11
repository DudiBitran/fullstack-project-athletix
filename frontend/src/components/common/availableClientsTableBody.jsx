function AvailableClientsTableBody({ clients, onAssign }) {
  return (
    <>
      {clients.map((client) => (
        <tr key={client._id}>
          <td>
            {client.firstName} {client.lastName}
          </td>
          <td>{client.email}</td>
          <td>{client.age}</td>
          <td>
            <button
              style={{ fontSize: "1.1rem", fontWeight: "bold" }}
              className="btn btn-warning btn-sm"
              onClick={() => onAssign(client._id)}
            >
              Assign
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}

export default AvailableClientsTableBody;
