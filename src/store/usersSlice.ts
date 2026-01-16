import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../services/api";
import type { User } from "../types/domain";
import type { PaginatedResponse, PaginationState } from "../types/pagination";

interface UsersState extends PaginationState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  usersCount: number;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
  usersCount: 0,
};


export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (id: number) => {
    const response = await userService.getById(id);
    return response.data.data as User;
  }
);

export const createUser = createAsyncThunk(
  "users/create",
  async (data: Partial<User>) => {
    const response = await userService.create(data);
    return response.data.data as User;
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }: { id: number; data: FormData }) => {
    const response = await userService.update(id, data);
    return response.data.data as User;
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: number) => {
    await userService.delete(id);
    return id;
  }
);

// Query-based actions (for compatibility with existing query system)
export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (queries: { [key: string]: string | number }) => {
    const page = +(queries.page || 1);
    const limit = +(queries.limit || 10);
    
    const response = await userService.getAll(page, limit);
    // Backend returns: { success, message, data: { data: [...], current_page, limit, total, last_page, ... } }
    const responseData = response.data.data;
    
    // Handle both paginated response structure and plain array (fallback)
    if (Array.isArray(responseData)) {
      // If data is just an array, we need to construct a paginated response
      // This shouldn't happen with the fixed backend, but handle it gracefully
      return {
        data: responseData,
        current_page: page,
        limit: limit,
        total: responseData.length,
        last_page: 1,
        from: responseData.length > 0 ? 1 : null,
        to: responseData.length > 0 ? responseData.length : null,
      } as PaginatedResponse<User>;
    }
    
    // Normal paginated response from backend
    return responseData as PaginatedResponse<User>;
  }
);


const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      });

    // Create user
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create user";
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      });

    // Get users (query-based)
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
        state.usersCount = action.payload.total;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export const { clearSelectedUser, clearError } = usersSlice.actions;
export default usersSlice.reducer;
