# Straye Relation Frontend Dockerfile
# Multi-stage build for optimized production image
# Next.js 15.1.3 + React 19

# Stage 1: Dependencies
FROM node:20.18.0-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm (use npm instead of corepack to avoid signature issues)
RUN npm install -g pnpm@10.25.0

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20.18.0-alpine AS builder
WORKDIR /app

# Install pnpm (use npm instead of corepack to avoid signature issues)
RUN npm install -g pnpm@10.25.0

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN pnpm build

# Stage 3: Runner
FROM node:20.18.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
