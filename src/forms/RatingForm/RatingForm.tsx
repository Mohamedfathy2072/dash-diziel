import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import RatingStars from "../../components/ratings/RatingStars";
import { BasicButton } from "../../mui/buttons/BasicButton";
import { GradientButton } from "../../mui/buttons/GradientButton";
import { useFormsStore } from "../../globals/formsStore";
import FormSection from "../../components/common/FormSection/FormSection";
import type { FormikProps } from "formik";
import type { TripRating } from "../../types/domain";

interface RatingFormProps {
  formik: FormikProps<Partial<TripRating>>;
  onClose: () => void;
  tripId?: number;
}

const RatingForm = ({ formik, onClose }: RatingFormProps) => {
  const { t } = useTranslation("forms/rating_form");
  const isLoading = useFormsStore((state) => state.isLoading);

  const aspectRatings = [
    { key: "punctuality_rating", label: t("punctuality", { defaultValue: "Punctuality" }) },
    { key: "service_rating", label: t("service", { defaultValue: "Service" }) },
    { key: "cleanliness_rating", label: t("cleanliness", { defaultValue: "Cleanliness" }) },
    { key: "communication_rating", label: t("communication", { defaultValue: "Communication" }) },
    { key: "safety_rating", label: t("safety", { defaultValue: "Safety" }) },
    { key: "courtesy_rating", label: t("courtesy", { defaultValue: "Courtesy" }) },
  ];

  return (
    <Box className="grid justify-stretch items-start gap-6">
      {/* Overall Rating Section */}
      <FormSection title={t("overallRating", { defaultValue: "Overall Rating" })}>
        <Box className="flex flex-col gap-4">
          <Typography variant="body2" className="text-gray-600">
            {t("overallRatingDescription", { defaultValue: "Rate your overall experience (required)" })}
          </Typography>
          <RatingStars
            rating={typeof formik.values.overall_rating === 'number' ? formik.values.overall_rating : 0}
            readOnly={false}
            onRatingChange={(rating) => formik.setFieldValue("overall_rating", rating)}
          />
          {formik.touched.overall_rating && formik.errors.overall_rating && (
            <Typography variant="caption" className="text-red-500">
              {formik.errors.overall_rating}
            </Typography>
          )}
        </Box>
      </FormSection>

      {/* Aspect Ratings Section */}
      <FormSection title={t("detailedRatings", { defaultValue: "Detailed Ratings (Optional)" })}>
        <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
          {aspectRatings.map((aspect) => {
            const value = formik.values[aspect.key as keyof TripRating] as number | null | undefined;
            return (
              <Box key={aspect.key} className="flex flex-col gap-2">
                <Typography variant="body2" className="text-gray-700">
                  {aspect.label}
                </Typography>
                <RatingStars
                  rating={typeof value === 'number' ? value : 0}
                  readOnly={false}
                  onRatingChange={(rating) => formik.setFieldValue(aspect.key, rating)}
                />
              </Box>
            );
          })}
        </Box>
      </FormSection>

      {/* Review Text Section */}
      <FormSection title={t("review", { defaultValue: "Review (Optional)" })}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label={t("reviewText", { defaultValue: "Write a review" })}
          placeholder={t("reviewPlaceholder", { defaultValue: "Share your experience..." })}
          value={formik.values.review_text ?? ""}
          onChange={(e) => formik.setFieldValue("review_text", e.target.value)}
          error={!!(formik.touched.review_text && formik.errors.review_text)}
          helperText={formik.touched.review_text && formik.errors.review_text}
        />
      </FormSection>

      {/* Submit Button */}
      <Box className="flex justify-end gap-4">
        <BasicButton onClick={onClose} disabled={isLoading}>
          {t("cancel", { defaultValue: "Cancel" })}
        </BasicButton>
        <GradientButton onClick={() => formik.handleSubmit()} disabled={isLoading}>
          {isLoading ? t("submitting", { defaultValue: "Submitting..." }) : t("submit", { defaultValue: "Submit Rating" })}
        </GradientButton>
      </Box>
    </Box>
  );
};

export default RatingForm;

