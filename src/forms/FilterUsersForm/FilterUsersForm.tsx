import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomMenu from "../../components/CustomMenu/CustomMenu";
import FilterChips from "../../components/FilterChips/FilterChips";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { limits } from "../../constants";
import { useFormsStore } from "../../globals/formsStore";
import useFilters from "../../hooks/useFilters";
import useQueries from "../../hooks/useQueries";
import ArrowDownIcon from "../../icons/ArrowDownIcon";
import FilterIcon from "../../icons/FilterIcon";
import { BasicButton } from "../../mui/buttons/BasicButton";
import { SecondaryButton } from "../../mui/buttons/SecondaryButton";
import type {
  FilterUsersFormTypes,
  FilterValuesTypes,
  FormiksTypes,
} from "../../types/forms";
;

const FilterUsersForm = ({
  formik,
}: FormiksTypes<FilterUsersFormTypes>) => {
  const setUsersLimit = useFormsStore((state) => state.setUsersLimit)
  const usersLimit = useFormsStore((state) => state.usersLimit)
  const limit = usersLimit
  const { handleResetFilter, handleFilter, handleFilterLimits } = useFilters();
  const { handleGetQueries } = useQueries();
  const queries = handleGetQueries();

  const { t } = useTranslation("forms/filter_users_form");

  const handleReset = () => {
    formik.resetForm();
    handleResetFilter("users")
  };

  const handleCloseChip = (key: string) => {
    const updatedQueries = { ...queries };
    updatedQueries[key] = "";
    handleFilter("users", updatedQueries as unknown as FilterValuesTypes); 
  };

  useEffect(() => {
    const newLimit = +queries["limit"] || 10;
    // Only update if the limit value actually changed
    if (usersLimit !== newLimit) {
      setUsersLimit(newLimit);
    }
  }, [queries.limit, usersLimit, setUsersLimit]);

  return (
    <Box className={`flex justify-start items-center flex-wrap gap-2`}>
      <Typography variant="subtitle1" className={`text-Jeeteak_gray !font-[600]`}>
        {t("labels.rowsToShow")}
      </Typography>

      <CustomMenu
        button={
          <BasicButton key={Math.random()}>
            {limit}
            <ArrowDownIcon className={`w-[16px]`} />
          </BasicButton>
        }
        limit
      >
        <Box className={`grid justify-stretch items-center gap-4 p-4 lg:p-3 md:p-2 xs:p-1`}>
          {limits.map((limit: number) => (
            <Button
              key={limit}
              onClick={() => {
                handleFilterLimits("users", limit);
                setUsersLimit(limit)
              }}
            >
              {limit}
            </Button>
          ))}
        </Box>
      </CustomMenu>

      <CustomMenu
        button={
          <BasicButton key={Math.random()}>
            <FilterIcon className={`w-[16px]`} />
            {t("buttons.filter")}
          </BasicButton>
        }
      >
        <Box className={`grid justify-stretch items-center gap-6 p-4 lg:p-3 md:p-2 xs:p-1`}>
          <Box className={`grid justify-stretch items-center gap-4`}>
            <Input formik={formik} label={t("labels.username")} name={"name1"} optional value={formik.values.name1} />
          </Box>

          <Box className={`grid justify-stretch items-center grid-cols-2 gap-3`}>
            <SubmitButton
              loading={false}
              type={"button"}
              handling={() => handleFilter("users", formik.values)}
              variant="gradient"
            >
              {t("buttons.applyFilter")}
            </SubmitButton>
            <SecondaryButton type={"button"} onClick={handleReset}>
              {t("buttons.clearFilter")}
            </SecondaryButton>
          </Box>
        </Box>
      </CustomMenu>

      <FilterChips variant="users" onClose={handleCloseChip} />
    </Box>
  );
};

export default FilterUsersForm;
