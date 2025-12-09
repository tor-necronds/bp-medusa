#!/bin/sh
set -e

# Ensure we're in the project root directory
cd "$(dirname "$0")/.." || exit 1

# Debug: Show current directory and check for admin files
echo "Current directory: $(pwd)"
echo "Checking for admin build files..."

# Check if admin build exists in possible locations
ADMIN_BUILD_FOUND=false
ADMIN_PATH=""

if [ -f .medusa/server/public/admin/index.html ]; then
  ADMIN_BUILD_FOUND=true
  ADMIN_PATH=".medusa/server/public/admin/"
  echo "✓ Admin build found at $ADMIN_PATH"
  ls -la .medusa/server/public/admin/ | head -5
elif [ -f .medusa/admin/index.html ]; then
  ADMIN_BUILD_FOUND=true
  ADMIN_PATH=".medusa/admin/"
  echo "✓ Admin build found at $ADMIN_PATH"
fi

if [ "$ADMIN_BUILD_FOUND" = "false" ]; then
  echo "✗ Admin build not found, attempting rebuild with increased memory..."
  # Increase Node.js memory limit for build process (Render free tier has 512MB, use 400MB for heap)
  NODE_OPTIONS='-r ts-node/register --max-old-space-size=400' NODE_ENV=production medusa build || {
    echo "ERROR: Build failed due to memory constraints. Admin files must be preserved from build phase."
    exit 1
  }
fi

# Verify admin files exist before starting
if [ ! -f .medusa/server/public/admin/index.html ] && [ ! -f .medusa/admin/index.html ]; then
  echo "ERROR: Admin build files still not found after check/rebuild"
  echo "Listing .medusa directory structure:"
  find .medusa -name "index.html" 2>/dev/null || echo "No index.html found in .medusa"
  exit 1
fi

# Start the server from project root
echo "Starting Medusa server from $(pwd)..."
NODE_OPTIONS='-r ts-node/register' NODE_ENV=production medusa start
