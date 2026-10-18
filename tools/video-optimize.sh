#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Re-encode the homepage hero videos (device-sized variants).
# Run whenever the source videos change:
#
#   npm install --no-save ffmpeg-static   # one-time (~80 MB, gitignored)
#   bash tools/video-optimize.sh <original-video.mp4> <num>
#
# Example:  bash tools/video-optimize.sh "Video 3 (1).mp4" 1
# → assets/videos/hero-1.mp4         720p  CRF 24  30fps  no audio (~6.5 MB)
#   assets/videos/hero-1-mobile.mp4  540p  CRF 26  30fps  no audio (~3 MB)
#
# index.html holds the poster + data-src / data-src-mobile references;
# main.js picks the variant by viewport. Hero videos are muted loops, so the
# audio track is deliberately stripped (-an).
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."

IN="${1:?input file, e.g. \"Video 3 (1).mp4\"}"
NUM="${2:?slide number 1..3}"
FF="node_modules/ffmpeg-static/ffmpeg"
[ -x "$FF" ] || { echo "run: npm install --no-save ffmpeg-static"; exit 1; }

for spec in "720 24 hero-$NUM.mp4" "540 26 hero-$NUM-mobile.mp4"; do
  set -- $spec
  echo "▶ encoding $3 (scale=-2:$1, crf $2)…"
  "$FF" -hide_banner -loglevel warning -y -i "$IN" \
    -vf "scale=-2:$1,fps=30" -c:v libx264 -crf "$2" -preset medium \
    -profile:v high -pix_fmt yuv420p -movflags +faststart -an "assets/videos/$3"
done
ls -la --block-size=K "assets/videos/"