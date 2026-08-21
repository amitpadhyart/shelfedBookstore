import { RatingStars } from "@/components/ui/rating-stars";
import { formatDate } from "@/lib/utils";

interface ReviewWithUser {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: { name: string | null; image: string | null };
}

export function ReviewList({ reviews }: { reviews: ReviewWithUser[] }) {
  if (reviews.length === 0) {
    return (
      <p className="font-body text-sm text-ink-soft dark:text-paper-soft/60">
        No reviews yet — be the first to leave a note for the next reader.
      </p>
    );
  }

  return (
    <ul className="space-y-6" aria-label="Reader reviews">
      {reviews.map((review) => (
        <li key={review.id} className="rule pt-5 first:border-t-0 first:pt-0">
          <div className="flex items-center justify-between">
            <p className="font-display text-base text-ink dark:text-paper-soft">
              {review.user.name ?? "A reader"}
            </p>
            <span className="font-mono text-xs text-ink-faint dark:text-paper-soft/40">
              {formatDate(review.createdAt)}
            </span>
          </div>
          <RatingStars rating={review.rating} className="mt-1" />
          {review.comment && (
            <p className="mt-2 font-body text-sm text-ink-soft dark:text-paper-soft/75">{review.comment}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
