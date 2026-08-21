"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { MessageCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { formatINR } from "@/lib/utils";
import { buildUpiLink } from "@/lib/upi";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import type { CartLine } from "@/store/cart-store";

export function PaymentStep({
  orderNumber,
  total,
  name,
  phone,
  address,
  items,
  subtotal,
}: {
  orderNumber: string;
  total: number;
  name: string;
  phone: string;
  address: string;
  items: CartLine[];
  subtotal: number;
}) {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone/i.test(navigator.userAgent));
  }, []);

  const payeeVpa = process.env.NEXT_PUBLIC_UPI_ID || "shelfedbookstore@upi";
  const payeeName = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "Shelfed Bookstore";
  const upiLink = buildUpiLink({ payeeVpa, payeeName, amount: total, orderNumber });
  const whatsappLink = buildWhatsAppOrderLink({ orderNumber, name, phone, address, items, subtotal, total });

  function handleCopy() {
    navigator.clipboard.writeText(payeeVpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="section-label">Order {orderNumber}</p>
        <h2 className="font-display text-display-md mt-1 text-ink dark:text-paper-soft">Almost there.</h2>
        <p className="mt-2 font-body text-sm text-ink-soft dark:text-paper-soft/70 max-w-sm mx-auto">
          Scan to pay {formatINR(total)} by UPI, then tap through to WhatsApp so we know to pack your order.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="leaf rounded-sm p-6 inline-block">
          <QRCodeSVG value={upiLink} size={220} bgColor="transparent" fgColor="currentColor" className="text-ink dark:text-paper-soft" level="M" />
        </div>

        <div className="flex items-center gap-2 font-mono text-sm text-ink-soft dark:text-paper-soft/70">
          <span>{payeeVpa}</span>
          <button type="button" onClick={handleCopy} aria-label="Copy UPI ID" className="text-ink-faint hover:text-ink dark:hover:text-paper-soft">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        {isMobile && (
          <a
            href={upiLink}
            className="font-mono text-xs uppercase tracking-[0.1em] text-spine underline underline-offset-2 dark:text-brass-light"
          >
            Open in a UPI app instead
          </a>
        )}
      </div>

      <div className="rule pt-6 text-center">
        <p className="font-body text-sm text-ink-soft dark:text-paper-soft/70 mb-4">
          Paid? Send us your order on WhatsApp with one tap — everything&apos;s pre-filled.
        </p>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="bg-[#25D366] hover:bg-[#1fbd5a] text-white">
            <MessageCircle className="h-4 w-4" /> Send order on WhatsApp
          </Button>
        </a>
      </div>

      <div className="text-center">
        <LinkButton href="/account" variant="ghost" size="sm">
          View order status in your account
        </LinkButton>
      </div>
    </div>
  );
}
