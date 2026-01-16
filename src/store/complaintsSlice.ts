import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { complaintService } from "../services/api";
import type { Complaint, PaginatedResponse } from "../types/domain";

interface ComplaintsState {
  complaints: Complaint[];
  selectedComplaint: Complaint | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

const initialState: ComplaintsState = {
  complaints: [],
  selectedComplaint: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
};

export const fetchComplaints = createAsyncThunk(
  "complaints/fetchAll",
  async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    user_id?: number | string;
    complaintable_type?: string;
    subject?: string;
  }) => {
    const response = await complaintService.getAll(params);
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
      } as PaginatedResponse<Complaint>;
    }
    
    // Normal paginated response from backend
    return responseData as PaginatedResponse<Complaint>;
  }
);

export const fetchComplaintById = createAsyncThunk(
  "complaints/fetchById",
  async (id: number) => {
    const response = await complaintService.getById(id);
    return response.data.data as Complaint;
  }
);

export const createComplaint = createAsyncThunk(
  "complaints/create",
  async (data: Partial<Complaint>) => {
    const response = await complaintService.create(data);
    return response.data.data as Complaint;
  }
);

export const updateComplaint = createAsyncThunk(
  "complaints/update",
  async ({ id, data }: { id: number; data: Partial<Complaint> }) => {
    const response = await complaintService.update(id, data);
    return response.data.data as Complaint;
  }
);

export const resolveComplaint = createAsyncThunk(
  "complaints/resolve",
  async ({ id, data }: { id: number; data: { resolution_notes?: string } }) => {
    const response = await complaintService.resolve(id, data);
    return response.data.data as Complaint;
  }
);

export const deleteComplaint = createAsyncThunk(
  "complaints/delete",
  async (id: number) => {
    await complaintService.delete(id);
    return id;
  }
);

const complaintsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedComplaint: (state) => {
      state.selectedComplaint = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all complaints
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch complaints";
      });

    // Fetch complaint by ID
    builder
      .addCase(fetchComplaintById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaintById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedComplaint = action.payload;
        const index = state.complaints.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        } else {
          state.complaints.push(action.payload);
        }
      })
      .addCase(fetchComplaintById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch complaint";
      });

    // Create complaint
    builder
      .addCase(createComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create complaint";
      });

    // Update complaint
    builder
      .addCase(updateComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.complaints.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
        if (state.selectedComplaint?.id === action.payload.id) {
          state.selectedComplaint = action.payload;
        }
      })
      .addCase(updateComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update complaint";
      });

    // Resolve complaint
    builder
      .addCase(resolveComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveComplaint.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.complaints.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
        if (state.selectedComplaint?.id === action.payload.id) {
          state.selectedComplaint = action.payload;
        }
      })
      .addCase(resolveComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to resolve complaint";
      });

    // Delete complaint
    builder
      .addCase(deleteComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = state.complaints.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedComplaint?.id === action.payload) {
          state.selectedComplaint = null;
        }
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete complaint";
      });
  },
});

export const { clearError, clearSelectedComplaint } = complaintsSlice.actions;
export default complaintsSlice.reducer;

