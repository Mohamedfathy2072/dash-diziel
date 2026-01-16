import Skeleton from '@mui/material/Skeleton';

const LoadingButton = ({ className }: { className?: string }) => {
    return (
        <Skeleton className={`!w-[150px] !h-[40px] !rounded-lg ${className}`} variant='rounded' />
    )
}

export default LoadingButton
