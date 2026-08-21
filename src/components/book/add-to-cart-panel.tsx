"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";
import type { Book } from "@prisma/client";

export function AddToCartPanel({ book }: { book: Book }) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isSaved = useWishlistStore((s) => s.isSaved(book.id));
  const router = useRouter();

  const outOfStock = book.stock === 0;
  const lowStock = book.stock > 0 && book.stock <= 5;

  function handleAdd() {
    addItem(
      {
        bookId: book.id,
        slug: book.slug,
        title: book.title,
        author: book.author,
        price: book.price,
        coverUrl: book.coverUrl,
        format: book.format,
        stock: book.stock,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  function handleBuyNow() {
    handleAdd();
    router.push("/checkout");
  }

  return (
    <div className="space-y-5">
      {outOfStock ? (
        <p className="font-mono text-sm text-wine dark:text-wine-light">Currently out of stock</p>
      ) : (
        <p className={cn("font-mono text-sm", lowStock ? "text-wine dark:text-wine-light" : "text-spine dark:text-brass-light")}>
          {lowStock ? `Only ${book.stock} left` : "In stock, ships in 2–4 days"}
        </p>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-ink/25 dark:border-paper-soft/25 rounded-sm">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={outOfStock}
            aria-label="Decrease quantity"
            className="flex h-10 w-10 items-center justify-center disabled:opacity-30"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center font-mono text-sm" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
            disabled={outOfStock || quantity >= book.stock}
            aria-label="Increase quantity"
            className="flex h-10 w-10 items-center justify-center disabled:opacity-30"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

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
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-ink/25 dark:border-paper-soft/25 hover:border-wine transition-colors"
        >
          <Heart className={cn("h-4 w-4", isSaved && "fill-wine text-wine")} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleAdd} disabled={outOfStock} size="lg" className="flex-1">
          {justAdded ? (
            <>
              <Check className="h-4 w-4" /> Added to cart
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </>
          )}
        </Button>
        <Button onClick={handleBuyNow} disabled={outOfStock} variant="outline" size="lg" className="flex-1">
          Buy now
        </Button>
      </div>
    </div>
  );
}
