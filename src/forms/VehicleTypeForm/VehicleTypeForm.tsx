import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import { BasicButton } from "../../mui/buttons/BasicButton";
import FormSection from "../../components/common/FormSection/FormSection";
import type { FormiksTypes, VehicleTypeFormTypes } from "../../types/forms";

const VehicleTypeForm = ({
  formik,
  type,
}: FormiksTypes<VehicleTypeFormTypes> & {
  type?: "addVehicleType" | "editVehicleType";
}) => {
  const { t } = useTranslation("forms/vehicle_type_form");
  const isLoading = useFormsStore((state) => state.isLoading);
  const navigate = useNavigate();
  const isEdit = type === "editVehicleType";

  return (
    <Box className="grid justify-stretch items-start gap-6">
      {/* Basic Information Section */}
      <FormSection title={t("basicInformation", { defaultValue: "Basic Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("name", { defaultValue: "Name" })}
            name="name"
            placeholder={t("namePlaceholder", { defaultValue: "Enter vehicle type name" })}
          />
          <Input
            formik={formik}
            label={t("nameAr", { defaultValue: "Arabic Name" })}
            name="name_ar"
            placeholder={t("nameArPlaceholder", { defaultValue: "Enter Arabic vehicle type name" })}
          />
          <Input
            formik={formik}
            label={t("status", { defaultValue: "Status" })}
            name="status"
            select
            options={["Active", "Inactive"]}
            values={["active", "inactive"]}
            placeholder={t("statusPlaceholder", { defaultValue: "Select status" })}
            optional
          />
          <Input
            formik={formik}
            label={t("order", { defaultValue: "Order" })}
            name="order"
            type="number"
            placeholder={t("orderPlaceholder", { defaultValue: "Enter display order" })}
            optional
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
            ? t("updateVehicleType", { defaultValue: "Update Vehicle Type" })
            : t("createVehicleType", { defaultValue: "Create Vehicle Type" })}
        </SubmitButton>
      </Box>
    </Box>
  );
};

export default VehicleTypeForm;

