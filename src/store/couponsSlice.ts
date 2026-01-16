import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { couponService } from "../services/api";
import type { Coupon, PaginatedResponse } from "../types/domain";

interface CouponsState {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

const initialState: CouponsState = {
  coupons: [],
  selectedCoupon: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  limit: 10,
};

export const fetchCoupons = createAsyncThunk(
  "coupons/fetchAll",
  async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await couponService.getAll(params);
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
      } as PaginatedResponse<Coupon>;
    }
    
    // Normal paginated response from backend
    return responseData as PaginatedResponse<Coupon>;
  }
);

export const fetchCouponById = createAsyncThunk(
  "coupons/fetchById",
  async (id: number) => {
    const response = await couponService.getById(id);
    const responseData = response.data.data;
    
    // Handle nested structure: { coupon: {...}, usage_stats: {...} }
    if (responseData.coupon) {
      // Merge usage_stats into coupon if it exists, preserving all fields including recent_usages
      const coupon = {
        ...responseData.coupon,
        usage_stats: responseData.usage_stats ? {
          // Preserve all API fields
          total_usages: responseData.usage_stats.total_usages ?? 0,
          usage_limit: responseData.usage_stats.usage_limit ?? null,
          remaining_usages: responseData.usage_stats.remaining_usages ?? 0,
          unique_users: responseData.usage_stats.unique_users ?? 0,
          recent_usages: responseData.usage_stats.recent_usages || [],
          // Legacy fields for backward compatibility
          total_uses: responseData.usage_stats.total_usages ?? 0,
          total_discount_amount: responseData.usage_stats.recent_usages?.reduce(
            (sum: number, usage: any) => sum + (parseFloat(usage.discount_amount) || 0),
            0
          ) ?? 0,
          average_discount_per_use: responseData.usage_stats.recent_usages?.length > 0
            ? (responseData.usage_stats.recent_usages.reduce(
                (sum: number, usage: any) => sum + (parseFloat(usage.discount_amount) || 0),
                0
              ) / responseData.usage_stats.recent_usages.length)
            : 0,
        } : undefined,
      };
      return coupon as Coupon;
    }
    
    // Fallback: assume response.data.data is the coupon directly
    return responseData as Coupon;
  }
);

export const createCoupon = createAsyncThunk(
  "coupons/create",
  async (data: Partial<Coupon>) => {
    const response = await couponService.create(data);
    return response.data.data as Coupon;
  }
);

export const updateCoupon = createAsyncThunk(
  "coupons/update",
  async ({ id, data }: { id: number; data: Partial<Coupon> }) => {
    const response = await couponService.update(id, data);
    return response.data.data as Coupon;
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupons/delete",
  async (id: number) => {
    await couponService.delete(id);
    return id;
  }
);

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCoupon: (state) => {
      state.selectedCoupon = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all coupons
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalCount = action.payload.total;
        state.limit = action.payload.limit;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch coupons";
      });

    // Fetch coupon by ID
    builder
      .addCase(fetchCouponById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCouponById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCoupon = action.payload;
        const index = state.coupons.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        } else {
          state.coupons.push(action.payload);
        }
      })
      .addCase(fetchCouponById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch coupon";
      });

    // Create coupon
    builder
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create coupon";
      });

    // Update coupon
    builder
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coupons.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
        if (state.selectedCoupon?.id === action.payload.id) {
          state.selectedCoupon = action.payload;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update coupon";
      });

    // Delete coupon
    builder
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
        if (state.selectedCoupon?.id === action.payload) {
          state.selectedCoupon = null;
        }
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete coupon";
      });
  },
});

export const { clearError, clearSelectedCoupon } = couponsSlice.actions;
export default couponsSlice.reducer;

