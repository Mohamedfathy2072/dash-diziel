import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import LoadingText from "../LoadingText/LoadingText";

const LoadingProfileManagerCard = () => {
  return (
    <Paper className={`paper p-0`}>
      <Box className={`grid justify-start items-center gap-2 pb-2 px-4 md:p-3 xs:p-2 pt-8 md:pt-6 xs:pt-4`}>
        <LoadingText />
        <LoadingText />
      </Box>

      <Box className={`grid justify-start items-center text-start gap-3 bg-[#FAFAFA] py-2 px-4 md:p-3 xs:p-2 rounded-md`}>
        <LoadingText />
        <LoadingText />
      </Box>
    </Paper>
  );
};

export default LoadingProfileManagerCard;
