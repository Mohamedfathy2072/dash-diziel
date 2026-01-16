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
import type { FormiksTypes, CouponFormTypes } from "../../types/forms";
import useVehicleTypes from "../../hooks/useVehicleTypes";

const CouponForm = ({
  formik,
  type,
}: FormiksTypes<CouponFormTypes> & {
  type?: "addCoupon" | "editCoupon";
}) => {
  const { t } = useTranslation("forms/coupon_form");
  const isLoading = useFormsStore((state) => state.isLoading);
  const navigate = useNavigate();
  const isEdit = type === "editCoupon";
  const { activeVehicleTypes } = useVehicleTypes();

  const showMaxDiscount = formik.values.type === "percentage";
  const showVehicleTypes = formik.values.applicable_to === "specific_vehicle_types";

  return (
    <Box className="grid justify-stretch items-start gap-6">
      {/* Basic Information Section */}
      <FormSection title={t("basicInformation", { defaultValue: "Basic Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("code", { defaultValue: "Code" })}
            name="code"
            placeholder={t("codePlaceholder", { defaultValue: "Enter coupon code" })}
          />
          <Input
            formik={formik}
            label={t("type", { defaultValue: "Type" })}
            name="type"
            select
            options={["Percentage", "Fixed Amount"]}
            values={["percentage", "fixed_amount"]}
            placeholder={t("typePlaceholder", { defaultValue: "Select type" })}
          />
          <Input
            formik={formik}
            label={t("value", { defaultValue: "Value" })}
            name="value"
            type="number"
            placeholder={t("valuePlaceholder", { defaultValue: "Enter value" })}
          />
          {showMaxDiscount && (
            <Input
              formik={formik}
              label={t("maxDiscount", { defaultValue: "Max Discount" })}
              name="max_discount"
              type="number"
              placeholder={t("maxDiscountPlaceholder", { defaultValue: "Enter max discount" })}
              optional
            />
          )}
          <Input
            formik={formik}
            label={t("description", { defaultValue: "Description" })}
            name="description"
            placeholder={t("descriptionPlaceholder", { defaultValue: "Enter description" })}
            optional
          />
        </Box>
      </FormSection>

      {/* Limits Section */}
      <FormSection title={t("limits", { defaultValue: "Limits" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("minOrderAmount", { defaultValue: "Min Order Amount" })}
            name="min_order_amount"
            type="number"
            placeholder={t("minOrderAmountPlaceholder", { defaultValue: "Enter minimum order amount" })}
            optional
          />
          <Input
            formik={formik}
            label={t("usageLimit", { defaultValue: "Usage Limit" })}
            name="usage_limit"
            type="number"
            placeholder={t("usageLimitPlaceholder", { defaultValue: "Enter usage limit" })}
            optional
          />
          <Input
            formik={formik}
            label={t("userLimit", { defaultValue: "User Limit" })}
            name="user_limit"
            type="number"
            placeholder={t("userLimitPlaceholder", { defaultValue: "Enter user limit" })}
          />
        </Box>
      </FormSection>

      {/* Validity Section */}
      <FormSection title={t("validity", { defaultValue: "Validity" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("validFrom", { defaultValue: "Valid From" })}
            name="valid_from"
            type="date"
            placeholder={t("validFromPlaceholder", { defaultValue: "Select valid from date" })}
          />
          <Input
            formik={formik}
            label={t("validUntil", { defaultValue: "Valid Until" })}
            name="valid_until"
            type="date"
            placeholder={t("validUntilPlaceholder", { defaultValue: "Select valid until date" })}
          />
        </Box>
      </FormSection>

      {/* Applicability Section */}
      <FormSection title={t("applicability", { defaultValue: "Applicability" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("applicableTo", { defaultValue: "Applicable To" })}
            name="applicable_to"
            select
            options={["All", "Specific Vehicle Types"]}
            values={["all", "specific_vehicle_types"]}
            placeholder={t("applicableToPlaceholder", { defaultValue: "Select applicability" })}
          />
          {showVehicleTypes && (
            <Box>
              <Box className="mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("vehicleTypes", { defaultValue: "Vehicle Types" })}
                </label>
              </Box>
              <Box className="grid grid-cols-2 md:grid-cols-1 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded p-3">
                {activeVehicleTypes.map((vt) => (
                  <FormControlLabel
                    key={vt.id}
                    control={
                      <Checkbox
                        checked={formik.values.vehicle_types.includes(vt.id)}
                        onChange={(e) => {
                          const currentTypes = formik.values.vehicle_types;
                          if (e.target.checked) {
                            formik.setFieldValue("vehicle_types", [...currentTypes, vt.id]);
                          } else {
                            formik.setFieldValue("vehicle_types", currentTypes.filter(id => id !== vt.id));
                          }
                        }}
                      />
                    }
                    label={vt.name}
                  />
                ))}
              </Box>
            </Box>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.is_active}
                onChange={(e) => formik.setFieldValue("is_active", e.target.checked)}
              />
            }
            label={t("isActive", { defaultValue: "Is Active" })}
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
            ? t("updateCoupon", { defaultValue: "Update Coupon" })
            : t("createCoupon", { defaultValue: "Create Coupon" })}
        </SubmitButton>
      </Box>
    </Box>
  );
};

export default CouponForm;

