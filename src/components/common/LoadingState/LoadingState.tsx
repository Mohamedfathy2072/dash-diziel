import Box from "@mui/material/Box";
import LoadingIcon from "../../../icons/LoadingIcon";

interface LoadingStateProps {
  minHeight?: string;
  className?: string;
}

const LoadingState = ({ minHeight = "min-h-[400px]", className }: LoadingStateProps) => {
  return (
    <Box className={`flex justify-center items-center ${minHeight} ${className || ""}`}>
      <LoadingIcon className="animate-spin" />
    </Box>
  );
};

export default LoadingState;

