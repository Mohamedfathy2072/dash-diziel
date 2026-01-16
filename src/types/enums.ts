// Enum types matching backend PHP enums

// Driver Enums
export type DriverStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export type DriverAvailabilityStatus = 'available' | 'busy' | 'offline';

export type DriverBackgroundCheckStatus = 'pending' | 'passed' | 'failed';

export type DriverDrugTestStatus = 'pending' | 'passed' | 'failed';

// Document Enums
export type DocumentType = 
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

export type DocumentCategory = 
  | 'identity'
  | 'license'
  | 'vehicle'
  | 'insurance'
  | 'financial'
  | 'legal'
  | 'medical'
  | 'photo'
  | 'other';

export type DocumentVerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'expired';

// User Enums
export type UserType = 'user' | 'driver' | 'superAdmin';

// Vehicle Enums
export type VehicleStatus = 'active' | 'inactive' | 'maintenance' | 'suspended';
export type VehicleVerificationStatus = 'pending' | 'verified' | 'rejected';

// Trip Enums
export type TripStatus = 'pending' | 'accepted' | 'started' | 'completed' | 'cancelled';

// Enum value arrays for iteration
export const DRIVER_STATUSES: DriverStatus[] = ['pending', 'verified', 'rejected', 'suspended'];
export const DRIVER_AVAILABILITY_STATUSES: DriverAvailabilityStatus[] = ['available', 'busy', 'offline'];
export const DRIVER_BACKGROUND_CHECK_STATUSES: DriverBackgroundCheckStatus[] = ['pending', 'passed', 'failed'];
export const DRIVER_DRUG_TEST_STATUSES: DriverDrugTestStatus[] = ['pending', 'passed', 'failed'];
export const DOCUMENT_TYPES: DocumentType[] = [
  'drivers_license',
  'vehicle_registration',
  'insurance_certificate',
  'background_check',
  'drug_test',
  'vehicle_inspection',
  'profile_photo',
  'vehicle_photo',
  'bank_statement',
  'tax_document',
  'identity_proof',
  'address_proof',
  'medical_certificate',
  'commercial_license',
  'vehicle_permit',
  'other',
];
export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'identity',
  'license',
  'vehicle',
  'insurance',
  'financial',
  'legal',
  'medical',
  'photo',
  'other',
];
export const DOCUMENT_VERIFICATION_STATUSES: DocumentVerificationStatus[] = [
  'pending',
  'under_review',
  'verified',
  'rejected',
  'expired',
];
export const VEHICLE_STATUSES: VehicleStatus[] = ['active', 'inactive', 'maintenance', 'suspended'];
export const VEHICLE_VERIFICATION_STATUSES: VehicleVerificationStatus[] = ['pending', 'verified', 'rejected'];
export const TRIP_STATUSES: TripStatus[] = ['pending', 'accepted', 'started', 'completed', 'cancelled'];

