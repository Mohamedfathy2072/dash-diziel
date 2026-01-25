import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { handleToaster } from "../../functions/handleToaster";
import type { AppDispatch } from "../../store/store";
import { createUser, updateUser, getUsers } from "../../store/usersSlice";
import type { UserFormTypes } from "../../types/forms";
import useQueries from "../../hooks/useQueries";

const useUserSubmit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation("forms/user_form");
  const { handleGetQueries } = useQueries();
  const queries = handleGetQueries();

  // Get current pagination settings
  const getCurrentPagination = () => ({
    page: parseInt(queries.page || "1"),
    limit: parseInt(queries.limit || "10")
  });

  const addUser = async (values: UserFormTypes & { photoFile?: File | null }) => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'role_ids') {
          // Handle role_ids as array
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((roleId: number) => {
              formData.append('role_ids[]', roleId.toString());
            });
          }
        } else if (key !== 'photoFile' && value !== null && value !== undefined && value !== '') {
          formData.append(key, value as string);
        }
      });

      // Add photo file if provided
      if (values.photoFile && values.photoFile instanceof File) {
        formData.append('photo', values.photoFile);
      }

      await dispatch(createUser(formData as any)).unwrap();
      handleToaster({ msg: t("add_submit_success", { defaultValue: "User created successfully" }), status: "success" });
      // Refresh users list - use limit instead of per_page
      dispatch(getUsers({ page: 1, limit: 10 }));
      navigate(`${import.meta.env.VITE_USERS_ROUTE}`);
    } catch (error: any) {
      handleToaster({ 
        msg: error?.message || t("add_submit_error", { defaultValue: "Failed to create user" }), 
        status: "error" 
      });
    }
  };

  const editUser = async (values: UserFormTypes & { photoFile?: File | null }) => {
    if (!id) {
      handleToaster({ msg: t("edit_submit_error", { defaultValue: "User ID is required" }), status: "error" });
      return;
    }
    
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData (excluding password and photo_url)
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'role_ids') {
          // Handle role_ids as array
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((roleId: number) => {
              formData.append('role_ids[]', roleId.toString());
            });
          }
        } else if (key !== 'photoFile' && key !== 'password' && key !== 'password_confirmation' && key !== 'photo_url' && value !== null && value !== undefined && value !== '') {
          formData.append(key, value as string);
        }
      });

      // Add photo file if provided
      if (values.photoFile && values.photoFile instanceof File) {
        formData.append('photo', values.photoFile);
      } else if (!values.photo_url) {
        // If not uploading a new photo and photo_url is empty, it means we want to remove the existing photo
        formData.append('remove_photo', '1');
      }

      await dispatch(updateUser({ id: +id, data: formData as any })).unwrap();
      handleToaster({ msg: t("edit_submit_success", { defaultValue: "User updated successfully" }), status: "success" });
      // Refresh users list with current pagination
      const pagination = getCurrentPagination();
      dispatch(getUsers(pagination));
      navigate(`${import.meta.env.VITE_USERS_ROUTE}`);
    } catch (error: any) {
      handleToaster({ 
        msg: error?.message || t("edit_submit_error", { defaultValue: "Failed to update user" }), 
        status: "error" 
      });
    }
  };

  return { addUser, editUser };
};

export default useUserSubmit;
