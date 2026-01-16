import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { statisticsService } from "../services/api";

interface StatisticsState {
  statistics: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  statistics: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchStatistics = createAsyncThunk(
  "statistics/fetchAll",
  async () => {
    const response = await statisticsService.getStatistics();
    return response.data.data;
  }
);

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
        state.error = null;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch statistics";
      });
  },
});

export const { clearError } = statisticsSlice.actions;
export default statisticsSlice.reducer;

