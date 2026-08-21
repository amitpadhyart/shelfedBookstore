import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink/15 dark:border-paper-soft/15 mt-20">
      <div className="container py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-display text-2xl text-ink dark:text-paper-soft">Shelfed</p>
            <p className="mt-2 font-body text-sm text-ink-soft dark:text-paper-soft/60 max-w-[22ch]">
              A bookstore, mostly. Curated in small batches, shipped with a note.
            </p>
          </div>

          <div>
            <p className="section-label mb-3">Browse</p>
            <ul className="space-y-2 font-body text-sm text-ink-soft dark:text-paper-soft/70">
              <li><Link href="/catalog" className="hover:text-ink dark:hover:text-paper-soft">All books</Link></li>
              <li><Link href="/catalog?sort=newest" className="hover:text-ink dark:hover:text-paper-soft">New arrivals</Link></li>
              <li><Link href="/catalog?sort=bestselling" className="hover:text-ink dark:hover:text-paper-soft">Bestsellers</Link></li>
              <li><Link href="/wishlist" className="hover:text-ink dark:hover:text-paper-soft">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <p className="section-label mb-3">Account</p>
            <ul className="space-y-2 font-body text-sm text-ink-soft dark:text-paper-soft/70">
              <li><Link href="/account" className="hover:text-ink dark:hover:text-paper-soft">Order history</Link></li>
              <li><Link href="/account/addresses" className="hover:text-ink dark:hover:text-paper-soft">Saved addresses</Link></li>
              <li><Link href="/login" className="hover:text-ink dark:hover:text-paper-soft">Log in</Link></li>
            </ul>
          </div>

          <div>
            <p className="section-label mb-3">Ordering</p>
            <p className="font-body text-sm text-ink-soft dark:text-paper-soft/70 max-w-[26ch]">
              Pay by UPI at checkout, then confirm on WhatsApp — we pack and ship once payment&apos;s in.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-ink/10 dark:border-paper-soft/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-xs text-ink-faint dark:text-paper-soft/40">
            © {new Date().getFullYear()} Shelfed Bookstore. Set in Fraunces, Libre Franklin &amp; IBM Plex Mono.
          </p>
          <p className="font-mono text-xs text-ink-faint dark:text-paper-soft/40">Printed digitally, read slowly.</p>
        </div>
      </div>
    </footer>
  );
}
