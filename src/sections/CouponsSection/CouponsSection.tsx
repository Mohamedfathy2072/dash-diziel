import { useCallback } from "react";
import { useSelector } from "react-redux";
import GenericListSection from "../../components/sections/GenericListSection";
import useAuth from "../../hooks/useAuth";
import { fetchCoupons } from "../../store/couponsSlice";
import type { RootState } from "../../store/store";
import CouponsTable from "../../Tables/CouponsTable/CouponsTable";

const CouponsSection = () => {
  const { isSuperAdmin } = useAuth();
  const { coupons, totalCount, loading } = useSelector(
    (state: RootState) => state.coupons
  );

  const fetchAction = useCallback((queries: { [key: string]: string | number }) => {
    const page = +(queries.page || 1);
    const limit = +(queries.limit || 10);
    return fetchCoupons({ page, limit });
  }, []);

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <GenericListSection
      title=""
      titleKey="labels.coupons"
      translationNamespace="sections/coupons_section"
      addUrl={`${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}/add`}
      addLabel=""
      addLabelKey="buttons.addNewCoupon"
      tableComponent={
        <CouponsTable
          data={coupons}
          loading={loading}
          count={totalCount}
        />
      }
      fetchAction={fetchAction}
      defaultLimit="10"
    />
  );
};

export default CouponsSection;

