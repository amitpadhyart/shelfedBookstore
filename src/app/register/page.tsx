"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Couldn't create that account.");
      return;
    }

    const signInRes = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInRes?.error) {
      router.push("/login");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="container max-w-md py-16 md:py-24">
      <p className="section-label">New here</p>
      <h1 className="font-display text-display-lg mt-2 mb-8 text-ink dark:text-paper-soft">Create an account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} autoComplete="name" aria-invalid={!!errors.name} />
          {errors.name && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} autoComplete="email" aria-invalid={!!errors.email} />
          {errors.email && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} autoComplete="new-password" aria-invalid={!!errors.password} />
          {errors.password && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.password.message}</p>}
        </div>

        {error && <p className="text-sm text-wine dark:text-wine-light">{error}</p>}

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-ink-soft dark:text-paper-soft/60">
        Already have an account?{" "}
        <Link href="/login" className="text-spine dark:text-brass-light underline underline-offset-2">
          Log in
        </Link>
      </p>
    </div>
  );
}
