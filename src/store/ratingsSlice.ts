import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ratingService } from "../services/api";
import type { TripRating } from "../types/domain";

interface RatingsState {
  tripRatings: TripRating[];
  driverRatings: TripRating[];
  userRatings: TripRating[];
  selectedRating: TripRating | null;
  loading: boolean;
  error: string | null;
  canRate: boolean | null;
}

const initialState: RatingsState = {
  tripRatings: [],
  driverRatings: [],
  userRatings: [],
  selectedRating: null,
  loading: false,
  error: null,
  canRate: null,
};

export const submitRating = createAsyncThunk(
  "ratings/submit",
  async ({ tripId, data }: { tripId: number; data: Partial<TripRating> }) => {
    const response = await ratingService.submitRating(tripId, data);
    return response.data.data as TripRating;
  }
);

export const fetchTripRatings = createAsyncThunk(
  "ratings/fetchTripRatings",
  async (tripId: number) => {
    const response = await ratingService.getTripRatings(tripId);
    return response.data.data as TripRating[];
  }
);

export const fetchDriverRatings = createAsyncThunk(
  "ratings/fetchDriverRatings",
  async (driverId: number) => {
    try {
      const response = await ratingService.getDriverRatings(driverId);
      return response.data.data as TripRating[];
    } catch (error: any) {
      // Return empty array instead of failing - ratings are optional
      // This prevents the page from breaking if ratings endpoint doesn't exist
      const status = error?.response?.status;
      if (status === 404 || status === 403) {
        return [] as TripRating[];
      }
      // For other errors, return empty array but log warning
      console.warn('Failed to fetch driver ratings:', error?.response?.data?.message || error?.message);
      return [] as TripRating[];
    }
  }
);

export const fetchUserRatings = createAsyncThunk(
  "ratings/fetchUserRatings",
  async (userId: number) => {
    const response = await ratingService.getUserRatings(userId);
    const responseData = response.data.data;
    
    // Handle both paginated response structure and plain array (fallback)
    if (Array.isArray(responseData)) {
      return responseData as TripRating[];
    }
    
    // If it's a paginated response, extract the data array
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return (responseData as any).data as TripRating[];
    }
    
    // Fallback to empty array
    return [] as TripRating[];
  }
);

export const checkCanRate = createAsyncThunk(
  "ratings/checkCanRate",
  async (tripId: number) => {
    const response = await ratingService.canRate(tripId);
    return response.data.data.can_rate as boolean;
  }
);

const ratingsSlice = createSlice({
  name: "ratings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedRating: (state) => {
      state.selectedRating = null;
    },
    clearRatings: (state) => {
      state.tripRatings = [];
      state.driverRatings = [];
      state.userRatings = [];
    },
  },
  extraReducers: (builder) => {
    // Submit rating
    builder
      .addCase(submitRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitRating.fulfilled, (state, action) => {
        state.loading = false;
        state.tripRatings.push(action.payload);
        state.canRate = false; // User has now rated
      })
      .addCase(submitRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to submit rating";
      });

    // Fetch trip ratings
    builder
      .addCase(fetchTripRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.tripRatings = action.payload;
      })
      .addCase(fetchTripRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch trip ratings";
      });

    // Fetch driver ratings
    builder
      .addCase(fetchDriverRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.driverRatings = action.payload || [];
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchDriverRatings.rejected, (state) => {
        state.loading = false;
        // Don't set error for ratings - they're optional
        // Just set empty array so page doesn't break
        state.driverRatings = [];
        state.error = null;
      });

    // Fetch user ratings
    builder
      .addCase(fetchUserRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.userRatings = action.payload;
      })
      .addCase(fetchUserRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user ratings";
      });

    // Check can rate
    builder
      .addCase(checkCanRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkCanRate.fulfilled, (state, action) => {
        state.loading = false;
        state.canRate = action.payload;
      })
      .addCase(checkCanRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to check if can rate";
      });
  },
});

export const { clearError, clearSelectedRating, clearRatings } = ratingsSlice.actions;
export default ratingsSlice.reducer;

