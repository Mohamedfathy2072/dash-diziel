import GenericFormPage from "../components/pages/GenericFormPage";

const AddCoupon = () => {
  return (
    <GenericFormPage
      formType="addCoupon"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/add_coupon"
      backRoute={`${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}`}
    />
  );
};

export default AddCoupon;

