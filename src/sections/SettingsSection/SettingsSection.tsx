import { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { settingsService } from "../../services/api";
import PrimaryCard from "../../components/PrimaryCard/PrimaryCard";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { BasicButton } from "../../mui/buttons/BasicButton";
import FormSection from "../../components/common/FormSection/FormSection";
import { useFormsStore } from "../../globals/formsStore";
import { handleToaster } from "../../functions/handleToaster";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useFormik } from "formik";
import * as Yup from "yup";

interface Setting {
  id: number;
  key: string;
  value: string;
  type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const SettingsSection = () => {
  const { t } = useTranslation("sections/settings_section");
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdminUser = user?.type === 'superAdmin';
  const isLoading = useFormsStore((state) => state.isLoading);
  const setFormsLoading = useFormsStore((state) => state.setLoading);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoadingState] = useState(true);
  const [initialValues, setInitialValues] = useState({
    platform_fee_percentage: "",
    max_driver_debt_limit: "",
  });

  // Validation schema
  const validationSchema = Yup.object({
    platform_fee_percentage: Yup.number()
      .required(t("platformFeePercentageRequired", { defaultValue: "Platform fee percentage is required" }))
      .min(0, t("platformFeePercentageMin", { defaultValue: "Must be at least 0" }))
      .max(100, t("platformFeePercentageMax", { defaultValue: "Must be at most 100" })),
    max_driver_debt_limit: Yup.number()
      .required(t("maxDriverDebtLimitRequired", { defaultValue: "Max driver debt limit is required" }))
      .min(0, t("maxDriverDebtLimitMin", { defaultValue: "Must be at least 0" })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setFormsLoading(true);

        // Update platform fee percentage
        if (values.platform_fee_percentage !== initialValues.platform_fee_percentage) {
          await settingsService.updatePlatformFeePercentage(Number(values.platform_fee_percentage));
        }

        // Update max driver debt limit
        if (values.max_driver_debt_limit !== initialValues.max_driver_debt_limit) {
          await settingsService.updateMaxDriverDebtLimit(Number(values.max_driver_debt_limit));
        }

        handleToaster({
          msg: t("settingsUpdatedSuccessfully", { defaultValue: "Settings updated successfully" }),
          status: "success",
        });

        // Reload settings
        await fetchSettings();
      } catch (error: any) {
        handleToaster({
          msg: error.response?.data?.message || t("errorUpdatingSettings", { defaultValue: "Error updating settings" }),
          status: "error",
        });
      } finally {
        setFormsLoading(false);
      }
    },
  });

  const fetchSettings = useCallback(async () => {
    try {
      setLoadingState(true);
      const response = await settingsService.getAll();
      const settingsData = response.data.data || [];
      setSettings(settingsData);

      // Extract values for form
      const platformFee = settingsData.find((s: Setting) => s.key === "platform_fee_percentage");
      const maxDebtLimit = settingsData.find((s: Setting) => s.key === "max_driver_debt_limit");

      const newInitialValues = {
        platform_fee_percentage: platformFee?.value || "",
        max_driver_debt_limit: maxDebtLimit?.value || "",
      };

      setInitialValues(newInitialValues);
    } catch (error: any) {
      handleToaster({
        msg: error.response?.data?.message || t("errorLoadingSettings", { defaultValue: "Error loading settings" }),
        status: "error",
      });
    } finally {
      setLoadingState(false);
    }
  }, [t]);

  useEffect(() => {
    if (isSuperAdminUser) {
      fetchSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdminUser]);

  // Update formik when initialValues change
  useEffect(() => {
    if (initialValues.platform_fee_percentage !== "" || initialValues.max_driver_debt_limit !== "") {
      formik.setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  if (!isSuperAdminUser) {
    return null;
  }

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </Box>
    );
  }

  const platformFeeSetting = settings.find((s) => s.key === "platform_fee_percentage");
  const maxDebtLimitSetting = settings.find((s) => s.key === "max_driver_debt_limit");

  return (
    <Box className="grid justify-stretch items-start gap-6">
      <Typography variant="h4" className="!font-[700]">
        {t("title", { defaultValue: "Settings" })}
      </Typography>

      <PrimaryCard>
        <form onSubmit={formik.handleSubmit}>
          <Box className="grid justify-stretch items-start gap-6">
            {/* Platform Fee Percentage Section */}
            <FormSection title={t("platformFeePercentage", { defaultValue: "Platform Fee Percentage" })}>
              <Box className="grid justify-stretch items-start gap-5">
                <Input
                  formik={formik}
                  label={t("platformFeePercentageLabel", { defaultValue: "Platform Fee Percentage (%)" })}
                  name="platform_fee_percentage"
                  type="number"
                  placeholder={t("platformFeePercentagePlaceholder", { defaultValue: "Enter platform fee percentage (0-100)" })}
                />
                {platformFeeSetting?.description && (
                  <Typography variant="body2" className="!text-gray-600 !text-sm">
                    {platformFeeSetting.description}
                  </Typography>
                )}
                <Typography variant="body2" className="!text-gray-500 !text-xs">
                  {t("platformFeePercentageNote", { defaultValue: "Note: The value must be between 0 and 100. Example: 15 means 15%" })}
                </Typography>
              </Box>
            </FormSection>

            {/* Max Driver Debt Limit Section */}
            <FormSection title={t("maxDriverDebtLimit", { defaultValue: "Max Driver Debt Limit" })}>
              <Box className="grid justify-stretch items-start gap-5">
                <Input
                  formik={formik}
                  label={t("maxDriverDebtLimitLabel", { defaultValue: "Max Driver Debt Limit" })}
                  name="max_driver_debt_limit"
                  type="number"
                  placeholder={t("maxDriverDebtLimitPlaceholder", { defaultValue: "Enter max driver debt limit" })}
                />
                {maxDebtLimitSetting?.description && (
                  <Typography variant="body2" className="!text-gray-600 !text-sm">
                    {maxDebtLimitSetting.description}
                  </Typography>
                )}
                <Typography variant="body2" className="!text-gray-500 !text-xs">
                  {t("maxDriverDebtLimitNote", { defaultValue: "Note: Set to 0 for unlimited debt. If a driver exceeds this limit, they cannot accept new trips until the debt is paid." })}
                </Typography>
              </Box>
            </FormSection>

            {/* Action Buttons */}
            <Box className="flex justify-end items-center gap-4 pt-4">
              <BasicButton
                type="button"
                onClick={() => {
                  formik.setValues(initialValues);
                  formik.resetForm();
                }}
                className="!px-6 !py-2.5"
              >
                {t("reset", { defaultValue: "Reset" })}
              </BasicButton>
              <SubmitButton
                loading={isLoading}
                variant="gradient"
                className="!px-6 !py-2.5"
              >
                {t("updateSettings", { defaultValue: "Update Settings" })}
              </SubmitButton>
            </Box>
          </Box>
        </form>
      </PrimaryCard>
    </Box>
  );
};

export default SettingsSection;

