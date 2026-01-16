import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleToaster } from "../../functions/handleToaster";
import { useFormsStore } from "../../globals/formsStore";
import useCustomAxios from "../../hooks/useCustomAxios";
import logger from "../../utils/logger";
import { login as loginAction } from "../../store/authSlice";
import type { AppDispatch } from "../../store/store";
import type { LoginFormTypes } from "../../types/forms";

const useLoginSubmit = () => {
  const { server } = useCustomAxios();
  const setLoading = useFormsStore((state) => state.setLoading);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("forms/login_form");

  const login = async (values: LoginFormTypes) => {
    setLoading(true);
    try {
      // Login with Laravel API
      const loginResponse = await server.post(`/auth/login`, {
        email: values.email,
        password: values.password,
      });

      // Check if user is SuperAdmin
      const user = loginResponse.data.data;
      if (user.type !== 'superAdmin') {
        handleToaster({
          msg: "Access denied. Only Super Admins can access this dashboard.",
          status: "error"
        });
        setLoading(false);
        return;
      }

      handleToaster({
        msg: t("login_success", { defaultValue: "Login Successfully" }),
        status: "success"
      });

      dispatch(loginAction({ user }));
      navigate(`${import.meta.env.VITE_DASHBOARD_ROUTE}`);
    } catch (error) {
      // Error handling is done in axios interceptor
      logger.error("Login error", error);
    }
    setLoading(false);
  };
  
  return { login };
};

export default useLoginSubmit;
