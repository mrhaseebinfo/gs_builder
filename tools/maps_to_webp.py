#!/usr/bin/env python3
"""Convert the society master-plan PDFs in assets/maps/ into high-resolution
WebP images for the on-page "Map Scope" magnifier (pages/real-estate.html).

Browsers cannot magnify the layers inside a PDF, so the scope viewer zooms a
raster render instead (assets/js/map-scope.js). The PDFs stay next to the
WebPs as the canonical downloads; the WebPs are what the lens samples.

    python3 tools/maps_to_webp.py             # convert every outdated PDF
    python3 tools/maps_to_webp.py --force     # re-render even if up to date
    python3 tools/maps_to_webp.py d-17-mvhs   # convert a single map by stem

Requires poppler-utils (pdftoppm) and Pillow with WebP support.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MAPS = ROOT / "assets" / "maps"
DPI = 400        # render density — ~4x the viewer's on-screen width, so the
                 # lens can zoom without exposing soft pixels
QUALITY = 85     # WebP quality — scanned linework stays crisp at ~1 MB/map
TMP = Path("/tmp/opencode")


def convert(pdf: Path, force: bool) -> None:
    webp = pdf.with_suffix(".webp")
    if webp.exists() and webp.stat().st_mtime >= pdf.stat().st_mtime and not force:
        print(f"  skip    {webp.name:26s} up to date ({webp.stat().st_size // 1024} KB)")
        return
    TMP.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=TMP) as td:
        prefix = Path(td) / "page"
        subprocess.run(
            ["pdftoppm", "-r", str(DPI), "-png", str(pdf), str(prefix)],
            check=True,
        )
        pages = sorted(prefix.parent.glob("page-*.png"))
        if len(pages) != 1:
            sys.exit(f"{pdf.name}: expected a single-page map, found {len(pages)} pages")
        im = Image.open(pages[0]).convert("RGB")
        im.save(webp, "WEBP", quality=QUALITY, method=6)
    print(f"  render  {pdf.name:26s} -> {webp.name}  "
          f"{im.size[0]}x{im.size[1]}  {webp.stat().st_size // 1024} KB")


def main() -> None:
    stems = [a for a in sys.argv[1:] if not a.startswith("-")]
    force = "--force" in sys.argv
    pdfs = sorted(MAPS.glob("*.pdf"))
    if not pdfs:
        sys.exit(f"no PDFs found in {MAPS}")
    for pdf in pdfs:
        short = pdf.stem.replace("-map", "")
        if stems and pdf.stem not in stems and short not in stems:
            continue
        convert(pdf, force)


if __name__ == "__main__":
    main()