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
  FilterVehiclesFormTypes,
  FilterValuesTypes,
  FormiksTypes,
} from "../../types/forms";
import { VEHICLE_STATUSES, VEHICLE_VERIFICATION_STATUSES } from "../../types/enums";
import useVehicleTypes from "../../hooks/useVehicleTypes";

const FilterVehiclesForm = ({
  formik,
}: FormiksTypes<FilterVehiclesFormTypes>) => {
  const setVehiclesLimit = useFormsStore((state) => state.setVehiclesLimit);
  const vehiclesLimit = useFormsStore((state) => state.vehiclesLimit);
  const limit = vehiclesLimit || 10;
  const { handleResetFilter, handleFilter, handleFilterLimits } = useFilters();
  const { handleGetQueries } = useQueries();
  const queries = handleGetQueries();
  const { activeVehicleTypes } = useVehicleTypes();

  const { t } = useTranslation("forms/filter_vehicles_form");

  const handleReset = () => {
    formik.resetForm();
    handleResetFilter("vehicles");
  };

  const handleCloseChip = (key: string) => {
    const updatedQueries = { ...queries };
    updatedQueries[key] = "";
    handleFilter("vehicles", updatedQueries as unknown as FilterValuesTypes);
  };

  useEffect(() => {
    const newLimit = +queries["limit"] || 10;
    // Only update if the limit value actually changed
    if (vehiclesLimit !== newLimit) {
      setVehiclesLimit(newLimit);
    }
  }, [queries.limit, vehiclesLimit, setVehiclesLimit]);

  return (
    <Box className={`flex justify-start items-center flex-wrap gap-2`}>
      <Typography variant="subtitle1" className={`text-Diziel_gray !font-[600]`}>
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
                handleFilterLimits("vehicles", limit);
                setVehiclesLimit(limit);
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
              options={["", ...VEHICLE_STATUSES.map(s => s.charAt(0).toUpperCase() + s.slice(1))]}
              values={["", ...VEHICLE_STATUSES]}
              optional
              value={formik.values.status}
            />
            <Input
              formik={formik}
              label={t("labels.verificationStatus", { defaultValue: "Verification Status" })}
              name="verification_status"
              select
              options={["", ...VEHICLE_VERIFICATION_STATUSES.map(s => s.charAt(0).toUpperCase() + s.slice(1))]}
              values={["", ...VEHICLE_VERIFICATION_STATUSES]}
              optional
              value={formik.values.verification_status}
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
              label={t("labels.make", { defaultValue: "Make" })}
              name="make"
              optional
              value={formik.values.make}
            />
            <Input
              formik={formik}
              label={t("labels.model", { defaultValue: "Model" })}
              name="model"
              optional
              value={formik.values.model}
            />
            <Input
              formik={formik}
              label={t("labels.licensePlate", { defaultValue: "License Plate" })}
              name="license_plate"
              optional
              value={formik.values.license_plate}
            />
            <Input
              formik={formik}
              label={t("labels.driverId", { defaultValue: "Driver ID" })}
              name="driver_id"
              optional
              value={formik.values.driver_id}
            />
          </Box>

          <Box className={`grid justify-stretch items-center grid-cols-2 gap-3`}>
            <SubmitButton
              loading={false}
              type={"button"}
              handling={() => handleFilter("vehicles", formik.values)}
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

      <FilterChips variant="vehicles" onClose={handleCloseChip} />
    </Box>
  );
};

export default FilterVehiclesForm;
