import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SectionHeaderProps } from "../../../types/components";

const SectionHeader = ({ icon, title, className }: SectionHeaderProps) => {
  return (
    <Box className={`flex items-center gap-2 ${className || ""}`}>
      {icon && <Box className="w-5 h-5">{icon}</Box>}
      <Typography variant="h6" className="!font-[600] !text-gray-800">
        {title}
      </Typography>
    </Box>
  );
};

export default SectionHeader;

