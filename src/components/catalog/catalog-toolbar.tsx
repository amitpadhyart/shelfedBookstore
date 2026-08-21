"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Select } from "@/components/ui/select";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "New arrivals" },
  { value: "bestselling", label: "Bestselling" },
  { value: "rating", label: "Highest rated" },
  { value: "az", label: "Title, A–Z" },
  { value: "za", label: "Title, Z–A" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
];

export function CatalogToolbar({
  total,
  onOpenMobileFilters,
}: {
  total: number;
  onOpenMobileFilters: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 400);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) params.set("q", debouncedQuery);
    else params.delete("q");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, authors, ISBNs…"
            aria-label="Search the catalog"
            className="w-full rounded-sm border border-ink/25 bg-paper-soft py-2.5 pl-9 pr-9 text-sm placeholder:text-ink-faint focus-visible:border-spine dark:bg-night-surface dark:border-paper-soft/25 dark:text-paper-soft dark:placeholder:text-paper-soft/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink dark:hover:text-paper-soft"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm border border-ink/25 dark:border-paper-soft/25"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4 text-ink dark:text-paper-soft" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-ink-soft dark:text-paper-soft/60" aria-live="polite">
          {total} {total === 1 ? "book" : "books"}
        </p>
        <div className="w-48">
          <Select
            value={searchParams.get("sort") ?? "newest"}
            onChange={(e) => handleSortChange(e.target.value)}
            aria-label="Sort books by"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
