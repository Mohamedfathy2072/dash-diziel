import { useSelector, shallowEqual } from "react-redux";
import { useMemo } from "react";
import { useFormsStore } from "../globals/formsStore";
import logger from "../utils/logger";
import type { RootState } from "../store/store";
import type { EntityTypes } from "../types/app";
import type { FilterValuesTypes } from "../types/forms";
import useQueries from "./useQueries";

/**
 * Entity configuration for filters
 */
interface EntityConfig {
    defaultLimit: number;
    limitKey: string;
    setLimitKey: string;
    selector: (state: RootState) => { totalCount: number; totalPages: number };
}

const entityConfig: Record<EntityTypes, EntityConfig> = {
    users: {
        defaultLimit: 10,
        limitKey: 'usersLimit',
        setLimitKey: 'setUsersLimit',
        selector: (state) => ({ totalCount: state.users.totalCount, totalPages: state.users.totalPages }),
    },
    drivers: {
        defaultLimit: 10,
        limitKey: 'driversLimit',
        setLimitKey: 'setDriversLimit',
        selector: (state) => ({ totalCount: state.drivers.totalCount, totalPages: state.drivers.totalPages }),
    },
    vehicles: {
        defaultLimit: 10,
        limitKey: 'vehiclesLimit',
        setLimitKey: 'setVehiclesLimit',
        selector: (state) => ({ totalCount: state.vehicles.totalCount, totalPages: state.vehicles.totalPages }),
    },
    trips: {
        defaultLimit: 10,
        limitKey: 'tripsLimit',
        setLimitKey: 'setTripsLimit',
        selector: (state) => ({ totalCount: state.trips.totalCount, totalPages: state.trips.totalPages }),
    },
    vehicleTypes: {
        defaultLimit: 10,
        limitKey: 'usersLimit', // Fallback, can be extended
        setLimitKey: 'setUsersLimit',
        selector: (state) => ({ totalCount: state.vehicleTypes.totalCount, totalPages: state.vehicleTypes.totalPages }),
    },
    coupons: {
        defaultLimit: 10,
        limitKey: 'usersLimit', // Fallback, can be extended
        setLimitKey: 'setUsersLimit',
        selector: (state) => ({ totalCount: state.coupons.totalCount, totalPages: state.coupons.totalPages }),
    },
    ads: {
        defaultLimit: 10,
        limitKey: 'usersLimit', // Fallback, can be extended
        setLimitKey: 'setUsersLimit',
        selector: (state) => ({ totalCount: state.ads.totalCount, totalPages: state.ads.totalPages }),
    },
    complaints: {
        defaultLimit: 10,
        limitKey: 'complaintsLimit',
        setLimitKey: 'setComplaintsLimit',
        selector: (state) => ({ totalCount: state.complaints.totalCount, totalPages: state.complaints.totalPages }),
    },
    notifications: {
        defaultLimit: 10,
        limitKey: 'notificationsLimit',
        setLimitKey: 'setNotificationsLimit',
        selector: (state) => ({ totalCount: state.notifications.totalCount, totalPages: state.notifications.totalPages }),
    },
    permissions: {
        defaultLimit: 10,
        limitKey: 'usersLimit',
        setLimitKey: 'setUsersLimit',
        selector: (state) => ({ totalCount: state.permissions.totalCount, totalPages: state.permissions.totalPages }),
    },
    roles: {
        defaultLimit: 10,
        limitKey: 'usersLimit',
        setLimitKey: 'setUsersLimit',
        selector: (state) => ({ totalCount: state.roles.totalCount, totalPages: state.roles.totalPages }),
    },
};

