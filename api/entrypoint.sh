#!/bin/sh
set -e

CERT_DIR="${CERT_DIR:-/certs}"
mkdir -p "$CERT_DIR"

if [ ! -f "$CERT_DIR/server.crt" ]; then
  echo "Generating self-signed TLS certificate..."
  openssl req -x509 -newkey rsa:4096 \
    -keyout "$CERT_DIR/server.key" \
    -out "$CERT_DIR/server.crt" \
    -days 365 -nodes \
    -subj "/CN=localhost" \
    -addext "subjectAltName=IP:127.0.0.1,DNS:localhost,DNS:api"
  chmod 644 "$CERT_DIR/server.crt"
  chmod 600 "$CERT_DIR/server.key"
  echo "Certificate generated."
fi

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting API server..."
exec node dist/server.js
