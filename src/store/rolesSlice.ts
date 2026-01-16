import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { rolesService } from "../services/api";
import type { Role, PaginatedResponse } from "../types/domain";

interface RolesState {
  roles: Role[];
  selectedRole: Role | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

const initialState: RolesState = {
  roles: [],
  selectedRole: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 15,
};

export const fetchRoles = createAsyncThunk(
  "roles/fetchAll",
  async (params?: { page?: number; per_page?: number; is_active?: boolean | string; search?: string }) => {
    const response = await rolesService.getAll(params);
    const responseData = response.data.data;
    
    if (responseData.roles && responseData.pagination) {
      return {
        data: responseData.roles,
        current_page: responseData.pagination.current_page,
        limit: responseData.pagination.per_page,
        total: responseData.pagination.total,
        last_page: responseData.pagination.last_page,
      } as PaginatedResponse<Role>;
    }
    
    if (Array.isArray(responseData)) {
      return {
        data: responseData,
        current_page: params?.page || 1,
        limit: params?.per_page || 15,
        total: responseData.length,
        last_page: 1,
      } as PaginatedResponse<Role>;
    }
    
    return responseData as PaginatedResponse<Role>;
  }
);

export const fetchRoleById = createAsyncThunk(
  "roles/fetchById",
  async (id: number | string) => {
    const response = await rolesService.getById(id);
    return response.data.data as Role;
  }
);

export const createRole = createAsyncThunk(
  "roles/create",
  async (data: { name: string; slug?: string; description?: string; is_active?: boolean; permission_ids?: number[] }) => {
    const response = await rolesService.create(data);
    return response.data.data as Role;
  }
);

export const updateRole = createAsyncThunk(
  "roles/update",
  async ({ id, data }: { id: number | string; data: { name?: string; slug?: string; description?: string; is_active?: boolean } }) => {
    const response = await rolesService.update(id, data);
    return response.data.data as Role;
  }
);

export const deleteRole = createAsyncThunk(
  "roles/delete",
  async (id: number | string) => {
    await rolesService.delete(id);
    return id;
  }
);

export const assignRolePermissions = createAsyncThunk(
  "roles/assignPermissions",
  async ({ id, permissionIds }: { id: number | string; permissionIds: number[] }) => {
    const response = await rolesService.assignPermissions(id, permissionIds);
    return response.data.data as Role;
  }
);

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch roles";
      })
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRole = action.payload;
        const index = state.roles.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        } else {
          state.roles.push(action.payload);
        }
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch role";
      })
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create role";
      })
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        if (state.selectedRole?.id === action.payload.id) {
          state.selectedRole = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update role";
      })
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((r) => r.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedRole?.id === action.payload) {
          state.selectedRole = null;
        }
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete role";
      })
      .addCase(assignRolePermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignRolePermissions.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        if (state.selectedRole?.id === action.payload.id) {
          state.selectedRole = action.payload;
        }
      })
      .addCase(assignRolePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to assign permissions";
      });
  },
});

export const { clearError, clearSelectedRole } = rolesSlice.actions;
export default rolesSlice.reducer;

