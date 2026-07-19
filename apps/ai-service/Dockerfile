FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies cleanly using standard npm
RUN npm install --omit=dev
# Copy source code
COPY index.js ./

# Expose port
EXPOSE 3001

# Start the service
CMD ["node", "index.js"]