import Box from '@mui/material/Box';
import { Navigate, useLocation } from "react-router-dom";
import useAppRoutes from "../hooks/useAppRoutes";
import useAuth from "../hooks/useAuth";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { pathname } = useLocation();
    const { handleGetAuthorization } = useAuth();
    const { authRoutes } = useAppRoutes();

    const auth = handleGetAuthorization();

    if (auth) return <Navigate to={import.meta.env.VITE_DASHBOARD_ROUTE} replace />;

    if (!authRoutes.includes(pathname))
        return <Navigate to={import.meta.env.VITE_LOGIN_ROUTE} replace />;

    return (
        <Box component="main" className="!bg-white">
            {children}
        </Box>
    );
};

export default PublicRoute;
