import { useState } from 'react';

// Star components
const StarEmpty = () => (
  <svg
    className="w-5 h-5 text-gray-300"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const StarFull = () => (
  <svg
    className="w-5 h-5 text-yellow-400"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const StarHalf = () => (
  <div className="relative w-5 h-5">
    <StarEmpty />
    <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
      <StarFull />
    </div>
  </div>
);

// Rating Display Component
const RatingDisplay = ({ rating, reviewCount }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Fallback for null, undefined, or zero values
  const safeRating = Number(rating) || 0;
  const safeReviewCount = reviewCount || 0;

  // Calculate stars
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="relative inline-block z-10">
      <div
        className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center gap-1">
          {/* Always show 5 empty stars if rating is 0 or null */}
          {safeRating === 0 ? (
            [...Array(5)].map((_, i) => <StarEmpty key={`empty-${i}`} />)
          ) : (
            <>
              {[...Array(fullStars)].map((_, i) => (
                <StarFull key={`full-${i}`} />
              ))}
              {hasHalfStar && <StarHalf />}
              {[...Array(emptyStars)].map((_, i) => (
                <StarEmpty key={`empty-${i}`} />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 z-200 mt-2">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg relative">
            {/* Tooltip content */}
            <div className="text-center whitespace-nowrap">
              {safeRating.toFixed(1)} out of 5
              <div className="text-gray-300 text-xs">
                {safeReviewCount} {safeReviewCount === 1 ? 'review' : 'reviews'}
              </div>
            </div>
            {/* Tooltip arrow */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45 z-[-1]"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingDisplay;