const useFilters = () => {
    const { handleResetQueries, handleGetQueries, handleSetQueries } = useQueries();
    const formsStore = useFormsStore();
    const setLimit = useFormsStore((state) => state.setLimit);
    const queries = handleGetQueries();

    // Get entity data using selectors with shallowEqual to prevent unnecessary re-renders
    const usersData = useSelector(entityConfig.users.selector, shallowEqual);
    const driversData = useSelector(entityConfig.drivers.selector, shallowEqual);
    const vehiclesData = useSelector(entityConfig.vehicles.selector, shallowEqual);
    const tripsData = useSelector(entityConfig.trips.selector, shallowEqual);
    const vehicleTypesData = useSelector(entityConfig.vehicleTypes.selector, shallowEqual);
    const couponsData = useSelector(entityConfig.coupons.selector, shallowEqual);
    const adsData = useSelector(entityConfig.ads.selector, shallowEqual);
    const complaintsData = useSelector(entityConfig.complaints.selector, shallowEqual);
    const notificationsData = useSelector(entityConfig.notifications.selector, shallowEqual);
    const permissionsData = useSelector(entityConfig.permissions.selector, shallowEqual);
    const rolesData = useSelector(entityConfig.roles.selector, shallowEqual);

    // Memoize entityData to prevent creating new object reference on every render
    const entityData: Record<EntityTypes, { totalCount: number; totalPages: number }> = useMemo(() => ({
        users: usersData,
        drivers: driversData,
        vehicles: vehiclesData,
        trips: tripsData,
        vehicleTypes: vehicleTypesData,
        coupons: couponsData,
        ads: adsData,
        complaints: complaintsData,
        notifications: notificationsData,
        permissions: permissionsData,
        roles: rolesData,
    }), [usersData, driversData, vehiclesData, tripsData, vehicleTypesData, couponsData, adsData, complaintsData, notificationsData]);

    const hasAtLeastOneFilter = (values: Record<string, any>) => {
        return Object.values(values).some((val) =>
            val !== undefined && val !== null && val !== "" && val !== "All"
        );
    };

    const cleanFilterValues = (values: Record<string, any>): Record<string, any> => {
        const cleaned: Record<string, any> = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "" && value !== "All") {
                cleaned[key] = value;
            }
        });
        return cleaned;
    };

    const handleResetFilter = (variant: EntityTypes) => {
        const config = entityConfig[variant];
        if (config) {
            const setLimitFn = formsStore[config.setLimitKey as keyof typeof formsStore] as ((value: number) => void) | undefined;
            if (setLimitFn) {
                setLimitFn(config.defaultLimit);
            }
            handleResetQueries();
            handleSetQueries({ page: 1, limit: config.defaultLimit });
        } else {
            handleResetQueries();
        }
    };

    const handleFilter = async (variant: EntityTypes, values: FilterValuesTypes) => {
        try {
            if (!hasAtLeastOneFilter(values) && (Object.keys(queries).length === 2 && queries["limit"] && queries["page"])) return;
            
            const config = entityConfig[variant];
            if (!config) return;
            
            const limit = (formsStore[config.limitKey as keyof typeof formsStore] as number) || config.defaultLimit;
            const baseQuery = { page: 1, limit };
            const cleanedValues = cleanFilterValues(values);
            const allQueries = { ...baseQuery, limit, ...cleanedValues };
            
            // Update URL - Section will handle the API call via useEffect
            handleSetQueries({ ...allQueries });
        } catch (error) {
            logger.error("Error in handleFilter", error);
        }
    };

    const handleFilterLimits = async (variant: EntityTypes, limit: number) => {
        try {
            const config = entityConfig[variant];
            if (!config) return;
            
            const { totalCount, totalPages } = entityData[variant];
            let page = parseInt(queries["page"] || "1");
            
            // Use backend's totalPages if available, otherwise calculate
            const calculatedTotalPages = totalPages || Math.ceil((totalCount || 0) / limit);
            
            if (calculatedTotalPages > 0 && page > calculatedTotalPages) {
                page = calculatedTotalPages;
            }
            
            // Update URL - Section will handle the API call via useEffect
            handleSetQueries({ page: page || 1, limit });
            setLimit(`${variant}Limit`, limit);
        } catch (error) {
            logger.error("Error in handleFilterLimits", error);
        }
    };

    return { handleResetFilter, handleFilter, handleFilterLimits }
}

export default useFilters;