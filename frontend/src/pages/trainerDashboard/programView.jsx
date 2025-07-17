import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProgramDetails from "../../components/common/programDetails";
import { useAuth } from "../../context/auth.context";
import { Navigate } from "react-router";

function ProgramViewPage() {
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, getProgramById } = useAuth();

  useEffect(() => {
    const getProgramDetails = async () => {
      try {
        setLoading(true);
        const response = await getProgramById(programId);
        setProgram(response.data);
      } catch (err) {
        setError("Failed to load program.");
      } finally {
        setLoading(false);
      }
    };
    getProgramDetails();
  }, [programId]);

  if (loading) return <p>Loading program details...</p>;
  if (error) return <p>{error}</p>;
  return <ProgramDetails program={program} setProgram={setProgram} />;
}

export default ProgramViewPage;
