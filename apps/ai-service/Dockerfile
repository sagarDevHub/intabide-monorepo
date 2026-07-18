FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY index.js ./

# Expose port
EXPOSE 3001

# Start the service
CMD ["node", "index.js"]