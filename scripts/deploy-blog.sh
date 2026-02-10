#!/bin/bash
# Auto-deploy Moltbook blog mirror to active-iq.com
set -e

cd /home/genysis/active-iq-source

echo "[$(date)] Starting Moltbook blog sync..."

# 1. Fetch latest Moltbook data
echo "  Fetching Moltbook data..."
python3 scripts/fetch-moltbook.py

# 2. Post new comments to Matrix Blog Community room
echo "  Posting new comments to Matrix..."
python3 scripts/post-to-matrix.py

# 3. Regenerate static blog pages
echo "  Generating blog pages..."
node scripts/sync-moltbook.cjs

# 4. Copy to Docker container
echo "  Deploying to container..."
docker cp dist/blog/. active-iq-site:/usr/share/nginx/html/blog/

echo "[$(date)] ✓ Blog sync complete!"
