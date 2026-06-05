#!/bin/sh
set -e
CERT_DIR="${CERT_DIR:-/certs}"
echo "Waiting for TLS certificates..."
for i in $(seq 1 30); do
  if [ -f "$CERT_DIR/server.crt" ]; then echo "Certificates found."; break; fi
  sleep 2
done
if [ ! -f "$CERT_DIR/server.crt" ]; then
  echo "Generating self-signed cert for web..."
  openssl req -x509 -newkey rsa:4096 -keyout "$CERT_DIR/server.key" -out "$CERT_DIR/server.crt" -days 365 -nodes -subj "/CN=localhost"
fi
exec nginx -g "daemon off;"
