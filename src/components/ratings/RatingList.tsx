import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RatingDisplay from "./RatingDisplay";
import type { TripRating } from "../../types/domain";

interface RatingListProps {
  ratings: TripRating[];
  showDetails?: boolean;
  emptyMessage?: string;
}

const RatingList = ({
  ratings,
  showDetails = false,
  emptyMessage = "No ratings yet",
}: RatingListProps) => {
  if (ratings.length === 0) {
    return (
      <Box className="p-8 text-center">
        <Typography variant="body2" className="text-gray-500">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="space-y-4">
      {ratings.map((rating) => (
        <RatingDisplay key={rating.id} rating={rating} showDetails={showDetails} />
      ))}
    </Box>
  );
};

export default RatingList;

