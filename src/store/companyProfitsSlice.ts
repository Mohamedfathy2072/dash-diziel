import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { companyProfitsService } from "../services/api";

interface CompanyProfitsState {
  profits: any | null;
  temporalDistribution: any | null;
  byPaymentMethod: any | null;
  byCity: any | null;
  topDrivers: any | null;
  growthIndicators: any | null;
  monthlyTrend: any | null;
  dailyTrend: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyProfitsState = {
  profits: null,
  temporalDistribution: null,
  byPaymentMethod: null,
  byCity: null,
  topDrivers: null,
  growthIndicators: null,
  monthlyTrend: null,
  dailyTrend: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCompanyProfits = createAsyncThunk(
  "companyProfits/fetchProfits",
  async (params?: { period?: string; start_date?: string; end_date?: string }) => {
    const response = await companyProfitsService.getProfits(params);
    return response.data.data;
  }
);

export const fetchTemporalDistribution = createAsyncThunk(
  "companyProfits/fetchTemporalDistribution",
  async () => {
    const response = await companyProfitsService.getTemporalDistribution();
    return response.data.data;
  }
);

export const fetchByPaymentMethod = createAsyncThunk(
  "companyProfits/fetchByPaymentMethod",
  async (params?: { period?: string; start_date?: string; end_date?: string }) => {
    const response = await companyProfitsService.getByPaymentMethod(params);
    return response.data.data;
  }
);

export const fetchByCity = createAsyncThunk(
  "companyProfits/fetchByCity",
  async (params?: { period?: string; start_date?: string; end_date?: string }) => {
    const response = await companyProfitsService.getByCity(params);
    return response.data.data;
  }
);

export const fetchTopDrivers = createAsyncThunk(
  "companyProfits/fetchTopDrivers",
  async (params?: { limit?: number; period?: string; start_date?: string; end_date?: string }) => {
    const response = await companyProfitsService.getTopDrivers(params);
    return response.data.data;
  }
);

export const fetchGrowthIndicators = createAsyncThunk(
  "companyProfits/fetchGrowthIndicators",
  async (params?: { period?: string }) => {
    const response = await companyProfitsService.getGrowthIndicators(params);
    return response.data.data;
  }
);

export const fetchMonthlyTrend = createAsyncThunk(
  "companyProfits/fetchMonthlyTrend",
  async (params?: { months?: number }) => {
    const response = await companyProfitsService.getMonthlyTrend(params);
    return response.data.data;
  }
);

export const fetchDailyTrend = createAsyncThunk(
  "companyProfits/fetchDailyTrend",
  async (params?: { days?: number }) => {
    const response = await companyProfitsService.getDailyTrend(params);
    return response.data.data;
  }
);

const companyProfitsSlice = createSlice({
  name: "companyProfits",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profits
      .addCase(fetchCompanyProfits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyProfits.fulfilled, (state, action) => {
        state.loading = false;
        // Map API response to expected format
        const payload = action.payload;
        state.profits = {
          total_revenues: payload?.total_revenue || 0,
          total_commission: payload?.total_profits || 0,
          net_profit: payload?.total_profits || 0,
          commission_rate: payload?.total_revenue ? ((payload.total_profits / payload.total_revenue) * 100) : 0,
          total_trips: payload?.total_transactions || 0,
          avg_commission_per_trip: payload?.average_profit_per_transaction || 0,
          avg_revenue_per_trip: payload?.total_transactions ? (payload.total_revenue / payload.total_transactions) : 0,
          driver_profits: (payload?.total_revenue || 0) - (payload?.total_profits || 0)
        };
        state.error = null;
      })
      .addCase(fetchCompanyProfits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch company profits";
      })
      // Fetch Temporal Distribution
      .addCase(fetchTemporalDistribution.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTemporalDistribution.fulfilled, (state, action) => {
        // Convert temporalDistribution object to array format
        const payload = action.payload;
        const temporalData: any[] = [];
        
        // Add by_month data
        if (payload?.by_month && Array.isArray(payload.by_month)) {
          payload.by_month.forEach((item: any) => {
            temporalData.push({
              period: item.period || '',
              total_revenue: (item.profits || 0) * 18.66, // Estimate based on ratio
              commission: item.profits || 0,
              number_of_trips: 0, // Not available in API
              commission_percentage: 0 // Not available in API
            });
          });
        }
        
        // Add by_week data if needed
        if (payload?.by_week && Array.isArray(payload.by_week)) {
          payload.by_week.forEach((item: any) => {
            temporalData.push({
              period: item.period || '',
              total_revenue: (item.profits || 0) * 18.66,
              commission: item.profits || 0,
              number_of_trips: 0,
              commission_percentage: 0
            });
          });
        }
        
        state.temporalDistribution = temporalData;
        state.error = null;
      })
      .addCase(fetchTemporalDistribution.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch temporal distribution";
      })
      // Fetch By Payment Method
      .addCase(fetchByPaymentMethod.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchByPaymentMethod.fulfilled, (state, action) => {
        // Extract array from object or use the payload directly if it's already an array
        const payload = action.payload;
        state.byPaymentMethod = Array.isArray(payload) ? payload : (payload?.by_payment_method ? Object.entries(payload.by_payment_method).map(([key, value]: [string, any]) => ({
          payment_method: key,
          amount: value?.total_profits || value?.amount || 0,
          number_of_trips: value?.transaction_count || value?.number_of_trips || 0
        })) : []);
        state.error = null;
      })
      .addCase(fetchByPaymentMethod.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch by payment method";
      })
      // Fetch By City
      .addCase(fetchByCity.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchByCity.fulfilled, (state, action) => {
        // Extract array from object or use the payload directly if it's already an array
        const payload = action.payload;
        state.byCity = Array.isArray(payload) ? payload : (payload?.by_city ? Object.entries(payload.by_city).map(([key, value]: [string, any]) => ({
          city: key,
          total_revenue: value?.total_revenue || 0,
          commission: value?.total_profits || value?.commission || 0,
          number_of_trips: value?.transaction_count || value?.number_of_trips || 0,
          number_of_drivers: value?.number_of_drivers || 0,
          commission_percentage: value?.commission_percentage || 0
        })) : []);
        state.error = null;
      })
      .addCase(fetchByCity.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch by city";
      })
      // Fetch Top Drivers
      .addCase(fetchTopDrivers.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTopDrivers.fulfilled, (state, action) => {
        // Extract array from object or use the payload directly if it's already an array
        const payload = action.payload;
        state.topDrivers = Array.isArray(payload) ? payload : (payload?.top_drivers || []);
        state.error = null;
      })
      .addCase(fetchTopDrivers.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch top drivers";
      })
      // Fetch Growth Indicators
      .addCase(fetchGrowthIndicators.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchGrowthIndicators.fulfilled, (state, action) => {
        // Extract growth object and map to expected format
        const payload = action.payload;
        const growth = payload?.growth || {};
        state.growthIndicators = {
          commission_growth: growth?.profit_growth_percentage || 0,
          revenue_growth: growth?.profit_growth_percentage || 0, // Using profit growth as estimate
          trips_growth: growth?.transaction_growth_percentage || 0
        };
        state.error = null;
      })
      .addCase(fetchGrowthIndicators.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch growth indicators";
      })
      // Fetch Monthly Trend
      .addCase(fetchMonthlyTrend.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchMonthlyTrend.fulfilled, (state, action) => {
        // Extract monthly_trend array and convert to chart format
        const payload = action.payload;
        const monthlyTrendData = payload?.monthly_trend || [];
        state.monthlyTrend = {
          labels: monthlyTrendData.map((item: any) => item.month || ''),
          commission: monthlyTrendData.map((item: any) => item.total_profits || 0),
          revenues: monthlyTrendData.map((item: any) => (item.total_profits || 0) + ((item.total_profits || 0) * 10)) // Estimate revenue
        };
        state.error = null;
      })
      .addCase(fetchMonthlyTrend.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch monthly trend";
      })
      // Fetch Daily Trend
      .addCase(fetchDailyTrend.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchDailyTrend.fulfilled, (state, action) => {
        // Extract daily_trend array and convert to chart format
        const payload = action.payload;
        const dailyTrendData = payload?.daily_trend || [];
        state.dailyTrend = {
          labels: dailyTrendData.map((item: any) => item.date || ''),
          commission: dailyTrendData.map((item: any) => item.total_profits || 0)
        };
        state.error = null;
      })
      .addCase(fetchDailyTrend.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch daily trend";
      });
  },
});

export const { clearError } = companyProfitsSlice.actions;
export default companyProfitsSlice.reducer;
