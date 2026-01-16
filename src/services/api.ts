import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type { PaginatedApiResponse } from '../types/pagination';
import type { User } from '../types/domain';
import i18n from '../i18n';

// Create base axios instance
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Language': i18n.language || 'en',
    },
  });
  
  // Add request interceptor to update locale header on each request
  client.interceptors.request.use(
    (config) => {
      // Update locale header with current language
      if (config.headers) {
        config.headers['Accept-Language'] = i18n.language || 'en';
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle 401 Unauthorized
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      // Handle 401 Unauthorized - redirect to login
      if (error.response?.status === 401) {
        // Don't redirect if this is a login request itself (to avoid redirect loops)
        const requestUrl = error.config?.url || '';
        const isLoginRequest = requestUrl.includes('/auth/login');
        
        if (!isLoginRequest) {
          // Only redirect if not already on login page to avoid infinite loops
          const currentPath = window.location.pathname;
          const loginRoute = import.meta.env.VITE_LOGIN_ROUTE || '/login';
          
          if (!currentPath.includes(loginRoute)) {
            // Clear stored auth data from localStorage
            // This matches what the logout action does in authSlice
            const userDataStorageKey = import.meta.env.VITE_USER_DATA_STORAGE;
            if (userDataStorageKey) {
              localStorage.removeItem(userDataStorageKey);
            }
            
            // Clear any other auth-related data if needed
            // Note: Redux state will be cleared on page reload/redirect
            
            // Redirect to login page
            window.location.href = loginRoute;
          }
        }
      }
      
      // Return the error so it can be handled by the calling code
      return Promise.reject(error);
    }
  );

  return client;
};

// Authentication Service
export const authService = {
  login: (email: string, password: string) => {
    const client = createApiClient();
    return client.post('/auth/login', { email, password });
  },
  
  logout: () => {
    const client = createApiClient();
    return client.post('/auth/logout');
  },
  
  me: () => {
    const client = createApiClient();
    return client.get('/auth/me');
  },
  
  register: (data: any) => {
    const client = createApiClient();
    return client.post('/auth/register', data);
  },

  forgotPassword: (email: string) => {
    const client = createApiClient();
    return client.post('/auth/forgot-password', { email });
  },

  resetPassword: (data: any) => {
    const client = createApiClient();
    return client.post('/auth/reset-password', data);
  },
};

// User Service
export const userService = {
  getAll: (page = 1, limit = 10): Promise<AxiosResponse<PaginatedApiResponse<User>>> => {
    const client = createApiClient();
    return client.get('/users', { 
      params: { 
        page, 
        limit
      } 
    });
  },
  
  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/users/${id}`);
  },
  
  create: (data: any) => {
    const client = createApiClient();
    // If data is FormData, don't set Content-Type - browser will set it with boundary
    if (data instanceof FormData) {
      return client.post('/users', data, {
        headers: {
          'Content-Type': undefined, // Let browser set Content-Type with boundary
        },
      });
    }
    return client.post('/users', data);
  },
  
  update: (id: number, data: any) => {
    // If data is FormData, use POST for file uploads
    // Laravel API routes don't support method spoofing, so we use POST directly
    if (data instanceof FormData) {
      const formDataClient = createApiClient();
      // Remove Content-Type header for FormData - browser will set it with boundary
      delete formDataClient.defaults.headers['Content-Type'];
      return formDataClient.post(`/users/${id}`, data);
    }
    const client = createApiClient();
    return client.put(`/users/${id}`, data);
  },
  
  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/users/${id}`);
  },
  
  // User Roles Management (Admin only)
  getRoles: (userId: number | string) => {
    const client = createApiClient();
    return client.get(`/admin/users/${userId}/roles`);
  },
  
  assignRole: (userId: number | string, roleId: number) => {
    const client = createApiClient();
    return client.post(`/admin/users/${userId}/roles`, {
      role_id: roleId,
    });
  },
  
  syncRoles: (userId: number | string, roleIds: number[]) => {
    const client = createApiClient();
    return client.put(`/admin/users/${userId}/roles`, {
      role_ids: roleIds,
    });
  },
  
  removeRole: (userId: number | string, roleId: number | string) => {
    const client = createApiClient();
    return client.delete(`/admin/users/${userId}/roles/${roleId}`);
  },
  
  getPermissions: (userId: number | string, params?: {
    group?: string;
    group_by?: boolean | string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, any> = {};
    
    if (params?.group) queryParams.group = params.group;
    if (params?.group_by !== undefined) queryParams.group_by = params.group_by;
    
    return client.get(`/admin/users/${userId}/roles/permissions`, { params: queryParams });
  },
  
  checkPermission: (userId: number | string, permissionSlug: string) => {
    const client = createApiClient();
    return client.get(`/admin/users/${userId}/permissions/check/${permissionSlug}`);
  },
  
  checkRole: (userId: number | string, roleSlug: string) => {
    const client = createApiClient();
    return client.get(`/admin/users/${userId}/roles/check-role/${roleSlug}`);
  },
};

