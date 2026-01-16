/**
 * User utility functions
 */

/**
 * Get color classes for user type badge
 * @param type - User type (user, driver, superAdmin)
 * @returns Tailwind CSS classes for the badge
 */
export const getUserTypeColor = (type: string): string => {
  switch (type) {
    case 'superAdmin':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'driver':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'user':
      return 'bg-[#FFA500]/10 text-[#FFA500] border-[#FFA500]/20';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

/**
 * Get localized label for user type
 * @param type - User type
 * @returns Localized label
 */
export const getUserTypeLabel = (type: string | null | undefined): string => {
  if (!type) return "";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

