import { useTranslation } from "react-i18next";
import * as yup from "yup";

const useRatingSchema = () => {
  const { t } = useTranslation("forms/rating_form");

  const RatingSchema = yup.object({
    overall_rating: yup
      .number()
      .required(t("overall_rating_required", { defaultValue: "Overall rating is required" }))
      .min(1, t("overall_rating_min", { defaultValue: "Rating must be at least 1" }))
      .max(5, t("overall_rating_max", { defaultValue: "Rating must be at most 5" })),
    punctuality_rating: yup
      .number()
      .nullable()
      .min(1, t("rating_min", { defaultValue: "Rating must be at least 1" }))
      .max(5, t("rating_max", { defaultValue: "Rating must be at most 5" })),
    service_rating: yup
      .number()
      .nullable()
      .min(1, t("rating_min", { defaultValue: "Rating must be at least 1" }))
      .max(5, t("rating_max", { defaultValue: "Rating must be at most 5" })),
    cleanliness_rating: yup
      .number()
      .nullable()
      .min(1, t("rating_min", { defaultValue: "Rating must be at least 1" }))
      .max(5, t("rating_max", { defaultValue: "Rating must be at most 5" })),
    communication_rating: yup
      .number()
      .nullable()
      .min(1, t("rating_min", { defaultValue: "Rating must be at least 1" }))
      .max(5, t("rating_max", { defaultValue: "Rating must be at most 5" })),
    safety_rating: yup
      .number()
      .nullable()
      .min(1, t("rating_min", { defaultValue: "Rating must be at least 1" }))
      .max(5, t("rating_max", { defaultValue: "Rating must be at most 5" })),
    courtesy_rating: yup
      .number()
      .nullable()
      .min(1, t("rating_min", { defaultValue: "Rating must be at least 1" }))
      .max(5, t("rating_max", { defaultValue: "Rating must be at most 5" })),
    review_text: yup
      .string()
      .nullable()
      .max(2000, t("review_text_max", { defaultValue: "Review text must be less than 2000 characters" })),
  });

  const RatingInitialValues = {
    overall_rating: 0 as number,
    punctuality_rating: null as number | null,
    service_rating: null as number | null,
    cleanliness_rating: null as number | null,
    communication_rating: null as number | null,
    safety_rating: null as number | null,
    courtesy_rating: null as number | null,
    review_text: "" as string,
  };

  return { RatingSchema, RatingInitialValues };
};

export default useRatingSchema;

