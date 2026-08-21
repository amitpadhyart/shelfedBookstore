"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, X } from "lucide-react";
import { BookCover } from "@/components/book/book-cover";
import { PriceTag } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addToCart = useCartStore((s) => s.addItem);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <div className="container py-10 md:py-14">
      <p className="section-label">Saved for later</p>
      <h1 className="font-display text-display-lg mt-2 mb-10 text-ink dark:text-paper-soft">Your wishlist</h1>

      {!hydrated ? null : items.length === 0 ? (
        <div className="py-16 text-center">
          <Heart className="mx-auto h-10 w-10 text-ink-faint dark:text-paper-soft/30" aria-hidden="true" />
          <p className="mt-4 font-display text-xl text-ink dark:text-paper-soft">Nothing saved yet.</p>
          <p className="mt-1 font-body text-sm text-ink-soft dark:text-paper-soft/60">
            Tap the heart on any book to keep it here.
          </p>
          <LinkButton href="/catalog" className="mt-6">
            Browse the catalog
          </LinkButton>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {items.map((book) => (
            <div key={book.bookId} className="relative">
              <button
                type="button"
                onClick={() => remove(book.bookId)}
                aria-label={`Remove ${book.title} from wishlist`}
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-paper-soft/90 text-ink shadow-pin dark:bg-night-surface/90 dark:text-paper-soft"
              >
                <X className="h-4 w-4" />
              </button>
              <Link href={`/books/${book.slug}`}>
                <BookCover src={book.coverUrl} title={book.title} author={book.author} className="aspect-[2/3] w-full" />
              </Link>
              <div className="mt-3">
                <Link href={`/books/${book.slug}`}>
                  <h3 className="font-display text-base text-ink hover:underline decoration-brass dark:text-paper-soft">{book.title}</h3>
                </Link>
                <p className="font-body text-sm text-ink-soft dark:text-paper-soft/60">{book.author}</p>
                <div className="mt-2 flex items-center justify-between">
                  <PriceTag amount={book.price} />
                  <button
                    type="button"
                    onClick={() =>
                      addToCart({ ...book, format: "PAPERBACK", stock: 99 }, 1)
                    }
                    aria-label={`Add ${book.title} to cart`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/25 hover:border-spine hover:bg-spine hover:text-paper-soft dark:border-paper-soft/25 dark:text-paper-soft transition-colors"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
