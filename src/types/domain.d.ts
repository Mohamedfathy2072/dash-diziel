// Domain types for Diziel ride-sharing application

import type {
  UserType,
  DriverStatus,
  DriverVerificationStatus,
  DriverAvailabilityStatus,
  DriverBackgroundCheckStatus,
  DriverDrugTestStatus,
  DocumentType,
  DocumentCategory,
  DocumentVerificationStatus,
} from './enums';

export interface User {
  id: number;
  name: string;
  email: string;
  type: UserType;
  phone: string | null;
  photo_url: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  date_of_birth: string | null;
  postal_code: string | null;
  country: string | null;
  rating: number | null;
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

// Re-export enum types for backward compatibility
export type { DriverStatus, DocumentVerificationStatus as DocumentStatus, DocumentCategory, DocumentType } from './enums';

export type DocumentTypeOld = 
  | 'drivers_license' 
  | 'vehicle_registration'
  | 'insurance_certificate'
  | 'background_check'
  | 'drug_test'
  | 'vehicle_inspection'
  | 'profile_photo'
  | 'vehicle_photo'
  | 'bank_statement'
  | 'tax_document'
  | 'identity_proof'
  | 'address_proof'
  | 'medical_certificate'
  | 'commercial_license'
  | 'vehicle_permit'
  | 'other';

export interface Driver {
  id: number;
  user_id: number;
  // User fields (from user relationship)
  name?: string;
  email?: string;
  email_verified_at?: string | null;
  phone?: string | null;
  photo_url?: string | null;
  address?: string | null;
  governorate_id?: number | null;
  driver_type?: string | null;
  license_degree?: string | null;
  national_id?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  address?: string;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  // Emergency Contact
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  // Status & Availability
  status: DriverStatus;
  availability_status?: DriverAvailabilityStatus;
  verified_at?: string | null;
  verified_by?: number | null;
  verifier?: {
    id: number;
    name: string;
    email: string;
  } | null;
  verification_notes?: string | null;
  // License Information
  license_number: string;
  license_class?: string | null;
  license_type?: string | null;
  license_issue_date: string | null;
  license_expiry_date: string;
  license_issuing_state?: string | null;
  license_issuing_country?: string | null;
  // Statistics
  rating: number | string | null;
  total_rides?: number;
  completed_rides?: number;
  cancelled_rides?: number;
  total_earnings?: number | string | null;
  // Location
  current_lat?: number | string | null;
  current_lng?: number | string | null;
  current_address?: string | null;
  location_updated_at?: string | null;
  // Timestamps
  joined_at?: string | null;
  last_active_at?: string | null;
  // Background Check
  background_check_status: DriverBackgroundCheckStatus | null;
  background_check_date: string | null;
  // Drug Test
  drug_test_status?: DriverDrugTestStatus | null;
  drug_test_date?: string | null;
  // Insurance
  insurance_provider?: string | null;
  insurance_policy_number?: string | null;
  insurance_expiry_date?: string | null;
  // Bank Account
  bank_name?: string | null;
  bank_account_holder?: string | null;
  bank_account_number_encrypted?: string | null;
  bank_routing_number?: string | null;
  // Timestamps
  created_at: string;
  updated_at: string;
  // Relationships
  documents?: DriverDocument[];
  vehicles?: Vehicle[];
  // Legacy/computed fields (for backward compatibility)
  is_available?: boolean; // Computed from availability_status
  is_verified?: boolean; // Computed from status === 'verified'
  license_state?: string | null; // Alias for license_issuing_state
  // Verification helper
  has_all_documents_verified?: boolean; // Indicates if all documents are verified
}

export interface DriverDocument {
  id: number;
  driver_id: number;
  // Type & Category
  type: DocumentType;
  category: DocumentCategory;
  // File info
  name?: string;
  path: string;
  disk?: string;
  original_name?: string;
  size?: number;
  mime_type: string;
  // Document details
  document_number?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  issuing_authority?: string | null;
  // Verification
  verification_status: DocumentVerificationStatus;
  verified_at: string | null;
  verified_by: number | null;
  verifier?: {
    id: number;
    name: string;
    email: string;
  } | null;
  rejection_reason?: string | null;
  // Flags
  is_required?: boolean;
  is_sensitive?: boolean;
  // Metadata
  metadata?: Record<string, any> | null;
  // URLs
  download_url?: string | null;
  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  // File path for image previews (relative path, e.g., "drivers/documents/xxx.pdf")
  file_path?: string | null;
  // Legacy fields (for backward compatibility)
  file_name?: string; // Alias for original_name or name
  file_size?: number; // Alias for size
  status?: DocumentVerificationStatus; // Alias for verification_status
  notes?: string | null; // Alias for rejection_reason or metadata
}

import type { VehicleStatus, VehicleVerificationStatus, VehicleType } from './enums';

// Vehicle Type interface matching backend VehicleType model
export interface VehicleType {
  id: number;
  name: string;
  name_ar: string;
  status: 'active' | 'inactive';
  order: number | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleHead {
  id: number;
  license_plate: string;
  chassis_number: string;
  engine_number?: string | null;
  number_of_axles: number;
  max_load: string;
  length: string;
  photos?: {
    license_front?: string;
    license_back?: string;
    four_sides?: string[];
  } | null;
}

export interface VehicleTrailer {
  id: number;
  license_plate: string;
  chassis_number: string;
  engine_number?: string | null;
  number_of_axles: number;
  max_load: string;
  length: string;
  model: string;
  year: number;
  photos?: {
    license_front?: string;
    license_back?: string;
  } | null;
}

export interface Vehicle {
  id: number;
  driver_id: number;
  driver?: {
    id: number;
    name: string | null;
    email: string | null;
  };
  make: string;
  model: string;
  year: number;
  color: string;
  vehicle_type: "composite" | "regular";
  part_type: "composite" | "regular";
  display_name: string;
  
