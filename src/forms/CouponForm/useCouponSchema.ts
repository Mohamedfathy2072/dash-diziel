import { useTranslation } from "react-i18next";
import * as yup from "yup";
import type { Coupon } from "../../types/domain";

const useCouponSchema = (isEdit = false, selectedCoupon?: Coupon | null) => {
  const { t } = useTranslation("forms/coupon_form");

  const CouponSchema = yup.object({
    code: yup
      .string()
      .trim()
      .max(50, t("code_max", { defaultValue: "Code must be less than 50 characters" }))
      .required(t("code_required", { defaultValue: "Code is required" })),
    type: yup
      .string()
      .oneOf(["percentage", "fixed_amount"], t("type_invalid", { defaultValue: "Invalid type" }))
      .required(t("type_required", { defaultValue: "Type is required" })),
    value: yup
      .number()
      .min(0, t("value_min", { defaultValue: "Value must be at least 0" }))
      .required(t("value_required", { defaultValue: "Value is required" })),
    min_order_amount: yup
      .number()
      .nullable()
      .min(0, t("min_order_amount_min", { defaultValue: "Minimum order amount must be at least 0" })),
    max_discount: yup
      .number()
      .nullable()
      .when("type", {
        is: "percentage",
        then: (schema) => schema.min(0, t("max_discount_min", { defaultValue: "Max discount must be at least 0" })),
        otherwise: (schema) => schema.nullable(),
      }),
    usage_limit: yup
      .number()
      .nullable()
      .min(1, t("usage_limit_min", { defaultValue: "Usage limit must be at least 1" })),
    user_limit: yup
      .number()
      .min(1, t("user_limit_min", { defaultValue: "User limit must be at least 1" }))
      .required(t("user_limit_required", { defaultValue: "User limit is required" })),
    valid_from: yup
      .string()
      .required(t("valid_from_required", { defaultValue: "Valid from date is required" })),
    valid_until: yup
      .string()
      .required(t("valid_until_required", { defaultValue: "Valid until date is required" }))
      .test("is-after-valid-from", t("valid_until_after", { defaultValue: "Valid until must be after valid from" }), function(value) {
        const { valid_from } = this.parent;
        if (!value || !valid_from) return true;
        return new Date(value) > new Date(valid_from);
      }),
    is_active: yup
      .boolean()
      .required(t("is_active_required", { defaultValue: "Active status is required" })),
    applicable_to: yup
      .string()
      .oneOf(["all", "specific_vehicle_types"], t("applicable_to_invalid", { defaultValue: "Invalid applicable to value" }))
      .required(t("applicable_to_required", { defaultValue: "Applicable to is required" })),
    vehicle_types: yup
      .array()
      .of(yup.number())
      .when("applicable_to", {
        is: "specific_vehicle_types",
        then: (schema) => schema
          .min(1, t("vehicle_types_required", { defaultValue: "At least one vehicle type is required" }))
          .required(t("vehicle_types_required", { defaultValue: "Vehicle types are required" })),
        otherwise: (schema) => schema.nullable(),
      }),
    description: yup
      .string()
      .nullable()
      .max(500, t("description_max", { defaultValue: "Description must be less than 500 characters" })),
  });

  const CouponInitialValues = isEdit && selectedCoupon
    ? {
        code: selectedCoupon.code || "",
        type: selectedCoupon.type || "percentage",
        value: selectedCoupon.value || 0,
        min_order_amount: selectedCoupon.min_order_amount || null,
        max_discount: selectedCoupon.max_discount || null,
        usage_limit: selectedCoupon.usage_limit || null,
        user_limit: selectedCoupon.user_limit || 1,
        valid_from: selectedCoupon.valid_from ? new Date(selectedCoupon.valid_from).toISOString().split('T')[0] : "",
        valid_until: selectedCoupon.valid_until ? new Date(selectedCoupon.valid_until).toISOString().split('T')[0] : "",
        is_active: selectedCoupon.is_active ?? true,
        applicable_to: selectedCoupon.applicable_to || "all",
        vehicle_types: selectedCoupon.vehicle_types?.map(vt => vt.id) || [],
        description: selectedCoupon.description || null,
      }
    : {
        code: "",
        type: "percentage" as "percentage" | "fixed_amount",
        value: 0,
        min_order_amount: null as number | null,
        max_discount: null as number | null,
        usage_limit: null as number | null,
        user_limit: 1,
        valid_from: "",
        valid_until: "",
        is_active: true,
        applicable_to: "all" as "all" | "specific_vehicle_types",
        vehicle_types: [] as number[],
        description: null as string | null,
      };

  return { CouponSchema, CouponInitialValues };
};

export default useCouponSchema;

