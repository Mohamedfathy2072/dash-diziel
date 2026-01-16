import axios from "axios";
import logger from "../utils/logger";

export const handleLogout = async () => {
  try {
    // Call Laravel logout endpoint to destroy session
    await axios.post('/api/v1/auth/logout', {}, {
      withCredentials: true,
    });
  } catch (error) {
    logger.error("Logout error", error);
  } finally {
    // Clear local storage
    localStorage.removeItem(`${import.meta.env.VITE_USER_DATA_STORAGE}`);
  }
};
