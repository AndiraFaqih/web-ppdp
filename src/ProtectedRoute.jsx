import { Outlet } from "react-router-dom";

// Login temporarily disabled: allow all routes without authentication.
// Restore original logic in production if needed.
const ProtectedRoute = ({ allowedRoles }) => {
  return <Outlet />;
};

export default ProtectedRoute;
