FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy source
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build the service
RUN pnpm build

EXPOSE 3002

CMD ["node", "dist/index.js"]