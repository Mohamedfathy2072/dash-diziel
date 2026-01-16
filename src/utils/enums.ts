import type {
  DriverStatus,
  DriverAvailabilityStatus,
  DriverBackgroundCheckStatus,
  DriverDrugTestStatus,
  DocumentType,
  DocumentCategory,
  DocumentVerificationStatus,
  VehicleStatus,
  VehicleVerificationStatus,
} from '../types/enums';
import type { TripStatus, ComplaintStatus } from '../types/domain';

// Driver Status Labels
export const getDriverStatusLabel = (status: DriverStatus): string => {
  const labels: Record<DriverStatus, string> = {
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected',
    suspended: 'Suspended',
  };
  return labels[status] || status;
};

export const getDriverStatusColor = (status: DriverStatus): string => {
  const colors: Record<DriverStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    verified: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

// Driver Availability Status Labels
export const getDriverAvailabilityStatusLabel = (status: DriverAvailabilityStatus): string => {
  const labels: Record<DriverAvailabilityStatus, string> = {
    available: 'Available',
    busy: 'Busy',
    offline: 'Offline',
  };
  return labels[status] || status;
};

export const getDriverAvailabilityStatusColor = (status: DriverAvailabilityStatus): string => {
  const colors: Record<DriverAvailabilityStatus, string> = {
    available: 'bg-green-100 text-green-700 border-green-200',
    busy: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    offline: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

// Get color for availability status dot indicator
export const getDriverAvailabilityStatusDotColor = (status: DriverAvailabilityStatus | string | null | undefined): string => {
  if (!status) return 'bg-gray-400';
  const colors: Record<string, string> = {
    available: 'bg-green-500',
    busy: 'bg-yellow-500',
    offline: 'bg-gray-400',
  };
  return colors[status.toLowerCase()] || 'bg-gray-400';
};

// Driver Background Check Status Labels
export const getDriverBackgroundCheckStatusLabel = (status: DriverBackgroundCheckStatus): string => {
  const labels: Record<DriverBackgroundCheckStatus, string> = {
    pending: 'Pending',
    passed: 'Passed',
    failed: 'Failed',
  };
  return labels[status] || status;
};

export const getDriverBackgroundCheckStatusColor = (status: DriverBackgroundCheckStatus): string => {
  const colors: Record<DriverBackgroundCheckStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    passed: 'bg-green-100 text-green-700 border-green-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

// Driver Drug Test Status Labels
export const getDriverDrugTestStatusLabel = (status: DriverDrugTestStatus): string => {
  const labels: Record<DriverDrugTestStatus, string> = {
    pending: 'Pending',
    passed: 'Passed',
    failed: 'Failed',
  };
  return labels[status] || status;
};

export const getDriverDrugTestStatusColor = (status: DriverDrugTestStatus): string => {
  const colors: Record<DriverDrugTestStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    passed: 'bg-green-100 text-green-700 border-green-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

// Document Type Labels
export const getDocumentTypeLabel = ( type: DocumentType): string => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Document Category Labels
export const getDocumentCategoryLabel = (category: DocumentCategory): string => {
  const labels: Record<DocumentCategory, string> = {
    identity: 'Identity',
    license: 'License',
    vehicle: 'Vehicle',
    insurance: 'Insurance',
    financial: 'Financial',
    legal: 'Legal',
    medical: 'Medical',
    photo: 'Photo',
    other: 'Other',
  };
  return labels[category] || category;
};

// Document Verification Status Labels
export const getDocumentVerificationStatusLabel = (status: DocumentVerificationStatus): string => {
  const labels: Record<DocumentVerificationStatus, string> = {
    pending: 'Pending',
    under_review: 'Under Review',
    verified: 'Verified',
    rejected: 'Rejected',
    expired: 'Expired',
  };
  return labels[status] || status;
};

export const getDocumentVerificationStatusColor = (status: DocumentVerificationStatus): string => {
  const colors: Record<DocumentVerificationStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    under_review: 'bg-blue-100 text-blue-700 border-blue-200',
    verified: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    expired: 'bg-orange-100 text-orange-700 border-orange-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

// Vehicle Status Labels
export const getVehicleStatusLabel = (status: VehicleStatus): string => {
  const labels: Record<VehicleStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
    maintenance: 'Maintenance',
    suspended: 'Suspended',
  };
  return labels[status] || status;
};

export const getVehicleStatusColor = (status: VehicleStatus): string => {
  const colors: Record<VehicleStatus, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    maintenance: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

// Vehicle Verification Status Labels
export const getVehicleVerificationStatusLabel = (status: VehicleVerificationStatus): string => {
  const labels: Record<VehicleVerificationStatus, string> = {
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected',
  };
  return labels[status] || status;
};

export const getVehicleVerificationStatusColor = (status: VehicleVerificationStatus): string => {
  const colors: Record<VehicleVerificationStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    verified: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

// Trip Status Labels
export const getTripStatusLabel = (status: TripStatus | string): string => {
  const labels: Record<TripStatus, string> = {
    pending: 'Pending',
    accepted: 'Accepted',
    started: 'Started',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return labels[status as TripStatus] || status;
};

export const getTripStatusColor = (status: TripStatus | string): string => {
  const colors: Record<TripStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    accepted: 'bg-blue-100 text-blue-700 border-blue-200',
    started: 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };
  return colors[status as TripStatus] || 'bg-gray-100 text-gray-700 border-gray-200';
};

// Complaint Status Labels
export const getComplaintStatusLabel = (status: ComplaintStatus | string): string => {
  const labels: Record<ComplaintStatus, string> = {
    pending: 'Pending',
    resolved: 'Resolved',
  };
  return labels[status as ComplaintStatus] || status;
};

export const getComplaintStatusColor = (status: ComplaintStatus | string): string => {
  const colors: Record<ComplaintStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    resolved: 'bg-green-100 text-green-700 border-green-200',
  };
  return colors[status as ComplaintStatus] || 'bg-gray-100 text-gray-700 border-gray-200';
};

