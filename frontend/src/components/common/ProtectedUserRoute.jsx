import { Navigate } from "react-router";
import { useAuth } from "../../context/auth.context";

function ProtectedUserRoute({ children }) {
  const { user } = useAuth();

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the protected content
  return children;
}

export default ProtectedUserRoute; 