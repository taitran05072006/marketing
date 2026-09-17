import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function StarRating({ rating, maxRating = 5, size = 'md', interactive = false, onRate }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onRate?.(i + 1)}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
            aria-label={`${i + 1} sao`}
          >
            <Star
              className={[
                sizeMap[size],
                filled ? 'fill-amber-400 text-amber-400' : 'text-gray-300',
                interactive && !filled ? 'hover:fill-amber-300 hover:text-amber-300' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          </button>
        );
      })}
    </div>
  );
}

export function RatingSummary({ averageRating, totalReviews }: { averageRating: number; totalReviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <StarRating rating={averageRating} size="sm" />
      <span className="text-sm text-gray-600">
        {averageRating.toFixed(1)} ({totalReviews} đánh giá)
      </span>
    </div>
  );
}
