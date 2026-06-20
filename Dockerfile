# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

# Install OS libs needed by Prisma's query engine
RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts


# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client before build
RUN npx prisma generate

# Next.js telemetry — disable for reproducible builds
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# ── Stage 3: Production runtime ───────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run as non-root for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy only what Next.js standalone output needs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy generated Prisma client
COPY --from=builder /app/lib/generated ./lib/generated
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