// Driver Service
export const driverService = {
  getAll: (page = 1, limit = 10, additionalParams?: Record<string, any>) => {
    const client = createApiClient();
    const params: Record<string, any> = { page, limit };
    
    // Merge any additional query parameters (like filters)
    if (additionalParams) {
      Object.keys(additionalParams).forEach(key => {
        if (additionalParams[key] !== undefined && additionalParams[key] !== null && additionalParams[key] !== '') {
          params[key] = additionalParams[key];
        }
      });
    }
    
    return client.get('/drivers', { params });
  },
  
  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/drivers/${id}`);
  },
  
  create: (data: any) => {
    const client = createApiClient();
    // If data is FormData, don't set Content-Type - browser will set it with boundary
    if (data instanceof FormData) {
      return client.post('/drivers', data, {
        headers: {
          'Content-Type': undefined, // Let browser set Content-Type with boundary
        },
      });
    }
    return client.post('/drivers', data);
  },
  
  update: (id: number, data: any) => {
    // If data is FormData, use POST for file uploads
    if (data instanceof FormData) {
      const formDataClient = createApiClient();
      // Remove Content-Type header for FormData - browser will set it with boundary
      delete formDataClient.defaults.headers['Content-Type'];
      return formDataClient.post(`/drivers/${id}`, data);
    }
    const client = createApiClient();
    return client.post(`/drivers/${id}`, data);
  },
  
  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/drivers/${id}`);
  },

  // Document management
  getDocuments: (driverId: number) => {
    const client = createApiClient();
    return client.get(`/drivers/${driverId}/documents`);
  },

  uploadDocument: (driverId: number, formData: FormData) => {
    const client = createApiClient();
    return client.post(`/drivers/${driverId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  verifyDocument: (driverId: number, documentId: number, rejectionReason?: string) => {
    const client = createApiClient();
    return client.post(`/drivers/${driverId}/documents/${documentId}/verify`, {
      rejection_reason: rejectionReason || null,
    });
  },

  rejectDocument: (driverId: number, documentId: number, rejectionReason: string) => {
    const client = createApiClient();
    return client.post(`/drivers/${driverId}/documents/${documentId}/verify`, {
      rejection_reason: rejectionReason,
    });
  },

  downloadDocument: (driverId: number, documentId: number) => {
    const client = createApiClient();
    return client.get(`/drivers/${driverId}/documents/${documentId}/download`, {
      responseType: 'blob',
    });
  },

  updateDocument: (driverId: number, documentId: number, formData: FormData) => {
    const client = createApiClient();
    // Remove Content-Type header for FormData - browser will set it with boundary
    delete client.defaults.headers['Content-Type'];
    return client.put(`/drivers/${driverId}/documents/${documentId}`, formData);
  },

  deleteDocument: (driverId: number, documentId: number) => {
    const client = createApiClient();
    return client.delete(`/drivers/${driverId}/documents/${documentId}`);
  },

  expireDocument: (driverId: number, documentId: number) => {
    const client = createApiClient();
    return client.put(`/drivers/${driverId}/documents/${documentId}`, {
      verification_status: 'expired',
    });
  },

  // Driver Wallet Management (Admin only)
  getWallet: (driverId: number | string) => {
    const client = createApiClient();
    return client.get(`/admin/drivers/${driverId}/wallet`);
  },
  
  addDeposit: (driverId: number | string, data: {
    amount: number;
    type?: string; // "manual" for manual deposits by admin
    description?: string;
    reference_number?: string;
    metadata?: Record<string, any>;
  }) => {
    const client = createApiClient();
    return client.post(`/admin/drivers/${driverId}/wallet/deposit`, data);
  },
  
  getTransactions: (driverId: number | string, params?: {
    page?: number;
    per_page?: number;
    type?: string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, any> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.per_page) queryParams.per_page = params.per_page;
    if (params?.type) queryParams.type = params.type;
    
    return client.get(`/admin/drivers/${driverId}/wallet/transactions`, { params: queryParams });
  },
};

// Vehicle Service
export const vehicleService = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    verification_status?: string;
    vehicle_type_id?: number | string;
    driver_id?: number;
    make?: string;
    model?: string;
    license_plate?: string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, any> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.status) queryParams.status = params.status;
    if (params?.verification_status) queryParams.verification_status = params.verification_status;
    if (params?.vehicle_type_id) queryParams.vehicle_type_id = params.vehicle_type_id;
    if (params?.driver_id) queryParams.driver_id = params.driver_id;
    if (params?.make) queryParams.make = params.make;
    if (params?.model) queryParams.model = params.model;
    if (params?.license_plate) queryParams.license_plate = params.license_plate;
    
    return client.get('/vehicles', { params: queryParams });
  },
  
  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/vehicles/${id}`);
  },
  
  getByDriver: (driverId: number) => {
    const client = createApiClient();
    return client.get(`/drivers/${driverId}/vehicles`);
  },
  
  create: (data: any) => {
    const client = createApiClient();
    return client.post('/vehicles', data);
  },
  
  update: (id: number, data: any) => {
    const client = createApiClient();
    return client.put(`/vehicles/${id}`, data);
  },
  
  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/vehicles/${id}`);
  },

  verify: (id: number, action: 'verify' | 'reject', notes?: string) => {
    const client = createApiClient();
    return client.post(`/vehicles/${id}/verify`, { action, notes });
  },

  setPrimary: (id: number) => {
    const client = createApiClient();
    return client.post(`/vehicles/${id}/set-primary`);
  },
};

// Trip Service
export const tripService = {
  getAll: (params: { [key: string]: any } = {}) => {
    const client = createApiClient();
    return client.get('/trips', { params });
  },
  
  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/trips/${id}`);
  },
  
  create: (data: any) => {
    const client = createApiClient();
    return client.post('/trips', data);
  },
  
  update: (id: number, data: any) => {
    const client = createApiClient();
    return client.put(`/trips/${id}`, data);
  },
  
  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/trips/${id}`);
  },

  acceptOffer: (id: number, offerId: number) => {
    const client = createApiClient();
    return client.post(`/trips/${id}/accept-offer`, { offer_id: offerId });
  },

  start: (id: number) => {
    const client = createApiClient();
    return client.post(`/trips/${id}/start`);
  },

  complete: (id: number) => {
    const client = createApiClient();
    return client.post(`/trips/${id}/complete`);
  },

  cancel: (id: number, reason?: string) => {
    const client = createApiClient();
    return client.post(`/trips/${id}/cancel`, { reason });
  },
};

// Trip Offer Service
export const tripOfferService = {
  getByTrip: (tripId: number) => {
    const client = createApiClient();
    return client.get(`/trips/${tripId}/offers`);
  },
  
  getById: (tripId: number, offerId: number) => {
    const client = createApiClient();
    return client.get(`/trips/${tripId}/offers/${offerId}`);
  },
  
  create: (tripId: number, data: any) => {
    const client = createApiClient();
    return client.post(`/trips/${tripId}/offers`, data);
  },
  
  update: (tripId: number, offerId: number, data: any) => {
    const client = createApiClient();
    return client.put(`/trips/${tripId}/offers/${offerId}`, data);
  },
  
  delete: (tripId: number, offerId: number) => {
    const client = createApiClient();
    return client.delete(`/trips/${tripId}/offers/${offerId}`);
  },

  withdraw: (tripId: number, offerId: number) => {
    const client = createApiClient();
    return client.post(`/trips/${tripId}/offers/${offerId}/withdraw`);
  },
};

// Vehicle Type Service
export const vehicleTypeService = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'inactive';
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, any> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.status) queryParams.status = params.status;
    
    return client.get('/vehicle-types', { params: queryParams });
  },
  
  getActive: () => {
    const client = createApiClient();
    return client.get('/vehicle-types/active');
  },
  
  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/vehicle-types/${id}`);
  },
  
  create: (data: any) => {
    const client = createApiClient();
    return client.post('/vehicle-types', data);
  },
  
  update: (id: number, data: any) => {
    const client = createApiClient();
    return client.put(`/vehicle-types/${id}`, data);
  },
  
  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/vehicle-types/${id}`);
  },
};

// Coupon Service (Admin only)
export const couponService = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, any> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.status) queryParams.status = params.status;
    
    return client.get('/admin/coupons', { params: queryParams });
  },
  
  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/admin/coupons/${id}`);
  },
  
  create: (data: any) => {
    const client = createApiClient();
    return client.post('/admin/coupons', data);
  },
  
  update: (id: number, data: any) => {
    const client = createApiClient();
    return client.put(`/admin/coupons/${id}`, data);
  },
  
  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/admin/coupons/${id}`);
  },
};

// Ad Service (Admin only)
export const adService = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    is_active?: string;
    valid_from?: string;
    valid_until?: string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, any> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.is_active) queryParams.is_active = params.is_active;
    if (params?.valid_from) queryParams.valid_from = params.valid_from;
    if (params?.valid_until) queryParams.valid_until = params.valid_until;
    
    return client.get('/admin/ads', { params: queryParams });
  },
  
  getActive: () => {
    const client = createApiClient();
    return client.get('/ads');
  },
  
  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/admin/ads/${id}`);
  },
  
  create: (data: any) => {
    const client = createApiClient();
    // If data is FormData, don't set Content-Type - browser will set it with boundary
    if (data instanceof FormData) {
      return client.post('/admin/ads', data, {
        headers: {
          'Content-Type': undefined, // Let browser set Content-Type with boundary
        },
      });
    }
    return client.post('/admin/ads', data);
  },
  
  update: (id: number, data: any) => {
    // If data is FormData, use POST for file uploads with method spoofing
    if (data instanceof FormData) {
      const formDataClient = createApiClient();
      // Add _method=PUT for Laravel method spoofing
      if (!data.has('_method')) {
        data.append('_method', 'PUT');
      }
      // Remove Content-Type header for FormData - browser will set it with boundary
      delete formDataClient.defaults.headers['Content-Type'];
      return formDataClient.post(`/admin/ads/${id}`, data);
    }
    const client = createApiClient();
    return client.put(`/admin/ads/${id}`, data);
  },
  
  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/admin/ads/${id}`);
  },
};

// Complaint Service
export const complaintService = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    user_id?: number | string;
    complaintable_type?: string;
    subject?: string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, any> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.status) queryParams.status = params.status;
    if (params?.user_id) queryParams.user_id = params.user_id;
    if (params?.complaintable_type) queryParams.complaintable_type = params.complaintable_type;
    if (params?.subject) queryParams.subject = params.subject;
    
    return client.get('/complaints', { params: queryParams });
  },
  
  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/complaints/${id}`);
  },
  
  create: (data: any) => {
    const client = createApiClient();
    return client.post('/complaints', data);
  },
  
  update: (id: number, data: any) => {
    const client = createApiClient();
    return client.put(`/complaints/${id}`, data);
  },
  
  resolve: (id: number, data: { resolution_notes?: string }) => {
    const client = createApiClient();
    return client.post(`/admin/complaints/${id}/resolve`, data);
  },
  
  delete: (id: number) => {
    const client = createApiClient();
    return client.delete(`/complaints/${id}`);
  },
};

