import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import { BasicButton } from "../../mui/buttons/BasicButton";
import FormSection from "../../components/common/FormSection/FormSection";
import type { FormiksTypes, RoleFormTypes } from "../../types/forms";
import { fetchPermissions } from "../../store/permissionsSlice";
import type { RootState, AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";

const RoleForm = ({
  formik,
  type,
}: FormiksTypes<RoleFormTypes> & {
  type?: "addRole" | "editRole";
}) => {
  const { t } = useTranslation("forms/role_form");
  const isLoading = useFormsStore((state) => state.isLoading);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isEdit = type === "editRole";
  const { permissions, groups } = useSelector((state: RootState) => state.permissions);
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  useEffect(() => {
    dispatch(fetchPermissions({ per_page: 1000, group_by: true }));
  }, [dispatch]);

  const filteredPermissions = selectedGroup
    ? permissions.filter(p => p.group === selectedGroup)
    : permissions;

  const allGroups = groups.length > 0 ? groups : Array.from(new Set(permissions.map(p => p.group).filter((g): g is string => Boolean(g))));

  return (
    <Box className="grid justify-stretch items-start gap-6">
      {/* Basic Information Section */}
      <FormSection title={t("basicInformation", { defaultValue: "Basic Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("name", { defaultValue: "Name" })}
            name="name"
            placeholder={t("namePlaceholder", { defaultValue: "Enter role name" })}
          />
          <Input
            formik={formik}
            label={t("slug", { defaultValue: "Slug" })}
            name="slug"
            placeholder={t("slugPlaceholder", { defaultValue: "Enter slug (optional, auto-generated from name)" })}
            optional
          />
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
          <FormControlLabel
            control={
              <Checkbox
                id="is_active"
                name="is_active"
                checked={formik.values.is_active ?? true}
                onChange={(e) => formik.setFieldValue("is_active", e.target.checked)}
              />
            }
            label={t("isActive", { defaultValue: "Is Active" })}
          />
        </Box>
      </FormSection>

      {/* Permissions Section */}
      <FormSection title={t("permissions", { defaultValue: "Permissions" })}>
        <Box className="grid justify-stretch items-start gap-5">
          {allGroups.length > 0 && (
            <Box>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                {t("filterByGroup", { defaultValue: "Filter by Group" })}
              </label>
              <select
                id="permission-group-filter"
                name="permission-group-filter"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value === "All Groups" ? "" : e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("selectGroup", { defaultValue: "Select group" })}</option>
                <option value="All Groups">All Groups</option>
                {allGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </Box>
          )}
          <Box className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPermissions.map((permission) => (
                <FormControlLabel
                  key={permission.id}
                  control={
                    <Checkbox
                      id={`permission-${permission.id}`}
                      name={`permission_ids[${permission.id}]`}
                      checked={(formik.values.permission_ids || []).includes(permission.id)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const currentIds = formik.values.permission_ids || [];
                        if (e.target.checked) {
                          formik.setFieldValue("permission_ids", [...currentIds, permission.id]);
                        } else {
                          formik.setFieldValue("permission_ids", currentIds.filter((id: number) => id !== permission.id));
                        }
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Box className="font-medium">{permission.name}</Box>
                      {permission.group && (
                        <Box className="text-xs text-gray-500">({permission.group})</Box>
                      )}
                    </Box>
                  }
                />
              ))}
            </Box>
          </Box>
        </Box>
      </FormSection>

      {/* Action Buttons */}
      <Box className="flex justify-end items-center gap-4">
        <BasicButton
          type="button"
          onClick={() => navigate(`${import.meta.env.VITE_ROLES_ROUTE || "/roles"}`)}
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
            ? t("updateRole", { defaultValue: "Update Role" })
            : t("createRole", { defaultValue: "Create Role" })}
        </SubmitButton>
      </Box>
    </Box>
  );
};

export default RoleForm;

