import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import { BasicButton } from "../../mui/buttons/BasicButton";
import FormSection from "../../components/common/FormSection/FormSection";
import type { FormiksTypes, DepositFormTypes } from "../../types/forms";

interface DepositFormProps extends FormiksTypes<DepositFormTypes> {
  driverName?: string;
  onCancel?: () => void;
}

const DepositForm = ({
  formik,
  driverName,
  onCancel,
}: DepositFormProps) => {
  const { t } = useTranslation("forms/deposit_form");
  const isLoading = useFormsStore((state) => state.isLoading);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box className="grid justify-stretch items-start gap-6">
        {/* Basic Information Section */}
        <FormSection title={t("depositInformation", { defaultValue: "Deposit Information" })}>
          <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
            {driverName && (
              <Box className="col-span-full">
                <Input
                formik={formik}
                label={t("driver", { defaultValue: "Driver" })}
                name="driver"
                value={driverName || ""}
                disabled
              />
              </Box>
            )}
            <Input
              formik={formik}
              label={t("amount", { defaultValue: "Amount" })}
              name="amount"
              type="number"
              placeholder={t("amountPlaceholder", { defaultValue: "Enter amount" })}
            />
            <Box className="col-span-full">
              <Input
                formik={formik}
                label={t("description", { defaultValue: "Description" })}
                name="description"
                placeholder={t("descriptionPlaceholder", { defaultValue: "Enter description (optional)" })}
                textarea
                rows={3}
                optional
              />
            </Box>
            <Input
              formik={formik}
              label={t("referenceNumber", { defaultValue: "Reference Number" })}
              name="reference_number"
              placeholder={t("referenceNumberPlaceholder", { defaultValue: "Enter reference number (optional)" })}
              optional
            />
          </Box>
        </FormSection>

        {/* Action Buttons */}
        <Box className="flex justify-end items-center gap-4">
          {onCancel && (
            <BasicButton
              type="button"
              onClick={onCancel}
              className="!px-6 !py-2.5"
            >
              {t("cancel", { defaultValue: "Cancel" })}
            </BasicButton>
          )}
          <SubmitButton
            loading={isLoading}
            variant="gradient"
            className="!px-6 !py-2.5"
          >
            {t("addDeposit", { defaultValue: "Add Deposit" })}
          </SubmitButton>
        </Box>
      </Box>
    </form>
  );
};

export default DepositForm;

