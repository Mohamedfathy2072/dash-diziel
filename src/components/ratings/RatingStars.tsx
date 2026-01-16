import Box from "@mui/material/Box";
import StarIcon from "../../icons/StarIcon";
import StarBorderIcon from "../../icons/StarBorderIcon";
import StarHalfIcon from "../../icons/StarHalfIcon";
import { useState } from "react";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "small" | "medium" | "large";
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
}

const RatingStars = ({
  rating,
  maxRating = 5,
  size = "medium",
  readOnly = true,
  onRatingChange,
  showValue = false,
}: RatingStarsProps) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [tempRating, setTempRating] = useState<number | null>(null);

  const displayRating = tempRating ?? hoveredRating ?? (typeof rating === 'number' ? rating : 0);
  const sizeClass = size === "small" ? "w-4 h-4" : size === "large" ? "w-8 h-8" : "w-6 h-6";

  const handleStarClick = (starValue: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(starValue);
      setTempRating(null);
    }
  };

  const handleStarHover = (starValue: number) => {
    if (!readOnly) {
      setHoveredRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoveredRating(null);
      setTempRating(null);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isHalfStar = displayRating >= starValue - 0.5 && displayRating < starValue;
    const isFullStar = displayRating >= starValue;

    if (isFullStar) {
      return (
        <StarIcon
          key={index}
          className={`${sizeClass} text-yellow-400 ${!readOnly ? "cursor-pointer hover:text-yellow-500" : ""}`}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
        />
      );
    } else if (isHalfStar) {
      return (
        <StarHalfIcon
          key={index}
          className={`${sizeClass} text-yellow-400 ${!readOnly ? "cursor-pointer hover:text-yellow-500" : ""}`}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
        />
      );
    } else {
      return (
        <StarBorderIcon
          key={index}
          className={`${sizeClass} text-gray-300 ${!readOnly ? "cursor-pointer hover:text-yellow-400" : ""}`}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
        />
      );
    }
  };

  return (
    <Box
      className="flex items-center gap-1"
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </Box>
  );
};

export default RatingStars;

