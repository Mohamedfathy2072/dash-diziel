import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { createRole, updateRole } from "../../store/rolesSlice";
import { useFormsStore } from "../../globals/formsStore";
import { handleToaster } from "../../functions/handleToaster";
import type { RoleFormTypes } from "../../types/forms";
import type { AppDispatch } from "../../store/store";
import { useParams } from "react-router-dom";

const useRoleSubmit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("forms/role_form");
  const { id } = useParams();
  const setLoading = useFormsStore((state) => state.setLoading);
  const isLoading = useFormsStore((state) => state.isLoading);

  const addRole = async (values: RoleFormTypes) => {
    if (isLoading) return;
    
    setLoading(true);
    try {
      const data: any = {
        name: values.name,
        slug: values.slug || undefined,
        description: values.description || undefined,
        is_active: values.is_active ?? true,
        permission_ids: values.permission_ids || [],
      };

      await dispatch(createRole(data)).unwrap();
      handleToaster({
        msg: t("role_created_successfully", { defaultValue: "Role created successfully" }),
        status: "success",
      });
      navigate(`${import.meta.env.VITE_ROLES_ROUTE || "/roles"}`);
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("failed_to_create_role", { defaultValue: "Failed to create role" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const editRole = async (values: RoleFormTypes) => {
    if (isLoading || !id) return;
    
    setLoading(true);
    try {
      const data: any = {
        name: values.name,
        slug: values.slug || undefined,
        description: values.description || undefined,
        is_active: values.is_active ?? true,
      };

      await dispatch(updateRole({ id, data })).unwrap();
      
      // If permission_ids are provided, update them separately
      if (values.permission_ids && values.permission_ids.length > 0) {
        const { assignRolePermissions } = await import("../../store/rolesSlice");
        await dispatch(assignRolePermissions({ id, permissionIds: values.permission_ids })).unwrap();
      }
      
      handleToaster({
        msg: t("role_updated_successfully", { defaultValue: "Role updated successfully" }),
        status: "success",
      });
      navigate(`${import.meta.env.VITE_ROLES_ROUTE || "/roles"}/${id}`);
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("failed_to_update_role", { defaultValue: "Failed to update role" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { addRole, editRole };
};

export default useRoleSubmit;

