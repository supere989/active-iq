#!/bin/bash
# Deploy full active-iq.com website
set -e

cd /home/genysis/active-iq-source

echo "[Mon, Feb  9, 2026  7:08:11 PM] Starting full site deployment..."

# 1. Build the React app
echo "  Building React app..."
npm run build

# 2. Deploy to container
echo "  Deploying to active-iq-site container..."
docker cp dist/. active-iq-site:/usr/share/nginx/html/

# 3. Verify deployment
echo "  Verifying deployment..."
docker exec active-iq-site ls -la /usr/share/nginx/html/ | head -10

echo "[Mon, Feb  9, 2026  7:08:11 PM] ✓ Site deployment complete!"
echo "Live at: https://www.active-iq.com"
