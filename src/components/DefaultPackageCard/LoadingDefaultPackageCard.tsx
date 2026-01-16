import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import LoadingText from '../LoadingText/LoadingText';

const LoadingDefaultPackageCard = () => {
    return (
        <Box
            className={`p-2 my-2 rounded-md flex justify-start items-center gap-4 w-full border-[1px] border-transparent cursor-pointer`}
        >
            <Skeleton variant='circular' className={`w-[20px] h-[20px]`} />
            <Box className={`!bg-primary_100 px-3 py-2 rounded-md flex justify-center items-center gap-2 !text-primary border-[1px] border-solid border-primary_500`}>
                <LoadingText width={100} unit={"px"} />
            </Box>
        </Box>
    );
};

export default LoadingDefaultPackageCard;
