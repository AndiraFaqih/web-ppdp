import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;

    if (allowedRoles.includes(userRole)) {
      return <Outlet />;
    }

    return userRole === "admin" ? (
      <Navigate to="/admin/employee" replace />
    ) : (
      <Navigate to="/attendance-history" replace />
    );
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
