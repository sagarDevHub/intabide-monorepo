FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies with pnpm
RUN pnpm install

# Copy source code
COPY index.js ./

# Expose port
EXPOSE 3001

# Start the service
CMD ["node", "index.js"]