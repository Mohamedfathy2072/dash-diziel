import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { createComplaint, updateComplaint } from "../../store/complaintsSlice";
import { useFormsStore } from "../../globals/formsStore";
import { handleToaster } from "../../functions/handleToaster";
import type { ComplaintFormTypes } from "../../types/forms";
import type { AppDispatch } from "../../store/store";
import { useParams } from "react-router-dom";

const useComplaintSubmit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("forms/complaint_form");
  const { id } = useParams();
  const setLoading = useFormsStore((state) => state.setLoading);
  const isLoading = useFormsStore((state) => state.isLoading);

  const addComplaint = async (values: ComplaintFormTypes) => {
    if (isLoading) return;
    
    setLoading(true);
    try {
      // Prepare data for API
      const data: any = {
        subject: values.subject,
        description: values.description,
        complaintable_type: values.complaintable_type || null,
        complaintable_id: values.complaintable_id || null,
      };

      await dispatch(createComplaint(data)).unwrap();
      handleToaster({
        msg: t("complaint_created_successfully", { defaultValue: "Complaint created successfully" }),
        status: "success",
      });
      navigate(`${import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}`);
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("failed_to_create_complaint", { defaultValue: "Failed to create complaint" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const editComplaint = async (values: ComplaintFormTypes) => {
    if (isLoading || !id) return;
    
    setLoading(true);
    try {
      // Prepare data for API
      const data: any = {
        subject: values.subject,
        description: values.description,
      };

      await dispatch(updateComplaint({ id: +id, data })).unwrap();
      handleToaster({
        msg: t("complaint_updated_successfully", { defaultValue: "Complaint updated successfully" }),
        status: "success",
      });
      navigate(`${import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}/${id}`);
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("failed_to_update_complaint", { defaultValue: "Failed to update complaint" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { addComplaint, editComplaint };
};

export default useComplaintSubmit;

