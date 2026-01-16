import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Paper from "@mui/material/Paper";
import { useEffect, useState, type ChangeEvent } from "react";
import { useSelector } from "react-redux";
import useQueries from "../hooks/useQueries";
import ChevronLeftIcon from "../icons/ChevronLeftIcon";
import ChevronRightIcon from "../icons/ChevronRightIcon";
import type { RootState } from "../store/store";
import type { EntityTypes } from "../types/app";

const PrimaryTablePagination = ({
  variant,
  count,
}: {
  variant?: EntityTypes;
  count: number;
}) => {
  const { handleSetQueries, handleGetQueries } = useQueries();
  const queries = handleGetQueries();
  const limit = +queries["limit"] || 10;

  // Get pagination metadata from Redux store
  const usersState = useSelector((state: RootState) =>
    variant === "users" ? state.users : null
  );
  const driversState = useSelector((state: RootState) =>
    variant === "drivers" ? state.drivers : null
  );
  const vehiclesState = useSelector((state: RootState) =>
    variant === "vehicles" ? state.vehicles : null
  );
  const tripsState = useSelector((state: RootState) =>
    variant === "trips" ? state.trips : null
  );
  const notificationsState = useSelector((state: RootState) =>
    variant === "notifications" ? state.notifications : null
  );

  // Use backend pagination data if available, otherwise calculate
  const state = variant === "users" ? usersState : variant === "drivers" ? driversState : variant === "vehicles" ? vehiclesState : variant === "trips" ? tripsState : variant === "notifications" ? notificationsState : null;
  const totalPages = state?.totalPages || Math.ceil(count / limit);
  const currentPageFromState = state?.currentPage;
  const [page, setPage] = useState(
    currentPageFromState || +(queries["page"] || 1)
  );

  const handleChange = (_: ChangeEvent<unknown>, value: number) => {
    // Only update URL query - UsersSection will handle the API call via useEffect
    // This prevents duplicate API calls
    handleSetQueries({ page: value.toString() });
    setPage(value);
  };

  useEffect(() => {
    if (
      (variant === "users" && usersState?.currentPage) ||
      (variant === "drivers" && driversState?.currentPage) ||
      (variant === "vehicles" && vehiclesState?.currentPage) ||
      (variant === "trips" && tripsState?.currentPage) ||
      (variant === "notifications" && notificationsState?.currentPage)
    ) {
      // Use backend pagination data if available
      setPage(state?.currentPage || 1);
    } else if (queries["page"] && parseInt(queries["page"])) {
      setPage(parseInt(queries["page"]));
    } else {
      setPage(1);
    }
  }, [queries, variant, usersState, driversState, vehiclesState, tripsState, notificationsState, state]);

  return (
    <Paper className={`paper !shadow-none !flex`}>
      <Pagination
        color="primary"
        count={totalPages}
        page={page}
        onChange={handleChange}
        renderItem={(item) => (
          <PaginationItem
            slots={{
              previous: ChevronLeftIcon,
              next: ChevronRightIcon,
            }}
            {...item}
          />
        )}
      />
    </Paper>
  );
};

export default PrimaryTablePagination;
