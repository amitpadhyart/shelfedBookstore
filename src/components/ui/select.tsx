import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-sm border border-ink/25 bg-paper-soft px-3.5 py-2.5 pr-9 text-ink",
          "focus-visible:border-spine dark:bg-night-surface dark:text-paper-soft dark:border-paper-soft/25",
          "transition-colors duration-150",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint"
        aria-hidden="true"
      />
    </div>
  )
);
Select.displayName = "Select";
