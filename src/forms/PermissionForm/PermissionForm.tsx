import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import { BasicButton } from "../../mui/buttons/BasicButton";
import FormSection from "../../components/common/FormSection/FormSection";
import type { FormiksTypes, PermissionFormTypes } from "../../types/forms";
import { fetchPermissionGroups } from "../../store/permissionsSlice";
import type { RootState, AppDispatch } from "../../store/store";

const PermissionForm = ({
  formik,
  type,
}: FormiksTypes<PermissionFormTypes> & {
  type?: "addPermission" | "editPermission";
}) => {
  const { t } = useTranslation("forms/permission_form");
  const isLoading = useFormsStore((state) => state.isLoading);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isEdit = type === "editPermission";
  const { groups } = useSelector((state: RootState) => state.permissions);

  useEffect(() => {
    dispatch(fetchPermissionGroups());
  }, [dispatch]);

  return (
    <Box className="grid justify-stretch items-start gap-6">
      {/* Basic Information Section */}
      <FormSection title={t("basicInformation", { defaultValue: "Basic Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("name", { defaultValue: "Name" })}
            name="name"
            placeholder={t("namePlaceholder", { defaultValue: "Enter permission name" })}
          />
          <Input
            formik={formik}
            label={t("slug", { defaultValue: "Slug" })}
            name="slug"
            placeholder={t("slugPlaceholder", { defaultValue: "Enter slug (optional, auto-generated from name)" })}
            optional
          />
          {groups.length > 0 && (
            <Input
              formik={formik}
              label={t("group", { defaultValue: "Group" })}
              name="group"
              select
              options={["", ...groups]}
              values={["", ...groups]}
              placeholder={t("groupPlaceholder", { defaultValue: "Select group (optional)" })}
              optional
            />
          )}
          {groups.length === 0 && (
            <Input
              formik={formik}
              label={t("group", { defaultValue: "Group" })}
              name="group"
              placeholder={t("groupPlaceholder", { defaultValue: "Enter group name (optional)" })}
              optional
            />
          )}
          <Box className="col-span-full">
            <Input
              formik={formik}
              label={t("description", { defaultValue: "Description" })}
              name="description"
              placeholder={t("descriptionPlaceholder", { defaultValue: "Enter description" })}
              textarea
              rows={3}
              optional
            />
          </Box>
        </Box>
      </FormSection>

      {/* Action Buttons */}
      <Box className="flex justify-end items-center gap-4">
        <BasicButton
          type="button"
          onClick={() => navigate(`${import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions"}`)}
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
            ? t("updatePermission", { defaultValue: "Update Permission" })
            : t("createPermission", { defaultValue: "Create Permission" })}
        </SubmitButton>
      </Box>
    </Box>
  );
};

export default PermissionForm;

