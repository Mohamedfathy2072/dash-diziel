import { useTranslation } from "react-i18next";
import * as yup from "yup";
import type { Complaint } from "../../types/domain";

const useComplaintSchema = (isEdit = false, selectedComplaint?: Complaint | null) => {
  const { t } = useTranslation("forms/complaint_form");

  const ComplaintSchema = yup.object({
    subject: yup
      .string()
      .trim()
      .max(255, t("subject_max", { defaultValue: "Subject must be less than 255 characters" }))
      .required(t("subject_required", { defaultValue: "Subject is required" })),
    description: yup
      .string()
      .trim()
      .max(2000, t("description_max", { defaultValue: "Description must be less than 2000 characters" }))
      .required(t("description_required", { defaultValue: "Description is required" })),
    complaintable_type: yup
      .string()
      .nullable()
      .oneOf(["Trip", "Driver", "User", null], t("complaintable_type_invalid", { defaultValue: "Invalid complaintable type" })),
    complaintable_id: yup
      .number()
      .nullable()
      .when("complaintable_type", {
        is: (val: string | null) => val !== null && val !== "",
        then: (schema) => schema
          .required(t("complaintable_id_required", { defaultValue: "Complaintable ID is required when type is selected" }))
          .integer(t("complaintable_id_integer", { defaultValue: "Complaintable ID must be an integer" })),
        otherwise: (schema) => schema.nullable(),
      }),
  });

  const ComplaintInitialValues = isEdit && selectedComplaint
    ? {
        subject: selectedComplaint.subject || "",
        description: selectedComplaint.description || "",
        complaintable_type: selectedComplaint.complaintable_type || null,
        complaintable_id: selectedComplaint.complaintable_id || null,
      }
    : {
        subject: "",
        description: "",
        complaintable_type: null as "Trip" | "Driver" | "User" | null,
        complaintable_id: null as number | null,
      };

  return { ComplaintSchema, ComplaintInitialValues };
};

export default useComplaintSchema;

