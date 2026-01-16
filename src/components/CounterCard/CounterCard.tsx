import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import type { CounterCardTypes } from "../../types/components";

const CounterCard = ({
  icon,
  number,
  title,
  unit,
  back,
  iconClassName,
}: CounterCardTypes) => {
  return (
    <Box className={`counter_card`}>
      <Icon
        className={`${iconClassName} !w-[40px] !h-[40px] rounded-full !flex justify-center items-center`}
      >
        {icon}
      </Icon>

      <Box className={`grid justify-stretch items-center gap-2 z-[1]`}>
        <Typography variant="h6" className="!font-[700]">
          {number} {unit}
        </Typography>
        <Typography variant="subtitle1" className="!font-[400]">
          {title}
        </Typography>
      </Box>
      {back}
    </Box>
  );
};

export default CounterCard;
