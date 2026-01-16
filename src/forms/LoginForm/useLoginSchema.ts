import { useTranslation } from "react-i18next";
import * as yup from "yup";

const useLoginSchema = () => {
  const { t } = useTranslation("forms/login_form");

  const LoginSchema = yup.object({
    email: yup
      .string()
      .trim()
      .email(t("validation.invalid_email"))
      .required(t("validation.email_required")),
    password: yup
      .string()
      .trim()
      .min(8, t("validation.password_min"))
      .required(t("validation.password_required"))
  });

  const LoginInitialValues = {
    email: "",
    password: "",
  }

  return { LoginSchema, LoginInitialValues };
};

export default useLoginSchema;
