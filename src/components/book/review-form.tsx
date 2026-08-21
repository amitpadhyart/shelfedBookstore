"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

export function ReviewForm({ bookId }: { bookId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!session) {
    return (
      <div className="leaf rounded-sm p-6 text-center">
        <p className="font-body text-sm text-ink-soft dark:text-paper-soft/70">
          Log in to leave a review for this book.
        </p>
        <LinkButton href="/login" size="sm" variant="secondary" className="mt-3">
          Log in
        </LinkButton>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="leaf rounded-sm p-6 text-center">
        <p className="font-display text-lg text-ink dark:text-paper-soft">Thanks for the review.</p>
        <p className="mt-1 font-body text-sm text-ink-soft dark:text-paper-soft/70">It&apos;s live on this page now.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Pick a star rating first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/books/${bookId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Couldn't submit that review.");
      }
      setSubmitted(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="leaf rounded-sm p-6 space-y-4">
      <div>
        <p className="section-label mb-2">Your rating</p>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  (hoverRating || rating) >= star ? "fill-brass text-brass" : "fill-transparent text-ink/25 dark:text-paper-soft/25"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="section-label mb-2 block">
          Your review (optional)
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="What stuck with you about this one?"
        />
      </div>

      {error && <p className="text-sm text-wine dark:text-wine-light">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Posting…" : "Post review"}
      </Button>
    </form>
  );
}
