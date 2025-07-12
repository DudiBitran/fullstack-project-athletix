import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../../context/auth.context";

function AssignProgramModal({ show, onClose, onAssign, programId }) {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const { getMyOwnClients } = useAuth();

  useEffect(() => {
    if (!show) return;

    const getMyClients = async () => {
      try {
        const response = await getMyOwnClients();
        const unassigned = response.data.filter(
          (client) => client?.programs.length === 0
        );
        setClients(unassigned);
      } catch (err) {
        throw err;
      }
    };

    getMyClients();
  }, [show]);

  const handleAssign = () => {
    if (!selectedClientId) return;
    onAssign(programId, selectedClientId);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered className="assign-modal">
      <Modal.Header closeButton>
        <Modal.Title>Assign Program to Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {clients.length === 0 ? (
          <p>No available clients without a program.</p>
        ) : (
          <Form.Group controlId="clientSelect">
            <Form.Label>Select a client:</Form.Label>
            <Form.Control
              as="select"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              <option value="">-- Select Client --</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.firstName} {client.lastName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={handleAssign}
          disabled={!selectedClientId}
        >
          Assign
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AssignProgramModal;
