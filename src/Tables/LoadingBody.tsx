import Skeleton from "@mui/material/Skeleton";
import { StyledTableCell } from "./StyledTableCell";
import { StyledTableRow } from "./StyledTableRow";

const LoadingBody = ({ count }: { count: number }) => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <StyledTableRow key={`row-${i}`}>
          {Array.from({ length: count }).map((_, j) => (
            <StyledTableCell key={`cell-${i}-${j}`}>
              <Skeleton variant="rounded" className="!h-[30px]" />
            </StyledTableCell>
          ))}
        </StyledTableRow>
      ))}
    </>
  );
};

export default LoadingBody;
