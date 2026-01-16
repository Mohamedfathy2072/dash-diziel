import { useTranslation } from "react-i18next";
import * as yup from "yup";
import type { VehicleType } from "../../types/domain";

const useVehicleTypeSchema = (isEdit = false, selectedVehicleType?: VehicleType | null) => {
  const { t } = useTranslation("forms/vehicle_type_form");

  const VehicleTypeSchema = yup.object({
    name: yup
      .string()
      .trim()
      .max(100, t("name_max", { defaultValue: "Name must be less than 100 characters" }))
      .required(t("name_required", { defaultValue: "Name is required" })),
    name_ar: yup
      .string()
      .trim()
      .max(100, t("name_ar_max", { defaultValue: "Arabic name must be less than 100 characters" }))
      .required(t("name_ar_required", { defaultValue: "Arabic name is required" })),
    status: yup
      .string()
      .oneOf(["active", "inactive"], t("status_invalid", { defaultValue: "Invalid status" }))
      .nullable(),
    order: yup
      .number()
      .nullable()
      .min(0, t("order_min", { defaultValue: "Order must be at least 0" })),
  });

  const VehicleTypeInitialValues = isEdit && selectedVehicleType
    ? {
        name: selectedVehicleType.name || "",
        name_ar: selectedVehicleType.name_ar || "",
        status: selectedVehicleType.status || "active",
        order: selectedVehicleType.order || null,
      }
    : {
        name: "",
        name_ar: "",
        status: "active" as "active" | "inactive",
        order: null as number | null,
      };

  return { VehicleTypeSchema, VehicleTypeInitialValues };
};

export default useVehicleTypeSchema;

