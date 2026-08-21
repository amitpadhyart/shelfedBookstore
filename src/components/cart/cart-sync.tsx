"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

/**
 * Invisible sync component mounted once near the root.
 * On sign-in, pushes whatever is in localStorage up to the DB (merge),
 * then pulls the authoritative merged cart/wishlist back down.
 * Signed-out visitors just keep using localStorage — no DB calls at all.
 */
export function CartSync() {
  const { status } = useSession();
  const hasSynced = useRef(false);

  const cartItems = useCartStore((s) => s.items);
  const replaceCart = useCartStore((s) => s.replaceCart);
  const wishlistItems = useWishlistStore((s) => s.items);
  const replaceWishlist = useWishlistStore((s) => s.replaceWishlist);

  useEffect(() => {
    if (status !== "authenticated" || hasSynced.current) return;
    hasSynced.current = true;

    (async () => {
      try {
        const [cartRes, wishlistRes] = await Promise.all([
          fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cartItems.map((i) => ({ bookId: i.bookId, quantity: i.quantity })),
            }),
          }),
          fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookIds: wishlistItems.map((i) => i.bookId),
            }),
          }),
        ]);

        if (cartRes.ok) {
          const merged = await cartRes.json();
          replaceCart(merged.items);
        }
        if (wishlistRes.ok) {
          const merged = await wishlistRes.json();
          replaceWishlist(merged.items);
        }
      } catch {
        // Sync failures are non-fatal — localStorage remains the fallback source of truth.
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") hasSynced.current = false;
  }, [status]);

  return null;
}
