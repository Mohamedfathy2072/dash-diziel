import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notificationService } from "../services/api";
import type { Notification } from "../types/domain";
import type { PaginatedResponse } from "../types/domain";

interface NotificationsState {
  notifications: Notification[];
  selectedNotification: Notification | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

const initialState: NotificationsState = {
  notifications: [],
  selectedNotification: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (params?: {
    page?: number;
    limit?: number;
    target_type?: string;
  }) => {
    const response = await notificationService.getAll(params);
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
      } as PaginatedResponse<Notification>;
    }
    
    // Normal paginated response from backend
    return responseData as PaginatedResponse<Notification>;
  }
);

export const fetchNotificationById = createAsyncThunk(
  "notifications/fetchById",
  async (id: number) => {
    const response = await notificationService.getById(id);
    return response.data.data as Notification;
  }
);

// Query-based actions (for compatibility with existing query system)
export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (queries: { [key: string]: string | number }) => {
    const page = +(queries.page || 1);
    const limit = +(queries.limit || 10);
    
    // Extract filter parameters (exclude page and limit)
    const { page: _, limit: __, ...filterParams } = queries;
    
    const params: any = {
      page,
      limit,
    };
    
    if (filterParams.target_type) {
      params.target_type = filterParams.target_type;
    }
    
    const response = await notificationService.getAll(params);
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
      } as PaginatedResponse<Notification>;
    }
    
    // Normal paginated response from backend
    return responseData as PaginatedResponse<Notification>;
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      })
      // Fetch notification by ID
      .addCase(fetchNotificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNotification = action.payload;
        state.error = null;
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notification";
      })
      // Get notifications (query-based)
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
        state.error = null;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      });
  },
});

export const { clearSelectedNotification, clearError } = notificationsSlice.actions;
export default notificationsSlice.reducer;

