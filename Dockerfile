# Stage 1: Build the SvelteKit app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

COPY package.json package-lock.json ./


RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files again
COPY package.json package-lock.json ./

# Install **only production dependencies**
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/build ./build


# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the port
EXPOSE 3000

# Start the app
CMD ["node", "build/index.js"]