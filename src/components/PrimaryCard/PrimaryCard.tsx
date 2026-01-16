import Paper from "@mui/material/Paper";
import type { ReactNode } from "react";

interface PrimaryCardProps {
  children: ReactNode;
  className?: string;
}

const PrimaryCard = ({ children, className = "" }: PrimaryCardProps) => {
  return (
    <Paper className={`!shadow-none !rounded-lg p-6 border-[1px] border-gray-300 border-solid ${className}`}>
      {children}
    </Paper>
  );
};

export default PrimaryCard;

