import { Box } from "@mui/material";
import LoadingText from "../LoadingText/LoadingText";

const LoadingTextLabel = ({
  variant,
  noTitle
}: {
  variant?: "employee" | "member" | "payment" | "user" | "network" | "package";
  noTitle?: boolean
}) => {
  return (
    <Box className={`grid justify-stretch items-center gap-1`}>
      {!noTitle &&
        <LoadingText width={100} unit={"px"} />
      }
      <Box
        className={`bg-white rounded-md px-4 py-[10px] flex justify-start items-center ${variant === "employee" || "package" || variant === "network"
          ? "border-[1px] border-solid border-text_label_border"
          : (variant === "member" || variant === "user")
            ? "!bg-[#F4F4F4] border-[1px] border-solid border-[#EEEEEE]"
            : ""
          }`}
      >
        <LoadingText />
      </Box>
    </Box>
  );
};

export default LoadingTextLabel;
