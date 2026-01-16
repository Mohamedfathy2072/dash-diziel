import { useTranslation } from "react-i18next";
import * as yup from "yup";
import type { Role } from "../../types/domain";

const useRoleSchema = (isEdit = false, selectedRole?: Role | null) => {
  const { t } = useTranslation("forms/role_form");

  const RoleSchema = yup.object({
    name: yup
      .string()
      .trim()
      .max(255, t("name_max", { defaultValue: "Name must be less than 255 characters" }))
      .required(t("name_required", { defaultValue: "Name is required" })),
    slug: yup
      .string()
      .nullable()
      .max(255, t("slug_max", { defaultValue: "Slug must be less than 255 characters" })),
    description: yup
      .string()
      .nullable()
      .max(1000, t("description_max", { defaultValue: "Description must be less than 1000 characters" })),
    is_active: yup
      .boolean()
      .nullable(),
    permission_ids: yup
      .array()
      .of(yup.number())
      .nullable(),
  });

  const RoleInitialValues = isEdit && selectedRole
    ? {
        name: selectedRole.name || "",
        slug: selectedRole.slug || null,
        description: selectedRole.description || null,
        is_active: selectedRole.is_active ?? true,
        permission_ids: selectedRole.permissions?.map(p => p.id) || [],
      }
    : {
        name: "",
        slug: null as string | null,
        description: null as string | null,
        is_active: true,
        permission_ids: [] as number[],
      };

  return {
    RoleInitialValues,
    RoleSchema,
  };
};

export default useRoleSchema;

