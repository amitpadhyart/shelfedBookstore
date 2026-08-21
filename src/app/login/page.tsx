"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setError(null);
    const res = await signIn("credentials", { ...data, redirect: false });
    if (res?.error) {
      setError("Wrong email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="container max-w-md py-16 md:py-24">
      <p className="section-label">Welcome back</p>
      <h1 className="font-display text-display-lg mt-2 mb-8 text-ink dark:text-paper-soft">Log in</h1>

      <button
        type="button"
        onClick={() => {
          setGoogleLoading(true);
          signIn("google", { callbackUrl });
        }}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-2.5 rounded-sm border border-ink/25 dark:border-paper-soft/25 py-2.5 font-body text-sm text-ink dark:text-paper-soft hover:bg-ink/5 dark:hover:bg-paper-soft/10 transition-colors disabled:opacity-50"
      >
        <GoogleIcon /> {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 rule" />
        <span className="font-mono text-xs text-ink-faint dark:text-paper-soft/40">or</span>
        <div className="flex-1 rule" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} autoComplete="email" aria-invalid={!!errors.email} />
          {errors.email && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} autoComplete="current-password" aria-invalid={!!errors.password} />
          {errors.password && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.password.message}</p>}
        </div>

        {error && <p className="text-sm text-wine dark:text-wine-light">{error}</p>}

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-ink-soft dark:text-paper-soft/60">
        New here?{" "}
        <Link href="/register" className="text-spine dark:text-brass-light underline underline-offset-2">
          Create an account
        </Link>
      </p>

      <p className="mt-8 rounded-sm bg-paper-warm dark:bg-night-soft p-4 font-mono text-[11px] text-ink-faint dark:text-paper-soft/40 leading-relaxed">
        Demo accounts — admin@shelfed.store / shelfed-admin-2026 · reader@shelfed.store / readingtime
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
