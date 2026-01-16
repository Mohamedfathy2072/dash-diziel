import EntityActionMenu from "../../components/tables/EntityActionMenu";
import type { Coupon } from "../../types/domain";

const ActionMenus = ({ coupon }: { coupon: Coupon }) => {
  return (
    <EntityActionMenu
      entity={coupon}
      editRoute={(id) => `${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}/edit/${id}`}
      deleteType="deleteCoupon"
      deleteIdKey="couponId"
    />
  );
};

export default ActionMenus;

