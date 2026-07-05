#!/usr/bin/env bash
set -euo pipefail

# ─── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}✓${NC} $*"; }
warn()  { echo -e "${YELLOW}⚠${NC} $*"; }
error() { echo -e "${RED}✗${NC} $*" >&2; }

# ─── Detect container engine ─────────────────────────────────────────────────
if command -v podman &>/dev/null; then
  COMPOSE="podman compose"
elif command -v docker &>/dev/null; then
  COMPOSE="docker compose"
else
  error "Neither podman nor docker found. Install one to continue."
  exit 1
fi

info "Using container engine: ${COMPOSE%% *}"

# ─── Build @proshop/ability ──────────────────────────────────────────────────
info "Building @proshop/ability..."
pnpm --filter @proshop/ability build

# ─── Start containers ────────────────────────────────────────────────────────
info "Starting containers..."
$COMPOSE up -d

# ─── Wait for MongoDB ────────────────────────────────────────────────────────
info "Waiting for MongoDB to be ready..."
RETRIES=30
until $COMPOSE exec -T mongodb mongosh --eval "db.runCommand({ ping: 1 })" --quiet &>/dev/null; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -le 0 ]; then
    error "MongoDB did not become ready in time."
    exit 1
  fi
  sleep 1
done
info "MongoDB is ready."

# ─── Seed database ───────────────────────────────────────────────────────────
info "Seeding database..."
$COMPOSE exec -T server pnpm data:import

# ─── Done ────────────────────────────────────────────────────────────────────
echo ""
info "Dev environment is ready!"
echo ""
echo "  API:       http://localhost:3000/api"
echo "  MongoDB:   localhost:27017"
echo "  MinIO:     http://localhost:9001 (admin / change-me-please)"
echo "  Mailpit:   http://localhost:8025"
echo ""
echo "  Seed accounts:"
echo "    Admin:  admin@example.com / password123"
echo "    User:   john@example.com   / password123"
echo ""
