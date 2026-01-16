import { useTranslation } from "react-i18next";
import * as yup from "yup";

const useNotificationSchema = () => {
  const { t } = useTranslation("forms/notification_form");

  const NotificationSchema = yup.object({
    title: yup
      .string()
      .trim()
      .required(t("title_required", { defaultValue: "Title is required" }))
      .max(200, t("title_max", { defaultValue: "Title must be less than 200 characters" })),
    body: yup
      .string()
      .trim()
      .required(t("body_required", { defaultValue: "Body is required" }))
      .max(1000, t("body_max", { defaultValue: "Body must be less than 1000 characters" })),
    target_type: yup
      .string()
      .oneOf(["user", "driver", "all_users", "all_drivers"], t("target_type_invalid", { defaultValue: "Invalid target type" }))
      .required(t("target_type_required", { defaultValue: "Target type is required" })),
    user_id: yup
      .number()
      .nullable()
      .when("target_type", {
        is: "user",
        then: (schema) => schema
          .required(t("user_id_required", { defaultValue: "User ID is required" }))
          .min(1, t("user_id_min", { defaultValue: "User ID must be at least 1" })),
        otherwise: (schema) => schema.nullable(),
      }),
    driver_id: yup
      .number()
      .nullable()
      .when("target_type", {
        is: "driver",
        then: (schema) => schema
          .required(t("driver_id_required", { defaultValue: "Driver ID is required" }))
          .min(1, t("driver_id_min", { defaultValue: "Driver ID must be at least 1" })),
        otherwise: (schema) => schema.nullable(),
      }),
  });

  const NotificationInitialValues = {
    title: "",
    body: "",
    target_type: "all_users" as "user" | "driver" | "all_users" | "all_drivers",
    user_id: null as number | null,
    driver_id: null as number | null,
  };

  return { NotificationSchema, NotificationInitialValues };
};

export default useNotificationSchema;

