"use client";

import { BookCover } from "@/components/book/book-cover";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import type { CartLine } from "@/store/cart-store";
import type { CheckoutInput } from "@/lib/validations";

export function OrderReview({
  items,
  subtotal,
  details,
  onBack,
  onConfirm,
  submitting,
}: {
  items: CartLine[];
  subtotal: number;
  details: CheckoutInput;
  onBack: () => void;
  onConfirm: () => void;
  submitting: boolean;
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="section-label mb-3">Items</p>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.bookId} className="flex items-center gap-4">
              <BookCover src={item.coverUrl} title={item.title} author={item.author} className="w-12 aspect-[2/3] flex-shrink-0" sizes="48px" />
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm text-ink dark:text-paper-soft truncate">{item.title}</p>
                <p className="font-mono text-xs text-ink-faint dark:text-paper-soft/40">Qty {item.quantity}</p>
              </div>
              <PriceTag amount={item.price * item.quantity} className="text-sm" />
            </div>
          ))}
        </div>
      </div>

      <div className="rule pt-5">
        <p className="section-label mb-3">Deliver to</p>
        <div className="font-body text-sm text-ink-soft dark:text-paper-soft/75 leading-relaxed">
          <p className="text-ink dark:text-paper-soft font-medium">{details.fullName}</p>
          <p>{details.phone}</p>
          <p>
            {details.line1}
            {details.line2 ? `, ${details.line2}` : ""}
          </p>
          <p>
            {details.city}, {details.state} {details.pincode}
          </p>
        </div>
      </div>

      <div className="rule pt-5 flex justify-between items-baseline">
        <span className="font-display text-lg text-ink dark:text-paper-soft">Total to pay</span>
        <span className="font-mono text-lg text-brass-dark dark:text-brass-light">{formatINR(subtotal)}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="button" variant="secondary" onClick={onBack} disabled={submitting}>
          Back
        </Button>
        <Button type="button" onClick={onConfirm} disabled={submitting} className="flex-1">
          {submitting ? "Placing order…" : "Place order & get payment QR"}
        </Button>
      </div>
    </div>
  );
}
