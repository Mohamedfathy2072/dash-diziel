import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { permissionsService } from "../services/api";
import type { Permission, PaginatedResponse } from "../types/domain";

interface PermissionsState {
  permissions: Permission[];
  selectedPermission: Permission | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  groups: string[];
}

const initialState: PermissionsState = {
  permissions: [],
  selectedPermission: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 15,
  groups: [],
};

export const fetchPermissions = createAsyncThunk(
  "permissions/fetchAll",
  async (params?: { page?: number; per_page?: number; group?: string; search?: string; group_by?: boolean | string }) => {
    const response = await permissionsService.getAll(params);
    const responseData = response.data.data;
    
    if (responseData.permissions && responseData.pagination) {
      return {
        data: responseData.permissions,
        current_page: responseData.pagination.current_page,
        limit: responseData.pagination.per_page,
        total: responseData.pagination.total,
        last_page: responseData.pagination.last_page,
      } as PaginatedResponse<Permission>;
    }
    
    if (Array.isArray(responseData)) {
      return {
        data: responseData,
        current_page: params?.page || 1,
        limit: params?.per_page || 15,
        total: responseData.length,
        last_page: 1,
      } as PaginatedResponse<Permission>;
    }
    
    return responseData as PaginatedResponse<Permission>;
  }
);

export const fetchPermissionById = createAsyncThunk(
  "permissions/fetchById",
  async (id: number | string) => {
    const response = await permissionsService.getById(id);
    return response.data.data as Permission;
  }
);

export const createPermission = createAsyncThunk(
  "permissions/create",
  async (data: { name: string; slug?: string; group?: string; description?: string }) => {
    const response = await permissionsService.create(data);
    return response.data.data as Permission;
  }
);

export const updatePermission = createAsyncThunk(
  "permissions/update",
  async ({ id, data }: { id: number | string; data: { name?: string; slug?: string; group?: string; description?: string } }) => {
    const response = await permissionsService.update(id, data);
    return response.data.data as Permission;
  }
);

export const deletePermission = createAsyncThunk(
  "permissions/delete",
  async (id: number | string) => {
    await permissionsService.delete(id);
    return id;
  }
);

export const fetchPermissionGroups = createAsyncThunk(
  "permissions/fetchGroups",
  async () => {
    const response = await permissionsService.getGroups();
    return response.data.data as string[];
  }
);

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPermission: (state) => {
      state.selectedPermission = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch permissions";
      })
      .addCase(fetchPermissionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPermission = action.payload;
        const index = state.permissions.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.permissions[index] = action.payload;
        } else {
          state.permissions.push(action.payload);
        }
      })
      .addCase(fetchPermissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch permission";
      })
      .addCase(createPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create permission";
      })
      .addCase(updatePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.permissions.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.permissions[index] = action.payload;
        }
        if (state.selectedPermission?.id === action.payload.id) {
          state.selectedPermission = action.payload;
        }
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update permission";
      })
      .addCase(deletePermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = state.permissions.filter((p) => p.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedPermission?.id === action.payload) {
          state.selectedPermission = null;
        }
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete permission";
      })
      .addCase(fetchPermissionGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      });
  },
});

export const { clearError, clearSelectedPermission } = permissionsSlice.actions;
export default permissionsSlice.reducer;

