import { Box, Icon, Skeleton } from "@mui/material";
import LoadingText from "../LoadingText/LoadingText";

const LoadingStatisticalCard = () => {
  return (
    <Box className={`profile_employees_paper h-full overflow-hidden`}>
      <Box className={`flex justify-start items-start gap-2 p-4`}>
        <Icon
          className={`rounded-3xl !w-[60px] !h-[60px] !flex justify-center items-center`}
        >
          <Skeleton variant="rounded" className={`!h-full !w-full`} />
        </Icon>
        <Box className={`grid justify-stretch items-center w-full gap-2`}>
          <LoadingText />
          <LoadingText />
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingStatisticalCard;
