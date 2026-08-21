"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { BookCover } from "@/components/book/book-cover";
import { PriceTag, FormatTag } from "@/components/ui/badge";
import { useCartStore, type CartLine } from "@/store/cart-store";
import { formatINR } from "@/lib/utils";

export function CartItemRow({ item }: { item: CartLine }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 py-6 rule first:border-t-0 first:pt-0">
      <Link href={`/books/${item.slug}`} className="w-20 flex-shrink-0">
        <BookCover src={item.coverUrl} title={item.title} author={item.author} className="aspect-[2/3] w-full" sizes="80px" />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/books/${item.slug}`}>
              <h3 className="font-display text-base text-ink truncate hover:underline decoration-brass dark:text-paper-soft">
                {item.title}
              </h3>
            </Link>
            <p className="font-body text-sm text-ink-soft dark:text-paper-soft/60">{item.author}</p>
            <FormatTag format={item.format} className="mt-1.5" />
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.bookId)}
            aria-label={`Remove ${item.title} from cart`}
            className="flex-shrink-0 text-ink-faint hover:text-wine dark:hover:text-wine-light transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center border border-ink/25 dark:border-paper-soft/25 rounded-sm">
            <button
              type="button"
              onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center font-mono text-sm" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="text-right">
            <PriceTag amount={item.price * item.quantity} />
            {item.quantity > 1 && (
              <p className="font-mono text-[11px] text-ink-faint dark:text-paper-soft/40">
                {formatINR(item.price)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
