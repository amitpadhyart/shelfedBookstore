"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { BookCover } from "@/components/book/book-cover";
import { RatingStars } from "@/components/ui/rating-stars";
import { PriceTag } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";
import type { Book } from "@prisma/client";

export function BookCard({ book, className }: { book: Book; className?: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isSaved = useWishlistStore((s) => s.isSaved(book.id));

  return (
    <motion.article
      className={cn("group relative flex flex-col", className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        <Link
          href={`/books/${book.slug}`}
          className="block aspect-[2/3] outline-none"
          tabIndex={-1}
        >
          <motion.div
            className="h-full w-full"
            whileHover={{ y: -6, rotate: -0.6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <BookCover src={book.coverUrl} title={book.title} author={book.author} className="h-full w-full" />
          </motion.div>
        </Link>

        <button
          type="button"
          onClick={() =>
            toggleWishlist({
              bookId: book.id,
              slug: book.slug,
              title: book.title,
              author: book.author,
              price: book.price,
              coverUrl: book.coverUrl,
            })
          }
          aria-pressed={isSaved}
          aria-label={isSaved ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-paper-soft/90 text-ink opacity-0 shadow-pin transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 dark:bg-night-surface/90 dark:text-paper-soft"
        >
          <Heart className={cn("h-4 w-4", isSaved && "fill-wine text-wine")} />
        </button>

        {book.stock === 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-ink/85 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-paper-soft">
            Out of stock
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <Link href={`/books/${book.slug}`} className="story-link">
          <h3 className="font-display text-lg leading-snug text-ink group-hover:underline decoration-brass decoration-2 underline-offset-4 dark:text-paper-soft">
            {book.title}
          </h3>
        </Link>
        <p className="font-body text-sm text-ink-soft dark:text-paper-soft/70">{book.author}</p>
        <RatingStars rating={book.rating} count={book.ratingCount} className="mt-1" />

        <div className="mt-auto flex items-center justify-between pt-3">
          <PriceTag amount={book.price} />
          <button
            type="button"
            disabled={book.stock === 0}
            onClick={() =>
              addItem({
                bookId: book.id,
                slug: book.slug,
                title: book.title,
                author: book.author,
                price: book.price,
                coverUrl: book.coverUrl,
                format: book.format,
                stock: book.stock,
              })
            }
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors duration-150 hover:border-spine hover:bg-spine hover:text-paper-soft disabled:opacity-30 disabled:pointer-events-none dark:border-paper-soft/25 dark:text-paper-soft dark:hover:border-brass dark:hover:bg-brass dark:hover:text-ink"
            aria-label={`Add ${book.title} to cart`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
