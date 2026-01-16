import type { UserTypes } from "../types/app";

export const handleGetAuthData = (): {
  userData: UserTypes | null;
  isAuthenticated: boolean;
} => {
  const userData = localStorage.getItem(
    `${import.meta.env.VITE_USER_DATA_STORAGE}`
  );
  
  const parsedUser = userData && userData !== "undefined" ? JSON.parse(userData) : null;
  
  return {
    userData: parsedUser,
    isAuthenticated: Boolean(parsedUser),
  };
};
