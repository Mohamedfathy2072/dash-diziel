import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useQueries from '../hooks/useQueries';
import type { PrimaryTableTypes } from "../types/tables";
import PrimaryTablePagination from "./PrimaryTablePagination";

const PrimaryTable = memo(({
  children,
  variant,
  count,
  currentCount,
  pagination = true,
  loading,
  id
}: PrimaryTableTypes) => {
  const { handleGetQueries } = useQueries();
  const limit = useMemo(() => handleGetQueries()['limit'], [handleGetQueries]);
  const { t } = useTranslation("tables/primary_table");

  const showNoData = useMemo(() => (count === 0 || currentCount === 0) && !loading, [count, currentCount, loading]);
  const showPagination = useMemo(() => {
    if (!loading && pagination && count) {
      const limitNum = +(limit || "10");
      return count > limitNum;
    }
    return false;
  }, [loading, pagination, count, limit]);

  return (
    <>
      <TableContainer
        id={id}
        component={Paper}
        className="!shadow-none border-[1px] border-solid border-neutral_100 !rounded-lg"
      >
        <Table aria-label="customized table">{children}</Table>
        {showNoData && (
          <Typography
            variant="subtitle1"
            className={`!text-center py-4 !text-gray-500`}
          >
            {t("noData", { defaultValue: "لا يوجد بيانات" })}
          </Typography>
        )}
      </TableContainer>
      {showPagination && count !== undefined ? (
        <PrimaryTablePagination count={count} variant={variant} />
      ) : null}
    </>
  );
});

PrimaryTable.displayName = "PrimaryTable";

export default PrimaryTable;