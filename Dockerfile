# Multi-stage Dockerfile for Atelier Haute Couture Web Application

# --- Stage 1: Build Frontend (React + Vite + Tailwind) ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code and build config
COPY . .

# Build production assets
RUN npm run build

# --- Stage 2: Serve Web Application on Port 3000 ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install lightweight static file server
RUN npm install -g serve

# Copy built dist files from builder stage
COPY --from=builder /app/dist ./dist

# Expose container port
EXPOSE 3000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start server on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
