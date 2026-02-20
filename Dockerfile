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

# Set env vars needed for client build (baked into client bundle)
ENV CLIENT_REMOTE_HOST=wordquest-online.onrender.com
ENV SSL=true
ENV ACCEPT_LICENSE=true
ENV SKIP_DATABASE=true
ENV HOST=0.0.0.0
ENV PORT=10000

# Build client + server
RUN yarn build

ENV NODE_ENV=production

EXPOSE 10000

# Start only the game server (it serves client static files too)
CMD ["yarn", "workspace", "@kaetram/server", "start"]
