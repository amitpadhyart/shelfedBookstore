import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT: "bg-brass/15 text-brass-dark dark:text-brass-light border-brass/40",
  PAYMENT_CONFIRMED: "bg-cloth/15 text-cloth dark:text-cloth-light border-cloth/40",
  FULFILLED: "bg-spine/15 text-spine dark:text-brass-light border-spine/40",
  CANCELLED: "bg-wine/15 text-wine dark:text-wine-light border-wine/40",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pending payment",
  PAYMENT_CONFIRMED: "Payment confirmed",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em]",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
