import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import { BasicButton } from "../../mui/buttons/BasicButton";
import FormSection from "../../components/common/FormSection/FormSection";
import type { FormiksTypes, TripFormTypes } from "../../types/forms";
import { TRIP_STATUSES } from "../../types/enums";
import useVehicleTypes from "../../hooks/useVehicleTypes";


const TripForm = ({
  formik,
  type,
}: FormiksTypes<TripFormTypes> & {
  type?: "editTrip";
}) => {
  const { t } = useTranslation("forms/trip_form");
  const isLoading = useFormsStore((state) => state.isLoading);
  const navigate = useNavigate();
  const isEdit = type === "editTrip";
  const { activeVehicleTypes } = useVehicleTypes();

  return (
    <Box className="grid justify-stretch items-start gap-6">
      {/* Trip Basic Information Section */}
      <FormSection title={t("tripInformation", { defaultValue: "Trip Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("tripTitle", { defaultValue: "Trip Title" })}
            name="trip_title"
            placeholder={t("tripTitlePlaceholder", { defaultValue: "Enter trip title" })}
            optional
          />
          {isEdit && (
            <Input
              formik={formik}
              label={t("status", { defaultValue: "Status" })}
              name="status"
              select
              options={TRIP_STATUSES.map(s => s.charAt(0).toUpperCase() + s.slice(1))}
              values={TRIP_STATUSES}
              placeholder={t("statusPlaceholder", { defaultValue: "Select status" })}
              optional
            />
          )}
          <Input
            formik={formik}
            label={t("vehicleType", { defaultValue: "Vehicle Type" })}
            name="vehicle_type_id"
            select
            options={activeVehicleTypes.map(vt => vt.name)}
            values={activeVehicleTypes.map(vt => vt.id.toString())}
            placeholder={t("vehicleTypePlaceholder", { defaultValue: "Select vehicle type" })}
          />
          <Input
            formik={formik}
            label={t("basePrice", { defaultValue: "Base Price" })}
            name="base_price"
            type="number"
            placeholder={t("basePricePlaceholder", { defaultValue: "Enter base price" })}
          />
          <Input
            formik={formik}
            label={t("scheduledAt", { defaultValue: "Scheduled At" })}
            name="scheduled_at"
            type="datetime-local"
            placeholder={t("scheduledAtPlaceholder", { defaultValue: "Select scheduled date and time" })}
            optional
          />
        </Box>
      </FormSection>

      {/* Pickup Information Section */}
      <FormSection title={t("pickupInformation", { defaultValue: "Pickup Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("pickupAddress", { defaultValue: "Pickup Address" })}
            name="pickup_address"
            placeholder={t("pickupAddressPlaceholder", { defaultValue: "Enter pickup address" })}
          />
          <Input
            formik={formik}
            label={t("pickupLatitude", { defaultValue: "Pickup Latitude" })}
            name="pickup_lat"
            type="number"
            placeholder={t("pickupLatitudePlaceholder", { defaultValue: "Enter latitude" })}
            optional
          />
          <Input
            formik={formik}
            label={t("pickupLongitude", { defaultValue: "Pickup Longitude" })}
            name="pickup_lng"
            type="number"
            placeholder={t("pickupLongitudePlaceholder", { defaultValue: "Enter longitude" })}
            optional
          />
          <Input
            formik={formik}
            label={t("pickupDate", { defaultValue: "Pickup Date" })}
            name="pickup_date"
            type="datetime-local"
            placeholder={t("pickupDatePlaceholder", { defaultValue: "Select pickup date and time" })}
            optional
          />
        </Box>
      </FormSection>

      {/* Destination Information Section */}
      <FormSection title={t("destinationInformation", { defaultValue: "Destination Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("destinationAddress", { defaultValue: "Destination Address" })}
            name="destination_address"
            placeholder={t("destinationAddressPlaceholder", { defaultValue: "Enter destination address" })}
          />
          <Input
            formik={formik}
            label={t("destinationLatitude", { defaultValue: "Destination Latitude" })}
            name="destination_lat"
            type="number"
            placeholder={t("destinationLatitudePlaceholder", { defaultValue: "Enter latitude" })}
            optional
          />
          <Input
            formik={formik}
            label={t("destinationLongitude", { defaultValue: "Destination Longitude" })}
            name="destination_lng"
            type="number"
            placeholder={t("destinationLongitudePlaceholder", { defaultValue: "Enter longitude" })}
            optional
          />
          <Input
            formik={formik}
            label={t("destinationDate", { defaultValue: "Destination Date" })}
            name="destination_date"
            type="datetime-local"
            placeholder={t("destinationDatePlaceholder", { defaultValue: "Select destination date and time" })}
            optional
          />
        </Box>
      </FormSection>

      {/* Additional Information Section */}
      <FormSection title={t("additionalInformation", { defaultValue: "Additional Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("description", { defaultValue: "Description" })}
            name="description"
            textarea
            placeholder={t("descriptionPlaceholder", { defaultValue: "Enter description" })}
            optional
          />
          <Input
            formik={formik}
            label={t("notes", { defaultValue: "Notes" })}
            name="notes"
            textarea
            placeholder={t("notesPlaceholder", { defaultValue: "Enter notes" })}
            optional
          />
          <Input
            formik={formik}
            label={t("weight", { defaultValue: "Weight" })}
            name="weight"
            placeholder={t("weightPlaceholder", { defaultValue: "Enter weight" })}
            optional
          />
          <Input
            formik={formik}
            label={t("material", { defaultValue: "Material" })}
            name="material"
            placeholder={t("materialPlaceholder", { defaultValue: "Enter material" })}
            optional
          />
        </Box>
      </FormSection>

      {/* Action Buttons */}
      <Box className="flex justify-end items-center gap-4">
        <BasicButton
          type="button"
          onClick={() => navigate(-1)}
          className="!px-6 !py-2.5"
        >
          {t("cancel", { defaultValue: "Cancel" })}
        </BasicButton>
        <SubmitButton
          loading={isLoading}
          variant="gradient"
          className="!px-6 !py-2.5"
        >
          {isEdit 
            ? t("updateTrip", { defaultValue: "Update Trip" })
            : t("createTrip", { defaultValue: "Create Trip" })}
        </SubmitButton>
      </Box>
    </Box>
  );
};

export default TripForm;
