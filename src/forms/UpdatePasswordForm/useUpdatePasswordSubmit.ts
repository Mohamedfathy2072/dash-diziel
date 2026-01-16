import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleToaster } from "../../functions/handleToaster";
import { useFormsStore } from "../../globals/formsStore";
import useCustomAxios from "../../hooks/useCustomAxios";
import logger from "../../utils/logger";
import { logout } from "../../store/authSlice";
import type { AppDispatch } from "../../store/store";
import type { UpdatePasswordFormTypes } from "../../types/forms";

const useUpdatePasswordSubmit = () => {
  const { server } = useCustomAxios();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const setLoading = useFormsStore((state) => state.setLoading);
  const { t } = useTranslation("forms/update_password_form");

  const updatePassword = async (values: UpdatePasswordFormTypes) => {
    setLoading(true);
    await server
      .post(`/`, {
        ...values,
        logout_all_sessions: 1,
        cmd: "frappe.core.doctype.user.user.update_password",
      })
      .then((res) => {
        logger.debug("Password update response", res);
        handleToaster({
          msg: t("update_success"),
          status: "success",
        });
        localStorage.setItem(
          `${import.meta.env.VITE_USER_LAST_RESET_PASSWORD_STORAGE}`,
          "false"
        );
        dispatch(logout());
        navigate(`${import.meta.env.VITE_LOGIN_ROUTE}`);
      });
    setLoading(false);
  };
  return { updatePassword };
};

export default useUpdatePasswordSubmit;
