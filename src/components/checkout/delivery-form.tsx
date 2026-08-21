"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DeliveryForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<CheckoutInput>;
  onSubmit: (data: CheckoutInput) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" {...register("fullName")} autoComplete="name" aria-invalid={!!errors.fullName} />
        {errors.fullName && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.fullName.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="9876543210"
          {...register("phone")}
          autoComplete="tel"
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.phone.message}</p>}
      </div>

      <div>
        <Label htmlFor="line1">Address line 1</Label>
        <Input id="line1" placeholder="House / flat, street" {...register("line1")} autoComplete="address-line1" aria-invalid={!!errors.line1} />
        {errors.line1 && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.line1.message}</p>}
      </div>

      <div>
        <Label htmlFor="line2">Address line 2 (optional)</Label>
        <Textarea id="line2" rows={2} placeholder="Landmark, apartment name…" {...register("line2")} autoComplete="address-line2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} autoComplete="address-level2" aria-invalid={!!errors.city} />
          {errors.city && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.city.message}</p>}
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register("state")} autoComplete="address-level1" aria-invalid={!!errors.state} />
          {errors.state && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.state.message}</p>}
        </div>
      </div>

      <div className="max-w-[160px]">
        <Label htmlFor="pincode">PIN code</Label>
        <Input id="pincode" inputMode="numeric" {...register("pincode")} autoComplete="postal-code" aria-invalid={!!errors.pincode} />
        {errors.pincode && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.pincode.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        Continue to review
      </Button>
    </form>
  );
}
