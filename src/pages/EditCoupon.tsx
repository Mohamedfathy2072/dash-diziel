import GenericFormPage from "../components/pages/GenericFormPage";

const EditCoupon = () => {
  return (
    <GenericFormPage
      formType="editCoupon"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/edit_coupon"
      backRoute={`${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}`}
    />
  );
};

export default EditCoupon;

