import { Navigate, useLocation } from "react-router-dom";
import { hasRole, isUserLoggedIn } from "../services/AuthService";

const ProtectedRoute = ({ children, requiredRole }) => {
    const location = useLocation();

    if (!isUserLoggedIn()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/employees" replace />;
    }

    return children;
};

export default ProtectedRoute;
