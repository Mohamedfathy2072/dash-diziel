import { Box, Typography } from "@mui/material";
import EmployeesIcon from "../../icons/EmployeesIcon";
import type { StatisticalCardTypes } from "../../types/components";

const StatisticalCard = ({
  title,
  subtitle,
  number,
  bg,
  color,
  icon,
}: StatisticalCardTypes) => {
  return (
    <Box className="profile_employees_paper h-full overflow-hidden !border-[2px] !border-[#ECEDEF] !border-solid">
      <Box className="grid grid-cols-[auto,1fr] justify-start items-start gap-2 p-4 py-6">
        <Box
          className={`rounded-3xl w-[60px] h-[60px] flex justify-center items-center ${bg}`}
        >
          {icon || <EmployeesIcon className={`${color} w-[35px] h-auto`} />}
        </Box>
        <Box className="grid justify-stretch items-center gap-2">
          <Typography variant="h6" className="text-profile_employees_counter_text_gray">
            {title}
          </Typography>
          <Typography variant="h4" className={`!font-[700]`}>
            {subtitle || number}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StatisticalCard;
