import { useTranslation } from "react-i18next";
import * as yup from "yup";
import type { Trip } from "../../types/domain";
import { TRIP_STATUSES, type TripStatus } from "../../types/enums";

const useTripSchema = (isEdit = false, selectedTrip?: Trip | null) => {
  const { t } = useTranslation("forms/trip_form");

  const TripSchema = yup.object({
    trip_title: yup
      .string()
      .nullable()
      .max(255, t("trip_title_max", { defaultValue: "Trip title must be less than 255 characters" })),
    pickup_address: yup
      .string()
      .trim()
      .max(255, t("pickup_address_max", { defaultValue: "Pickup address must be less than 255 characters" }))
      .required(t("pickup_address_required", { defaultValue: "Pickup address is required" })),
    pickup_lat: yup
      .number()
      .nullable()
      .min(-90, t("latitude_min", { defaultValue: "Latitude must be between -90 and 90" }))
      .max(90, t("latitude_max", { defaultValue: "Latitude must be between -90 and 90" })),
    pickup_lng: yup
      .number()
      .nullable()
      .min(-180, t("longitude_min", { defaultValue: "Longitude must be between -180 and 180" }))
      .max(180, t("longitude_max", { defaultValue: "Longitude must be between -180 and 180" })),
    pickup_date: yup
      .string()
      .nullable()
      .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, t("datetime_invalid", { defaultValue: "Invalid date-time format" })),
    destination_address: yup
      .string()
      .trim()
      .max(255, t("destination_address_max", { defaultValue: "Destination address must be less than 255 characters" }))
      .required(t("destination_address_required", { defaultValue: "Destination address is required" })),
    destination_lat: yup
      .number()
      .nullable()
      .min(-90, t("latitude_min", { defaultValue: "Latitude must be between -90 and 90" }))
      .max(90, t("latitude_max", { defaultValue: "Latitude must be between -90 and 90" })),
    destination_lng: yup
      .number()
      .nullable()
      .min(-180, t("longitude_min", { defaultValue: "Longitude must be between -180 and 180" }))
      .max(180, t("longitude_max", { defaultValue: "Longitude must be between -180 and 180" })),
    destination_date: yup
      .string()
      .nullable()
      .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, t("datetime_invalid", { defaultValue: "Invalid date-time format" })),
    vehicle_type_id: yup
      .number()
      .integer(t("vehicle_type_id_invalid", { defaultValue: "Vehicle type ID must be an integer" }))
      .positive(t("vehicle_type_id_positive", { defaultValue: "Vehicle type ID must be positive" }))
      .required(t("vehicle_type_id_required", { defaultValue: "Vehicle type is required" })),
    base_price: yup
      .number()
      .min(0, t("base_price_min", { defaultValue: "Base price must be at least 0" }))
      .required(t("base_price_required", { defaultValue: "Base price is required" })),
    scheduled_at: yup
      .string()
      .nullable()
      .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, t("datetime_invalid", { defaultValue: "Invalid date-time format" })),
    description: yup
      .string()
      .nullable()
      .max(1000, t("description_max", { defaultValue: "Description must be less than 1000 characters" })),
    notes: yup
      .string()
      .nullable()
      .max(1000, t("notes_max", { defaultValue: "Notes must be less than 1000 characters" })),
    weight: yup
      .string()
      .nullable()
      .max(255, t("weight_max", { defaultValue: "Weight must be less than 255 characters" })),
    material: yup
      .string()
      .nullable()
      .max(255, t("material_max", { defaultValue: "Material must be less than 255 characters" })),
    status: yup
      .string()
      .nullable()
      .oneOf(TRIP_STATUSES, t("status_invalid", { defaultValue: "Invalid status" })),
  });

  const TripInitialValues = isEdit && selectedTrip
    ? {
        trip_title: selectedTrip.trip_title || null,
        pickup_address: selectedTrip.pickup_address || "",
        pickup_lat: selectedTrip.pickup_lat || null,
        pickup_lng: selectedTrip.pickup_lng || null,
        pickup_date: selectedTrip.pickup_date || null,
        destination_address: selectedTrip.destination_address || "",
        destination_lat: selectedTrip.destination_lat || null,
        destination_lng: selectedTrip.destination_lng || null,
        destination_date: selectedTrip.destination_date || null,
        vehicle_type_id: typeof selectedTrip.vehicle_type === 'object' && 'id' in selectedTrip.vehicle_type
          ? (selectedTrip.vehicle_type as { id: number })?.id
          : (selectedTrip.vehicle_type_id || (typeof selectedTrip.vehicle_type === 'number' ? selectedTrip.vehicle_type : 1)),
        base_price: selectedTrip.base_price || 0,
        scheduled_at: selectedTrip.scheduled_at || null,
        description: selectedTrip.description || null,
        notes: selectedTrip.notes || null,
        weight: selectedTrip.weight || null,
        material: selectedTrip.material || null,
        status: selectedTrip.status || "pending",
      }
    : {
        trip_title: null as string | null,
        pickup_address: "",
        pickup_lat: null as number | null,
        pickup_lng: null as number | null,
        pickup_date: null as string | null,
        destination_address: "",
        destination_lat: null as number | null,
        destination_lng: null as number | null,
        destination_date: null as string | null,
        vehicle_type_id: 1, // Default to first vehicle type (will be set properly when vehicle types are loaded)
        base_price: 0,
        scheduled_at: null as string | null,
        description: null as string | null,
        notes: null as string | null,
        weight: null as string | null,
        material: null as string | null,
        status: "pending" as TripStatus,
      };

  return { TripSchema, TripInitialValues };
};

export default useTripSchema;
