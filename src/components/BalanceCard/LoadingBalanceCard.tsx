import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import LoadingText from "../LoadingText/LoadingText";

const LoadingBalanceCard = () => {
  return (
    <Box className={`balance_card bg-neutral-100`}>
      <Skeleton variant="circular" className="!w-[40px] !h-[40px]" />
      <Box className={`grid justify-stretch items-center gap-2`}>
        <LoadingText />
        <LoadingText />
      </Box>
    </Box>
  );
};

export default LoadingBalanceCard;
