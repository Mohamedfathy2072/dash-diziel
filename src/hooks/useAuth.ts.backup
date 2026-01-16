import { useCallback } from "react";
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

    return { 
        handleCheckAuth, 
        handleGetAuthorization, 
        isSuperAdmin,
        isDriver,
        isUser
    }
}

export default useAuth;
