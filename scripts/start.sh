#!/bin/sh
set -e

# Check if admin build exists in possible locations
ADMIN_BUILD_FOUND=false

if [ -f .medusa/server/public/admin/index.html ]; then
  ADMIN_BUILD_FOUND=true
  echo "Admin build found at .medusa/server/public/admin/"
elif [ -f .medusa/admin/index.html ]; then
  ADMIN_BUILD_FOUND=true
  echo "Admin build found at .medusa/admin/"
fi

if [ "$ADMIN_BUILD_FOUND" = "false" ]; then
  echo "Admin build not found, attempting rebuild with increased memory..."
  # Increase Node.js memory limit for build process (Render free tier has 512MB total, use 400MB for heap)
  NODE_OPTIONS='-r ts-node/register --max-old-space-size=400' NODE_ENV=production medusa build || {
    echo "ERROR: Build failed due to memory constraints. Admin files must be preserved from build phase."
    exit 1
  }
fi

# Start the server
NODE_OPTIONS='-r ts-node/register' NODE_ENV=production medusa start

