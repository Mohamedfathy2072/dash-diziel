import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../types/domain";
import { authService } from "../services/api";

interface ProfileState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Fetch authenticated user's profile from /auth/me
export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async () => {
    const response = await authService.me();
    return response.data.data as User;
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch profile";
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
