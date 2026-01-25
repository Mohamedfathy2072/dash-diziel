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
    const vehicleData = response.data.data;
    
    // Store in window for debugging
    if (typeof window !== 'undefined') {
      window.lastFetchedVehicle = vehicleData;
    }
    
    // Handle composite vehicle response structure (same as updateVehicle)
    if (vehicleData && typeof vehicleData === 'object' && 'head' in vehicleData && 'trailer' in vehicleData) {
      const head = vehicleData.head;
      const trailer = vehicleData.trailer;
      
      // For composite vehicles, the top-level data contains the main vehicle info
      // while head and trailer contain the specific parts
      return {
        id: vehicleData.id || head.id,
        driver_id: vehicleData.driver_id || head.driver_id,
        make: vehicleData.make || head.make || "",
        model: vehicleData.model || head.model || "",
        year: vehicleData.year || head.year || new Date().getFullYear(),
        color: vehicleData.color || head.color || null,
        license_plate: head.license_plate || vehicleData.license_plate || "",
        vehicle_type: (vehicleData.vehicle_type || 'composite') as const,
        vehicle_type_id: vehicleData.vehicle_type_id || head.vehicle_type?.id || vehicleData.vehicle_type?.id || null,
        part_type: (vehicleData.part_type || 'composite') as const,
        display_name: vehicleData.display_name || `${vehicleData.make || head.make} ${vehicleData.model || head.model} (رأس + مقطورة)`,
        driver: vehicleData.driver || null,
        head: {
          id: head.id,
          license_plate: head.license_plate,
          chassis_number: head.chassis_number,
          engine_number: head.engine_number,
          number_of_axles: head.number_of_axles,
          max_load: head.max_load,
          length: head.length,
          photos: head.photos,
          // For composite vehicles, model and year come from top-level, not from head
          model: vehicleData.model || head.model || "",
          year: vehicleData.year || head.year || new Date().getFullYear(),
        },
        trailer: trailer ? {
          id: trailer.id,
          license_plate: trailer.license_plate,
          chassis_number: trailer.chassis_number,
          engine_number: trailer.engine_number,
          number_of_axles: trailer.number_of_axles,
          max_load: trailer.max_load,
          length: trailer.length,
          photos: trailer.photos,
          model: trailer.model,
          year: trailer.year,
        } : undefined,
        total_axles: vehicleData.total_axles || ((Number(head.number_of_axles) || 0) + (Number(trailer?.number_of_axles) || 0)),
        total_max_load: vehicleData.total_max_load || ((Number(head.max_load) || 0) + (Number(trailer?.max_load) || 0)),
        total_length: vehicleData.total_length || ((Number(head.length) || 0) + (Number(trailer?.length) || 0)),
        status: vehicleData.status || head.status || "active",
        verification_status: vehicleData.verification_status || head.verification_status || "pending",
        created_at: vehicleData.created_at || head.created_at,
        updated_at: vehicleData.updated_at || head.updated_at,
        // Include other fields from vehicleData
        fuel_type: vehicleData.fuel_type || null,
        transmission: vehicleData.transmission || null,
        doors: vehicleData.doors || null,
        seats: vehicleData.seats || null,
        is_primary: vehicleData.is_primary || false,
        verification_date: vehicleData.verification_date || null,
        verified_by: vehicleData.verified_by || null,
        verifier: vehicleData.verifier || null,
        verification_notes: vehicleData.verification_notes || null,
        registration_number: vehicleData.registration_number || null,
        registration_expiry: vehicleData.registration_expiry || null,
        registration_state: vehicleData.registration_state || null,
        insurance_provider: vehicleData.insurance_provider || null,
        insurance_policy_number: vehicleData.insurance_policy_number || null,
        insurance_expiry: vehicleData.insurance_expiry || null,
        inspection_date: vehicleData.inspection_date || null,
        inspection_expiry: vehicleData.inspection_expiry || null,
        inspection_certificate: vehicleData.inspection_certificate || null,
        mileage: vehicleData.mileage || null,
        condition_rating: vehicleData.condition_rating || null,
        last_maintenance_date: vehicleData.last_maintenance_date || null,
        next_maintenance_due: vehicleData.next_maintenance_due || null,
        features: vehicleData.features || null,
        notes: vehicleData.notes || null,
        created_by: vehicleData.created_by || null,
        creator: vehicleData.creator || null,
        updated_by: vehicleData.updated_by || null,
        updater: vehicleData.updater || null,
      } as Vehicle;
    }
    
    return vehicleData as Vehicle;
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
    const responseData = response.data.data;
    
    // Handle composite vehicle response structure
    // Response can be: { head: {...}, trailer: {...} } or a single Vehicle object
    if (responseData && typeof responseData === 'object' && 'head' in responseData && 'trailer' in responseData) {
      // Composite vehicle response - construct Vehicle object from head and trailer
      const head = responseData.head;
      const trailer = responseData.trailer;
      
      // For composite vehicles, the top-level data contains the main vehicle info
      // while head and trailer contain the specific parts
      return {
        id: responseData.id || head.id,
        driver_id: responseData.driver_id || head.driver_id,
        make: responseData.make || head.make || "",
        model: responseData.model || head.model || "",
        year: responseData.year || head.year || new Date().getFullYear(),
        color: responseData.color || head.color || null,
        license_plate: head.license_plate || responseData.license_plate || "",
        vehicle_type: (responseData.vehicle_type || 'composite') as const,
        vehicle_type_id: responseData.vehicle_type_id || head.vehicle_type?.id || responseData.vehicle_type?.id || null,
        part_type: (responseData.part_type || 'composite') as const,
        display_name: responseData.display_name || `${responseData.make || head.make} ${responseData.model || head.model} (رأس + مقطورة)`,
        driver: responseData.driver || null,
        head: {
          id: head.id,
          license_plate: head.license_plate,
          chassis_number: head.chassis_number,
          engine_number: head.engine_number,
          number_of_axles: head.number_of_axles,
          max_load: head.max_load,
          length: head.length,
          photos: head.photos,
          // For composite vehicles, model and year come from top-level, not from head
          model: responseData.model || head.model || "",
          year: responseData.year || head.year || new Date().getFullYear(),
        },
        trailer: trailer ? {
          id: trailer.id,
          license_plate: trailer.license_plate,
          chassis_number: trailer.chassis_number,
          engine_number: trailer.engine_number,
          number_of_axles: trailer.number_of_axles,
          max_load: trailer.max_load,
          length: trailer.length,
          photos: trailer.photos,
          model: trailer.model,
          year: trailer.year,
        } : undefined,
        total_axles: responseData.total_axles || ((Number(head.number_of_axles) || 0) + (Number(trailer?.number_of_axles) || 0)),
        total_max_load: responseData.total_max_load || ((Number(head.max_load) || 0) + (Number(trailer?.max_load) || 0)),
        total_length: responseData.total_length || ((Number(head.length) || 0) + (Number(trailer?.length) || 0)),
        status: responseData.status || head.status || "active",
        verification_status: responseData.verification_status || head.verification_status || "pending",
        created_at: responseData.created_at || head.created_at,
        updated_at: responseData.updated_at || head.updated_at,
        // Include other fields from responseData
        fuel_type: responseData.fuel_type || null,
        transmission: responseData.transmission || null,
        doors: responseData.doors || null,
        seats: responseData.seats || null,
        is_primary: responseData.is_primary || false,
        verification_date: responseData.verification_date || null,
        verified_by: responseData.verified_by || null,
        verifier: responseData.verifier || null,
        verification_notes: responseData.verification_notes || null,
        registration_number: responseData.registration_number || null,
        registration_expiry: responseData.registration_expiry || null,
        registration_state: responseData.registration_state || null,
        insurance_provider: responseData.insurance_provider || null,
        insurance_policy_number: responseData.insurance_policy_number || null,
        insurance_expiry: responseData.insurance_expiry || null,
        inspection_date: responseData.inspection_date || null,
        inspection_expiry: responseData.inspection_expiry || null,
        inspection_certificate: responseData.inspection_certificate || null,
        mileage: responseData.mileage || null,
        condition_rating: responseData.condition_rating || null,
        last_maintenance_date: responseData.last_maintenance_date || null,
        next_maintenance_due: responseData.next_maintenance_due || null,
        features: responseData.features || null,
        notes: responseData.notes || null,
        created_by: responseData.created_by || null,
        creator: responseData.creator || null,
        updated_by: responseData.updated_by || null,
        updater: responseData.updater || null,
      } as Vehicle;
    }
    
    // Regular vehicle response
    return responseData as Vehicle;
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
      // .addCase(setPrimaryVehicle.fulfilled, (state, action) => {
      //   state.loading = false;
      //   // Update all vehicles to mark only this one as primary
      //   state.vehicles = state.vehicles.map((v) => ({
      //     ...v,
      //     is_primary: v.id === action.payload.id,
      //   }));
      //   if (state.selectedVehicle) {
      //     state.selectedVehicle.is_primary = state.selectedVehicle.id === action.payload.id;
      //   }
      // })
      .addCase(setPrimaryVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to set primary vehicle";
      });
  },
});

export const { clearSelectedVehicle, clearError } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;

