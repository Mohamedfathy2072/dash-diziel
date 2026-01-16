import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { vehicleTypeService } from "../services/api";
import type { VehicleType, PaginatedResponse } from "../types/domain";

interface VehicleTypesState {
  vehicleTypes: VehicleType[];
  activeVehicleTypes: VehicleType[];
  selectedVehicleType: VehicleType | null;
  loading: boolean;
  loadingActive: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

const initialState: VehicleTypesState = {
  vehicleTypes: [],
  activeVehicleTypes: [],
  selectedVehicleType: null,
  loading: false,
  loadingActive: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
};

// Async thunks
export const fetchVehicleTypes = createAsyncThunk(
  "vehicleTypes/fetchAll",
  async (params?: { page?: number; limit?: number; status?: 'active' | 'inactive' }) => {
    const response = await vehicleTypeService.getAll(params);
    const responseData = response.data.data;
    
    // Handle both paginated response structure and plain array (fallback)
    if (Array.isArray(responseData)) {
      return {
        data: responseData,
        current_page: params?.page || 1,
        limit: params?.limit || 10,
        total: responseData.length,
        last_page: 1,
        from: responseData.length > 0 ? 1 : null,
        to: responseData.length > 0 ? responseData.length : null,
      } as PaginatedResponse<VehicleType>;
    }
    
    // Normal paginated response from backend
    return responseData as PaginatedResponse<VehicleType>;
  }
);

export const fetchActiveVehicleTypes = createAsyncThunk(
  "vehicleTypes/fetchActive",
  async () => {
    const response = await vehicleTypeService.getActive();
    return response.data.data as VehicleType[];
  }
);

export const fetchVehicleTypeById = createAsyncThunk(
  "vehicleTypes/fetchById",
  async (id: number) => {
    const response = await vehicleTypeService.getById(id);
    return response.data.data as VehicleType;
  }
);

export const createVehicleType = createAsyncThunk(
  "vehicleTypes/create",
  async (data: Partial<VehicleType>) => {
    const response = await vehicleTypeService.create(data);
    return response.data.data as VehicleType;
  }
);

export const updateVehicleType = createAsyncThunk(
  "vehicleTypes/update",
  async ({ id, data }: { id: number; data: Partial<VehicleType> }) => {
    const response = await vehicleTypeService.update(id, data);
    return response.data.data as VehicleType;
  }
);

export const deleteVehicleType = createAsyncThunk(
  "vehicleTypes/delete",
  async (id: number) => {
    await vehicleTypeService.delete(id);
    return id;
  }
);

const vehicleTypesSlice = createSlice({
  name: "vehicleTypes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedVehicleType: (state) => {
      state.selectedVehicleType = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all vehicle types
    builder
      .addCase(fetchVehicleTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleTypes = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
      })
      .addCase(fetchVehicleTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch vehicle types";
      });

    // Fetch active vehicle types
    builder
      .addCase(fetchActiveVehicleTypes.pending, (state) => {
        state.loadingActive = true;
        state.error = null;
      })
      .addCase(fetchActiveVehicleTypes.fulfilled, (state, action) => {
        state.loadingActive = false;
        state.activeVehicleTypes = action.payload;
      })
      .addCase(fetchActiveVehicleTypes.rejected, (state, action) => {
        state.loadingActive = false;
        state.error = action.error.message || "Failed to fetch active vehicle types";
      });

    // Fetch vehicle type by ID
    builder
      .addCase(fetchVehicleTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVehicleType = action.payload;
        const index = state.vehicleTypes.findIndex((vt) => vt.id === action.payload.id);
        if (index !== -1) {
          state.vehicleTypes[index] = action.payload;
        } else {
          state.vehicleTypes.push(action.payload);
        }
      })
      .addCase(fetchVehicleTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch vehicle type";
      });

    // Create vehicle type
    builder
      .addCase(createVehicleType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicleType.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleTypes.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createVehicleType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create vehicle type";
      });

    // Update vehicle type
    builder
      .addCase(updateVehicleType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVehicleType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vehicleTypes.findIndex((vt) => vt.id === action.payload.id);
        if (index !== -1) {
          state.vehicleTypes[index] = action.payload;
        }
        if (state.selectedVehicleType?.id === action.payload.id) {
          state.selectedVehicleType = action.payload;
        }
        // Update in activeVehicleTypes if it exists there
        const activeIndex = state.activeVehicleTypes.findIndex((vt) => vt.id === action.payload.id);
        if (activeIndex !== -1) {
          state.activeVehicleTypes[activeIndex] = action.payload;
        }
      })
      .addCase(updateVehicleType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update vehicle type";
      });

    // Delete vehicle type
    builder
      .addCase(deleteVehicleType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVehicleType.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleTypes = state.vehicleTypes.filter((vt) => vt.id !== action.payload);
        state.activeVehicleTypes = state.activeVehicleTypes.filter((vt) => vt.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedVehicleType?.id === action.payload) {
          state.selectedVehicleType = null;
        }
      })
      .addCase(deleteVehicleType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete vehicle type";
      });
  },
});

export const { clearError, clearSelectedVehicleType } = vehicleTypesSlice.actions;
export default vehicleTypesSlice.reducer;

