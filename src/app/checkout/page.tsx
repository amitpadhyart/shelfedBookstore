"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { DeliveryForm } from "@/components/checkout/delivery-form";
import { OrderReview } from "@/components/checkout/order-review";
import { PaymentStep } from "@/components/checkout/payment-step";
import { useCartStore, type CartLine } from "@/store/cart-store";
import type { CheckoutInput } from "@/lib/validations";

type Step = "details" | "review" | "payment";

const STEPS: { key: Step; label: string }[] = [
  { key: "details", label: "Chapter One — Delivery" },
  { key: "review", label: "Chapter Two — Review" },
  { key: "payment", label: "Chapter Three — Payment" },
];

interface PlacedOrder {
  orderNumber: string;
  total: number;
  items: CartLine[];
  subtotal: number;
  details: CheckoutInput;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState<Step>("details");
  const [details, setDetails] = useState<CheckoutInput | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && items.length === 0 && !placedOrder) {
      router.replace("/cart");
    }
  }, [hydrated, items.length, placedOrder, router]);

  async function handlePlaceOrder() {
    if (!details) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...details,
          items: items.map((i) => ({ bookId: i.bookId, quantity: i.quantity, price: i.price, title: i.title })),
          subtotal,
          total: subtotal,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Couldn't place that order — try again.");
      }
      const order = await res.json();
      setPlacedOrder({ orderNumber: order.orderNumber, total: order.total, items, subtotal, details });
      clearCart();
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) return null;

  return (
    <div className="container py-10 md:py-14 max-w-2xl">
      <p className="section-label">Checkout</p>
      <h1 className="font-display text-display-lg mt-2 mb-8 text-ink dark:text-paper-soft">
        {step === "payment" ? "Order placed" : "Let's get this to you"}
      </h1>

      {step !== "payment" && (
        <ol className="flex items-center gap-2 mb-10 font-mono text-[11px] uppercase tracking-wide">
          {STEPS.slice(0, 2).map((s) => (
            <li
              key={s.key}
              className={
                s.key === step
                  ? "text-spine dark:text-brass-light"
                  : "text-ink-faint dark:text-paper-soft/30"
              }
            >
              {s.label}
            </li>
          ))}
        </ol>
      )}

      <AnimatePresence mode="wait">
        {step === "details" && (
          <motion.div key="details" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3 }}>
            <DeliveryForm
              defaultValues={{
                fullName: session?.user?.name ?? "",
              }}
              onSubmit={(data) => {
                setDetails(data);
                setStep("review");
              }}
            />
          </motion.div>
        )}

        {step === "review" && details && (
          <motion.div key="review" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3 }}>
            {error && <p className="mb-4 text-sm text-wine dark:text-wine-light">{error}</p>}
            <OrderReview
              items={items}
              subtotal={subtotal}
              details={details}
              onBack={() => setStep("details")}
              onConfirm={handlePlaceOrder}
              submitting={submitting}
            />
          </motion.div>
        )}

        {step === "payment" && placedOrder && (
          <motion.div key="payment" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <PaymentStep
              orderNumber={placedOrder.orderNumber}
              total={placedOrder.total}
              name={placedOrder.details.fullName}
              phone={placedOrder.details.phone}
              address={`${placedOrder.details.line1}${placedOrder.details.line2 ? ", " + placedOrder.details.line2 : ""}, ${placedOrder.details.city}, ${placedOrder.details.state} ${placedOrder.details.pincode}`}
              items={placedOrder.items}
              subtotal={placedOrder.subtotal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
