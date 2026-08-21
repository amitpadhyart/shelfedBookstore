import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  count,
  size = "sm",
  className,
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";
  return (
    <div className={cn("flex items-center gap-1.5", className)} role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5 stars`}>
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(rating);
          return (
            <Star
              key={i}
              className={cn(starSize, filled ? "fill-brass text-brass" : "fill-transparent text-ink/25 dark:text-paper-soft/25")}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      <span className="font-mono text-xs text-ink-soft dark:text-paper-soft/70">
        {rating.toFixed(1)}
        {count !== undefined && <span className="text-ink-faint dark:text-paper-soft/40"> ({count})</span>}
      </span>
    </div>
  );
}
