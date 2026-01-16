import { useTranslation } from "react-i18next";
import * as yup from "yup";
import type { Permission } from "../../types/domain";

const usePermissionSchema = (isEdit = false, selectedPermission?: Permission | null) => {
  const { t } = useTranslation("forms/permission_form");

  const PermissionSchema = yup.object({
    name: yup
      .string()
      .trim()
      .max(255, t("name_max", { defaultValue: "Name must be less than 255 characters" }))
      .required(t("name_required", { defaultValue: "Name is required" })),
    slug: yup
      .string()
      .nullable()
      .max(255, t("slug_max", { defaultValue: "Slug must be less than 255 characters" })),
    group: yup
      .string()
      .nullable()
      .max(100, t("group_max", { defaultValue: "Group must be less than 100 characters" })),
    description: yup
      .string()
      .nullable()
      .max(1000, t("description_max", { defaultValue: "Description must be less than 1000 characters" })),
  });

  const PermissionInitialValues = isEdit && selectedPermission
    ? {
        name: selectedPermission.name || "",
        slug: selectedPermission.slug || null,
        group: selectedPermission.group || null,
        description: selectedPermission.description || null,
      }
    : {
        name: "",
        slug: null as string | null,
        group: null as string | null,
        description: null as string | null,
      };

  return {
    PermissionInitialValues,
    PermissionSchema,
  };
};

export default usePermissionSchema;

