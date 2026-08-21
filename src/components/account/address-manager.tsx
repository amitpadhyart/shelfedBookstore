"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Star, Trash2 } from "lucide-react";
import { addressSchema, type AddressInput } from "@/lib/validations";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  label: string | null;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}
export function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(initialAddresses.length === 0);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({ resolver: zodResolver(addressSchema) });

  async function onSubmit(data: AddressInput) {
    setError(null);
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Couldn't save that address.");
      return;
    }
    const { address } = await res.json();
    setAddresses((prev) => (data.isDefault ? [...prev.map((a) => ({ ...a, isDefault: false })), address] : [...prev, address]));
    reset();
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
  }

  async function handleSetDefault(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    await fetch(`/api/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
  }

  return (
    <div className="space-y-6">
      {addresses.map((address) => (
        <div key={address.id} className="leaf rounded-sm p-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-base text-ink dark:text-paper-soft">{address.label || "Address"}</p>
              {address.isDefault && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-brass-dark dark:text-brass-light">
                  <Star className="h-3 w-3 fill-current" /> Default
                </span>
              )}
            </div>
            <p className="mt-1 font-body text-sm text-ink-soft dark:text-paper-soft/70">
              {address.fullName} · {address.phone}
            </p>
            <p className="font-body text-sm text-ink-soft dark:text-paper-soft/70">
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} {address.pincode}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {!address.isDefault && (
              <button
                type="button"
                onClick={() => handleSetDefault(address.id)}
                className="font-mono text-[11px] uppercase tracking-wide text-spine dark:text-brass-light"
              >
                Set default
              </button>
            )}
            <button
              type="button"
              onClick={() => handleDelete(address.id)}
              aria-label="Delete address"
              className="text-ink-faint hover:text-wine dark:hover:text-wine-light"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={handleSubmit(onSubmit)} className="leaf rounded-sm p-5 space-y-4" noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="label">Label (optional)</Label>
              <Input id="label" placeholder="Home, Work…" {...register("label")} />
            </div>
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" {...register("fullName")} aria-invalid={!!errors.fullName} />
              {errors.fullName && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.fullName.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" inputMode="numeric" {...register("phone")} aria-invalid={!!errors.phone} />
            {errors.phone && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.phone.message}</p>}
          </div>
          <div>
            <Label htmlFor="line1">Address line 1</Label>
            <Input id="line1" {...register("line1")} aria-invalid={!!errors.line1} />
            {errors.line1 && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.line1.message}</p>}
          </div>
          <div>
            <Label htmlFor="line2">Address line 2</Label>
            <Input id="line2" {...register("line2")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} aria-invalid={!!errors.city} />
              {errors.city && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.city.message}</p>}
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} aria-invalid={!!errors.state} />
              {errors.state && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.state.message}</p>}
            </div>
          </div>
          <div className="max-w-[160px]">
            <Label htmlFor="pincode">PIN code</Label>
            <Input id="pincode" inputMode="numeric" {...register("pincode")} aria-invalid={!!errors.pincode} />
            {errors.pincode && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.pincode.message}</p>}
          </div>
          <label className="flex items-center gap-2 font-body text-sm text-ink-soft dark:text-paper-soft/70">
            <input type="checkbox" {...register("isDefault")} className="h-4 w-4" />
            Set as default address
          </label>

          {error && <p className="text-sm text-wine dark:text-wine-light">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save address"}
            </Button>
            {addresses.length > 0 && (
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className={cn(
            "flex items-center gap-2 font-body text-sm text-spine dark:text-brass-light border border-dashed border-spine/50 dark:border-brass-light/50 rounded-sm px-4 py-3 w-full justify-center hover:bg-spine/5 dark:hover:bg-brass/5 transition-colors"
          )}
        >
          <Plus className="h-4 w-4" /> Add a new address
        </button>
      )}
    </div>
  );
}
