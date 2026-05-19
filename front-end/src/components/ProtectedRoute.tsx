import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;

  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {
  const { user } = useAuth();

  /////////////////////////////////////////////////////
  // NOT LOGGED IN
  /////////////////////////////////////////////////////

  if (!user) {
    return (
      <Navigate to="/login" />
    );
  }

  /////////////////////////////////////////////////////
  // ROLE CHECK
  /////////////////////////////////////////////////////

  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.role
    )
  ) {
    return (
      <Navigate to="/unauthorized" />
    );
  }

  return children;
}