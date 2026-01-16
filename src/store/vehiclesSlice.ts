import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { vehicleService } from "../services/api";
import type { Vehicle, PaginatedResponse } from "../types/domain";

interface VehiclesState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

const initialState: VehiclesState = {
  vehicles: [],
  selectedVehicle: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
};

// Async thunks
export const fetchVehicles = createAsyncThunk(
  "vehicles/fetchAll",
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
    if (queries.verification_status) params.verification_status = queries.verification_status;
    if (queries.vehicle_type_id) params.vehicle_type_id = typeof queries.vehicle_type_id === 'string' ? parseInt(queries.vehicle_type_id, 10) : queries.vehicle_type_id;
    // Backward compatibility: also check for old vehicle_type param
    if (!params.vehicle_type_id && queries.vehicle_type) params.vehicle_type_id = typeof queries.vehicle_type === 'string' ? parseInt(queries.vehicle_type, 10) : queries.vehicle_type;
    if (queries.driver_id) params.driver_id = +queries.driver_id;
    if (queries.make) params.make = queries.make;
    if (queries.model) params.model = queries.model;
    if (queries.license_plate) params.license_plate = queries.license_plate;
    
    const response = await vehicleService.getAll(params);
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
      } as PaginatedResponse<Vehicle>;
    }
    
    // Normal paginated response from backend
    return responseData as PaginatedResponse<Vehicle>;
  }
);

export const fetchVehicleById = createAsyncThunk(
  "vehicles/fetchById",
  async (id: number) => {
    const response = await vehicleService.getById(id);
    return response.data.data as Vehicle;
  }
);

export const fetchVehiclesByDriver = createAsyncThunk(
  "vehicles/fetchByDriver",
  async (driverId: number) => {
    const response = await vehicleService.getByDriver(driverId);
    return response.data.data as Vehicle[];
  }
);

export const createVehicle = createAsyncThunk(
  "vehicles/create",
  async (data: Partial<Vehicle>) => {
    const response = await vehicleService.create(data);
    return response.data.data as Vehicle;
  }
);

export const updateVehicle = createAsyncThunk(
  "vehicles/update",
  async ({ id, data }: { id: number; data: Partial<Vehicle> }) => {
    const response = await vehicleService.update(id, data);
    return response.data.data as Vehicle;
  }
);

export const deleteVehicle = createAsyncThunk(
  "vehicles/delete",
  async (id: number) => {
    await vehicleService.delete(id);
    return id;
  }
);

export const verifyVehicle = createAsyncThunk(
  "vehicles/verify",
  async ({ id, action, notes }: { id: number; action: 'verify' | 'reject'; notes?: string }) => {
    const response = await vehicleService.verify(id, action, notes);
    return response.data.data as Vehicle;
  }
);

export const setPrimaryVehicle = createAsyncThunk(
  "vehicles/setPrimary",
  async (id: number) => {
    const response = await vehicleService.setPrimary(id);
    return response.data.data as Vehicle;
  }
);

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    clearSelectedVehicle: (state) => {
      state.selectedVehicle = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch vehicles
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch vehicles";
      });

    // Fetch vehicle by ID
    builder
      .addCase(fetchVehicleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVehicle = action.payload;
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch vehicle";
      });

    // Fetch vehicles by driver
    builder
      .addCase(fetchVehiclesByDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehiclesByDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehiclesByDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch driver vehicles";
      });

    // Create vehicle
    builder
      .addCase(createVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create vehicle";
      });

    // Update vehicle
    builder
      .addCase(updateVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vehicles.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
        if (state.selectedVehicle?.id === action.payload.id) {
          state.selectedVehicle = action.payload;
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update vehicle";
      });

    // Delete vehicle
    builder
      .addCase(deleteVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = state.vehicles.filter((v) => v.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedVehicle?.id === action.payload) {
          state.selectedVehicle = null;
        }
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete vehicle";
      });

    // Verify vehicle
    builder
      .addCase(verifyVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyVehicle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vehicles.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
        if (state.selectedVehicle?.id === action.payload.id) {
          state.selectedVehicle = action.payload;
        }
      })
      .addCase(verifyVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to verify vehicle";
      });

    // Set primary vehicle
    builder
      .addCase(setPrimaryVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setPrimaryVehicle.fulfilled, (state, action) => {
        state.loading = false;
        // Update all vehicles to mark only this one as primary
        state.vehicles = state.vehicles.map((v) => ({
          ...v,
          is_primary: v.id === action.payload.id,
        }));
        if (state.selectedVehicle) {
          state.selectedVehicle.is_primary = state.selectedVehicle.id === action.payload.id;
        }
      })
      .addCase(setPrimaryVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to set primary vehicle";
      });
  },
});

export const { clearSelectedVehicle, clearError } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;

