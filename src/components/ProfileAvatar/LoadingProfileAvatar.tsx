import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const LoadingProfileAvatar = () => {
  return (
    <Box className={`relative w-[200px] h-[200px] m-auto rounded-full`}>
      <Skeleton variant="circular" className="!w-full !h-full rounded-full" />
    </Box>
  );
};

export default LoadingProfileAvatar;
