import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { submitRating } from "../../store/ratingsSlice";
import { useFormsStore } from "../../globals/formsStore";
import { handleToaster } from "../../functions/handleToaster";
import type { AppDispatch } from "../../store/store";
import type { TripRating } from "../../types/domain";

const useRatingSubmit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("forms/rating_form");
  const setLoading = useFormsStore((state) => state.setLoading);
  const isLoading = useFormsStore((state) => state.isLoading);

  const submitTripRating = async (tripId: number, values: Partial<TripRating>) => {
    if (isLoading) return;

    setLoading(true);
    try {
      await dispatch(submitRating({ tripId, data: values })).unwrap();
      handleToaster({
        msg: t("rating_submitted_successfully", { defaultValue: "Rating submitted successfully" }),
        status: "success",
      });
      return true;
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("failed_to_submit_rating", { defaultValue: "Failed to submit rating" }),
        status: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitTripRating };
};

export default useRatingSubmit;

