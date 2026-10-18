#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Manual production deployment — GS Builder & Engineers (static site, Vercel)
#
# Usage:   bash deploy.sh
# Needs:   vercel CLI installed once (npm i -g vercel) and `vercel login` done
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")"

echo "▶ Pre-flight checks"

# 1. Files that must exist before shipping
for f in index.html sitemap.xml robots.txt vercel.json \
         assets/css/main.css assets/js/main.js \
         assets/images/og-cover.jpg assets/images/logo.webp; do
  [ -f "$f" ] || { echo "✗ Missing required file: $f"; exit 1; }
done
echo "  ✓ required files present"

# 2. No broken internal links / missing images
python3 tools/link_check.py

# 3. Vercel CLI available?
if ! command -v vercel >/dev/null 2>&1; then
  echo "✗ vercel CLI not found. Run once:  npm i -g vercel && vercel login"
  exit 1
fi
echo "  ✓ vercel CLI found"

echo ""
echo "▶ Deploying to PRODUCTION (https://gsbuilder-swart.vercel.app)"
vercel deploy --prod --yes

echo ""
echo "✓ Deployed. Verify:"
echo "    - https://gsbuilder-swart.vercel.app"
echo "    - https://gsbuilder-swart.vercel.app/sitemap.xml"
echo "    - https://developers.facebook.com/tools/debug/  (paste the URL)"
echo "    - https://search.google.com/test/rich-results   (paste the URL)"