#!/bin/sh
# Write runtime environment variables to .env so dotenv-extended can read them.
# Render sets env vars at runtime, but dotenv-extended reads from files only.

ENV_FILE="/app/.env"

# Start with base settings
cat > "$ENV_FILE" << 'BASE'
ACCEPT_LICENSE=true
HOST=0.0.0.0
SSL=true
CLIENT_REMOTE_HOST=wordquest-online.onrender.com
BASE

# Port (Render assigns PORT dynamically)
echo "PORT=${PORT:-10000}" >> "$ENV_FILE"

# Database settings - read from Render env vars
echo "SKIP_DATABASE=${SKIP_DATABASE:-false}" >> "$ENV_FILE"
echo "MONGODB_HOST=${MONGODB_HOST:-}" >> "$ENV_FILE"
echo "MONGODB_PORT=${MONGODB_PORT:-0}" >> "$ENV_FILE"
echo "MONGODB_USER=${MONGODB_USER:-}" >> "$ENV_FILE"
echo "MONGODB_PASSWORD=${MONGODB_PASSWORD:-}" >> "$ENV_FILE"
echo "MONGODB_DATABASE=${MONGODB_DATABASE:-wordquest}" >> "$ENV_FILE"
echo "MONGODB_SRV=${MONGODB_SRV:-true}" >> "$ENV_FILE"
echo "MONGODB_TLS=${MONGODB_TLS:-true}" >> "$ENV_FILE"
echo "MONGODB_AUTH_SOURCE=${MONGODB_AUTH_SOURCE:-}" >> "$ENV_FILE"

echo "[entrypoint] .env written with SKIP_DATABASE=${SKIP_DATABASE:-false}"

# Start the server
exec node --max-old-space-size=400 dist/main.js
