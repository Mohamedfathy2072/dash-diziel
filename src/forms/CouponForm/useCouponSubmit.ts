import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { createCoupon, updateCoupon } from "../../store/couponsSlice";
import { useFormsStore } from "../../globals/formsStore";
import { handleToaster } from "../../functions/handleToaster";
import type { CouponFormTypes } from "../../types/forms";
import type { AppDispatch } from "../../store/store";
import { useParams } from "react-router-dom";

const useCouponSubmit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("forms/coupon_form");
  const { id } = useParams();
  const setLoading = useFormsStore((state) => state.setLoading);
  const isLoading = useFormsStore((state) => state.isLoading);

  const addCoupon = async (values: CouponFormTypes) => {
    if (isLoading) return;
    
    setLoading(true);
    try {
      // Prepare data for API
      const data: any = {
        code: values.code,
        type: values.type,
        value: values.value,
        min_order_amount: values.min_order_amount || null,
        max_discount: values.max_discount || null,
        usage_limit: values.usage_limit || null,
        user_limit: values.user_limit,
        valid_from: values.valid_from,
        valid_until: values.valid_until,
        is_active: values.is_active,
        applicable_to: values.applicable_to,
        description: values.description || null,
      };

      // Add vehicle_types only if applicable_to is specific_vehicle_types
      if (values.applicable_to === "specific_vehicle_types" && values.vehicle_types.length > 0) {
        data.vehicle_types = values.vehicle_types;
      }

      await dispatch(createCoupon(data)).unwrap();
      handleToaster({
        msg: t("coupon_created_successfully", { defaultValue: "Coupon created successfully" }),
        status: "success",
      });
      navigate(`${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}`);
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("failed_to_create_coupon", { defaultValue: "Failed to create coupon" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const editCoupon = async (values: CouponFormTypes) => {
    if (isLoading || !id) return;
    
    setLoading(true);
    try {
      // Prepare data for API
      const data: any = {
        code: values.code,
        type: values.type,
        value: values.value,
        min_order_amount: values.min_order_amount || null,
        max_discount: values.max_discount || null,
        usage_limit: values.usage_limit || null,
        user_limit: values.user_limit,
        valid_from: values.valid_from,
        valid_until: values.valid_until,
        is_active: values.is_active,
        applicable_to: values.applicable_to,
        description: values.description || null,
      };

      // Add vehicle_types only if applicable_to is specific_vehicle_types
      if (values.applicable_to === "specific_vehicle_types" && values.vehicle_types.length > 0) {
        data.vehicle_types = values.vehicle_types;
      }

      await dispatch(updateCoupon({ id: +id, data })).unwrap();
      handleToaster({
        msg: t("coupon_updated_successfully", { defaultValue: "Coupon updated successfully" }),
        status: "success",
      });
      navigate(`${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}/${id}`);
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("failed_to_update_coupon", { defaultValue: "Failed to update coupon" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { addCoupon, editCoupon };
};

export default useCouponSubmit;

