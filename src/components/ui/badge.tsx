import { cn } from "@/lib/utils";

export function GenreTag({ genre, className }: { genre: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-wine/40 text-wine dark:border-wine-light/50 dark:text-wine-light px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em]",
        className
      )}
    >
      {genre}
    </span>
  );
}

export function FormatTag({ format, className }: { format: string; className?: string }) {
  const label = format === "HARDCOVER" ? "Hardcover" : format === "EBOOK" ? "Ebook" : "Paperback";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-cloth/40 text-cloth dark:border-cloth-light/50 dark:text-cloth-light px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em]",
        className
      )}
    >
      {label}
    </span>
  );
}

export function PriceTag({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={cn("font-mono text-brass-dark dark:text-brass-light font-medium", className)}>
      ₹{amount.toLocaleString("en-IN")}
    </span>
  );
}
