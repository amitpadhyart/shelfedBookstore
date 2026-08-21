"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";

const STATUSES = ["PENDING_PAYMENT", "PAYMENT_CONFIRMED", "FULFILLED", "CANCELLED"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: string) {
    setValue(newStatus);
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="w-44">
      <Select value={value} onChange={(e) => handleChange(e.target.value)} disabled={saving} aria-label="Order status">
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </option>
        ))}
      </Select>
    </div>
  );
}
