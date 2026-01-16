import Box from '@mui/material/Box';
import LoadingIcon from "../../icons/LoadingIcon";

const LoadingSpinner = () => {
    return (
        <Box className={`flex justify-center items-center h-full`}>
            <LoadingIcon className="animate-spin text-primary" />
        </Box>
    )
}

export default LoadingSpinner
