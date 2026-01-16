import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import { BasicButton } from "../../mui/buttons/BasicButton";
import FormSection from "../../components/common/FormSection/FormSection";
import type { FormiksTypes, ComplaintFormTypes } from "../../types/forms";

const ComplaintForm = ({
  formik,
  type,
}: FormiksTypes<ComplaintFormTypes> & {
  type?: "addComplaint" | "editComplaint";
}) => {
  const { t } = useTranslation("forms/complaint_form");
  const isLoading = useFormsStore((state) => state.isLoading);
  const navigate = useNavigate();
  const isEdit = type === "editComplaint";

  const showComplaintableId = formik.values.complaintable_type !== null;

  const handleComplaintableTypeChange = (value: string) => {
    formik.setFieldValue("complaintable_type", value === "" ? null : value);
  };

  return (
    <Box className="grid justify-stretch items-start gap-6">
      {/* Basic Information Section */}
      <FormSection title={t("basicInformation", { defaultValue: "Basic Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("subject", { defaultValue: "Subject" })}
            name="subject"
            placeholder={t("subjectPlaceholder", { defaultValue: "Enter complaint subject" })}
          />
          <Input
            formik={formik}
            label={t("description", { defaultValue: "Description" })}
            name="description"
            placeholder={t("descriptionPlaceholder", { defaultValue: "Enter complaint description" })}
            rows={6}
          />
        </Box>
      </FormSection>

      {/* Complaint About Section */}
      <FormSection title={t("complaintAbout", { defaultValue: "Complaint About" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("complaintableType", { defaultValue: "Type" })}
            name="complaintable_type"
            select
            options={["General", "Trip", "Driver", "User"]}
            values={["", "Trip", "Driver", "User"]}
            placeholder={t("complaintableTypePlaceholder", { defaultValue: "Select type (optional)" })}
            optional
            change={handleComplaintableTypeChange}
          />
          {showComplaintableId && (
            <Input
              formik={formik}
              label={t("complaintableId", { defaultValue: "ID" })}
              name="complaintable_id"
              type="number"
              placeholder={t("complaintableIdPlaceholder", { defaultValue: "Enter ID" })}
            />
          )}
        </Box>
      </FormSection>

      {/* Submit Button */}
      <Box className="flex justify-end gap-4">
        <BasicButton
          onClick={() => navigate(`${import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}`)}
          disabled={isLoading}
        >
          {t("cancel", { defaultValue: "Cancel" })}
        </BasicButton>
        <SubmitButton
          loading={isLoading}
          disabled={isLoading}
        >
          {isEdit ? t("updateComplaint", { defaultValue: "Update Complaint" }) : t("createComplaint", { defaultValue: "Create Complaint" })}
        </SubmitButton>
      </Box>
    </Box>
  );
};

export default ComplaintForm;

