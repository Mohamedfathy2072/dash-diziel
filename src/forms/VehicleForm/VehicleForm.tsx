import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import { BasicButton } from "../../mui/buttons/BasicButton";
import FormSection from "../../components/common/FormSection/FormSection";
import type { FormiksTypes, VehicleFormTypes } from "../../types/forms";
import { VEHICLE_STATUSES, VEHICLE_VERIFICATION_STATUSES } from "../../types/enums";
import useVehicleTypes from "../../hooks/useVehicleTypes";

const VehicleForm = ({
  formik,
  type,
}: FormiksTypes<VehicleFormTypes> & {
  type?: "addVehicle" | "editVehicle";
}) => {
  const { t } = useTranslation("forms/vehicle_form");
  const isLoading = useFormsStore((state) => state.isLoading);
  const navigate = useNavigate();
  const isEdit = type === "editVehicle";
  const { activeVehicleTypes } = useVehicleTypes();

  return (
    <Box className="grid justify-stretch items-start gap-6">
      {/* Basic Information Section */}
      <FormSection title={t("basicInformation", { defaultValue: "Basic Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("driverId", { defaultValue: "Driver ID" })}
            name="driver_id"
            type="number"
            placeholder={t("driverIdPlaceholder", { defaultValue: "Enter driver ID" })}
          />
          <Input
            formik={formik}
            label={t("make", { defaultValue: "Make" })}
            name="make"
            placeholder={t("makePlaceholder", { defaultValue: "Enter make" })}
          />
          <Input
            formik={formik}
            label={t("model", { defaultValue: "Model" })}
            name="model"
            placeholder={t("modelPlaceholder", { defaultValue: "Enter model" })}
          />
          <Input
            formik={formik}
            label={t("year", { defaultValue: "Year" })}
            name="year"
            type="number"
            placeholder={t("yearPlaceholder", { defaultValue: "Enter year" })}
          />
          <Input
            formik={formik}
            label={t("color", { defaultValue: "Color" })}
            name="color"
            placeholder={t("colorPlaceholder", { defaultValue: "Enter color" })}
            optional
          />
          <Input
            formik={formik}
            label={t("licensePlate", { defaultValue: "License Plate" })}
            name="license_plate"
            placeholder={t("licensePlatePlaceholder", { defaultValue: "Enter license plate" })}
          />
          <Input
            formik={formik}
            label={t("vin", { defaultValue: "VIN" })}
            name="vin"
            placeholder={t("vinPlaceholder", { defaultValue: "Enter VIN" })}
            optional
          />
          <Input
            formik={formik}
            label={t("vehicleType", { defaultValue: "Vehicle Type" })}
            name="vehicle_type_id"
            select
            options={activeVehicleTypes.map(vt => vt.name)}
            values={activeVehicleTypes.map(vt => vt.id.toString())}
            placeholder={t("vehicleTypePlaceholder", { defaultValue: "Select vehicle type" })}
          />
        </Box>
      </FormSection>

      {/* Vehicle Specifications Section */}
      <FormSection title={t("vehicleSpecifications", { defaultValue: "Vehicle Specifications" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("fuelType", { defaultValue: "Fuel Type" })}
            name="fuel_type"
            placeholder={t("fuelTypePlaceholder", { defaultValue: "Enter fuel type" })}
            optional
          />
          <Input
            formik={formik}
            label={t("transmission", { defaultValue: "Transmission" })}
            name="transmission"
            select
            options={["Automatic", "Manual", "CVT"]}
            values={["automatic", "manual", "cvt"]}
            placeholder={t("transmissionPlaceholder", { defaultValue: "Select transmission" })}
            optional
          />
          <Input
            formik={formik}
            label={t("doors", { defaultValue: "Doors" })}
            name="doors"
            type="number"
            placeholder={t("doorsPlaceholder", { defaultValue: "Enter number of doors" })}
            optional
          />
          <Input
            formik={formik}
            label={t("seats", { defaultValue: "Seats" })}
            name="seats"
            type="number"
            placeholder={t("seatsPlaceholder", { defaultValue: "Enter number of seats" })}
            optional
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.is_primary || false}
                onChange={(e) => formik.setFieldValue("is_primary", e.target.checked)}
                name="is_primary"
              />
            }
            label={t("isPrimary", { defaultValue: "Primary Vehicle" })}
          />
          {isEdit && (
            <>
              <Input
                formik={formik}
                label={t("status", { defaultValue: "Status" })}
                name="status"
                select
                options={VEHICLE_STATUSES.map(s => s.charAt(0).toUpperCase() + s.slice(1))}
                values={VEHICLE_STATUSES}
                placeholder={t("statusPlaceholder", { defaultValue: "Select status" })}
                optional
              />
              <Input
                formik={formik}
                label={t("verificationStatus", { defaultValue: "Verification Status" })}
                name="verification_status"
                select
                options={VEHICLE_VERIFICATION_STATUSES.map(s => s.charAt(0).toUpperCase() + s.slice(1))}
                values={VEHICLE_VERIFICATION_STATUSES}
                placeholder={t("verificationStatusPlaceholder", { defaultValue: "Select verification status" })}
                optional
              />
            </>
          )}
        </Box>
      </FormSection>

      {/* Registration Information Section */}
      <FormSection title={t("registrationInformation", { defaultValue: "Registration Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("registrationNumber", { defaultValue: "Registration Number" })}
            name="registration_number"
            placeholder={t("registrationNumberPlaceholder", { defaultValue: "Enter registration number" })}
            optional
          />
          <Input
            formik={formik}
            label={t("registrationExpiry", { defaultValue: "Registration Expiry" })}
            name="registration_expiry"
            type="date"
            optional
          />
          <Input
            formik={formik}
            label={t("registrationState", { defaultValue: "Registration State" })}
            name="registration_state"
            placeholder={t("registrationStatePlaceholder", { defaultValue: "Enter registration state" })}
            optional
          />
        </Box>
      </FormSection>

      {/* Insurance Information Section */}
      <FormSection title={t("insuranceInformation", { defaultValue: "Insurance Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("insuranceProvider", { defaultValue: "Insurance Provider" })}
            name="insurance_provider"
            placeholder={t("insuranceProviderPlaceholder", { defaultValue: "Enter insurance provider" })}
            optional
          />
          <Input
            formik={formik}
            label={t("insurancePolicyNumber", { defaultValue: "Insurance Policy Number" })}
            name="insurance_policy_number"
            placeholder={t("insurancePolicyNumberPlaceholder", { defaultValue: "Enter insurance policy number" })}
            optional
          />
          <Input
            formik={formik}
            label={t("insuranceExpiry", { defaultValue: "Insurance Expiry" })}
            name="insurance_expiry"
            type="date"
            optional
          />
        </Box>
      </FormSection>

      {/* Inspection Information Section */}
      <FormSection title={t("inspectionInformation", { defaultValue: "Inspection Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("inspectionDate", { defaultValue: "Inspection Date" })}
            name="inspection_date"
            type="date"
            optional
          />
          <Input
            formik={formik}
            label={t("inspectionExpiry", { defaultValue: "Inspection Expiry" })}
            name="inspection_expiry"
            type="date"
            optional
          />
          <Input
            formik={formik}
            label={t("inspectionCertificate", { defaultValue: "Inspection Certificate" })}
            name="inspection_certificate"
            placeholder={t("inspectionCertificatePlaceholder", { defaultValue: "Enter inspection certificate" })}
            optional
          />
        </Box>
      </FormSection>

      {/* Maintenance Information Section */}
      <FormSection title={t("maintenanceInformation", { defaultValue: "Maintenance Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("mileage", { defaultValue: "Mileage" })}
            name="mileage"
            type="number"
            placeholder={t("mileagePlaceholder", { defaultValue: "Enter mileage" })}
            optional
          />
          <Input
            formik={formik}
            label={t("conditionRating", { defaultValue: "Condition Rating" })}
            name="condition_rating"
            type="number"
            placeholder={t("conditionRatingPlaceholder", { defaultValue: "Enter condition rating (0-10)" })}
            optional
          />
          <Input
            formik={formik}
            label={t("lastMaintenanceDate", { defaultValue: "Last Maintenance Date" })}
            name="last_maintenance_date"
            type="date"
            optional
          />
          <Input
            formik={formik}
            label={t("nextMaintenanceDue", { defaultValue: "Next Maintenance Due" })}
            name="next_maintenance_due"
            type="date"
            optional
          />
        </Box>
      </FormSection>

      {/* Additional Information Section */}
      <FormSection title={t("additionalInformation", { defaultValue: "Additional Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Box className="col-span-full">
            <Input
              formik={formik}
              label={t("notes", { defaultValue: "Notes" })}
              name="notes"
              textarea
              rows={4}
              placeholder={t("notesPlaceholder", { defaultValue: "Enter additional notes" })}
              optional
            />
          </Box>
        </Box>
      </FormSection>

      {/* Form Actions */}
      <Box className="flex justify-end items-center gap-3">
        <BasicButton onClick={() => navigate(`${import.meta.env.VITE_VEHICLES_ROUTE}`)}>
          {t("cancel", { defaultValue: "Cancel" })}
        </BasicButton>
        <SubmitButton loading={isLoading}>
          {isEdit
            ? t("update", { defaultValue: "Update Vehicle" })
            : t("create", { defaultValue: "Create Vehicle" })}
        </SubmitButton>
      </Box>
    </Box>
  );
};

export default VehicleForm;
