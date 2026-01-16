import { createSlice } from "@reduxjs/toolkit";
import type { AuthValuesTypes } from "../types/store";

const initialState: AuthValuesTypes = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem(
        `${import.meta.env.VITE_USER_DATA_STORAGE}`,
        JSON.stringify(action.payload.user)
      );
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem(`${import.meta.env.VITE_USER_DATA_STORAGE}`);
    },
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { login, setAuth, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;
