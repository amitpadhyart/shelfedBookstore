"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/books", label: "Books" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin navigation" className="space-y-1">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname.startsWith(link.href) ? "page" : undefined}
          className={cn(
            "block py-2 font-body text-sm border-l-2 pl-3 transition-colors",
            pathname.startsWith(link.href)
              ? "border-wine text-ink dark:border-wine-light dark:text-paper-soft"
              : "border-transparent text-ink-soft hover:text-ink dark:text-paper-soft/60"
          )}
        >
          {link.label}
        </Link>
      ))}
      <Link href="/" className="block py-2 font-body text-sm border-l-2 border-transparent pl-3 text-ink-soft dark:text-paper-soft/60">
        ← Back to store
      </Link>
    </nav>
  );
}