// Rating Service
export const ratingService = {
  submitRating: (tripId: number, data: Partial<any>) => {
    const client = createApiClient();
    return client.post(`/trips/${tripId}/ratings`, data);
  },

  getTripRatings: (tripId: number) => {
    const client = createApiClient();
    return client.get(`/trips/${tripId}/ratings`);
  },

  getDriverRatings: (driverId: number) => {
    const client = createApiClient();
    return client.get(`/drivers/${driverId}/ratings`);
  },

  getUserRatings: (userId: number) => {
    const client = createApiClient();
    return client.get(`/users/${userId}/ratings`);
  },

  canRate: (tripId: number) => {
    const client = createApiClient();
    return client.get(`/trips/${tripId}/can-rate`);
  },
};

// Notification Service (Admin only)
export const notificationService = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    target_type?: string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, any> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.target_type) queryParams.target_type = params.target_type;
    
    return client.get('/admin/notifications', { params: queryParams });
  },
  
  getById: (id: number) => {
    const client = createApiClient();
    return client.get(`/admin/notifications/${id}`);
  },
  
  send: (data: {
    title: string;
    body: string;
    target_type: "user" | "driver" | "all_users" | "all_drivers";
    user_id?: number;
    driver_id?: number;
  }) => {
    const client = createApiClient();
    return client.post('/admin/notifications/send', data);
  },
  
  test: (data: {
    title: string;
    body: string;
    target_type: "user" | "driver" | "all_users" | "all_drivers";
    user_id?: number;
    driver_id?: number;
  }) => {
    const client = createApiClient();
    return client.post('/admin/notifications/test', data);
  },
};

