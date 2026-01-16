import { useParams } from "react-router-dom";
import { handleToaster } from "../../functions/handleToaster";
import type { DepositFormTypes } from "../../types/forms";
import { driverService } from "../../services/api";
import { useFormsStore } from "../../globals/formsStore";
import { useTranslation } from "react-i18next";

const useDepositSubmit = () => {
  const { id } = useParams();
  const { t } = useTranslation("forms/deposit_form");
  const setLoading = useFormsStore((state) => state.setLoading);
  const isLoading = useFormsStore((state) => state.isLoading);

  const addDeposit = async (values: DepositFormTypes, onSuccess?: () => void) => {
    if (isLoading || !id) return;
    
    setLoading(true);
    try {
      const data: any = {
        amount: values.amount,
        type: values.type || "manual", // Always send "manual" for admin manual deposits
        description: values.description && values.description.trim() ? values.description.trim() : undefined,
        reference_number: values.reference_number && values.reference_number.trim() ? values.reference_number.trim() : undefined,
        metadata: values.metadata || undefined,
      };

      await driverService.addDeposit(id, data);
      
      handleToaster({
        msg: t("deposit_added_successfully", { defaultValue: "Deposit added successfully" }),
        status: "success",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      handleToaster({
        msg: error?.response?.data?.message || error?.message || t("failed_to_add_deposit", { defaultValue: "Failed to add deposit" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { addDeposit };
};

export default useDepositSubmit;

