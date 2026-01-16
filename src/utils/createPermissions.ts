// Permission mapping for create actions
// Maps route paths to required create permission slugs
export const createPermissionMap: Record<string, string> = {
  '/users/add': 'users.create',
  '/drivers/add': 'drivers.create',
  '/vehicles/add': 'vehicles.create',
  '/trips/add': 'trips.create',
  '/vehicle-types/add': 'vehicle-types.create',
  '/coupons/add': 'coupons.create',
  '/ads/add': 'ads.create',
  '/complaints/add': 'complaints.create',
  '/notifications/send': 'notifications.create',
  '/roles/add': 'roles.create',
  '/permissions/add': 'permissions.create',
};

// Helper function to get create permission from URL
export const getCreatePermission = (url: string): string | null => {
  // Try exact match first
  if (createPermissionMap[url]) {
    return createPermissionMap[url];
  }
  
  // Try matching by route pattern
  for (const [route, permission] of Object.entries(createPermissionMap)) {
    if (url.includes(route)) {
      return permission;
    }
  }
  
  return null;
};
