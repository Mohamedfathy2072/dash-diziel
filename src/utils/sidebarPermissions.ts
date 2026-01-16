// Permission mapping for sidebar items
// Each sidebar item key maps to the required permission slug(s)
export const sidebarPermissionMap: Record<string, string | string[] | null> = {
  dashboard: null, // Always visible
  companyProfits: 'company-profits.view',
  users: 'users.view',
  drivers: 'drivers.view',
  vehicles: 'vehicles.view',
  trips: 'trips.view',
  vehicleTypes: 'vehicle-types.view',
  coupons: 'coupons.view',
  ads: 'ads.view',
  complaints: 'complaints.view',
  notifications: 'notifications.view',
  settings: 'settings.view',
  roles: 'roles.view',
  permissions: 'permissions.view',
  profile: null, // Always visible
};
