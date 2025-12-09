#!/bin/sh
set -e

# Check if admin build exists, if not rebuild
if [ ! -f .medusa/admin/index.html ]; then
  echo "Admin build not found, rebuilding admin..."
  NODE_OPTIONS='-r ts-node/register' NODE_ENV=production medusa build
fi

# Start the server
NODE_OPTIONS='-r ts-node/register' NODE_ENV=production medusa start

