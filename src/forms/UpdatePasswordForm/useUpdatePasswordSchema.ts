import { useTranslation } from "react-i18next";
import * as yup from "yup";

const useUpdatePasswordSchema = () => {
  const { t } = useTranslation("forms/update_password_form");

  const UpdatePasswordSchema = yup.object({
    old_password: yup
      .string()
      .min(8, t("min_length"))
      .required(t("old_password_required")),

    new_password: yup
      .string()
      .min(8, t("min_length"))
      .required(t("new_password_required"))
      .test(
        "not-same-as-old",
        t("new_password_must_differ"),
        function (value) {
          const { old_password } = this.parent;
          return value !== old_password;
        }
      ),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("new_password")], t("confirm_password_mismatch"))
      .required(t("confirm_password_required")),
  });

  const UpdatePasswordInitialValues = {
    old_password: "",
    new_password: "",
    confirm_password: "",
  };

  return { UpdatePasswordSchema, UpdatePasswordInitialValues };
};

export default useUpdatePasswordSchema;
