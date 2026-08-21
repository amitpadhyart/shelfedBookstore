"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/account", label: "Order history" },
  { href: "/account/addresses", label: "Saved addresses" },
  { href: "/wishlist", label: "Wishlist" },
];

export function AccountNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Account navigation" className="space-y-1">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={pathname === link.href ? "page" : undefined}
          className={cn(
            "block py-2 font-body text-sm border-l-2 pl-3 transition-colors",
            pathname === link.href
              ? "border-spine text-ink dark:border-brass dark:text-paper-soft"
              : "border-transparent text-ink-soft hover:text-ink dark:text-paper-soft/60 dark:hover:text-paper-soft"
          )}
        >
          {link.label}
        </Link>
      ))}
      {isAdmin && (
        <Link
          href="/admin"
          className="block py-2 font-body text-sm border-l-2 border-transparent pl-3 text-wine dark:text-wine-light"
        >
          Admin panel
        </Link>
      )}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="block w-full text-left py-2 font-body text-sm border-l-2 border-transparent pl-3 text-ink-soft hover:text-wine dark:text-paper-soft/60 dark:hover:text-wine-light"
      >
        Log out
      </button>
    </nav>
  );
}
