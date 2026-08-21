import { formatINR } from "@/lib/utils";
import type { CartLine } from "@/store/cart-store";

export interface OrderDispatchDetails {
  orderNumber: string;
  name: string;
  phone: string;
  address: string;
  items: CartLine[];
  subtotal: number;
  total: number;
}

/**
 * Builds a wa.me link with the full order pre-filled as a WhatsApp message,
 * so the customer just has to hit send from their own number.
 */
export function buildWhatsAppOrderLink(details: OrderDispatchDetails) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const lines: string[] = [];

  lines.push(`Hi Shelfed! Here's my order *${details.orderNumber}*.`);
  lines.push("");
  details.items.forEach((item) => {
    lines.push(`• ${item.title} × ${item.quantity} — ${formatINR(item.price * item.quantity)}`);
  });
  lines.push("");
  lines.push(`Subtotal: ${formatINR(details.subtotal)}`);
  lines.push(`Total: ${formatINR(details.total)}`);
  lines.push("");
  lines.push(`Name: ${details.name}`);
  lines.push(`Phone: ${details.phone}`);
  lines.push(`Delivery address: ${details.address}`);
  lines.push("");
  lines.push("I've sent the UPI payment for this order — please confirm and dispatch. Thank you!");

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${number}?text=${text}`;
}
