#!/usr/bin/env python3
"""Recompress large WebP images in place at a sane quality. Non-destructive
per file: only replaced when the new copy is at least 12% smaller; originals
are mirrored to /tmp/opencode/orig-images/ preserving relative paths.

    python3 tools/image_recompress.py [--check]
"""
import os
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BACKUP = Path("/tmp/opencode/orig-images")
MIN_FILE_KB = 200         # only touch files this big or bigger
TARGET_QUALITY = 82       # webp quality to re-encode at
MIN_SAVING = 0.12         # replace only when >= 12% smaller
SKIP = {"og-cover.jpg"}   # generated social image, already optimal


def main() -> None:
    check = "--check" in sys.argv
    files = [p for p in sorted(ROOT.glob("assets/images/**/*.webp"))
             if os.path.getsize(p) >= MIN_FILE_KB * 1024 and p.name not in SKIP]

    saved = 0
    replaced = []
    for p in files:
        old = os.path.getsize(p)
        base = p.relative_to(ROOT)
        tmp = Path("/tmp/opencode") / ("recompress-" + base.name)
        im = Image.open(p).convert("RGB")
        im.save(tmp, "WEBP", quality=TARGET_QUALITY, method=6)
        new = os.path.getsize(tmp)
        if new <= old * (1 - MIN_SAVING):
            mark = f"{old // 1024:4d}KB -> {new // 1024:4d}KB  (-{(1 - new / old) * 100:.0f}%)  {base}"
            print(mark)
            saved += old - new
            replaced.append((p, mark, tmp))
        else:
            print(f"  skip  {old // 1024:4d}KB -> {new // 1024:4d}KB   {base}")

    if check or not replaced:
        print(f"\npotential saving: {saved / 1024:.1f} MB across {len(replaced)} files")
        return

    BACKUP.mkdir(parents=True, exist_ok=True)
    for p, _, tmp in replaced:
        b = BACKUP / p.relative_to(ROOT)
        b.parent.mkdir(parents=True, exist_ok=True)
        if not b.exists():
            shutil.copy2(p, b)
        shutil.copy2(tmp, p)
    print(f"\nreplaced {len(replaced)} files — saved {saved / 1024:.2f} MB "
          f"(originals in {BACKUP})")


if __name__ == "__main__":
    main()