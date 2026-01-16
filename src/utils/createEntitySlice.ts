import { createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { PaginatedResponse } from "../types/pagination";
import { normalizeApiResponse, extractPaginationParams } from "./normalizeApiResponse";

/**
 * Generic entity service interface
 */
export interface EntityService<T> {
  getAll: (params?: any) => Promise<{ data: { data: T[] | PaginatedResponse<T> } }>;
  getById: (id: number) => Promise<{ data: { data: T } }>;
  create: (data: Partial<T>) => Promise<{ data: { data: T } }>;
  update: (id: number, data: Partial<T>) => Promise<{ data: { data: T } }>;
  delete: (id: number) => Promise<void>;
}

/**
 * Entity slice state interface
 */
export interface EntityState<T> {
  items: T[];
  selectedItem: T | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

/**
 * Configuration for creating an entity slice
 */
export interface EntitySliceConfig<T> {
  name: string;
  service: EntityService<T>;
  initialState?: Partial<EntityState<T>>;
  extraReducers?: (builder: any) => void;
}

/**
 * Creates async thunks for a generic entity
 */
export const createEntityThunks = <T extends { id: number }>(
  name: string,
  service: EntityService<T>
) => {
  const fetchAll = createAsyncThunk(
    `${name}/fetchAll`,
    async (queries: { [key: string]: string | number } = {}) => {
      const { page, limit, filterParams } = extractPaginationParams(queries);
      const params = { page, limit, ...filterParams };
      
      const response = await service.getAll(params);
      const responseData = response.data.data;
      
      return normalizeApiResponse(responseData, { page, limit });
    }
  );

  const fetchById = createAsyncThunk(
    `${name}/fetchById`,
    async (id: number) => {
      const response = await service.getById(id);
      return response.data.data as T;
    }
  );

  const create = createAsyncThunk(
    `${name}/create`,
    async (data: Partial<T>) => {
      const response = await service.create(data);
      return response.data.data as T;
    }
  );

  const update = createAsyncThunk(
    `${name}/update`,
    async ({ id, data }: { id: number; data: Partial<T> }) => {
      const response = await service.update(id, data);
      return response.data.data as T;
    }
  );

  const remove = createAsyncThunk(
    `${name}/delete`,
    async (id: number) => {
      await service.delete(id);
      return id;
    }
  );

  return {
    fetchAll,
    fetchById,
    create,
    update,
    remove,
  };
};

/**
 * Creates standard reducers for an entity slice
 */
export const createEntityReducers = <T extends { id: number }>() => {
  return {
    clearError: (state: EntityState<T>) => {
      state.error = null;
    },
    clearSelectedItem: (state: EntityState<T>) => {
      state.selectedItem = null;
    },
  };
};

/**
 * Creates standard extra reducers for an entity slice
 */
export const createEntityExtraReducers = <T extends { id: number }>(
  thunks: ReturnType<typeof createEntityThunks<T>>,
  builder: any
) => {
  // Fetch all
  builder
    .addCase(thunks.fetchAll.pending, (state: EntityState<T>) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(thunks.fetchAll.fulfilled, (state: EntityState<T>, action: PayloadAction<PaginatedResponse<T>>) => {
      state.loading = false;
      state.items = action.payload.data;
      state.currentPage = action.payload.current_page;
      state.totalPages = action.payload.last_page;
      state.totalCount = action.payload.total;
      state.limit = action.payload.limit;
    })
    .addCase(thunks.fetchAll.rejected, (state: EntityState<T>, action: any) => {
      state.loading = false;
      state.error = action.error.message || `Failed to fetch ${thunks.fetchAll.typePrefix.split('/')[0]}`;
    });

  // Fetch by ID
  builder
    .addCase(thunks.fetchById.pending, (state: EntityState<T>) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(thunks.fetchById.fulfilled, (state: EntityState<T>, action: PayloadAction<T>) => {
      state.loading = false;
      state.selectedItem = action.payload;
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    })
    .addCase(thunks.fetchById.rejected, (state: EntityState<T>, action: any) => {
      state.loading = false;
      state.error = action.error.message || `Failed to fetch ${thunks.fetchById.typePrefix.split('/')[0]}`;
    });

  // Create
  builder
    .addCase(thunks.create.pending, (state: EntityState<T>) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(thunks.create.fulfilled, (state: EntityState<T>, action: PayloadAction<T>) => {
      state.loading = false;
      state.items.unshift(action.payload);
      state.totalCount += 1;
    })
    .addCase(thunks.create.rejected, (state: EntityState<T>, action: any) => {
      state.loading = false;
      state.error = action.error.message || `Failed to create ${thunks.create.typePrefix.split('/')[0]}`;
    });

  // Update
  builder
    .addCase(thunks.update.pending, (state: EntityState<T>) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(thunks.update.fulfilled, (state: EntityState<T>, action: PayloadAction<T>) => {
      state.loading = false;
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedItem?.id === action.payload.id) {
        state.selectedItem = action.payload;
      }
    })
    .addCase(thunks.update.rejected, (state: EntityState<T>, action: any) => {
      state.loading = false;
      state.error = action.error.message || `Failed to update ${thunks.update.typePrefix.split('/')[0]}`;
    });

  // Delete
  builder
    .addCase(thunks.remove.pending, (state: EntityState<T>) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(thunks.remove.fulfilled, (state: EntityState<T>, action: PayloadAction<number>) => {
      state.loading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalCount -= 1;
      if (state.selectedItem?.id === action.payload) {
        state.selectedItem = null;
      }
    })
    .addCase(thunks.remove.rejected, (state: EntityState<T>, action: any) => {
      state.loading = false;
      state.error = action.error.message || `Failed to delete ${thunks.remove.typePrefix.split('/')[0]}`;
    });
};

