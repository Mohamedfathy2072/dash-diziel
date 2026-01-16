import { Box } from "@mui/material";
import LoadingText from "../LoadingText/LoadingText";

const LoadingStatusBox = () => {
    return (
        <Box
            className={`px-4 py-2 rounded-md text-center w-fit m-auto flex justify-center items-center gap-2 bg-gray-400`}
        >
            <LoadingText width={30} unit={"px"} />
        </Box>
    );
};

export default LoadingStatusBox;
