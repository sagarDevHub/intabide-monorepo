FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN pnpx prisma generate

# Build the service
RUN pnpm build

# Expose port
EXPOSE 3002

# Start the service
CMD ["node", "dist/index.js"]