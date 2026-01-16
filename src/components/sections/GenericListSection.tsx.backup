import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import Forms from "../../forms/Forms";
import AddIcon from "../../icons/AddIcon";
import { GradientButton } from "../../mui/buttons/GradientButton";
import useListPage from "../../hooks/useListPage";

interface GenericListSectionProps {
  title: string;
  titleKey?: string;
  translationNamespace?: string;
  addUrl?: string;
  addLabel: string;
  addLabelKey?: string;
  filterFormType?: string;
  tableComponent: ReactNode;
  fetchAction: (queries: { [key: string]: string | number }) => any;
  defaultLimit?: string;
}

const GenericListSection = memo(({
  title,
  titleKey,
  translationNamespace,
  addUrl,
  addLabel,
  addLabelKey,
  filterFormType,
  tableComponent,
  fetchAction,
  defaultLimit = "10",
}: GenericListSectionProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(translationNamespace);

  // Use the list page hook to handle pagination and filtering
  useListPage({ fetchAction, defaultLimit });

  const displayTitle = useMemo(() => titleKey ? t(titleKey) : title, [titleKey, t, title]);
  const displayAddLabel = useMemo(() => addLabelKey ? t(addLabelKey) : addLabel, [addLabelKey, t, addLabel]);

  const handleAddClick = useCallback(() => {
    if (addUrl) {
      navigate(addUrl);
    }
  }, [navigate, addUrl]);

  return (
    <Box className="grid justify-stretch items-center gap-6">
      <Box className="flex justify-between items-center gap-4 flex-wrap">
        <Typography variant="h5" className="!font-[600]">
          {displayTitle}
        </Typography>
        {addUrl && (
          <GradientButton
            onClick={handleAddClick}
          >
            <AddIcon />
            {displayAddLabel}
          </GradientButton>
        )}
      </Box>
      <Paper className="paper">
        {filterFormType && <Forms type={filterFormType as any} />}
        {tableComponent}
      </Paper>
    </Box>
  );
});

GenericListSection.displayName = "GenericListSection";

export default GenericListSection;

