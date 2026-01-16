import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/common/PageHeader/PageHeader";
import SectionHeader from "../components/common/SectionHeader/SectionHeader";
import InfoField from "../components/common/InfoField/InfoField";
import DetailPageWrapper from "../components/pages/DetailPageWrapper";
import DetailPageActions from "../components/common/DetailPageActions/DetailPageActions";
import useAuth from "../hooks/useAuth";
import useDetailPage from "../hooks/useDetailPage";
import { fetchAdById, clearSelectedAd } from "../store/adsSlice";
import type { RootState } from "../store/store";
import { handleGetFileFromServer } from "../functions/handleGetFileFromServer";

const Ad = () => {
  const { t } = useTranslation("pages/ad");
  const { isSuperAdmin } = useAuth();

  const { id, selectedItem: selectedAd, loading, error, handleBack } = useDetailPage({
    selector: (state: RootState) => ({
      selectedItem: state.ads.selectedAd,
      loading: state.ads.loading,
      error: state.ads.error,
    }),
    fetchAction: fetchAdById,
    clearAction: clearSelectedAd,
    backRoute: `${import.meta.env.VITE_ADS_ROUTE || "/ads"}`,
  });

  if (!isSuperAdmin) {
    return null;
  }

  const actions = (
    <DetailPageActions
      entityId={id}
      editRoute={`${import.meta.env.VITE_ADS_ROUTE || "/ads"}/edit/${id}`}
      deleteType="deleteAd"
      deleteIdKey="adId"
      editLabel={t("edit")}
      deleteLabel={t("delete")}
    />
  );

  if (!selectedAd && !loading) {
    return null;
  }

  return (
    <Box className="grid justify-stretch items-start gap-6">
      <PageHeader
        title={selectedAd?.title_en || ""}
        subtitle={t("subtitle")}
        actions={actions}
        backUrl={`${import.meta.env.VITE_ADS_ROUTE || "/ads"}`}
      />
      <DetailPageWrapper
        loading={loading}
        error={error}
        data={selectedAd}
        onBack={handleBack}
      >
        <Paper className="paper shadow-lg">
          <Box className="p-6">
            <SectionHeader
              title={t("basicInformation")}
              className="mb-4"
            />
            <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <InfoField
                label={t("titleEn")}
                value={selectedAd?.title_en || "-"}
              />
              <InfoField
                label={t("titleAr")}
                value={selectedAd?.title_ar || "-"}
              />
              <InfoField
                label={t("descriptionEn")}
                value={selectedAd?.description_en || "-"}
              />
              <InfoField
                label={t("descriptionAr")}
                value={selectedAd?.description_ar || "-"}
              />
              <InfoField
                label={t("link")}
                value={selectedAd?.link ? (
                  <a href={selectedAd.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {selectedAd.link}
                  </a>
                ) : "-"}
              />
              <InfoField
                label={t("image")}
                value={selectedAd?.image_url ? (
                  <img
                    src={handleGetFileFromServer(selectedAd.image_url) || ''}
                    alt={selectedAd.title_en}
                    className="max-w-xs max-h-48 object-contain rounded"
                  />
                ) : "-"}
              />
              <InfoField
                label={t("status")}
                value={
                  selectedAd?.is_active !== undefined ? (
                    <Chip
                      label={selectedAd.is_active ? t("active") : t("inactive")}
                      className={selectedAd.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}
                      size="small"
                    />
                  ) : "-"
                }
              />
              <InfoField
                label={t("order")}
                value={selectedAd?.order?.toString() || "0"}
              />
              <InfoField
                label={t("validFrom")}
                value={selectedAd?.valid_from ? new Date(selectedAd.valid_from).toLocaleString() : "-"}
              />
              <InfoField
                label={t("validUntil")}
                value={selectedAd?.valid_until ? new Date(selectedAd.valid_until).toLocaleString() : "-"}
              />
            </Box>
          </Box>
        </Paper>
      </DetailPageWrapper>
    </Box>
  );
};

export default Ad;

