import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Logo from "../../components/Logo/Logo";
import CircleIcon from "../../icons/CircleIcon";
import CirclesIcon from "../../icons/CirclesIcon";

const AuthSide = () => {
  const { t, i18n } = useTranslation("components/side_auth");
  const lang = i18n.language;

  return (
    <Box
      className={`grid justify-stretch items-center relative content-center bg-primary text-white h-full md:!hidden`}
    >
      <CircleIcon className={`absolute top-0 ${lang === "ar" ? "right-[50%]" : "left-[50%] -scale-x-100"} flex justify-stretch items-start w-[50%] h-auto`} />
      <Box
        className={`grid justify-center items-center gap-10 text-center h-full px-8 lg:px-6 md:px-3 sm:!px-2`}
      >
        <Logo className="w-[150px] !h-auto m-auto" />
        <Box className={`grid justify-stretch items-center gap-4`}>
          <Typography variant="h3" className={`!font-[700]`}>
            {t("title")}
          </Typography>
          <Typography variant="subtitle1" className={`text-gray-300 w-[75%] !m-auto`}>
            {t("description")}
          </Typography>
        </Box>
      </Box>
      <CirclesIcon className={`absolute bottom-0 ${lang === "ar" ? "right-0" : "left-0 -scale-x-100"
        } flex justify-stretch items-end w-[50%] h-auto`} />
    </Box>
  );
};

export default AuthSide;
