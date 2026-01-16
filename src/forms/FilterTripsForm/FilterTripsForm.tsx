import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomMenu from "../../components/CustomMenu/CustomMenu";
import FilterChips from "../../components/FilterChips/FilterChips";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { limits } from "../../constants";
import { useFormsStore } from "../../globals/formsStore";
import useFilters from "../../hooks/useFilters";
import useQueries from "../../hooks/useQueries";
import ArrowDownIcon from "../../icons/ArrowDownIcon";
import FilterIcon from "../../icons/FilterIcon";
import { BasicButton } from "../../mui/buttons/BasicButton";
import { SecondaryButton } from "../../mui/buttons/SecondaryButton";
import type {
  FilterTripsFormTypes,
  FilterValuesTypes,
  FormiksTypes,
} from "../../types/forms";
import { TRIP_STATUSES } from "../../types/enums";
import useVehicleTypes from "../../hooks/useVehicleTypes";


const FilterTripsForm = ({
  formik,
}: FormiksTypes<FilterTripsFormTypes>) => {
  const setTripsLimit = useFormsStore((state) => state.setTripsLimit);
  const tripsLimit = useFormsStore((state) => state.tripsLimit);
  const limit = tripsLimit || 10;
  const { handleResetFilter, handleFilter, handleFilterLimits } = useFilters();
  const { handleGetQueries } = useQueries();
  const queries = handleGetQueries();
  const { activeVehicleTypes } = useVehicleTypes();

  const { t } = useTranslation("forms/filter_trips_form");

  const handleReset = () => {
    formik.resetForm();
    handleResetFilter("trips");
  };

  const handleCloseChip = (key: string) => {
    const updatedQueries = { ...queries };
    updatedQueries[key] = "";
    handleFilter("trips", updatedQueries as unknown as FilterValuesTypes);
  };

  useEffect(() => {
    const newLimit = +queries["limit"] || 10;
    // Only update if the limit value actually changed
    if (tripsLimit !== newLimit) {
      setTripsLimit(newLimit);
    }
  }, [queries.limit, tripsLimit, setTripsLimit]);

  return (
    <Box className={`flex justify-start items-center flex-wrap gap-2`}>
      <Typography variant="subtitle1" className={`text-Jeeteak_gray !font-[600]`}>
        {t("labels.rowsToShow", { defaultValue: "Rows to Show" })}
      </Typography>

      <CustomMenu
        button={
          <BasicButton key={Math.random()}>
            {limit}
            <ArrowDownIcon className={`w-[16px]`} />
          </BasicButton>
        }
        limit
      >
        <Box className={`grid justify-stretch items-center gap-4 p-4 lg:p-3 md:p-2 xs:p-1`}>
          {limits.map((limit: number) => (
            <Button
              key={limit}
              onClick={() => {
                handleFilterLimits("trips", limit);
                setTripsLimit(limit);
              }}
            >
              {limit}
            </Button>
          ))}
        </Box>
      </CustomMenu>

      <CustomMenu
        button={
          <BasicButton key={Math.random()}>
            <FilterIcon className={`w-[16px]`} />
            {t("buttons.filter", { defaultValue: "Filter" })}
          </BasicButton>
        }
      >
        <Box className={`grid justify-stretch items-center gap-6 p-4 lg:p-3 md:p-2 xs:p-1`}>
          <Box className={`grid justify-stretch items-center gap-4`}>
            <Input
              formik={formik}
              label={t("labels.status", { defaultValue: "Status" })}
              name="status"
              select
              options={["", ...TRIP_STATUSES.map(s => s.charAt(0).toUpperCase() + s.slice(1))]}
              values={["", ...TRIP_STATUSES]}
              optional
              value={formik.values.status}
            />
            <Input
              formik={formik}
              label={t("labels.vehicleType", { defaultValue: "Vehicle Type" })}
              name="vehicle_type_id"
              select
              options={["", ...activeVehicleTypes.map(vt => vt.name)]}
              values={["", ...activeVehicleTypes.map(vt => vt.id.toString())]}
              optional
              value={formik.values.vehicle_type_id?.toString() || ""}
            />
            <Input
              formik={formik}
              label={t("labels.userId", { defaultValue: "User ID" })}
              name="user_id"
              type="number"
              optional
              value={formik.values.user_id}
            />
            <Input
              formik={formik}
              label={t("labels.driverId", { defaultValue: "Driver ID" })}
              name="driver_id"
              type="number"
              optional
              value={formik.values.driver_id}
            />
            <Input
              formik={formik}
              label={t("labels.pickupAddress", { defaultValue: "Pickup Address" })}
              name="pickup_address"
              optional
              value={formik.values.pickup_address}
            />
            <Input
              formik={formik}
              label={t("labels.destinationAddress", { defaultValue: "Destination Address" })}
              name="destination_address"
              optional
              value={formik.values.destination_address}
            />
          </Box>

          <Box className={`grid justify-stretch items-center grid-cols-2 gap-3`}>
            <SubmitButton
              loading={false}
              type={"button"}
              handling={() => handleFilter("trips", formik.values)}
              variant="gradient"
            >
              {t("buttons.applyFilter", { defaultValue: "Apply Filter" })}
            </SubmitButton>
            <SecondaryButton type={"button"} onClick={handleReset}>
              {t("buttons.clearFilter", { defaultValue: "Clear Filter" })}
            </SecondaryButton>
          </Box>
        </Box>
      </CustomMenu>

      <FilterChips variant="trips" onClose={handleCloseChip} />
    </Box>
  );
};

export default FilterTripsForm;
