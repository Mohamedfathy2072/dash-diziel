import { useCallback } from "react";
import { useSelector } from "react-redux";
import GenericListSection from "../../components/sections/GenericListSection";
import useAuth from "../../hooks/useAuth";
import { fetchAds } from "../../store/adsSlice";
import type { RootState } from "../../store/store";
import AdsTable from "../../Tables/AdsTable/AdsTable";

const AdsSection = () => {
  const { isSuperAdmin } = useAuth();
  const { ads, totalCount, loading } = useSelector(
    (state: RootState) => state.ads
  );

  const fetchAction = useCallback((queries: { [key: string]: string | number }) => {
    const page = +(queries.page || 1);
    const limit = +(queries.limit || 10);
    return fetchAds({ page, limit });
  }, []);

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <GenericListSection
      title=""
      titleKey="labels.ads"
      translationNamespace="sections/ads_section"
      addUrl={`${import.meta.env.VITE_ADS_ROUTE || "/ads"}/add`}
      addLabel=""
      addLabelKey="buttons.addNewAd"
      tableComponent={
        <AdsTable
          data={ads}
          loading={loading}
          count={totalCount}
        />
      }
      fetchAction={fetchAction}
      defaultLimit="10"
    />
  );
};

export default AdsSection;

