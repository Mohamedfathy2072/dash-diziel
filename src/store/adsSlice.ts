import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adService } from "../services/api";
import type { Ad, PaginatedResponse } from "../types/domain";

interface AdsState {
  ads: Ad[];
  selectedAd: Ad | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

const initialState: AdsState = {
  ads: [],
  selectedAd: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
};

export const fetchAds = createAsyncThunk(
  "ads/fetchAll",
  async (params?: { page?: number; limit?: number; is_active?: string }) => {
    const response = await adService.getAll(params);
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
      } as PaginatedResponse<Ad>;
    }
    
    // Normal paginated response from backend
    return responseData as PaginatedResponse<Ad>;
  }
);

export const fetchAdById = createAsyncThunk(
  "ads/fetchById",
  async (id: number) => {
    const response = await adService.getById(id);
    return response.data.data as Ad;
  }
);

export const createAd = createAsyncThunk(
  "ads/create",
  async (data: Partial<Ad> | FormData) => {
    const response = await adService.create(data);
    return response.data.data as Ad;
  }
);

export const updateAd = createAsyncThunk(
  "ads/update",
  async ({ id, data }: { id: number; data: Partial<Ad> | FormData }) => {
    const response = await adService.update(id, data);
    return response.data.data as Ad;
  }
);

export const deleteAd = createAsyncThunk(
  "ads/delete",
  async (id: number) => {
    await adService.delete(id);
    return id;
  }
);

const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAd: (state) => {
      state.selectedAd = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all ads
    builder
      .addCase(fetchAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAds.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch ads";
      });

    // Fetch ad by ID
    builder
      .addCase(fetchAdById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAd = action.payload;
        const index = state.ads.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.ads[index] = action.payload;
        } else {
          state.ads.push(action.payload);
        }
      })
      .addCase(fetchAdById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch ad";
      });

    // Create ad
    builder
      .addCase(createAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.loading = false;
        state.ads.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create ad";
      });

    // Update ad
    builder
      .addCase(updateAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.ads.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.ads[index] = action.payload;
        }
        if (state.selectedAd?.id === action.payload.id) {
          state.selectedAd = action.payload;
        }
      })
      .addCase(updateAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update ad";
      });

    // Delete ad
    builder
      .addCase(deleteAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = state.ads.filter((a) => a.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedAd?.id === action.payload) {
          state.selectedAd = null;
        }
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete ad";
      });
  },
});

export const { clearError, clearSelectedAd } = adsSlice.actions;
export default adsSlice.reducer;

