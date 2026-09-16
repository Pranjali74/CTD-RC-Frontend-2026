import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../auth/auth";

const ProtectedRoutes = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;