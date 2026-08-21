"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { GENRES } from "@/types";
import { cn } from "@/lib/utils";

const FORMATS = [
  { value: "HARDCOVER", label: "Hardcover" },
  { value: "PAPERBACK", label: "Paperback" },
  { value: "EBOOK", label: "Ebook" },
];

const RATINGS = [4, 3, 2];

export function FilterSidebar({
  priceBounds,
  genreCounts,
  className,
}: {
  priceBounds: { min: number; max: number };
  genreCounts: Record<string, number>;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const activeGenre = searchParams.get("genre") ?? "";
  const activeFormat = searchParams.get("format") ?? "";
  const activeMinRating = searchParams.get("minRating") ?? "";
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );

  function applyPriceRange() {
    updateParams({ minPrice: minPrice || null, maxPrice: maxPrice || null });
  }

  const hasActiveFilters = activeGenre || activeFormat || activeMinRating || minPrice || maxPrice;

  return (
    <aside className={cn("space-y-8", className)} aria-label="Filter books">
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            setMinPrice("");
            setMaxPrice("");
            router.push(pathname);
          }}
          className="font-mono text-xs uppercase tracking-[0.1em] text-wine dark:text-wine-light underline underline-offset-2"
        >
          Clear all filters
        </button>
      )}

      <fieldset>
        <legend className="section-label mb-3">Genre</legend>
        <div className="space-y-2">
          <FilterRadio
            checked={activeGenre === ""}
            onChange={() => updateParams({ genre: null })}
            label="All genres"
          />
          {GENRES.map((genre) => (
            <FilterRadio
              key={genre}
              checked={activeGenre === genre}
              onChange={() => updateParams({ genre })}
              label={genre}
              count={genreCounts[genre]}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="section-label mb-3">Format</legend>
        <div className="space-y-2">
          <FilterRadio checked={activeFormat === ""} onChange={() => updateParams({ format: null })} label="All formats" />
          {FORMATS.map((f) => (
            <FilterRadio
              key={f.value}
              checked={activeFormat === f.value}
              onChange={() => updateParams({ format: f.value })}
              label={f.label}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="section-label mb-3">Price (₹)</legend>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder={String(priceBounds.min)}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={applyPriceRange}
            className="w-full min-w-0 rounded-sm border border-ink/25 bg-paper-soft px-2.5 py-1.5 text-sm dark:bg-night-surface dark:border-paper-soft/25 dark:text-paper-soft"
            aria-label="Minimum price"
          />
          <span className="text-ink-faint">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder={String(priceBounds.max)}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={applyPriceRange}
            className="w-full min-w-0 rounded-sm border border-ink/25 bg-paper-soft px-2.5 py-1.5 text-sm dark:bg-night-surface dark:border-paper-soft/25 dark:text-paper-soft"
            aria-label="Maximum price"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="section-label mb-3">Rating</legend>
        <div className="space-y-2">
          <FilterRadio checked={activeMinRating === ""} onChange={() => updateParams({ minRating: null })} label="Any rating" />
          {RATINGS.map((r) => (
            <FilterRadio
              key={r}
              checked={activeMinRating === String(r)}
              onChange={() => updateParams({ minRating: String(r) })}
              label={`${r}+ stars`}
            />
          ))}
        </div>
      </fieldset>
    </aside>
  );
}

function FilterRadio({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer group">
      <span className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
            checked ? "border-spine bg-spine dark:border-brass dark:bg-brass" : "border-ink/30 dark:border-paper-soft/30"
          )}
          aria-hidden="true"
        >
          {checked && <span className="h-1.5 w-1.5 rounded-full bg-paper-soft" />}
        </span>
        <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
        <span className="font-body text-sm text-ink group-hover:text-spine dark:text-paper-soft/85 dark:group-hover:text-brass-light">
          {label}
        </span>
      </span>
      {count !== undefined && (
        <span className="font-mono text-xs text-ink-faint dark:text-paper-soft/40">{count}</span>
      )}
    </label>
  );
}
