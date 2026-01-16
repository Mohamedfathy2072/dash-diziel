import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import EmptyBoxIcon from "../../icons/EmptyBoxIcon";

const NoDataFound = () => {
  const { t } = useTranslation("components/no_data_found");
  return (
    <Box className={`grid justify-center items-center gap-2 p-4 text-center`}>
      <EmptyBoxIcon className={`text-primary w-[35px] h-auto m-auto`} />
      <Typography variant="h5" className={`!font-[600]`}>
        {t("no_data_found", { defaultValue: "لا يوجد بيانات" })}
      </Typography>
    </Box>
  );
};

export default NoDataFound;
