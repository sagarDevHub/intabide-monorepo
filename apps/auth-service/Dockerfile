FROM node:20-alpine AS base
RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/auth-service/package.json ./apps/auth-service/

RUN pnpm install --frozen-lockfile

COPY apps/auth-service/ ./apps/auth-service/

WORKDIR /app/apps/auth-service

RUN pnpm prisma generate

RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=base /app/apps/auth-service/dist ./dist
COPY --from=base /app/apps/auth-service/node_modules ./node_modules
COPY --from=base /app/apps/auth-service/package.json ./package.json

EXPOSE 3002
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]