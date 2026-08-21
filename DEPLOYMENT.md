# Deploying Shelfed Bookstore

This covers three deployment paths in full:

1. **[Vercel + Neon](#1-vercel--neon-recommended)** — recommended. Zero-config for Next.js, generous free tiers on both sides, least to maintain.
2. **[Railway](#2-railway-app--database-in-one-place)** — app and database in one dashboard, good if you'd rather not juggle two providers.
3. **[Self-hosted with Docker](#3-self-hosted-with-docker)** — full control, runs anywhere that runs containers (a VPS, your own server, etc.).

Whichever you pick, read [Environment variables reference](#environment-variables-reference) and the [post-deploy checklist](#post-deploy-checklist) — they apply regardless of host.

---

## Before you start

- A PostgreSQL database is required. Every path below either provisions one for you or tells you where to get one.
- `NEXTAUTH_SECRET` must be a real random value in production — generate one with:
  ```bash
  openssl rand -base64 32
  ```
- If you want Google sign-in, you'll register OAuth credentials once (see [Google OAuth setup](#google-oauth-setup)) and reuse them across environments — the only thing that changes per environment is the redirect URI.
- Decide on your real `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_UPI_ID` before launch. These are public (shipped to the browser) — don't put anything sensitive in them.

---

## 1. Vercel + Neon (recommended)

### 1.1 Provision the database (Neon)

1. Create a project at [neon.tech](https://neon.tech) (free tier is enough to start).
2. From the Neon dashboard, copy two connection strings:
   - **Pooled connection** (has `-pooler` in the hostname) → this becomes `DATABASE_URL`. The app's normal query traffic should go through the pooler, since serverless functions open a lot of short-lived connections and Postgres has a hard connection limit.
   - **Direct connection** (no `-pooler`) → this becomes `DIRECT_URL`. Prisma Migrate needs a direct connection; migrations don't work reliably through a pooler.
3. Both strings already include `?sslmode=require` — keep that.

This project's `prisma/schema.prisma` already has `directUrl` wired up for exactly this split:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

If you're using a database *without* a separate pooled/direct distinction (a plain self-hosted Postgres, for instance), just set both `DATABASE_URL` and `DIRECT_URL` to the same value.

### 1.2 Run the first migration

Do this once, from your own machine, before the first deploy — Vercel's build step needs the schema to already exist (see [why](#why-migrate-before-deploying) below).

```bash
# .env, locally, pointed at the real Neon database:
DATABASE_URL="<neon pooled connection string>"
DIRECT_URL="<neon direct connection string>"
```

```bash
npx prisma migrate deploy
npm run db:seed   # optional — loads the 48 demo books + demo accounts
```

#### Why migrate before deploying

The homepage and sitemap are intentionally `export const dynamic = "force-dynamic"` (see the comment in `src/app/page.tsx`), specifically so `next build` never needs to open a database connection. That means Vercel's build step itself won't fail if you deploy before migrating — but the *live site* will error on every page until the tables exist, since every route queries the database at request time. Migrate first.

### 1.3 Push to GitHub

Vercel deploys from a Git repository.

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create shelfed-bookstore --private --source=. --push
# or push to an existing remote of your choice
```

### 1.4 Import into Vercel

1. [vercel.com/new](https://vercel.com/new) → import the repository.
2. Framework preset: **Next.js** (auto-detected, no changes needed).
3. Build command / output directory: leave as default — Vercel's Next.js preset handles both, and `prisma generate` runs automatically via this project's `postinstall` script.
4. Before clicking Deploy, open **Environment Variables** and add everything from the [reference table](#environment-variables-reference) below, with production values. At minimum: `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_UPI_ID`, `NEXT_PUBLIC_UPI_PAYEE_NAME`, `NEXT_PUBLIC_SITE_URL`.
   - `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL`: use your final domain if you already know it (e.g. `https://shelfed.yourdomain.com`). If you're not ready to attach a custom domain yet, use the `*.vercel.app` URL Vercel assigns and update these two later (see [changing your domain](#changing-your-domain-later)).
5. Deploy.

### 1.5 Google OAuth setup

Skip this section if you're not using Google sign-in — email/password auth works with no extra setup.

1. [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials) → **Create Credentials → OAuth client ID** → Application type **Web application**.
2. **Authorized JavaScript origins**: `https://your-domain.com`
3. **Authorized redirect URIs**: `https://your-domain.com/api/auth/callback/google`
   - This exact path is fixed by NextAuth — don't change it.
   - Add `http://localhost:3000/api/auth/callback/google` too if you also want Google sign-in to work locally.
4. Copy the generated **Client ID** and **Client Secret** into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in Vercel's environment variables.
5. Under **OAuth consent screen**: for a small store, "Testing" publishing status with your own account added as a test user is enough. Move to "In production" if you want anyone to be able to sign in, which may require Google's verification if you request more than basic scopes (this app only requests the default profile/email scopes, so verification is typically not required).
6. Redeploy after adding the credentials (Vercel doesn't hot-reload env var changes into a running deployment — trigger a new deployment, or use **Redeploy** on the existing one).

### 1.6 Custom domain

1. Vercel project → **Settings → Domains** → add your domain.
2. Follow Vercel's DNS instructions (either an `A`/`ALIAS` record at your registrar, or delegate nameservers to Vercel). SSL is issued and renewed automatically — nothing to configure.
3. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the final `https://` domain, and add the same domain to the Google OAuth redirect URIs if you set those up with a placeholder earlier.
4. Redeploy.

### Changing your domain later

If you deploy first on `*.vercel.app` and attach a custom domain afterward: update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` in Vercel's env vars, update the Google OAuth redirect URI to match, then redeploy. Until you do, OAuth sign-in and any absolute URLs (sitemap, Open Graph tags) will still point at the old domain.

That's a complete Vercel deployment. Jump to the [post-deploy checklist](#post-deploy-checklist).

---

## 2. Railway (app + database in one place)

Railway provisions Postgres and hosts the app from the same project, which is convenient if you'd rather not manage two dashboards.

1. [railway.app/new](https://railway.app/new) → **Deploy from GitHub repo** → select your repo.
2. In the same project, **+ New → Database → PostgreSQL**. Railway creates it and exposes `DATABASE_URL` as a variable automatically.
3. On the app service → **Variables**:
   - Reference the database's connection string: click the `+` to add a variable, choose **Reference**, and point `DATABASE_URL` and `DIRECT_URL` at the Postgres service's `DATABASE_URL` (Railway doesn't distinguish pooled/direct the way Neon does, so both can point at the same reference).
   - Add the rest from the [reference table](#environment-variables-reference): `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (Railway gives you a `*.up.railway.app` domain — use that, or a custom domain if you've attached one), `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_UPI_ID`, `NEXT_PUBLIC_UPI_PAYEE_NAME`, `NEXT_PUBLIC_SITE_URL`, and Google OAuth vars if using them (redirect URI: `https://your-app.up.railway.app/api/auth/callback/google`, or your custom domain).
4. **Settings → Build**: Railway auto-detects Next.js via Nixpacks; no changes needed. `prisma generate` still runs via `postinstall`.
5. Migrate: Railway's dashboard has a **shell** on the service (Settings → the terminal icon, or `railway run` from the CLI). Run:
   ```bash
   railway run npx prisma migrate deploy
   railway run npm run db:seed   # optional
   ```
   (Or run these from your machine with the CLI's env vars pulled: `railway link`, then `railway run <command>`.)
6. Deploy. Railway redeploys automatically on every push to your connected branch.
7. **Settings → Networking → Custom Domain** to attach your own domain; update `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` / the Google redirect URI to match once it's live.

Jump to the [post-deploy checklist](#post-deploy-checklist).

---

## 3. Self-hosted with Docker

For a VPS (DigitalOcean, Hetzner, EC2, your own hardware — anywhere Docker runs). This repo includes a production `Dockerfile`, a `docker-compose.yml`, and a `.env.production.example`.

### 3.1 What's included and why

- **`Dockerfile`** — multi-stage build producing a minimal final image via Next's `output: "standalone"` (set in `next.config.js`). The build stage never touches a real database (see [§1.2](#why-migrate-before-deploying)) — it only needs `DATABASE_URL`/`DIRECT_URL` to be *present and well-formed* because Prisma's schema parser checks that, even though `prisma generate` never opens a connection. Those are baked in as harmless placeholders at build time and overridden with real values at container runtime.
- **`docker-compose.yml`** — a `db` service (Postgres 16), an `app` service (the image above), and two one-off tooling services (`migrate`, `seed`) that build from the Dockerfile's intermediate `builder` stage, which still has the full Prisma CLI — the final `app` image deliberately doesn't carry it, to stay small.
- **`.dockerignore`** — keeps `node_modules`, `.git`, `.next`, and docs out of the build context.

### 3.2 Provision a server

Any VPS with Docker and Docker Compose installed works. On a fresh Ubuntu box:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# log out and back in for the group change to apply
```

### 3.3 Get the code onto the server

```bash
git clone <your-repo-url> shelfed-bookstore
cd shelfed-bookstore
```

### 3.4 Configure environment

```bash
cp .env.production.example .env.production
```

Edit `.env.production` and fill in real values (see the [reference table](#environment-variables-reference)). Note that `DATABASE_URL`/`DIRECT_URL` are **not** set here — `docker-compose.yml` wires those to the `db` service automatically. If you want a non-default Postgres password, set it via a shell-level `POSTGRES_PASSWORD` environment variable before running compose commands, or add it to a `.env` file in the same directory (docker-compose auto-loads `.env`, separately from `.env.production` which is only consumed by the app container):

```bash
echo "POSTGRES_PASSWORD=$(openssl rand -hex 16)" > .env
```

### 3.5 Start the database, then migrate

```bash
docker compose up -d db
docker compose --profile tools run --rm migrate
docker compose --profile tools run --rm seed   # optional — demo data
```

### 3.6 Build and start the app

```bash
docker compose up -d --build app
```

The app is now listening on port 3000 on the host. Check it:

```bash
docker compose logs -f app
curl -I http://localhost:3000
```

### 3.7 Put it behind Nginx + HTTPS

Don't expose port 3000 directly to the internet — put a reverse proxy in front for TLS termination and a normal domain on port 443.

**Nginx** (`/etc/nginx/sites-available/shelfed`):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/shelfed /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

**TLS with Certbot** (free, auto-renewing Let's Encrypt certificate):

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Certbot rewrites the Nginx config to redirect port 80 → 443 and handles renewal via a systemd timer it installs — no cron job needed.

Once HTTPS is live, update `.env.production`: set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to `https://your-domain.com`, then:

```bash
docker compose up -d --build app
```

### 3.8 Updating the deployment

```bash
git pull
docker compose --profile tools run --rm migrate   # if the schema changed
docker compose up -d --build app
```

The `db` volume (`shelfed_db_data`) persists across rebuilds — rebuilding `app` never touches your data.

Jump to the [post-deploy checklist](#post-deploy-checklist).

---

## Google OAuth setup

Referenced above from each path — the steps are identical regardless of host, only the redirect URI's domain changes:

1. [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials) → **Create Credentials → OAuth client ID** → **Web application**.
2. Authorized JavaScript origin: `https://your-domain.com`
3. Authorized redirect URI: `https://your-domain.com/api/auth/callback/google` (this path is fixed by NextAuth).
4. Put the client ID/secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
5. Leaving these two blank is fine — the app detects their absence and simply doesn't render the "Continue with Google" button (see `src/lib/auth.ts`); email/password sign-in is unaffected.

---

## Environment variables reference

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Pooled connection string in production (Neon/Supabase). Direct string is fine for a single-instance self-hosted Postgres. |
| `DIRECT_URL` | Yes | Direct (non-pooled) connection string, used only for migrations. Same as `DATABASE_URL` if you're not using a pooler. |
| `NEXTAUTH_SECRET` | Yes | `openssl rand -base64 32`. Never reuse the dev value. |
| `NEXTAUTH_URL` | Yes | Your production URL, e.g. `https://shelfed.yourdomain.com`. Must match exactly (scheme + host) or OAuth callbacks will fail. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | No | Omit to disable Google sign-in; email/password still works. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Yes | International format, digits only, no `+` (e.g. `919876543210`). Public — ships to the browser. |
| `NEXT_PUBLIC_UPI_ID` | Yes | The UPI ID the QR code and payment link pay into. Public. |
| `NEXT_PUBLIC_UPI_PAYEE_NAME` | Yes | Shown inside the customer's UPI app during payment. Public. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Used for the sitemap, robots.txt, and Open Graph tags. Should match `NEXTAUTH_URL`. |

Anything prefixed `NEXT_PUBLIC_` is bundled into client-side JavaScript and is visible to anyone who views source — never put a secret there.

---

## Post-deploy checklist

Run through this after every fresh deployment, not just the first one:

- [ ] **Change or remove the demo accounts.** The seed script creates `admin@shelfed.store` / `shelfed-admin-2026` and `reader@shelfed.store` / `readingtime`. Change the admin password immediately (there's no in-app "change password" flow yet — update it directly: hash a new one with bcrypt and `UPDATE "User" SET password = '<hash>' WHERE email = 'admin@shelfed.store';`, or delete the account and register a fresh admin, then flip its `role` to `ADMIN` in the database).
- [ ] **Place a real order end-to-end** — add to cart, check out, confirm the UPI QR renders with the correct amount and your real `NEXT_PUBLIC_UPI_ID`, and confirm the WhatsApp button opens with the order pre-filled to your real number.
- [ ] **Sign in with Google** (if configured) and confirm the redirect completes without an error.
- [ ] **Visit `/sitemap.xml` and `/robots.txt`** and confirm they resolve and list your real domain.
- [ ] **Check image loading** — book covers come from `covers.openlibrary.org`, already whitelisted in `next.config.js`. If you add books with cover URLs from a different host, add that host to `images.remotePatterns` in `next.config.js` and redeploy, or Next's Image component will reject it.
- [ ] **Confirm `/admin` is only reachable by an admin account** and that a signed-out visit to `/admin` or `/account` redirects to `/login` (this is `src/middleware.ts` — worth a manual check once per deployment target).

---

## Monitoring and logs

- **Vercel** — Project → **Logs** tab for real-time function logs; **Observability** for request metrics. No setup required.
- **Railway** — Service → **Deployments** → click a deployment for build/runtime logs.
- **Docker** — `docker compose logs -f app`. For persistent log retention on a VPS, ship the container's stdout/stderr to a file or a log aggregator (e.g. `docker compose logs -f app >> /var/log/shelfed/app.log 2>&1` under a process manager, or point Docker's logging driver at something like Loki).

None of the three paths configure error tracking out of the box. If you want it, [Sentry's Next.js SDK](https://docs.sentry.io/platforms/javascript/guides/nextjs/) is the standard choice and wires in with a few lines in `next.config.js` — not included here to keep the base project dependency-light.

---

## Troubleshooting

**"Environment variable not found: DATABASE_URL" during build.** Prisma's schema parser needs the variable *present*, even during steps that don't connect to anything (like `prisma generate`). Make sure it's set in your host's build-time environment, not only its runtime environment — on Vercel these are the same list; in Docker, the Dockerfile already handles this with a placeholder (see [§3.1](#31-whats-included-and-why)).

**OAuth redirects to the wrong domain, or Google shows "redirect_uri_mismatch."** `NEXTAUTH_URL` doesn't match the domain you're actually visiting, or the Google Cloud Console redirect URI doesn't exactly match `https://your-domain.com/api/auth/callback/google` (check for a stray trailing slash or `http` vs `https`).

**Images 400 or fail to load in production.** The image's host isn't in `next.config.js`'s `images.remotePatterns`. Add it and redeploy — Next.js's image optimizer allowlists remote hosts explicitly for security.

**Migrations fail against Neon/Supabase with a pooler-related error.** You're running `prisma migrate` against the pooled connection string. Point `DIRECT_URL` (and only `DIRECT_URL`) at the non-pooled connection — this project's `prisma/schema.prisma` is already configured to use `directUrl` for migrations automatically once that variable is set correctly.

**The Docker `app` container starts and immediately exits.** Almost always a missing/malformed env var. Check `docker compose logs app` — Prisma and NextAuth both fail loudly and specifically (e.g. "NEXTAUTH_SECRET is not set") rather than crashing silently.

**WhatsApp button opens with no number, or "invalid number."** `NEXT_PUBLIC_WHATSAPP_NUMBER` needs the country code with no `+`, no spaces, no leading zero (`919876543210`, not `+91 98765 43210`). Since it's a `NEXT_PUBLIC_` variable, changing it requires a rebuild, not just a restart — the value gets inlined into the JavaScript bundle at build time.

**UPI QR code scans but shows the wrong amount or payee.** These come from `NEXT_PUBLIC_UPI_ID` / `NEXT_PUBLIC_UPI_PAYEE_NAME` at build time, same caveat as above — rebuild after changing them, a restart alone won't pick up the new value.

---

## CI

`.github/workflows/ci.yml` runs on every push and pull request against `main`: installs dependencies, runs real migrations against a Postgres service container, then type-checks, lints, and builds. It's not wired to auto-deploy anywhere — Vercel and Railway both already redeploy on push by default once connected to your repo, so this workflow exists purely as a pre-merge correctness gate (and doubles as full end-to-end validation of `prisma generate` + `next build`, run from an environment with normal internet access).