  // للمركبات المركبة
  head?: VehicleHead;
  trailer?: VehicleTrailer;
  total_axles?: number;
  total_max_load?: number;
  total_length?: number;
  
  // للمركبات العادية
  license_plate?: string;
  vin?: string;
  chassis_number?: string;
  engine_number?: string;
  number_of_axles?: number;
  max_load?: string;
  length?: string;
  
  // للتوافق مع المقطورات القديمة
  trailers?: VehicleTrailer[];
  
  // معلومات عامة
  fuel_type?: string | null;
  transmission?: string | null;
  doors?: number | null;
  seats?: number | null;
  status: VehicleStatus;
  verification_status: VehicleVerificationStatus;
  is_primary: boolean;
  
  // معلومات إضافية
  verification_date?: string | null;
  verified_by?: number | null;
  verifier?: {
    id: number;
    name: string;
    email: string;
  } | null;
  verification_notes?: string | null;
  
  // التسجيل والتأمين
  registration_number?: string | null;
  registration_expiry?: string | null;
  registration_state?: string | null;
  insurance_provider?: string | null;
  insurance_policy_number?: string | null;
  insurance_expiry?: string | null;
  
  // الفحص والصيانة
  inspection_date?: string | null;
  inspection_expiry?: string | null;
  inspection_certificate?: string | null;
  mileage?: number | null;
  condition_rating?: number | null;
  last_maintenance_date?: string | null;
  next_maintenance_due?: string | null;
  
  // صور المركبة (للمركبات العادية)
  photos?: {
    license_front?: string;
    license_back?: string;
    four_sides?: string[];
  } | null;
  
  features?: string[] | null;
  notes?: string | null;
  
  // معلومات النظام
  created_by?: number | null;
  creator?: {
    id: number;
    name: string;
    email: string;
  } | null;
  updated_by?: number | null;
  updater?: {
    id: number;
    name: string;
    email: string;
  } | null;
  
  vehicle_type_id?: number;
  vehicle_type_obj?: VehicleType;
  
