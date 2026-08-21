# syntax=docker/dockerfile:1

# ---------- deps: install once, cached separately from source changes ----------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ---------- builder: full node_modules + prisma CLI, used for build AND
#            reused directly by `docker compose --profile tools` for
#            migrate/seed one-off commands (see docker-compose.yml) ----------
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# `next build` never opens a database connection for this app — the
# homepage and sitemap are explicitly `dynamic = "force-dynamic"` for
# exactly this reason (see src/app/page.tsx). These two vars exist purely
# because `prisma generate` checks that DATABASE_URL/DIRECT_URL are
# *present and well-formed* while parsing schema.prisma — it never
# actually connects. Real values are supplied at container runtime instead
# (see docker-compose.yml).
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate
RUN npm run build

# ---------- runner: minimal final image ----------
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Explicitly bring the generated client + query engine binary along —
# Next's standalone output tracing doesn't always catch Prisma's native
# engine file, so we copy it in ourselves to be certain.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
