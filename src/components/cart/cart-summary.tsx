import { formatINR } from "@/lib/utils";
import { LinkButton } from "@/components/ui/link-button";

export function CartSummary({ subtotal, itemCount }: { subtotal: number; itemCount: number }) {
  return (
    <div className="leaf rounded-sm p-6 sticky top-24">
      <p className="section-label mb-4">Order summary</p>
      <div className="space-y-2.5 font-body text-sm">
        <div className="flex justify-between">
          <span className="text-ink-soft dark:text-paper-soft/60">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-mono text-ink dark:text-paper-soft">{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-soft dark:text-paper-soft/60">Shipping</span>
          <span className="font-mono text-ink dark:text-paper-soft">Calculated at checkout</span>
        </div>
      </div>
      <div className="mt-4 pt-4 rule flex justify-between items-baseline">
        <span className="font-display text-lg text-ink dark:text-paper-soft">Total</span>
        <span className="font-mono text-lg text-brass-dark dark:text-brass-light">{formatINR(subtotal)}</span>
      </div>
      <LinkButton href="/checkout" size="lg" className="w-full mt-6">
        Proceed to checkout
      </LinkButton>
      <p className="mt-3 font-mono text-[11px] text-ink-faint dark:text-paper-soft/40 text-center">
        Pay by UPI, confirm on WhatsApp.
      </p>
    </div>
  );
}
