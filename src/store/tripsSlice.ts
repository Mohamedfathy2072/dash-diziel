import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tripService } from "../services/api";
import type { Trip, PaginatedResponse } from "../types/domain";

interface TripsState {
  trips: Trip[];
  selectedTrip: Trip | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

const initialState: TripsState = {
  trips: [],
  selectedTrip: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
};

// Async thunks
export const fetchTrips = createAsyncThunk(
  "trips/fetchAll",
  async (queries: { [key: string]: string | number } = {}) => {
    const page = +(queries.page || 1);
    const limit = +(queries.limit || 10);
    
    // Extract filter parameters
    const params: any = {
      page,
      limit,
    };
    
    // Add filter parameters if they exist
    if (queries.status) params.status = queries.status;
    if (queries.vehicle_type_id) params.vehicle_type_id = typeof queries.vehicle_type_id === 'string' ? parseInt(queries.vehicle_type_id, 10) : queries.vehicle_type_id;
    // Backward compatibility: also check for old vehicle_type param
    if (!params.vehicle_type_id && queries.vehicle_type) params.vehicle_type_id = typeof queries.vehicle_type === 'string' ? parseInt(queries.vehicle_type, 10) : queries.vehicle_type;
    if (queries.user_id) params.user_id = +queries.user_id;
    if (queries.driver_id) params.driver_id = +queries.driver_id;
    if (queries.pickup_address) params.pickup_address = queries.pickup_address;
    if (queries.destination_address) params.destination_address = queries.destination_address;
    
    const response = await tripService.getAll(params);
    const responseData = response.data.data;
    
    // Handle both paginated response structure and plain array (fallback)
    if (Array.isArray(responseData)) {
      return {
        data: responseData,
        current_page: page,
        limit: limit,
        total: responseData.length,
        last_page: 1,
        from: responseData.length > 0 ? 1 : null,
        to: responseData.length > 0 ? responseData.length : null,
      } as PaginatedResponse<Trip>;
    }
    
    // Normal paginated response from backend
    return responseData as PaginatedResponse<Trip>;
  }
);

export const fetchTripById = createAsyncThunk(
  "trips/fetchById",
  async (id: number) => {
    const response = await tripService.getById(id);
    return response.data.data as Trip;
  }
);

export const updateTrip = createAsyncThunk(
  "trips/update",
  async ({ id, data }: { id: number; data: Partial<Trip> }) => {
    const response = await tripService.update(id, data);
    return response.data.data as Trip;
  }
);

export const deleteTrip = createAsyncThunk(
  "trips/delete",
  async (id: number) => {
    await tripService.delete(id);
    return id;
  }
);

export const acceptTripOffer = createAsyncThunk(
  "trips/acceptOffer",
  async ({ tripId, offerId }: { tripId: number; offerId: number }) => {
    const response = await tripService.acceptOffer(tripId, offerId);
    return response.data.data as Trip;
  }
);

export const startTrip = createAsyncThunk(
  "trips/start",
  async (id: number) => {
    const response = await tripService.start(id);
    return response.data.data as Trip;
  }
);

export const completeTrip = createAsyncThunk(
  "trips/complete",
  async (id: number) => {
    const response = await tripService.complete(id);
    return response.data.data as Trip;
  }
);

export const cancelTrip = createAsyncThunk(
  "trips/cancel",
  async ({ id, reason }: { id: number; reason?: string }) => {
    const response = await tripService.cancel(id, reason);
    return response.data.data as Trip;
  }
);

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    clearSelectedTrip: (state) => {
      state.selectedTrip = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch trips
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch trips";
      });

    // Fetch trip by ID
    builder
      .addCase(fetchTripById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTrip = action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch trip";
      });

    // Update trip
    builder
      .addCase(updateTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
        if (state.selectedTrip?.id === action.payload.id) {
          state.selectedTrip = action.payload;
        }
      })
      .addCase(updateTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update trip";
      });

    // Delete trip
    builder
      .addCase(deleteTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = state.trips.filter((t) => t.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedTrip?.id === action.payload) {
          state.selectedTrip = null;
        }
      })
      .addCase(deleteTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete trip";
      });

    // Accept trip offer
    builder
      .addCase(acceptTripOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptTripOffer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
        if (state.selectedTrip?.id === action.payload.id) {
          state.selectedTrip = action.payload;
        }
      })
      .addCase(acceptTripOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to accept offer";
      });

    // Start trip
    builder
      .addCase(startTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startTrip.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
        if (state.selectedTrip?.id === action.payload.id) {
          state.selectedTrip = action.payload;
        }
      })
      .addCase(startTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to start trip";
      });

    // Complete trip
    builder
      .addCase(completeTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeTrip.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
        if (state.selectedTrip?.id === action.payload.id) {
          state.selectedTrip = action.payload;
        }
      })
      .addCase(completeTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to complete trip";
      });

    // Cancel trip
    builder
      .addCase(cancelTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelTrip.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
        if (state.selectedTrip?.id === action.payload.id) {
          state.selectedTrip = action.payload;
        }
      })
      .addCase(cancelTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to cancel trip";
      });
  },
});

export const { clearSelectedTrip, clearError } = tripsSlice.actions;
export default tripsSlice.reducer;
