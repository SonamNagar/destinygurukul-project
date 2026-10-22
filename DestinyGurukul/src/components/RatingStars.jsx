import { Rating } from "react-simple-star-rating";

export default function RatingStars({
  rating = 0,
  readonly = true,
  size = 18,
  onRatingChange,
  showValue = false,
  className = "",
}) {
  const numRating = Number(rating) || 0;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Rating
        initialValue={numRating}
        readonly={readonly}
        size={size}
        allowFraction={true}
        transition={!readonly}
        onClick={onRatingChange}
        fillColor="#f59e0b"
        emptyColor="#e5e7eb"
        SVGstyle={{ display: "inline-block" }}
      />
      {showValue && (
        <span className="text-sm font-bold text-amber-600 ml-1">
          {numRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
