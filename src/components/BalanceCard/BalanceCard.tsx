import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import BalanceIcon from "../../icons/BalanceIcon";
import type { BalanceCardTypes } from "../../types/components";

const BalanceCard = ({ number, title, bgColor, btn }: BalanceCardTypes) => {
  const navigate = useNavigate()

  return (
    <Box className={`balance_card ${btn && "!flex justify-between items-center"} ${bgColor}`}>
      <Box className={`grid justify-between items-center gap-4`}>
        <BalanceIcon className={`text-black w-[35px] h-[35px]`} />
        <Box className={`grid justify-stretch items-center gap-2`}>
          <Typography variant="h6" className={`!font-[700]`}>
            {number}
          </Typography>
          <Typography variant="subtitle1" className={`!font-[500]`}>
            {title}
          </Typography>
        </Box>
      </Box>
      {btn && <Button className={`!bg-primary !text-white`} onClick={() => navigate(`${import.meta.env.VITE_PAYMENT_ROUTE}`)}>دفع</Button>}
    </Box>
  );
};

export default BalanceCard;
