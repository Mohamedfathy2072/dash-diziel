import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GradientButton } from '../../mui/buttons/GradientButton';

const NotFoundSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("sections/not_found_section");

  return (
    <Box component="section" className="grid justify-stretch items-center gap-10 text-center content-center">
      <h1 className="text-9xl !font-[700] text-primary text-center">404</h1>
      <Box className="grid justify-center items-center gap-2">
        <Typography variant="h4" className="!font-[700] text-black">
          {t("title", { defaultValue: "لم يتم العثور على الصفحة" })}
        </Typography>
        <Typography variant="h6" className="!font-[500] text-gray-900">
          {t("subtitle", { defaultValue: "نأسف، الصفحة التي تبحث عنها غير موجودة." })}
        </Typography>
      </Box>
      <Box className="flex justify-center items-center">
        <GradientButton onClick={() => navigate(`${import.meta.env.VITE_DASHBOARD_ROUTE}`)}>
          {t("button", { defaultValue: "العودة إلى الصفحة الرئيسية" })}
        </GradientButton>
      </Box>
    </Box>
  );
};

export default NotFoundSection;
