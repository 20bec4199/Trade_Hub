import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";


const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    if (!user || !isAuthenticated ){
        return <Navigate to='/' replace />
    }

    if(!allowedRoles.includes(user.role)) {
        return <Navigate to='/unauthorized' replace />
    }

    return <Outlet />
};

export default ProtectedRoute;