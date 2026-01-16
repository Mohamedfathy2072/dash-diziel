import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RatingStars from "./RatingStars";
import type { TripRating } from "../../types/domain";

interface RatingDisplayProps {
  rating: TripRating;
  showDetails?: boolean;
}

const RatingDisplay = ({ rating, showDetails = false }: RatingDisplayProps) => {
  const aspectRatings = [
    { label: "Punctuality", value: rating.punctuality_rating },
    { label: "Service", value: rating.service_rating },
    { label: "Cleanliness", value: rating.cleanliness_rating },
    { label: "Communication", value: rating.communication_rating },
    { label: "Safety", value: rating.safety_rating },
    { label: "Courtesy", value: rating.courtesy_rating },
  ].filter((aspect) => aspect.value !== null);

  return (
    <Box className="p-4 border border-gray-200 rounded-lg">
      <Box className="flex items-center justify-between mb-2">
        <Box className="flex items-center gap-2">
          <RatingStars rating={rating.overall_rating} showValue />
          {rating.rated_by && (
            <Typography variant="body2" className="text-gray-600">
              by {rating.rated_by.name}
            </Typography>
          )}
        </Box>
        <Typography variant="caption" className="text-gray-500">
          {new Date(rating.created_at).toLocaleDateString()}
        </Typography>
      </Box>

      {rating.review_text && (
        <Typography variant="body2" className="mt-2 text-gray-700">
          {rating.review_text}
        </Typography>
      )}

      {showDetails && aspectRatings.length > 0 && (
        <Box className="mt-4 pt-4 border-t border-gray-200">
          <Typography variant="subtitle2" className="mb-2 font-semibold">
            Detailed Ratings:
          </Typography>
          <Box className="grid grid-cols-2 gap-2">
            {aspectRatings.map((aspect) => (
              <Box key={aspect.label} className="flex items-center justify-between">
                <Typography variant="caption" className="text-gray-600">
                  {aspect.label}:
                </Typography>
                <RatingStars rating={aspect.value!} size="small" />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RatingDisplay;

