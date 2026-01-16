import { Box } from "@mui/material";
import LoadingText from "../LoadingText/LoadingText";

const LoadingTextLine = ({ className }: { className?: string }) => {
    return (
        <Box className={`flex justify-start items-center gap-2 ${className}`}>
            <LoadingText />
            <LoadingText />
        </Box>
    );
};

export default LoadingTextLine;
