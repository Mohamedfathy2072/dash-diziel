import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { driverService } from "../services/api";
import type { Driver, PaginatedResponse } from "../types/domain";

interface DriversState {
  drivers: Driver[];
  selectedDriver: Driver | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

const initialState: DriversState = {
  drivers: [],
  selectedDriver: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
};

// Async thunks
export const fetchDrivers = createAsyncThunk(
  "drivers/fetchAll",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const response = await driverService.getAll(page, limit);
    return response.data.data as PaginatedResponse<Driver>;
  }
);

// Query-based actions (for compatibility with existing query system)
export const getDrivers = createAsyncThunk(
  "drivers/getDrivers",
  async (queries: { [key: string]: string | number }) => {
    const page = +(queries.page || 1);
    const limit = +(queries.limit || 10);
    
    // Extract filter parameters (exclude page and limit)
    const { page: _, limit: __, ...filterParams } = queries;
    
    console.log("getDrivers: queries:", queries);
    console.log("getDrivers: filterParams:", filterParams);
    
    const response = await driverService.getAll(page, limit as number, filterParams);
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
      } as PaginatedResponse<Driver>;
    }
    
    // Normal paginated response from backend
    return responseData as PaginatedResponse<Driver>;
  }
);

export const fetchDriverById = createAsyncThunk(
  "drivers/fetchById",
  async (id: number, { rejectWithValue }) => {
    console.log('🚀 fetchDriverById STARTED for ID:', id);
    try {
      console.log('📡 Calling driverService.getById with ID:', id);
      const response = await driverService.getById(id);
      console.log('📦 Full response structure:', {
        hasResponse: !!response,
        hasData: !!response?.data,
        responseDataKeys: response?.data ? Object.keys(response.data) : [],
        hasNestedData: !!response?.data?.data,
        responseData: response?.data
      });
      
      // Handle both response structures: response.data.data and response.data
      // Handle response structure: response.data.data (most common) or response.data
      // Check if response.data exists and if it has a nested 'data' property
      let driverData: Driver | null = null;
      
      if (response?.data) {
        // Try response.data.data first (most common structure)
        if (response.data.data && typeof response.data.data === 'object') {
          driverData = response.data.data as Driver;
          console.log('📦 Using response.data.data structure');
        } 
        // Otherwise try response.data directly
        else if (typeof response.data === 'object' && 'id' in response.data) {
          driverData = response.data as Driver;
          console.log('📦 Using response.data structure directly');
        }
      }
      
      console.log('✅ driverService.getById SUCCESS:', {
        hasResponse: !!response,
        hasResponseData: !!response?.data,
        responseDataStructure: response?.data ? {
          hasNestedData: !!response.data.data,
          hasDirectData: typeof response.data === 'object' && 'id' in response.data,
          keys: Object.keys(response.data),
          nestedKeys: response.data.data ? Object.keys(response.data.data) : []
        } : null,
        hasDriverData: !!driverData,
        driverId: driverData?.id,
        driverName: driverData?.name,
        driverDataKeys: driverData ? Object.keys(driverData) : []
      });
      
      if (!driverData || !driverData.id) {
        console.error('❌ No valid driver data in response!', {
          response: response?.data,
          extractedData: driverData
        });
        return rejectWithValue({ 
          message: "No valid driver data in response",
          status: 200 
        });
      }
      
      return driverData;
    } catch (error: any) {
      console.error('❌ driverService.getById FAILED:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        message: error?.response?.data?.message || error?.message,
        url: error?.config?.url,
        method: error?.config?.method,
        fullError: error
      });
      // Return error message from backend if available
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Failed to fetch driver";
      return rejectWithValue({ 
        message: errorMessage,
        status: error?.response?.status 
      });
    }
  }
);

export const createDriver = createAsyncThunk(
  "drivers/create",
  async (data: Partial<Driver>) => {
    const response = await driverService.create(data);
    return response.data.data as Driver;
  }
);

export const updateDriver = createAsyncThunk(
  "drivers/update",
  async ({ id, data }: { id: number; data: Partial<Driver> }) => {
    const response = await driverService.update(id, data);
    return response.data.data as Driver;
  }
);

