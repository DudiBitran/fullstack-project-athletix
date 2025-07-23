import { Navigate } from "react-router";
import { useAuth } from "../../context/auth.context";

function ProtectedTrainerRoute({ children }) {
  const { user } = useAuth();

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is not a trainer, redirect to dashboard
  if (user.role !== "trainer") {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is a trainer, render the protected content
  return children;
}

export default ProtectedTrainerRoute; 