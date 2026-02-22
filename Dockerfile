FROM node:20-slim

WORKDIR /app

# Skip husky in Docker
ENV HUSKY=0

# Install git (required for uWebSockets.js git dependency)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Enable corepack for yarn
RUN corepack enable

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY packages/common/package.json packages/common/
COPY packages/server/package.json packages/server/
COPY packages/client/package.json packages/client/
COPY packages/hub/package.json packages/hub/
COPY packages/admin/package.json packages/admin/
COPY packages/tools/package.json packages/tools/
COPY packages/e2e/package.json packages/e2e/

# Install all dependencies
RUN yarn install --immutable || yarn install

# Copy all source
COPY . .

# Create build-time .env (SKIP_DATABASE=true only for build phase, not runtime)
RUN printf "ACCEPT_LICENSE=true\nSKIP_DATABASE=true\nPORT=10000\nHOST=0.0.0.0\nSSL=true\nCLIENT_REMOTE_HOST=wordquest-online.onrender.com\n" > .env

# Set env vars needed for client build (baked into client bundle)
ENV CLIENT_REMOTE_HOST=wordquest-online.onrender.com
ENV SSL=true
ENV ACCEPT_LICENSE=true
ENV HOST=0.0.0.0
ENV PORT=10000

# Build only required packages (client + server)
RUN yarn workspace @kaetram/client build && yarn workspace @kaetram/server build

ENV NODE_ENV=production

EXPOSE 10000

# Copy entrypoint script, fix line endings (Windows CRLF→LF), make executable
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN sed -i 's/\r$//' /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

# Change to server directory so relative paths (../../.env) work correctly
WORKDIR /app/packages/server

# Use entrypoint that writes runtime env vars to .env before starting
CMD ["/app/docker-entrypoint.sh"]
