import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import LoadingButton from "../LoadingButton/LoadingButton";
import LoadingText from "../LoadingText/LoadingText";

const LoadingPrimaryCard = ({ variant, editable = true }: { variant: "network" | "package"; editable?: boolean }) => {
    return (
        <Paper className={`!shadow-none !rounded-lg p-4 grid justify-stretch items-center gap-6 border-[1px] border-gray-300 border-solid`}>
            <Box className={`grid justify-stretch items-center gap-2`}>
                <LoadingText />
                {variant === "package" && <LoadingText />}
            </Box>
            {variant === "network" && <Box className={`px-2 py-1 bg-secondary_100 border-[1px] border-secondary_900 flex justify-center items-center gap-1 rounded-md w-1/2`}>
                <LoadingText />
                <LoadingText />
            </Box>}

            <Box className={`grid justify-between items-center gap-4 ${editable ? "grid-cols-2" : "grid-cols-1"} md:grid-cols-1 md:gap-3 sm:!gap-2`}>
                <LoadingButton className={editable ? '' : `!w-full`} />
                {editable ? <LoadingButton /> : <></>}
            </Box>
        </Paper>
    )
}

export default LoadingPrimaryCard
