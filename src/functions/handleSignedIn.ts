import { handleGetAuthData } from "./handleGetAuthData";

export const handleSignedIn = () => {
  const { userData } = handleGetAuthData();
  const last = localStorage.getItem(
    `${import.meta.env.VITE_USER_LAST_RESET_PASSWORD_STORAGE}`
  );
  return userData && last === "true";
};
