import type { VehicleType } from "../types/domain";

/**
 * Safely extract vehicle type name from object or ID
 * @param vehicleType - Can be VehicleType object, number ID, or string
 * @param vehicleTypesCache - Array of vehicle types to lookup from
 * @param useArabic - Whether to return Arabic name (default: false)
 * @returns Vehicle type name or 'Unknown' if not found
 */
export function getVehicleTypeName(
  vehicleType: VehicleType | number | string | undefined | null,
  vehicleTypesCache: VehicleType[] = [],
  useArabic = false
): string {
  if (!vehicleType) {
    return "-";
  }

  // If it's already an object with name property
  if (typeof vehicleType === "object" && "name" in vehicleType) {
    return useArabic ? vehicleType.name_ar : vehicleType.name;
  }

  // If it's a number or string ID, lookup from cache
  const id = typeof vehicleType === "string" ? parseInt(vehicleType, 10) : vehicleType;
  if (!isNaN(id)) {
    const found = vehicleTypesCache.find((vt) => vt.id === id);
    if (found) {
      return useArabic ? found.name_ar : found.name;
    }
  }

  return "Unknown";
}

/**
 * Get vehicle type by ID from cache
 * @param id - Vehicle type ID
 * @param vehicleTypesCache - Array of vehicle types to lookup from
 * @returns VehicleType object or null if not found
 */
export function getVehicleTypeById(
  id: number | string | null | undefined,
  vehicleTypesCache: VehicleType[] = []
): VehicleType | null {
  if (id === null || id === undefined) {
    return null;
  }

  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  if (isNaN(numericId)) {
    return null;
  }

  return vehicleTypesCache.find((vt) => vt.id === numericId) || null;
}

/**
 * Check if vehicle type is an object (relationship loaded) or just an ID
 * @param vehicleType - Vehicle type value to check
 * @returns true if it's an object, false if it's a number/string ID
 */
export function isVehicleTypeObject(
  vehicleType: VehicleType | number | string | undefined | null
): vehicleType is VehicleType {
  return typeof vehicleType === "object" && vehicleType !== null && "name" in vehicleType;
}

