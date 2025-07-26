function AvailableClientsTableBody({ clients, onAssign }) {
  return (
    <>
      {clients.map((client, index) => (
        <tr key={client._id}>
          <th scope="row">{index + 1}</th>
          <td>
            {client.firstName} {client.lastName}
          </td>
          <td>{client.email}</td>
          <td>{client.age}</td>
          <td>
            <button
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
