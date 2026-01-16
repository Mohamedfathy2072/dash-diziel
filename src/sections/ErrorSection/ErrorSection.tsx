import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import error from "../../assets/images/error.webp";
import { GradientButton } from '../../mui/buttons/GradientButton';

const ErrorSection = () => {
  const { t } = useTranslation("sections/error_section");

  return (
    <Box component={"section"} className={`grid justify-center items-center gap-10 text-center content-center`}>
      <img src={error} alt={"error"} className={`m-auto w-[125px]`} />
      <Box className={`grid justify-center items-center gap-2`}>
        <Typography variant="h4" className={`!font-[700] text-black`}>
          {t("title", { defaultValue: "حدث خطأ ما. نعمل على إصلاحه" })}
        </Typography>
        <Typography variant="h5" className={`!font-[500] text-gray-900`}>
          {t("subtitle", { defaultValue: "نعمل علي حل المشكلة" })}
        </Typography>
      </Box>
      <Box className={`flex justify-center items-center`}>
        <GradientButton onClick={() => window.location.reload()}>
          {t("button", { defaultValue: "إعادة التحميل" })}
        </GradientButton>
      </Box>
    </Box>
  );
};

export default ErrorSection;
