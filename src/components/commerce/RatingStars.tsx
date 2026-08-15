export function RatingStars({
  rating = 0,
  reviews = 0,
  size = 14,
  className = "",
}: {
  rating?: number;
  reviews?: number;
  size?: number;
  className?: string;
}) {
  if (!rating || rating <= 0) return null;
  const clamped = Math.max(0, Math.min(5, rating));
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div
        className="flex items-center"
        role="img"
        aria-label={`Rated ${clamped} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = clamped >= i ? 1 : clamped >= i - 0.5 ? 0.5 : 0;
          return <Star key={i} size={size} fill={fill} />;
        })}
      </div>
      {reviews > 0 && (
        <span className="text-xs text-muted-foreground">({reviews})</span>
      )}
    </div>
  );
}

function Star({ size, fill }: { size: number; fill: number }) {
  const id = `star-half-${fill}-${size}`;
  if (fill === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-warning" aria-hidden="true">
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  }
  if (fill === 0.5) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="rgb(226 232 240)" />
          </linearGradient>
        </defs>
        <path fill={`url(#${id})`} className="text-warning" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="rgb(226 232 240)" aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}