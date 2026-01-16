import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { createPermission, updatePermission } from "../../store/permissionsSlice";
import { useFormsStore } from "../../globals/formsStore";
import { handleToaster } from "../../functions/handleToaster";
import type { PermissionFormTypes } from "../../types/forms";
import type { AppDispatch } from "../../store/store";
import { useParams } from "react-router-dom";

const usePermissionSubmit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("forms/permission_form");
  const { id } = useParams();
  const setLoading = useFormsStore((state) => state.setLoading);
  const isLoading = useFormsStore((state) => state.isLoading);

  const addPermission = async (values: PermissionFormTypes) => {
    if (isLoading) return;
    
    setLoading(true);
    try {
      const data: any = {
        name: values.name,
        slug: values.slug || undefined,
        group: values.group || undefined,
        description: values.description || undefined,
      };

      await dispatch(createPermission(data)).unwrap();
      handleToaster({
        msg: t("permission_created_successfully", { defaultValue: "Permission created successfully" }),
        status: "success",
      });
      navigate(`${import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions"}`);
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("failed_to_create_permission", { defaultValue: "Failed to create permission" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const editPermission = async (values: PermissionFormTypes) => {
    if (isLoading || !id) return;
    
    setLoading(true);
    try {
      const data: any = {
        name: values.name,
        slug: values.slug || undefined,
        group: values.group || undefined,
        description: values.description || undefined,
      };

      await dispatch(updatePermission({ id, data })).unwrap();
      handleToaster({
        msg: t("permission_updated_successfully", { defaultValue: "Permission updated successfully" }),
        status: "success",
      });
      navigate(`${import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions"}/${id}`);
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("failed_to_update_permission", { defaultValue: "Failed to update permission" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { addPermission, editPermission };
};

export default usePermissionSubmit;

