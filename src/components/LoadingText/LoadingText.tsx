import Skeleton from '@mui/material/Skeleton';

const LoadingText = ({ width, unit }: { width?: number; unit?: "px" }) => {
  const randomWidth = Math.floor(Math.random() * (width ? width + 1 : 51)) + (width || 50);
  return <Skeleton variant="text" sx={{ width: `${randomWidth}${unit || "%"}` }} />;
};

export default LoadingText;
