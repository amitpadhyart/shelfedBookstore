import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-spine text-paper-soft hover:bg-spine-light active:bg-spine-dark dark:bg-brass dark:text-ink dark:hover:bg-brass-light",
  secondary:
    "bg-transparent text-ink border border-ink/30 hover:border-ink hover:bg-ink/5 dark:text-paper-soft dark:border-paper-soft/30 dark:hover:bg-paper-soft/10",
  ghost:
    "bg-transparent text-ink hover:bg-ink/5 dark:text-paper-soft dark:hover:bg-paper-soft/10",
  outline:
    "bg-transparent text-spine border border-spine hover:bg-spine hover:text-paper-soft dark:text-brass-light dark:border-brass-light dark:hover:bg-brass-light dark:hover:text-ink",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3.5 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

/** Shared class builder so `<Link>` and other elements can look exactly like a Button. */
export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-body font-medium tracking-wide transition-colors duration-200 ease-book disabled:opacity-40 disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return <button ref={ref} className={buttonClasses(variant, size, className)} {...props} />;
  }
);
Button.displayName = "Button";
