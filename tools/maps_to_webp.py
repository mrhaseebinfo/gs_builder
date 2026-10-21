#!/usr/bin/env python3
"""Convert the society master-plan PDFs in assets/maps/ into high-resolution
WebP images for the on-page "Map Scope" magnifier (pages/real-estate.html).

Browsers cannot magnify the layers inside a PDF, so the scope viewer zooms a
raster render instead (assets/js/map-scope.js). The PDFs stay next to the
WebPs as the canonical downloads; the WebPs are what the lens samples.

Each map renders at the best resolution its own content supports:

  * raster scans (Faisal Hills, D-17 MVHS, ...) render at their NATIVE
    image DPI — never upscaled (that only interpolates a blur) and never
    downscaled (plot numbers would soften under the lens);
  * vector plans (ECHS, Wapda Town) render at DPI_MAX, capturing all the
    linework detail the PDF carries, capped at VECTOR_PX_CAP px — beyond
    that no lens (its zoom tops out at 6x) or phone GPU can follow;
  * every render is additionally capped at PX_CAP px per side (the WebP
    hard limit is 16383 px).

    python3 tools/maps_to_webp.py             # convert every outdated PDF
    python3 tools/maps_to_webp.py --force     # re-render even if up to date
    python3 tools/maps_to_webp.py d-17-mvhs   # convert a single map by stem

Requires poppler-utils (pdftoppm), pikepdf and Pillow with WebP support.
"""
import bisect
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import pikepdf
from PIL import Image

Image.MAX_IMAGE_PIXELS = None  # the renders here are ours, and huge on purpose

ROOT = Path(__file__).resolve().parent.parent
MAPS = ROOT / "assets" / "maps"
DPI_MAX = 400        # ceiling for vector plans — ~4x the viewer's width
PX_CAP = 16000       # absolute per-side ceiling (WebP limit is 16383)
VECTOR_PX_CAP = 12000  # vector renders never need more (6x lens x 2000px)
QUALITY = 85         # WebP quality — scanned linework stays crisp
TMP = Path("/tmp/opencode")

CM_OPS = re.compile(rb"([-0-9.]+)\s+([-0-9.]+)\s+([-0-9.]+)\s+"
                    rb"([-0-9.]+)\s+([-0-9.]+)\s+([-0-9.]+)\s+cm")


def _content(page) -> bytes:
    c = page.Contents
    if isinstance(c, pikepdf.Array):
        return b"\n".join(s.read_bytes() for s in c)
    return c.read_bytes()


def native_dpi(pdf_path: Path):
    """DPI of the page's dominant raster image (the map scan), or None when
    the page is drawn as vector art. The placement matrix is the last `cm`
    operator before the image's `Do` — clip paths may sit in between."""
    try:
        with pikepdf.open(pdf_path) as pdf:
            page = pdf.pages[0]
            pw, ph = float(page.MediaBox[2]), float(page.MediaBox[3])
            xobjs = page.Resources.get("/XObject", {}) if "/Resources" in page else {}
            content = _content(page)
            # one pass over the (potentially huge) stream, bisect later
            cm_ends, cm_nums = [], []
            for mm in CM_OPS.finditer(content):
                cm_ends.append(mm.end())
                cm_nums.append(mm.groups())
            best = None  # (area_pt², dpi)
            for name, xo in xobjs.items():
                if str(xo.get("/Subtype", "")) != "/Image":
                    continue
                w_px, h_px = int(xo.get("/Width", 0)), int(xo.get("/Height", 0))
                draw = re.search(re.escape(str(name).encode()) + rb"\s+Do", content)
                if not draw:
                    continue
                i = bisect.bisect_right(cm_ends, draw.start())
                if i == 0:
                    continue
                a, b, c, d = (float(x) for x in cm_nums[i - 1][:4])
                w_pt = abs(a) + abs(b)  # axis-aligned scans: b = 0
                h_pt = abs(c) + abs(d)
                if not w_pt or not h_pt:
                    continue
                area = w_pt * h_pt
                dpi = w_px / w_pt * 72.0
                if best is None or area > best[0]:
                    best = (area, dpi)
            if best and best[0] >= 0.8 * pw * ph:
                return best[1]
    except Exception:
        pass
    return None


def render_dpi(pdf_path: Path) -> float:
    with pikepdf.open(pdf_path) as pdf:
        pw, ph = float(pdf.pages[0].MediaBox[2]), float(pdf.pages[0].MediaBox[3])
    native = native_dpi(pdf_path)
    if native:
        dpi = min(native, PX_CAP / max(pw, ph) * 72.0)
    else:
        dpi = min(DPI_MAX, VECTOR_PX_CAP / max(pw, ph) * 72.0)
    return round(dpi, 1)


def convert(pdf: Path, force: bool) -> None:
    webp = pdf.with_suffix(".webp")
    if webp.exists() and webp.stat().st_mtime >= pdf.stat().st_mtime and not force:
        print(f"  skip    {webp.name:26s} up to date ({webp.stat().st_size // 1024} KB)")
        return
    dpi = render_dpi(pdf)
    TMP.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=TMP) as td:
        prefix = Path(td) / "page"
        subprocess.run(
            ["pdftoppm", "-r", str(dpi), "-png", str(pdf), str(prefix)],
            check=True,
        )
        pages = sorted(prefix.parent.glob("page-*.png"))
        if len(pages) != 1:
            sys.exit(f"{pdf.name}: expected a single-page map, found {len(pages)} pages")
        im = Image.open(pages[0]).convert("RGB")
        im.save(webp, "WEBP", quality=QUALITY, method=6)
    print(f"  render  {pdf.name:26s} -> {webp.name}  @{dpi:g} dpi  "
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