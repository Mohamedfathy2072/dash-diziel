import { useTranslation } from "react-i18next";
import * as yup from "yup";
import {
  DRIVER_STATUSES,
  DRIVER_AVAILABILITY_STATUSES,
  type DriverStatus,
  type DriverAvailabilityStatus,
} from "../../types/enums";
import type { Driver } from "../../types/domain";

const useDriverSchema = (isEdit = false, selectedDriver?: Driver | null) => {
  const { t } = useTranslation("forms/driver_form");

  const DriverSchema = yup.object({
    user_id: yup
      .number()
      .nullable()
      .integer(),
    name: yup
      .string()
      .trim()
      .max(255, t("name_max", { defaultValue: "Name must be less than 255 characters" }))
      .when("user_id", {
        is: (val: number | null) => !val,
        then: (schema) => schema.required(t("name_required", { defaultValue: "Name is required" })),
        otherwise: (schema) => schema.nullable(),
      }),
    email: yup
      .string()
      .trim()
      .email(t("email_invalid", { defaultValue: "Invalid email address" }))
      .max(255, t("email_max", { defaultValue: "Email must be less than 255 characters" }))
      .when("user_id", {
        is: (val: number | null) => !val,
        then: (schema) => schema.required(t("email_required", { defaultValue: "Email is required" })),
        otherwise: (schema) => schema.nullable(),
      }),
    password: yup
      .string()
      .trim()
      .when(["user_id", "isEdit"], {
        is: (user_id: number | null, isEdit: boolean) => !user_id && !isEdit,
        then: (schema) => schema
          .min(8, t("password_min", { defaultValue: "Password must be at least 8 characters" }))
          .required(t("password_required", { defaultValue: "Password is required" })),
        otherwise: (schema) => schema
          .min(8, t("password_min", { defaultValue: "Password must be at least 8 characters" }))
          .nullable(),
      }),
    password_confirmation: yup
      .string()
      .trim()
      .when("password", {
        is: (val: string) => val && val.length > 0,
        then: (schema) =>
          schema
            .required(t("password_confirmation_required", { defaultValue: "Password confirmation is required" }))
            .oneOf([yup.ref("password")], t("password_mismatch", { defaultValue: "Passwords do not match" })),
        otherwise: (schema) => schema.nullable(),
      }),
    phone: yup
      .string()
      .nullable()
      .max(20, t("phone_max", { defaultValue: "Phone must be less than 20 characters" })),
    photo_url: yup
      .string()
      .nullable()
      .url(t("photo_url_invalid", { defaultValue: "Invalid photo URL" }))
      .max(255, t("photo_url_max", { defaultValue: "Photo URL must be less than 255 characters" })),
    date_of_birth: yup
      .string()
      .nullable()
      .matches(/^\d{4}-\d{2}-\d{2}$/, t("date_invalid", { defaultValue: "Invalid date format (YYYY-MM-DD)" })),
    gender: yup
      .string()
      .nullable()
      .oneOf(["male", "female", "other"], t("gender_invalid", { defaultValue: "Invalid gender" })),
    address: yup
      .string()
      // .required("العنوان مطلوب")
      .max(255, t("address_max", { defaultValue: "Address must be less than 255 characters" })),
    governorate_id: yup
      .number()
      .nullable()
      .typeError(t("", { defaultValue: "يرجى اختيار المحافظة" })),

    driver_type: yup
      .string()
      .nullable()
      .max(50, t("", { defaultValue: "نوع السائق لا يجب أن يزيد عن 50 حرفًا" })),

    license_degree: yup
      .string()
      .nullable()
      .max(50, t("", { defaultValue: "درجة الرخصة لا يجب أن تزيد عن 50 حرفًا" })),

    national_id: yup
      .string()
      .nullable()
      .max(20, t("", { defaultValue: "الرقم القومي لا يجب أن يزيد عن 20 رقمًا" })),
   
    city: yup
      .string()
      .nullable()
      .max(255, t("city_max", { defaultValue: "City must be less than 255 characters" })),
    state: yup
      .string()
      .nullable()
      .max(255, t("state_max", { defaultValue: "State must be less than 255 characters" })),
    postal_code: yup
      .string()
      .nullable()
      .max(20, t("postal_code_max", { defaultValue: "Postal code must be less than 20 characters" })),
    country: yup
      .string()
      .nullable()
      .max(50, t("country_max", { defaultValue: "Country must be less than 50 characters" })),
    // Driver-specific fields (all optional)
    emergency_contact_name: yup
      .string()
      .nullable()
      .max(255, t("emergency_contact_name_max", { defaultValue: "Emergency contact name must be less than 255 characters" })),
    emergency_contact_phone: yup
      .string()
      .nullable()
      .max(20, t("emergency_contact_phone_max", { defaultValue: "Emergency contact phone must be less than 20 characters" })),
    license_number: yup
      .string()
      .nullable()
      .max(50, t("license_number_max", { defaultValue: "License number must be less than 50 characters" })),
    license_class: yup
      .string()
      .nullable()
      .max(20, t("license_class_max", { defaultValue: "License class must be less than 20 characters" })),
    license_type: yup
      .string()
      .nullable()
      .max(20, t("license_type_max", { defaultValue: "License type must be less than 20 characters" })),
    license_issue_date: yup
      .string()
      .nullable()
      .matches(/^\d{4}-\d{2}-\d{2}$/, t("date_invalid", { defaultValue: "Invalid date format (YYYY-MM-DD)" })),
    license_expiry_date: yup
      .string()
      .nullable()
      .matches(/^\d{4}-\d{2}-\d{2}$/, t("date_invalid", { defaultValue: "Invalid date format (YYYY-MM-DD)" })),
    license_issuing_state: yup
      .string()
      .nullable()
      .max(50, t("license_issuing_state_max", { defaultValue: "License issuing state must be less than 50 characters" })),
    license_issuing_country: yup
      .string()
      .nullable()
      .max(3, t("license_issuing_country_max", { defaultValue: "License issuing country must be less than 3 characters" })),
    status: yup
      .string()
      .nullable()
      .oneOf(DRIVER_STATUSES, t("status_invalid", { defaultValue: "Invalid status" })) as yup.StringSchema<DriverStatus | null>,
    availability_status: yup
      .string()
      .nullable()
      .oneOf(DRIVER_AVAILABILITY_STATUSES, t("availability_status_invalid", { defaultValue: "Invalid availability status" })) as yup.StringSchema<DriverAvailabilityStatus | null>,
  });

  const DriverInitialValues = isEdit && selectedDriver
    ? {
        user_id: selectedDriver.user_id || null,
        name: selectedDriver.name || "",
        email: selectedDriver.email || "",
        password: "",
        password_confirmation: "",
        phone: selectedDriver.phone || null,
        photo_url: selectedDriver.photo_url || null,
        date_of_birth: selectedDriver.date_of_birth || null,
        gender: selectedDriver.gender || null,
        address: selectedDriver?.address || "",
        governorate_id: selectedDriver?.governorate_id ?? "",
        driver_type: selectedDriver?.driver_type || "",
        license_degree: selectedDriver?.license_degree || "",
        national_id: selectedDriver?.national_id || "",
        city: selectedDriver.city || null,
        state: selectedDriver.state || null,
        postal_code: selectedDriver.postal_code || null,
        country: selectedDriver.country || null,
        emergency_contact_name: selectedDriver.emergency_contact_name || null,
        emergency_contact_phone: selectedDriver.emergency_contact_phone || null,
        license_number: selectedDriver.license_number || "",
        license_class: selectedDriver.license_class || null,
        license_type: selectedDriver.license_type || null,
        license_issue_date: selectedDriver.license_issue_date || null,
        license_expiry_date: selectedDriver.license_expiry_date || "",
        license_issuing_state: selectedDriver.license_issuing_state || selectedDriver.license_state || null,
        license_issuing_country: selectedDriver.license_issuing_country || null,
        status: selectedDriver.status || "pending",
        availability_status: selectedDriver.availability_status || null,
      }
    : {
        user_id: null as number | null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: null as string | null,
        photo_url: null as string | null,
        date_of_birth: null as string | null,
        gender: null as "male" | "female" | "other" | null,
        address: null as string | null,
        governorate_id: "",
        driver_type: null as string | null,
        license_degree: null as string | null,
        national_id: null as string | null,
        city: null as string | null,
        state: null as string | null,
        postal_code: null as string | null,
        country: null as string | null,
        emergency_contact_name: null as string | null,
        emergency_contact_phone: null as string | null,
        license_number: "",
        license_class: null as string | null,
        license_type: null as string | null,
        license_issue_date: null as string | null,
        license_expiry_date: "",
        license_issuing_state: null as string | null,
        license_issuing_country: null as string | null,
        status: "pending" as DriverStatus,
        availability_status: null as DriverAvailabilityStatus | null,
      };

  return { DriverSchema, DriverInitialValues };
};

export default useDriverSchema;

