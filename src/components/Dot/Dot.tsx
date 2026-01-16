import { Box } from "@mui/material";
import type { DotTypes } from "../../types/components";

const Dot = ({ color, className, style }: DotTypes) => {
  return (
    <Box
      className={`${color || "bg-primary"} ${className} w-[10px] h-[10px] rounded-full`} style={style}
    />
  );
};

export default Dot;
