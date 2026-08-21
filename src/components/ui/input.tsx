import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-sm border border-ink/25 bg-paper-soft px-3.5 py-2.5 text-ink placeholder:text-ink-faint",
        "focus-visible:border-spine dark:bg-night-surface dark:text-paper-soft dark:border-paper-soft/25 dark:placeholder:text-paper-soft/40",
        "transition-colors duration-150",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-sm border border-ink/25 bg-paper-soft px-3.5 py-2.5 text-ink placeholder:text-ink-faint",
      "focus-visible:border-spine dark:bg-night-surface dark:text-paper-soft dark:border-paper-soft/25 dark:placeholder:text-paper-soft/40",
      "transition-colors duration-150",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn("block font-mono text-xs uppercase tracking-[0.12em] text-ink-soft mb-1.5 dark:text-paper-soft/70", className)}
    {...props}
  />
);
