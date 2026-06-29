import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
    const location = useLocation();
    const { hasRole, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/employees" replace />;
    }

    return children;
};

export default ProtectedRoute;
