import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Forms from "../../forms/Forms";
import PageHeader from "../common/PageHeader/PageHeader";

interface GenericFormPageProps {
  formType: string;
  titleKey: string;
  subtitleKey?: string;
  title?: string;
  subtitle?: string;
  translationNamespace?: string;
  backRoute: string;
}

const GenericFormPage = ({
  formType,
  titleKey,
  subtitleKey,
  title,
  subtitle,
  translationNamespace,
  backRoute,
}: GenericFormPageProps) => {
  const { t } = useTranslation(translationNamespace);
  const { id } = useParams();

  const displayTitle = title || t(titleKey);
  const displaySubtitle = subtitle || (subtitleKey ? t(subtitleKey) : undefined);
  
  // Determine back URL - if editing, go back to detail page, otherwise to list
  const backUrl = id ? `${backRoute}/${id}` : backRoute;

  return (
    <Box className="grid justify-stretch items-start gap-6">
      <PageHeader
        title={displayTitle}
        subtitle={displaySubtitle}
        backUrl={backUrl}
      />
      <Forms type={formType as any} />
    </Box>
  );
};

export default GenericFormPage;

