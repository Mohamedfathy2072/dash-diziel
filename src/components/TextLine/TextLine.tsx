import { Box, Typography } from "@mui/material";
import type { TextLineTypes } from "../../types/components";

const TextLine = ({ title, value, textColor, valueColor }: TextLineTypes) => {
  return (
    <Box className={`flex justify-start items-center gap-2 flex-wrap`}>
      <Typography variant="subtitle1" className={`text-Jeeteak_gray !font-[600] ${textColor}`}>
        {title}
      </Typography>
      <Typography variant="subtitle1" className={`${valueColor} !font-[600]`}>
        {value || "."}
      </Typography>
    </Box>
  );
};

export default TextLine;
