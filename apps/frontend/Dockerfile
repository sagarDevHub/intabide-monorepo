FROM node:20-alpine AS builder

# Install Python and build tools
RUN apk add --no-cache python3 make g++ build-base

# Install pnpm
RUN npm install -g pnpm

# Set environment variables
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_IGNORE_DEV_WARNINGS=1

WORKDIR /app

# Copy only package files first
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile --node-linker=hoisted

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source (node_modules is ignored via .dockerignore)
COPY . .

# Build the app
RUN pnpm build

# Production stage
FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy built files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["pnpm", "start"]