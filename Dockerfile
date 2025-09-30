# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application and verify
RUN npm run build && ls -la dist/

# Verify index.html exists
RUN test -f dist/index.html || (echo "ERROR: dist/index.html not found after build!" && exit 1)

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx-FIXED.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Verify files were copied
RUN ls -la /usr/share/nginx/html/ && test -f /usr/share/nginx/html/index.html

# Set correct permissions
RUN chmod -R 755 /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