export const deleteDriver = createAsyncThunk(
  "drivers/delete",
  async (id: number) => {
    await driverService.delete(id);
    return id;
  }
);

export const verifyDriverDocument = createAsyncThunk(
  "drivers/verifyDocument",
  async ({ driverId, documentId, rejectionReason }: { driverId: number; documentId: number; rejectionReason?: string }) => {
    const response = await driverService.verifyDocument(driverId, documentId, rejectionReason);
    return { document: response.data.data, driverId };
  }
);

export const rejectDriverDocument = createAsyncThunk(
  "drivers/rejectDocument",
  async ({ driverId, documentId, rejectionReason }: { driverId: number; documentId: number; rejectionReason: string }) => {
    const response = await driverService.rejectDocument(driverId, documentId, rejectionReason);
    return { document: response.data.data, driverId };
  }
);

export const downloadDriverDocument = createAsyncThunk(
  "drivers/downloadDocument",
  async ({ driverId, documentId, fileName }: { driverId: number; documentId: number; fileName?: string }) => {
    const response = await driverService.downloadDocument(driverId, documentId);
    // Create blob URL and trigger download
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `document-${documentId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return { driverId, documentId };
  }
);

export const updateDriverDocument = createAsyncThunk(
  "drivers/updateDocument",
  async ({ driverId, documentId, formData }: { driverId: number; documentId: number; formData: FormData }) => {
    const response = await driverService.updateDocument(driverId, documentId, formData);
    return { document: response.data.data, driverId };
  }
);

export const deleteDriverDocument = createAsyncThunk(
  "drivers/deleteDocument",
  async ({ driverId, documentId }: { driverId: number; documentId: number }) => {
    await driverService.deleteDocument(driverId, documentId);
    return { driverId, documentId };
  }
);

export const expireDriverDocument = createAsyncThunk(
  "drivers/expireDocument",
  async ({ driverId, documentId }: { driverId: number; documentId: number }) => {
    const response = await driverService.expireDocument(driverId, documentId);
    return { document: response.data.data, driverId };
  }
);

const driversSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    clearSelectedDriver: (state) => {
      state.selectedDriver = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch drivers
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch drivers";
      });

    // Fetch driver by ID
    builder
      .addCase(fetchDriverById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverById.fulfilled, (state, action) => {
        console.log('✅ fetchDriverById.fulfilled reducer called:', {
          hasPayload: !!action.payload,
          payloadType: typeof action.payload,
          payloadKeys: action.payload ? Object.keys(action.payload) : [],
          payloadId: action.payload?.id,
          payloadName: action.payload?.name,
          currentState: {
            loading: state.loading,
            hasSelectedDriver: !!state.selectedDriver,
            error: state.error
          }
        });
        
        state.loading = false;
        state.selectedDriver = action.payload;
        state.error = null; // Clear any previous errors
        
        console.log('✅ State updated:', {
          loading: state.loading,
          hasSelectedDriver: !!state.selectedDriver,
          selectedDriverId: state.selectedDriver?.id,
          selectedDriverName: state.selectedDriver?.name,
          error: state.error
        });
      })
      .addCase(fetchDriverById.rejected, (state, action) => {
        state.loading = false;
        // Get error message from response if available
        const payload = action.payload as any;
        const errorMessage = payload?.message || 
                            action.error.message || 
                            "Failed to fetch driver";
        state.error = errorMessage;
        state.selectedDriver = null;
        // Log error for debugging
        console.error('fetchDriverById error:', {
          message: errorMessage,
          status: payload?.status,
          error: action.error
        });
      });

    // Create driver
    builder
      .addCase(createDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create driver";
      });

    // Update driver
    builder
      .addCase(updateDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.drivers.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.drivers[index] = action.payload;
        }
        if (state.selectedDriver?.id === action.payload.id) {
          state.selectedDriver = action.payload;
        }
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update driver";
      });

    // Delete driver
    builder
      .addCase(deleteDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = state.drivers.filter((d) => d.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedDriver?.id === action.payload) {
          state.selectedDriver = null;
        }
      })
      .addCase(deleteDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete driver";
      });

    // Get drivers (query-based)
    builder
      .addCase(getDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
      })
      .addCase(getDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch drivers";
      });

    // Verify document
    builder
      .addCase(verifyDriverDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyDriverDocument.fulfilled, (state, action) => {
        state.loading = false;
        // Update document in selected driver if it exists
        if (state.selectedDriver?.documents) {
          const docIndex = state.selectedDriver.documents.findIndex(
            (doc) => doc.id === action.payload.document.id
          );
          if (docIndex !== -1) {
            state.selectedDriver.documents[docIndex] = action.payload.document;
          }
        }
        // Update document in drivers list if it exists
        const driver = state.drivers.find(d => d.id === action.payload.driverId);
        if (driver?.documents) {
          const docIndex = driver.documents.findIndex(
            (doc) => doc.id === action.payload.document.id
          );
          if (docIndex !== -1) {
            driver.documents[docIndex] = action.payload.document;
          }
        }
      })
      .addCase(rejectDriverDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectDriverDocument.fulfilled, (state, action) => {
        state.loading = false;
        // Update document in selected driver if it exists
        if (state.selectedDriver?.documents) {
          const docIndex = state.selectedDriver.documents.findIndex(
            (doc) => doc.id === action.payload.document.id
          );
          if (docIndex !== -1) {
            state.selectedDriver.documents[docIndex] = action.payload.document;
          }
        }
        // Update document in drivers list if it exists
        const driver = state.drivers.find(d => d.id === action.payload.driverId);
        if (driver?.documents) {
          const docIndex = driver.documents.findIndex(
            (doc) => doc.id === action.payload.document.id
          );
          if (docIndex !== -1) {
            driver.documents[docIndex] = action.payload.document;
          }
        }
      })
      .addCase(verifyDriverDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to verify document";
      })
      .addCase(rejectDriverDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to reject document";
      })
      .addCase(updateDriverDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriverDocument.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedDriver?.documents) {
          const docIndex = state.selectedDriver.documents.findIndex(
            (doc) => doc.id === action.payload.document.id
          );
          if (docIndex !== -1) {
            state.selectedDriver.documents[docIndex] = action.payload.document;
          }
        }
        const driver = state.drivers.find(d => d.id === action.payload.driverId);
        if (driver?.documents) {
          const docIndex = driver.documents.findIndex(
            (doc) => doc.id === action.payload.document.id
          );
          if (docIndex !== -1) {
            driver.documents[docIndex] = action.payload.document;
          }
        }
      })
      .addCase(updateDriverDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update document";
      })
      .addCase(deleteDriverDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDriverDocument.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedDriver?.documents) {
          state.selectedDriver.documents = state.selectedDriver.documents.filter(
            (doc) => doc.id !== action.payload.documentId
          );
        }
        state.drivers = state.drivers.map(driver =>
          driver.id === action.payload.driverId
            ? { ...driver, documents: driver.documents?.filter(doc => doc.id !== action.payload.documentId) }
            : driver
        );
      })
      .addCase(deleteDriverDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete document";
      })
      .addCase(expireDriverDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(expireDriverDocument.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedDriver?.documents) {
          const docIndex = state.selectedDriver.documents.findIndex(
            (doc) => doc.id === action.payload.document.id
          );
          if (docIndex !== -1) {
            state.selectedDriver.documents[docIndex] = action.payload.document;
          }
        }
        const driver = state.drivers.find(d => d.id === action.payload.driverId);
        if (driver?.documents) {
          const docIndex = driver.documents.findIndex(
            (doc) => doc.id === action.payload.document.id
          );
          if (docIndex !== -1) {
            driver.documents[docIndex] = action.payload.document;
          }
        }
      })
      .addCase(expireDriverDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to expire document";
      });
  },
});

export const { clearSelectedDriver, clearError } = driversSlice.actions;
export default driversSlice.reducer;

