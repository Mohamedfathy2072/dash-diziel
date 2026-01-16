import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { handleGetAuthData } from "../functions/handleGetAuthData";
import { setAuth } from "../store/authSlice";
import { getProfile } from "../store/profileSlice";
import type { AppDispatch, RootState } from "../store/store";

const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { pathname } = useLocation()
    const { profile } = useSelector((state: RootState) => state.profile)
    const { user } = useSelector((state: RootState) => state.auth)

    const handleGetAuthorization = (): boolean => {
        const { userData, isAuthenticated } = handleGetAuthData();
        return isAuthenticated && userData !== null;
    }

    const handleCheckAuth = useCallback(() => {
        const { userData, isAuthenticated } = handleGetAuthData();
        if (isAuthenticated && userData) {
            dispatch(setAuth({ user: userData, isAuthenticated: true }));
            if (!profile) {
                dispatch(getProfile());
            }
        }
    }, [pathname, dispatch, profile])

    const isSuperAdmin = (): boolean => {
        return user?.type === 'superAdmin';
    }

    const isDriver = (): boolean => {
        return user?.type === 'driver';
    }

    const isUser = (): boolean => {
        return user?.type === 'user';
    }

    // Get user permissions as an array of slugs
    const userPermissions = useMemo(() => {
        if (!(user as any)?.permissions) return [];
        return (user as any)?.permissions.map((p: any) => p.slug);
    }, [(user as any)?.permissions]);

    return { 
        handleCheckAuth, 
        handleGetAuthorization, 
        isSuperAdmin,
        isDriver,
        isUser,
        userPermissions
    }
}

export default useAuth;