  created_at: string;
  updated_at: string;
}

export type TripStatus = 
  | 'pending' 
  | 'accepted' 
  | 'started' 
  | 'completed' 
  | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'wallet';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Trip {
  id: number;
  trip_title: string | null;
  user_id: number;
  status: TripStatus;
  pickup_address: string;
  pickup_lat: number | null;
  pickup_lng: number | null;
  pickup_date: string | null;
  destination_address: string;
  destination_lat: number | null;
  destination_lng: number | null;
  destination_date: string | null;
  vehicle_type_id: number;
  vehicle_type?: VehicleType | number; // Can be object (when relationship loaded) or ID (when not loaded)
  base_price: number;
  scheduled_at: string | null;
  description: string | null;
  notes: string | null;
  weight: string | null;
  material: string | null;
  accepted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancelled_by: number | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  accepted_driver?: {
    id: number;
    user?: User;
  } | null;
  accepted_vehicle?: {
    id: number;
    make: string;
    model: string;
    year?: number | null;
    color?: string | null;
    license_plate?: string | null;
    vehicle_type_id: number;
    vehicle_type?: VehicleType | number;
  } | null;
  offers?: TripOffer[];
  ratings?: TripRating[];
}

export type TripOfferStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';

export type ComplaintStatus = 'pending' | 'resolved';

export interface TripRating {
  id: number;
  trip_id: number;
  trip?: Trip;
  rated_by_user_id: number;
  rated_by?: User;
  rated_driver_id: number | null;
  rated_driver?: Driver | null;
  rated_user_id: number | null;
  rated_user?: User | null;
  overall_rating: number;
  punctuality_rating: number | null;
  service_rating: number | null;
  cleanliness_rating: number | null;
  communication_rating: number | null;
  safety_rating: number | null;
  courtesy_rating: number | null;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: number;
  user_id: number;
  subject: string;
  description: string;
  status: ComplaintStatus;
  complaintable_type: 'Trip' | 'Driver' | 'User' | null;
  complaintable_id: number | null;
  resolved_at: string | null;
  resolved_by: number | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  resolver?: User;
  complaintable?: Trip | Driver | User | null;
}

export interface TripOffer {
  id: number;
  trip_id: number;
  driver_id: number;
  vehicle_id: number;
  offered_price: number;
  notes: string | null;
  status: TripOfferStatus;
  accepted_at: string | null;
  rejected_at: string | null;
  created_at: string;
  updated_at: string;
  trip?: Trip;
  driver?: {
    id: number;
    user?: User;
    rating?: number | string | null;
    total_rides?: number;
  };
  vehicle?: {
    id: number;
    make: string;
    model: string;
    year?: number;
    vehicle_type_id: number;
    vehicle_type?: VehicleType | number;
    color?: string | null;
    license_plate?: string;
  };
}

// Pagination types - matches Laravel's LengthAwarePaginator structure
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  limit: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Statistics types for dashboard
export interface DashboardStats {
  total_users: number;
  total_drivers: number;
  total_vehicles: number;
  total_trips: number;
  active_trips: number;
  completed_trips: number;
  cancelled_trips: number;
  pending_driver_verifications: number;
  pending_vehicle_verifications: number;
  total_revenue: number;
}

export interface TripStatistics {
  date: string;
  total_trips: number;
  completed_trips: number;
  cancelled_trips: number;
  total_revenue: number;
}

export interface CouponUsage {
  id: number;
  user_id: number;
  coupon_id: number;
  trip_id: number;
  transaction_id: number;
  discount_amount: string;
  used_at: string;
  created_at: string;
  updated_at: string;
  user?: User;
  trip?: Trip;
}

export interface CouponUsageStats {
  total_usages: number;
  usage_limit: number;
  remaining_usages: number;
  unique_users: number;
  recent_usages?: CouponUsage[];
  // Legacy fields for backward compatibility
  total_uses?: number;
  total_discount_amount?: number;
  average_discount_per_use?: number;
}

export interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  min_order_amount: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  user_limit: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  applicable_to: 'all' | 'specific_vehicle_types';
  description: string | null;
  created_at: string;
  updated_at: string;
  vehicle_types?: VehicleType[];
  usage_stats?: CouponUsageStats;
}

export interface Ad {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  link: string | null;
  image_url: string | null;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  order: number;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  target_type: "user" | "driver" | "all_users" | "all_drivers";
  user_id: number | null;
  driver_id: number | null;
  sent_count: number;
  total_count: number;
  created_at: string;
  updated_at: string;
  user?: User | null;
  driver?: Driver | null;
}

export interface Permission {
  id: number;
  name: string;
  slug: string;
  group: string | null;
  description: string | null;
  roles_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  permissions_count?: number;
  users_count?: number;
  permissions?: Permission[];
  created_at: string;
  updated_at: string;
}

