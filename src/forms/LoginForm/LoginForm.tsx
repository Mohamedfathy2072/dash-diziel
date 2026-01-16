import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import type { FormiksTypes, LoginFormTypes } from "../../types/forms";

const LoginForm = ({ formik }: FormiksTypes<LoginFormTypes>) => {
  const isLoading = useFormsStore((state) => state.isLoading);
  const { t } = useTranslation("forms/login_form");

  return (
    <Box className="grid justify-stretch items-center gap-10 md:gap-6 sm:gap-4 sm:justify-center relative">
      <Box className="grid justify-center items-center gap-4 text-center">
        <Typography variant="h3" className="text-primary !font-[700]">
          {t("title")}
        </Typography>
        <Typography variant="subtitle1" className="text-gray-700">
          {t("subtitle")}
        </Typography>
      </Box>

      <Box className="grid justify-stretch items-start gap-8 sm:flex sm:flex-wrap sm:justify-center">
        <Input
          formik={formik}
          label={t("email_label")}
          name="email"
          type="email"
        />
        <Input
          formik={formik}
          label={t("password_label")}
          type="password"
          name="password"
          ac="current-password"
        />
      </Box>

      <Box className="grid justify-stretch items-center gap-2 sm:justify-center">
        <SubmitButton loading={isLoading} variant="gradient">
          {t("login_button")}
        </SubmitButton>
      </Box>
    </Box>
  );
};

export default LoginForm;
