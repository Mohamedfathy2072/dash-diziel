import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import Input from "../../components/Input/Input";
import Logo from "../../components/Logo/Logo";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import type { FormiksTypes, UpdatePasswordFormTypes } from "../../types/forms";

const UpdatePasswordForm = ({
  formik,
}: FormiksTypes<UpdatePasswordFormTypes>) => {
  const { t } = useTranslation("forms/update_password_form");
  const isLoading = useFormsStore((state) => state.isLoading);

  return (
    <Box className="grid justify-stretch items-center gap-10 md:gap-6 sm:gap-4 sm:justify-center max-w-[30vw] m-auto">
      <Box className="grid justify-center items-center gap-4 text-center">
        <Logo className="w-[200px] h-auto m-auto" />
        <Typography variant="subtitle1" className="text-[#121212] !font-[600]">
          {t("title", {
            defaultValue:
              "مرحبًا بك في Jeeteak! لأمان حسابك، يُرجى تحديث كلمة المرور الخاصة بك قبل المتابعة.",
          })}
        </Typography>
      </Box>

      <Box className="grid justify-stretch items-start gap-8 sm:flex sm:flex-wrap sm:justify-center">
        <Input
          formik={formik}
          label={t("old_password", { defaultValue: "كلمة المرور المؤقتة" })}
          type="password"
          name="old_password"
          ac="current-password"
        />
        <Input
          formik={formik}
          label={t("new_password", { defaultValue: "كلمة المرور الجديدة" })}
          type="password"
          name="new_password"
          ac="new-password"
        />
        <Input
          formik={formik}
          label={t("confirm_password", {
            defaultValue: "تأكيد كلمة المرور الجديدة",
          })}
          type="password"
          name="confirm_password"
          ac="new-password"
        />
      </Box>

      <SubmitButton loading={isLoading} variant="gradient">
        {t("submit", { defaultValue: "تحديث كلمة المرور" })}
      </SubmitButton>
    </Box>
  );
};

export default UpdatePasswordForm;
