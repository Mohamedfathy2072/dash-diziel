import { useTranslation } from "react-i18next";
import * as yup from "yup";
import type { Vehicle } from "../../types/domain";
import { VEHICLE_STATUSES, VEHICLE_VERIFICATION_STATUSES } from "../../types/enums";

const useVehicleSchema = (isEdit = false, selectedVehicle?: Vehicle | null) => {
  const { t } = useTranslation("forms/vehicle_form");

  // const VehicleSchema = yup.object({
  //   driver_id: yup
  //     .number()
  //     .required(t("driver_id_required", { defaultValue: "Driver is required" })),
  //   make: yup
  //     .string()
  //     .trim()
  //     .max(255, t("make_max", { defaultValue: "Make must be less than 255 characters" }))
  //     .required(t("make_required", { defaultValue: "Make is required" })),
  //   model: yup
  //     .string()
  //     .trim()
  //     .max(255, t("model_max", { defaultValue: "Model must be less than 255 characters" }))
  //     .required(t("model_required", { defaultValue: "Model is required" })),
  //   year: yup
  //     .number()
  //     .min(1900, t("year_min", { defaultValue: "Year must be at least 1900" }))
  //     .max(2100, t("year_max", { defaultValue: "Year must be at most 2100" }))
  //     .required(t("year_required", { defaultValue: "Year is required" })),
  //   color: yup
  //     .string()
  //     .nullable()
  //     .max(50, t("color_max", { defaultValue: "Color must be less than 50 characters" })),
  //   license_plate: yup
  //     .string()
  //     .trim()
  //     .max(20, t("license_plate_max", { defaultValue: "License plate must be less than 20 characters" }))
  //     .required(t("license_plate_required", { defaultValue: "License plate is required" })),
  //   vin: yup
  //     .string()
  //     .nullable()
  //     .max(17, t("vin_max", { defaultValue: "VIN must be less than 17 characters" })),
  //   vehicle_type_id: yup
  //     .number()
  //     .integer(t("vehicle_type_id_invalid", { defaultValue: "Vehicle type ID must be an integer" }))
  //     .positive(t("vehicle_type_id_positive", { defaultValue: "Vehicle type ID must be positive" }))
  //     .required(t("vehicle_type_id_required", { defaultValue: "Vehicle type is required" })),
  //   chassis_number: yup
  //      .string()
  //      .required(t("chassisNumberRequired",{defaultValue:"chassis Number Required"})),   
  //   fuel_type: yup
  //     .string()
  //     .nullable()
  //     .max(50, t("fuel_type_max", { defaultValue: "Fuel type must be less than 50 characters" })),
  //   transmission: yup
  //     .string()
  //     .nullable()
  //     .oneOf(["automatic", "manual", "cvt"], t("transmission_invalid", { defaultValue: "Invalid transmission type" })),
  //   doors: yup
  //     .number()
  //     .nullable()
  //     .min(2, t("doors_min", { defaultValue: "Doors must be at least 2" }))
  //     .max(6, t("doors_max", { defaultValue: "Doors must be at most 6" })),
  //   seats: yup
  //     .number()
  //     .nullable()
  //     .min(2, t("seats_min", { defaultValue: "Seats must be at least 2" }))
  //     .max(20, t("seats_max", { defaultValue: "Seats must be at most 20" })),
  //   is_primary: yup
  //     .boolean()
  //     .nullable(),
  //   status: yup
  //     .string()
  //     .nullable()
  //     .oneOf(VEHICLE_STATUSES, t("status_invalid", { defaultValue: "Invalid status" })),
  //   registration_number: yup
  //     .string()
  //     .nullable()
  //     .max(100, t("registration_number_max", { defaultValue: "Registration number must be less than 100 characters" })),
  //   registration_expiry: yup
  //     .string()
  //     .nullable()
  //     .matches(/^\d{4}-\d{2}-\d{2}$/, t("date_invalid", { defaultValue: "Invalid date format (YYYY-MM-DD)" })),
  //   registration_state: yup
  //     .string()
  //     .nullable()
  //     .max(100, t("registration_state_max", { defaultValue: "Registration state must be less than 100 characters" })),
  //   insurance_provider: yup
  //     .string()
  //     .nullable()
  //     .max(255, t("insurance_provider_max", { defaultValue: "Insurance provider must be less than 255 characters" })),
  //   insurance_policy_number: yup
  //     .string()
  //     .nullable()
  //     .max(100, t("insurance_policy_number_max", { defaultValue: "Insurance policy number must be less than 100 characters" })),
  //   insurance_expiry: yup
  //     .string()
  //     .nullable()
  //     .matches(/^\d{4}-\d{2}-\d{2}$/, t("date_invalid", { defaultValue: "Invalid date format (YYYY-MM-DD)" })),
  //   inspection_date: yup
  //     .string()
  //     .nullable()
  //     .matches(/^\d{4}-\d{2}-\d{2}$/, t("date_invalid", { defaultValue: "Invalid date format (YYYY-MM-DD)" })),
  //   inspection_expiry: yup
  //     .string()
  //     .nullable()
  //     .matches(/^\d{4}-\d{2}-\d{2}$/, t("date_invalid", { defaultValue: "Invalid date format (YYYY-MM-DD)" })),
  //   inspection_certificate: yup
  //     .string()
  //     .nullable()
  //     .max(255, t("inspection_certificate_max", { defaultValue: "Inspection certificate must be less than 255 characters" })),
  //   mileage: yup
  //     .number()
  //     .nullable()
  //     .min(0, t("mileage_min", { defaultValue: "Mileage must be at least 0" })),
  //   condition_rating: yup
  //     .number()
  //     .nullable()
  //     .min(0, t("condition_rating_min", { defaultValue: "Condition rating must be at least 0" }))
  //     .max(10, t("condition_rating_max", { defaultValue: "Condition rating must be at most 10" })),
  //   last_maintenance_date: yup
  //     .string()
  //     .nullable()
  //     .matches(/^\d{4}-\d{2}-\d{2}$/, t("date_invalid", { defaultValue: "Invalid date format (YYYY-MM-DD)" })),
  //   next_maintenance_due: yup
  //     .string()
  //     .nullable()
  //     .matches(/^\d{4}-\d{2}-\d{2}$/, t("date_invalid", { defaultValue: "Invalid date format (YYYY-MM-DD)" })),
  //   notes: yup
  //     .string()
  //     .nullable()
  //     .max(1000, t("notes_max", { defaultValue: "Notes must be less than 1000 characters" })),
  // });

     
  const VehicleSchema = yup.object({
  driver_id: yup
    .number()
    .required("معرف السائق مطلوب"),

  make: yup
    .string()
    .required("المصنع مطلوب"),

  color: yup
    .string()
    .nullable(),

  vehicle_type_id: yup
    .number()
    .required("نوع العربة مطلوب"),

  head: yup.object({
    model: yup
      .string()
      .required("عربة النقل مطلوبة"),

  year: yup
      .number()
      .typeError("سنة الصنع يجب أن تكون رقماً")
      .min(1900, "سنة الصنع يجب أن تكون على الأقل 1900")
      .max(2100, "سنة الصنع يجب أن تكون على الأكثر 2100")
      .required("سنة الصنع مطلوبة"),

    license_plate: yup
      .string()
      .required("License plate is required"),

    chassis_number: yup
      .string()
      .required("Chassis number is required"),

    engine_number: yup
      .string()
      .nullable(),

    number_of_axles: yup
      .number()
      .typeError("عدد المحاور يجب أن يكون رقماً")
      .min(1, "عدد المحاور يجب أن يكون على الأقل 1")
      .required("عدد المحاور مطلوب"),

    max_load: yup
      .number()
      .typeError("الحمولة القصوى يجب أن تكون رقماً")
      .min(0, "الحمولة القصوى يجب أن تكون على الأقل 0")
      .required("الحمولة القصوى مطلوبة"),

    length: yup
      .number()
      .typeError("الطول يجب أن يكون رقماً")
      .min(0, "الطول يجب أن يكون على الأقل 0")
      .required("الطول مطلوب"),
  }),

  trailer: yup.object({
    model: yup
      .string()
      .required("Trailer model is required"),

    year: yup
      .number()
      .typeError("سنة الصنع يجب أن تكون رقماً")
      .min(1900, "سنة الصنع يجب أن تكون على الأقل 1900")
      .max(2100, "سنة الصنع يجب أن تكون على الأكثر 2100")
      .required("سنة الصنع مطلوبة"),

    license_plate: yup
      .string()
      .required(),

    chassis_number: yup
      .string()
      .required(),

    number_of_axles: yup
      .number()
      .typeError("عدد المحاور يجب أن يكون رقماً")
      .min(1, "عدد المحاور يجب أن يكون على الأقل 1")
      .required("عدد المحاور مطلوب"),

    max_load: yup
      .number()
      .typeError("الحمولة القصوى يجب أن تكون رقماً")
      .min(0, "الحمولة القصوى يجب أن تكون على الأقل 0")
      .required("الحمولة القصوى مطلوبة"),

    length: yup
      .number()
      .typeError("الطول يجب أن يكون رقماً")
      .min(0, "الطول يجب أن يكون على الأقل 0")
      .required("الطول مطلوب"),
  }),
});



  const VehicleInitialValues = isEdit && selectedVehicle
    ? {
        driver_id: selectedVehicle.driver_id || 0,
        make: selectedVehicle.make || "",
        // model: selectedVehicle.model || "",
        // year: selectedVehicle.year || new Date().getFullYear(),
        color: selectedVehicle.color || null,
        // license_plate: selectedVehicle.license_plate || "",
        // vin: selectedVehicle.vin || null,
        vehicle_type_id: typeof selectedVehicle.vehicle_type === 'object' && selectedVehicle.vehicle_type?.id
          ? selectedVehicle.vehicle_type.id
          : (selectedVehicle.vehicle_type_id || (typeof selectedVehicle.vehicle_type === 'number' ? selectedVehicle.vehicle_type : 1)),
      head: {
      model: selectedVehicle?.head?.model || "",
      year: selectedVehicle?.head?.year || "",
      license_plate: selectedVehicle?.head?.license_plate || "",
      chassis_number: selectedVehicle?.head?.chassis_number || "",
      engine_number: selectedVehicle?.head?.engine_number || "",
      number_of_axles: selectedVehicle?.head?.number_of_axles || 0,
      max_load: selectedVehicle?.head?.max_load || 0,
      length: selectedVehicle?.head?.length || 0,
        },
      trailer: {
      model: selectedVehicle?.head?.model || "",
      year: selectedVehicle?.head?.year || "",
      license_plate: selectedVehicle?.head?.license_plate || "",
      chassis_number: selectedVehicle?.head?.chassis_number || "",
      number_of_axles: selectedVehicle?.head?.number_of_axles || 0,
      max_load: selectedVehicle?.head?.max_load || 0,
      length: selectedVehicle?.head?.length || 0,
        },
        // fuel_type: selectedVehicle.fuel_type || null,
        // transmission: selectedVehicle.transmission || null,
        // doors: selectedVehicle.doors || null,
        // seats: selectedVehicle.seats || null,
        // is_primary: selectedVehicle.is_primary || false,
        // status: selectedVehicle.status || "active",
        // verification_status: selectedVehicle.verification_status || "pending",
        // registration_number: selectedVehicle.registration_number || null,
        // registration_expiry: selectedVehicle.registration_expiry || null,
        // registration_state: selectedVehicle.registration_state || null,
        // insurance_provider: selectedVehicle.insurance_provider || null,
        // insurance_policy_number: selectedVehicle.insurance_policy_number || null,
        // insurance_expiry: selectedVehicle.insurance_expiry || null,
        // inspection_date: selectedVehicle.inspection_date || null,
        // inspection_expiry: selectedVehicle.inspection_expiry || null,
        // inspection_certificate: selectedVehicle.inspection_certificate || null,
        // mileage: selectedVehicle.mileage || null,
        // condition_rating: selectedVehicle.condition_rating || null,
        // last_maintenance_date: selectedVehicle.last_maintenance_date || null,
        // next_maintenance_due: selectedVehicle.next_maintenance_due || null,
        // notes: selectedVehicle.notes || null,
      }
    : {
        driver_id: null as number|null,
        make: "",
        // model: "",
        // year: new Date().getFullYear(),
        color: null as string | null,
        // license_plate: "",
        // vin: null as string | null,
        vehicle_type_id: 1, // Default to first vehicle type (will be set properly when vehicle types are loaded)
        head: {
        model: "",
        year: null as number|null,
        license_plate: "",
        chassis_number: "",
         engine_number: null as string | null,
         number_of_axles: 0,
        max_load: 0,
        length: 0,
  },

  trailer: {
    model: "",
    year: null as number|null,
    license_plate: "",
    chassis_number: "",
    number_of_axles: 0,
    max_load: 0,
    length: 0,
  },
        fuel_type: null as string | null,
        transmission: null as string | null,
        doors: null as number | null,
        seats: null as number | null,
        is_primary: false,
        status: "active" as typeof VEHICLE_STATUSES[number],
        verification_status: "pending" as typeof VEHICLE_VERIFICATION_STATUSES[number],
        registration_number: null as string | null,
        registration_expiry: null as string | null,
        registration_state: null as string | null,
        insurance_provider: null as string | null,
        insurance_policy_number: null as string | null,
        insurance_expiry: null as string | null,
        inspection_date: null as string | null,
        inspection_expiry: null as string | null,
        inspection_certificate: null as string | null,
        mileage: null as number | null,
        condition_rating: null as number | null,
        last_maintenance_date: null as string | null,
        next_maintenance_due: null as string | null,
        notes: null as string | null,
      };
      

  return { VehicleSchema, VehicleInitialValues };
};

export default useVehicleSchema;
