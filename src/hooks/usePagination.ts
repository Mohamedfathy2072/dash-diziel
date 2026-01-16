import { useState, type ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import type { PrimaryPaginationEntities } from '../types/components';
import useQueries from './useQueries';
import { getUsers } from '../store/usersSlice';
import { getDrivers } from '../store/driversSlice';
import { fetchVehicles } from '../store/vehiclesSlice';
import { fetchTrips } from '../store/tripsSlice';
import { fetchVehicleTypes } from '../store/vehicleTypesSlice';
import { fetchCoupons } from '../store/couponsSlice';

/**
 * Entity action map for pagination
 */
const entityActions: Record<PrimaryPaginationEntities, (queries: { [key: string]: string | number }) => any> = {
    users: getUsers,
    drivers: getDrivers,
    vehicles: fetchVehicles,
    trips: fetchTrips,
    vehicleTypes: fetchVehicleTypes,
    coupons: fetchCoupons,
};

const usePagination = (variant: PrimaryPaginationEntities) => {
    const dispatch = useDispatch<AppDispatch>();
    const { handleGetQueries, handleSetQueries } = useQueries();
    const queries = handleGetQueries();
    const limit = (+queries['limit'] || 10);
    const currentPage = (+queries['page'] || 1);
    const [page, setPage] = useState(currentPage);

    const handleGetData = (allQueries: { [key: string]: string | number }) => {
        const action = entityActions[variant];
        return action ? action(allQueries) : undefined;
    };

    const handleChange = async (_: ChangeEvent<unknown>, value: number) => {
        const allQueries = { ...queries, page: value };
        const action = handleGetData(allQueries);
        if (action) {
            await dispatch(action as any).then(() => {
                handleSetQueries({ page: value.toString() });
                setPage(value);
            });
        }
    };

    return { handleChange, page, limit };
};

export default usePagination;
