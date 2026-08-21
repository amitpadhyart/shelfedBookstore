# Shelfed Bookstore

A curated online bookstore — editorial magazine layout, staff-pick index cards, mood-based shelves, and a checkout flow built around UPI QR codes and WhatsApp instead of a payment gateway.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma, PostgreSQL, and NextAuth.js.

## Design

The brief was "not another dark-mode card grid." The result:

- **Palette** — warm putty paper, not the generic cream-and-terracotta AI default. Primary accent is a deep "Daunt-green," with brass and wine as secondary/tertiary accents.
- **Type system** — Fraunces (display serif, variable, with its SOFT/WONK axes for warmth) + Libre Franklin (humanist sans, body) + IBM Plex Mono (prices, ISBNs, order numbers) + Caveat (handwritten accent, used only on staff-pick notes).
- **Signature element** — the "staff table" on the homepage renders recommendations as digital index cards, a nod to the actual handwritten cards taped under staff picks at shops like Strand and Powell's.
- **No hero carousel, no CTA banner.** The homepage opens like a magazine: a masthead, an editorial pull-quote, then a front table, new arrivals, mood shelves, and the staff table.

## Getting started

### 1. Install dependencies

```bash
npm install
```

This also runs `prisma generate` automatically via `postinstall`.

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string. Neon, Supabase, and Railway all work well for a project this size. |
| `DIRECT_URL` | Only matters in production with a connection pooler (Neon/Supabase) — see [DEPLOYMENT.md](./DEPLOYMENT.md). Locally, just set it to the same value as `DATABASE_URL`. |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | `http://localhost:3000` locally. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional. Leave blank to disable Google sign-in — email/password still works. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | The number the "Send order" button messages, international format, digits only (e.g. `919876543210`). |
| `NEXT_PUBLIC_UPI_ID` | The UPI ID the QR code and payment link pay into. |
| `NEXT_PUBLIC_UPI_PAYEE_NAME` | Name shown in the UPI app during payment. |
| `NEXT_PUBLIC_SITE_URL` | Used for metadata, Open Graph, and the sitemap. |

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npm run db:seed
```

The seed script loads `data/books.json` (48 books across 8 genres) and creates two demo accounts:

- **Admin** — `admin@shelfed.store` / `shelfed-admin-2026`
- **Customer** — `reader@shelfed.store` / `readingtime`

### 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`. Admin panel is at `/admin` (admin account only).

## Project structure

```
src/
  app/                  Routes (App Router)
    (catalog, books/[slug], cart, checkout, login, register,
     account/*, admin/*, api/*)
  components/           UI, organized by feature area
  lib/                  Prisma client, auth config, UPI/WhatsApp
                         link builders, validation schemas, queries
  store/                Zustand stores (cart, wishlist) — persisted
                         to localStorage, synced to the DB on login
  types/                Shared TypeScript types
  hooks/                use-debounce, use-media-query
prisma/
  schema.prisma         Full data model
  seed.ts                Seed script
data/
  books.json             Seed data — 48 books, 8 genres
Dockerfile                Multi-stage production build (see DEPLOYMENT.md)
docker-compose.yml         App + Postgres + migrate/seed tooling
.github/workflows/ci.yml   Type-check, lint, build on every push/PR
```

## How ordering works (no payment gateway)

1. **Cart** — held in `localStorage` via Zustand for guests. On login, `CartSync` merges it into the database (`cart_items` table) and the DB copy becomes the source of truth from then on.
2. **Checkout** — three steps ("chapters"): delivery details → review → payment. Placing an order calls `POST /api/orders`, which validates stock inside a transaction, decrements it, and creates the order as `PENDING_PAYMENT`.
3. **Payment** — the client builds a `upi://pay` deep link (`src/lib/upi.ts`) encoding the payee VPA, exact amount, and order number, and renders it as a QR code with `qrcode.react`. On mobile, there's also a direct "open in UPI app" link.
4. **Confirmation** — a `wa.me` link (`src/lib/whatsapp.ts`) opens WhatsApp with the full order — items, quantities, total, name, address — pre-filled as a message to the store's number.
5. **Fulfillment** — orders stay `PENDING_PAYMENT` until a human on the admin `/admin/orders` page confirms payment arrived and updates the status (`PAYMENT_CONFIRMED` → `FULFILLED`).

## Notes on this build

- **Book covers** come from the Open Library covers API by ISBN. A handful of editions may not have a cover indexed — the `BookCover` component falls back to a generated typographic placeholder rather than a broken image.
- **Reviews** recompute the book's aggregate `rating`/`ratingCount` on submit.
- **Middleware** (`src/middleware.ts`) protects `/account/*` (any signed-in user) and `/admin/*` (admin role only), redirecting to `/login` with a `callbackUrl`.
- **Accessibility** — semantic landmarks, a skip-to-content link, visible focus rings everywhere (not suppressed), `aria-live` regions on cart/search counts, and `prefers-reduced-motion` support baked into `globals.css`.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run type-check` | `tsc --noEmit` |
| `npm run db:migrate` | Run Prisma migrations (dev) |
| `npm run db:seed` | Re-run the seed script |
| `npm run db:studio` | Open Prisma Studio |

## Deploying

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for a full walkthrough of three paths — Vercel + Neon (recommended), Railway, and self-hosted Docker (a production `Dockerfile` and `docker-compose.yml` are included at the repo root) — plus a production environment variable reference, Google OAuth setup, and a post-deploy checklist.
