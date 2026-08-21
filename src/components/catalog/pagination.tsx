import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="mt-14 flex items-center justify-center gap-1.5" aria-label="Catalog pagination">
      <PageLink href={buildHref(Math.max(page - 1, 1))} disabled={page === 1} label="Previous page">
        ←
      </PageLink>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-ink-faint">…</span>}
          <Link
            href={buildHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm transition-colors",
              p === page
                ? "bg-spine text-paper-soft dark:bg-brass dark:text-ink"
                : "text-ink hover:bg-ink/5 dark:text-paper-soft dark:hover:bg-paper-soft/10"
            )}
          >
            {p}
          </Link>
        </span>
      ))}

      <PageLink href={buildHref(Math.min(page + 1, totalPages))} disabled={page === totalPages} label="Next page">
        →
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full text-ink-faint/40 dark:text-paper-soft/20" aria-hidden="true">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-ink/5 dark:text-paper-soft dark:hover:bg-paper-soft/10"
    >
      {children}
    </Link>
  );
}