// Statistics Service (Admin only)
export const statisticsService = {
  getStatistics: () => {
    const client = createApiClient();
    return client.get('/admin/statistics');
  },
};

// Company Profits Service (Admin only)
export const companyProfitsService = {
  getProfits: (params?: {
    period?: string; // 'today' | 'yesterday' | 'this_week' | 'this_month' | 'this_year'
    start_date?: string;
    end_date?: string;
  }) => {
    const client = createApiClient();
    return client.get('/admin/company-profits', { params });
  },
  
  getTemporalDistribution: () => {
    const client = createApiClient();
    return client.get('/admin/company-profits/temporal-distribution');
  },
  
  getByPaymentMethod: (params?: {
    period?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    const client = createApiClient();
    return client.get('/admin/company-profits/by-payment-method', { params });
  },
  
  getByCity: (params?: {
    period?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    const client = createApiClient();
    return client.get('/admin/company-profits/by-city', { params });
  },
  
  getTopDrivers: (params?: {
    limit?: number;
    period?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    const client = createApiClient();
    return client.get('/admin/company-profits/top-drivers', { params });
  },
  
  getGrowthIndicators: (params?: {
    period?: string;
  }) => {
    const client = createApiClient();
    return client.get('/admin/company-profits/growth-indicators', { params });
  },
  
  getMonthlyTrend: (params?: {
    months?: number;
  }) => {
    const client = createApiClient();
    return client.get('/admin/company-profits/monthly-trend', { params });
  },
  
  getDailyTrend: (params?: {
    days?: number;
  }) => {
    const client = createApiClient();
    return client.get('/admin/company-profits/daily-trend', { params });
  },
};

// Settings Service (Admin only)
export const settingsService = {
  getAll: () => {
    const client = createApiClient();
    return client.get('/admin/settings');
  },
  
  getByKey: (key: string) => {
    const client = createApiClient();
    return client.get(`/admin/settings/${key}`);
  },
  
  getPlatformFeePercentage: () => {
    const client = createApiClient();
    return client.get('/admin/settings/platform-fee-percentage');
  },
  
  updatePlatformFeePercentage: (platformFeePercentage: number) => {
    const client = createApiClient();
    return client.put('/admin/settings/platform-fee-percentage', {
      platform_fee_percentage: platformFeePercentage,
    });
  },
  
  getMaxDriverDebtLimit: () => {
    const client = createApiClient();
    return client.get('/admin/settings/max-driver-debt-limit');
  },
  
  updateMaxDriverDebtLimit: (maxDriverDebtLimit: number) => {
    const client = createApiClient();
    return client.put('/admin/settings/max-driver-debt-limit', {
      max_driver_debt_limit: maxDriverDebtLimit,
    });
  },
};

// Roles Service (Admin only)
export const rolesService = {
  getAll: (params?: {
    page?: number;
    per_page?: number;
    is_active?: boolean | string;
    search?: string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, any> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.per_page) queryParams.per_page = params.per_page;
    if (params?.is_active !== undefined) queryParams.is_active = params.is_active;
    if (params?.search) queryParams.search = params.search;
    
    return client.get('/admin/roles', { params: queryParams });
  },
  
  getById: (id: number | string) => {
    const client = createApiClient();
    return client.get(`/admin/roles/${id}`);
  },
  
  create: (data: {
    name: string;
    slug?: string;
    description?: string;
    is_active?: boolean;
    permission_ids?: number[];
  }) => {
    const client = createApiClient();
    return client.post('/admin/roles', data);
  },
  
  update: (id: number | string, data: {
    name?: string;
    slug?: string;
    description?: string;
    is_active?: boolean;
  }) => {
    const client = createApiClient();
    return client.put(`/admin/roles/${id}`, data);
  },
  
  delete: (id: number | string) => {
    const client = createApiClient();
    return client.delete(`/admin/roles/${id}`);
  },
  
  getPermissions: (id: number | string) => {
    const client = createApiClient();
    return client.get(`/admin/roles/${id}/permissions`);
  },
  
  assignPermissions: (id: number | string, permissionIds: number[]) => {
    const client = createApiClient();
    return client.post(`/admin/roles/${id}/permissions`, {
      permission_ids: permissionIds,
    });
  },
  
  getUsers: (id: number | string, params?: {
    page?: number;
    per_page?: number;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, any> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.per_page) queryParams.per_page = params.per_page;
    
    return client.get(`/admin/roles/${id}/users`, { params: queryParams });
  },
};

// Permissions Service (Admin only)
export const permissionsService = {
  getAll: (params?: {
    page?: number;
    per_page?: number;
    group?: string;
    search?: string;
    group_by?: boolean | string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, any> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.per_page) queryParams.per_page = params.per_page;
    if (params?.group) queryParams.group = params.group;
    if (params?.search) queryParams.search = params.search;
    if (params?.group_by !== undefined) queryParams.group_by = params.group_by;
    
    return client.get('/admin/permissions', { params: queryParams });
  },
  
  getById: (id: number | string) => {
    const client = createApiClient();
    return client.get(`/admin/permissions/${id}`);
  },
  
  create: (data: {
    name: string;
    slug?: string;
    group?: string;
    description?: string;
  }) => {
    const client = createApiClient();
    return client.post('/admin/permissions', data);
  },
  
  update: (id: number | string, data: {
    name?: string;
    slug?: string;
    group?: string;
    description?: string;
  }) => {
    const client = createApiClient();
    return client.put(`/admin/permissions/${id}`, data);
  },
  
  delete: (id: number | string) => {
    const client = createApiClient();
    return client.delete(`/admin/permissions/${id}`);
  },
  
  getRoles: (id: number | string) => {
    const client = createApiClient();
    return client.get(`/admin/permissions/${id}/roles`);
  },
  
  getGroups: () => {
    const client = createApiClient();
    return client.get('/admin/permissions/groups/list');
  },
};

// User Roles Service (Admin only)
export const userRolesService = {
  getUserRoles: (userId: number) => {
    const client = createApiClient();
    return client.get(`/admin/users/${userId}/roles`);
  },
  
  getUserPermissions: (userId: number, params?: {
    group?: string;
    group_by?: boolean | string;
  }) => {
    const client = createApiClient();
    const queryParams: Record<string, any> = {};
    
    if (params?.group) queryParams.group = params.group;
    if (params?.group_by !== undefined) queryParams.group_by = params.group_by;
    
    return client.get(`/admin/users/${userId}/roles/permissions`, { params: queryParams });
  },
  
  assignRole: (userId: number, roleId: number) => {
    const client = createApiClient();
    return client.post(`/admin/users/${userId}/roles`, {
      role_id: roleId,
    });
  },
  
  syncRoles: (userId: number, roleIds: number[]) => {
    const client = createApiClient();
    return client.put(`/admin/users/${userId}/roles`, {
      role_ids: roleIds,
    });
  },
  
  removeRole: (userId: number, roleId: number | string) => {
    const client = createApiClient();
    return client.delete(`/admin/users/${userId}/roles/${roleId}`);
  },
  
  checkRole: (userId: number, roleSlug: string) => {
    const client = createApiClient();
    return client.get(`/admin/users/${userId}/roles/check-role/${roleSlug}`);
  },
  
  checkPermission: (userId: number, permissionSlug: string) => {
    const client = createApiClient();
    return client.get(`/admin/users/${userId}/permissions/check/${permissionSlug}`);
  },
};

