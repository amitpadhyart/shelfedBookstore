"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { CartSummary } from "@/components/cart/cart-summary";
import { LinkButton } from "@/components/ui/link-button";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const totalItems = useCartStore((s) => s.totalItems());

  // Avoid a hydration flash: localStorage isn't available during SSR,
  // so we render the "loaded" state only after mount.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <div className="container py-10 md:py-14">
      <p className="section-label">Your cart</p>
      <h1 className="font-display text-display-lg mt-2 mb-10 text-ink dark:text-paper-soft">
        {hydrated && totalItems > 0 ? `${totalItems} ${totalItems === 1 ? "book" : "books"} on the way` : "Your cart"}
      </h1>

      {!hydrated ? null : items.length === 0 ? (
        <div className="py-16 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-ink-faint dark:text-paper-soft/30" aria-hidden="true" />
          <p className="mt-4 font-display text-xl text-ink dark:text-paper-soft">Your cart is empty.</p>
          <p className="mt-1 font-body text-sm text-ink-soft dark:text-paper-soft/60">
            Go find something worth reading.
          </p>
          <LinkButton href="/catalog" className="mt-6">
            Browse the catalog
          </LinkButton>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_340px] gap-10">
          <div>
            {items.map((item) => (
              <CartItemRow key={item.bookId} item={item} />
            ))}
          </div>
          <CartSummary subtotal={subtotal} itemCount={totalItems} />
        </div>
      )}
    </div>
  );
}
