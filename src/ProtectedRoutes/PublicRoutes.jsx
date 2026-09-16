import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../auth/auth";

const PublicRoutes = () => {
  return isAuthenticated() ? <Navigate to="/question-hub" replace /> : <Outlet />;
};

export default PublicRoutes;