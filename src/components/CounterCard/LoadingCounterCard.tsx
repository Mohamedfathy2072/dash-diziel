import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import LoadingText from "../LoadingText/LoadingText";

const LoadingCounterCard = () => {
  return (
    <Box className={`counter_card`}>
      <Skeleton
        variant="circular"
        className={`!w-[40px] !h-[40px] rounded-full !flex justify-center items-center`}
      />
      <Box className={`grid justify-stretch items-center gap-2`}>
        <LoadingText />
        <LoadingText />
      </Box>
    </Box>
  );
};

export default LoadingCounterCard;
