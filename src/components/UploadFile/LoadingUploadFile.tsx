import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import UploadIcon from "../../icons/UploadIcon";
import LoadingText from "../LoadingText/LoadingText";

const LoadingUploadFile = () => {
  return (
    <Box className={`grid justify-stretch items-center gap-2`}>
      <Typography variant="subtitle1" className={`!font-[700]`}>
        ملف او صورة التحويل
      </Typography>
      <Box
        className={`bg-white rounded-xl p-4 grid justify-stretch items-center text-center gap-4`}
      >
        <Box
          className={`w-[50px] h-[50px] rounded-full flex justify-center items-center bg-primary_200 m-auto relative border-[4px] border-solid border-primary_100`}
        >
          <UploadIcon className={`text-2xl`} />
        </Box>
        <Box className="flex justify-center items-center">
          <LoadingText />
        </Box>
        <Box className={`flex justify-center items-center gap-4`}>
          <Skeleton variant="rounded" className={`w-[100px] h-[40px]`} />
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingUploadFile;
