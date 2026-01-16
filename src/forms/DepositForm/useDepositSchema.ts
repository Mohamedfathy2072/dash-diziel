import { useTranslation } from "react-i18next";
import * as yup from "yup";

const useDepositSchema = () => {
  const { t } = useTranslation("forms/deposit_form");

  const DepositSchema = yup.object({
    amount: yup
      .number()
      .required(t("amount_required", { defaultValue: "Amount is required" }))
      .min(0.01, t("amount_min", { defaultValue: "Amount must be greater than 0" }))
      .typeError(t("amount_invalid", { defaultValue: "Amount must be a number" })),
    description: yup
      .string()
      .nullable()
      .max(500, t("description_max", { defaultValue: "Description must be less than 500 characters" })),
    reference_number: yup
      .string()
      .nullable()
      .max(100, t("reference_number_max", { defaultValue: "Reference number must be less than 100 characters" })),
    metadata: yup
      .object()
      .nullable(),
  });

  const DepositInitialValues: {
    amount: number;
    description?: string;
    reference_number?: string;
    metadata?: Record<string, any> | null;
    type?: string;
  } = {
    amount: 0,
    description: undefined,
    reference_number: undefined,
    metadata: null,
    type: "manual", // Default to "manual" for admin manual deposits
  };

  return {
    DepositInitialValues,
    DepositSchema,
  };
};

export default useDepositSchema;

