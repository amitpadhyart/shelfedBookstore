"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User, Menu, X, Moon, Sun } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/catalog", label: "Browse" },
  { href: "/catalog?genre=Fiction", label: "Fiction" },
  { href: "/catalog?genre=Non-Fiction", label: "Non-fiction" },
  { href: "/catalog?genre=Children%27s", label: "Children's" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const totalItems = useCartStore((s) => s.totalItems());
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  }

  return (
    <div className="sticky top-0 z-40 bg-paper/95 dark:bg-night/95 backdrop-blur border-b border-ink/15 dark:border-paper-soft/15">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-tight text-ink dark:text-paper-soft" onClick={() => setMenuOpen(false)}>
          Shelfed
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-body text-sm text-ink-soft hover:text-ink dark:text-paper-soft/70 dark:hover:text-paper-soft transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search books"
            onClick={() => setSearchOpen((o) => !o)}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5 dark:hover:bg-paper-soft/10 transition-colors"
          >
            <Search className="h-[18px] w-[18px] text-ink dark:text-paper-soft" />
          </button>

          <button
            type="button"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5 dark:hover:bg-paper-soft/10 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px] text-paper-soft" />
            ) : (
              <Moon className="h-[18px] w-[18px] text-ink" />
            )}
          </button>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5 dark:hover:bg-paper-soft/10 transition-colors"
          >
            <Heart className="h-[18px] w-[18px] text-ink dark:text-paper-soft" />
          </Link>

          <Link
            href={session ? "/account" : "/login"}
            aria-label={session ? "Your account" : "Log in"}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5 dark:hover:bg-paper-soft/10 transition-colors"
          >
            <User className="h-[18px] w-[18px] text-ink dark:text-paper-soft" />
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5 dark:hover:bg-paper-soft/10 transition-colors"
          >
            <ShoppingBag className="h-[18px] w-[18px] text-ink dark:text-paper-soft" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 font-mono text-[10px] text-paper-soft">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5 dark:hover:bg-paper-soft/10 transition-colors"
          >
            {menuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink/10 dark:border-paper-soft/10"
          >
            <form onSubmit={handleSearchSubmit} className="container py-3">
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, authors, ISBNs…"
                aria-label="Search books"
                className="w-full bg-transparent font-display text-xl italic placeholder:text-ink-faint focus:outline-none dark:text-paper-soft dark:placeholder:text-paper-soft/40"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-ink/10 dark:border-paper-soft/10"
          >
            <nav className="container py-4 flex flex-col gap-1" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 font-display text-lg text-ink dark:text-paper-soft"
                >
                  {link.label}
                </Link>
              ))}
              <div className={cn("mt-2 pt-3 border-t border-ink/10 dark:border-paper-soft/10 flex items-center gap-4")}>
                <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="text-sm text-ink-soft dark:text-paper-soft/70">
                  Wishlist
                </Link>
                <Link href={session ? "/account" : "/login"} onClick={() => setMenuOpen(false)} className="text-sm text-ink-soft dark:text-paper-soft/70">
                  {session ? "Account" : "Log in"}
                </Link>
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-sm text-ink-soft dark:text-paper-soft/70"
                >
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </button>
                {session && (
                  <button type="button" onClick={() => signOut()} className="text-sm text-wine dark:text-wine-light">
                    Log out
                  </button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
