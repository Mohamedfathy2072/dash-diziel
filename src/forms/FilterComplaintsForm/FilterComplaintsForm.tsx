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
  FilterComplaintsFormTypes,
  FilterValuesTypes,
  FormiksTypes,
} from "../../types/forms";

const COMPLAINT_STATUSES = ["pending", "resolved"];
const COMPLAINTABLE_TYPES = ["Trip", "Driver", "User"];

const FilterComplaintsForm = ({
  formik,
}: FormiksTypes<FilterComplaintsFormTypes>) => {
  const setComplaintsLimit = useFormsStore((state) => state.setComplaintsLimit);
  const complaintsLimit = useFormsStore((state) => state.complaintsLimit);
  const limit = complaintsLimit || 10;
  const { handleResetFilter, handleFilter, handleFilterLimits } = useFilters();
  const { handleGetQueries } = useQueries();
  const queries = handleGetQueries();

  const { t } = useTranslation("forms/filter_complaints_form");

  const handleReset = () => {
    formik.resetForm();
    handleResetFilter("complaints");
  };

  const handleCloseChip = (key: string) => {
    const updatedQueries = { ...queries };
    updatedQueries[key] = "";
    handleFilter("complaints", updatedQueries as unknown as FilterValuesTypes);
  };

  useEffect(() => {
    const newLimit = +queries["limit"] || 10;
    // Only update if the limit value actually changed
    if (complaintsLimit !== newLimit) {
      setComplaintsLimit(newLimit);
    }
  }, [queries.limit, complaintsLimit, setComplaintsLimit]);

  return (
    <Box className={`flex justify-start items-center flex-wrap gap-2`}>
      <Typography variant="subtitle1" className={`text-Diziel_gray !font-[600]`}>
        {t("labels.rowsToShow", { defaultValue: "Rows to Show" })}
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
                handleFilterLimits("complaints", limit);
                setComplaintsLimit(limit);
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
            {t("buttons.filter", { defaultValue: "Filter" })}
          </BasicButton>
        }
      >
        <Box className={`grid justify-stretch items-center gap-6 p-4 lg:p-3 md:p-2 xs:p-1`}>
          <Box className={`grid justify-stretch items-center gap-4`}>
            <Input
              formik={formik}
              label={t("labels.status", { defaultValue: "Status" })}
              name="status"
              select
              options={["", ...COMPLAINT_STATUSES.map(s => s.charAt(0).toUpperCase() + s.slice(1))]}
              values={["", ...COMPLAINT_STATUSES]}
              optional
              value={formik.values.status}
            />
            <Input
              formik={formik}
              label={t("labels.userId", { defaultValue: "User ID" })}
              name="user_id"
              type="number"
              optional
              value={formik.values.user_id}
            />
            <Input
              formik={formik}
              label={t("labels.complaintableType", { defaultValue: "Complaintable Type" })}
              name="complaintable_type"
              select
              options={["", ...COMPLAINTABLE_TYPES]}
              values={["", ...COMPLAINTABLE_TYPES]}
              optional
              value={formik.values.complaintable_type}
            />
            <Input
              formik={formik}
              label={t("labels.subject", { defaultValue: "Subject" })}
              name="subject"
              optional
              value={formik.values.subject}
            />
          </Box>

          <Box className={`grid justify-stretch items-center grid-cols-2 gap-3`}>
            <SubmitButton
              loading={false}
              type={"button"}
              handling={() => handleFilter("complaints", formik.values)}
              variant="gradient"
            >
              {t("buttons.applyFilter", { defaultValue: "Apply Filter" })}
            </SubmitButton>
            <SecondaryButton type={"button"} onClick={handleReset}>
              {t("buttons.clearFilter", { defaultValue: "Clear Filter" })}
            </SecondaryButton>
          </Box>
        </Box>
      </CustomMenu>

      <FilterChips variant="complaints" onClose={handleCloseChip} />
    </Box>
  );
};

export default FilterComplaintsForm;

