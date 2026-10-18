#!/usr/bin/env python3
"""Inject canonical / Open Graph / Twitter / robots / theme-color + Organization
JSON-LD into every HTML page. Idempotent — pages that already have a canonical
link are skipped. Run from the project root:

    python3 tools/seo_inject.py          # apply
    python3 tools/seo_inject.py --check  # report only, change nothing
"""
import json
import re
import sys
from pathlib import Path

BASE = "https://gsbuilder-swart.vercel.app"

ROOT = Path(__file__).resolve().parent.parent

org_ld = {
    "@context": "https://schema.org",
    "@type": ["Organization", "HomeAndConstructionBusiness"],
    "name": "GS Builder & Engineers",
    "url": BASE + "/",
    "logo": BASE + "/assets/images/logo.webp",
    "foundingDate": "2006",
    "telephone": "+92-345-3707530",
    "email": "gs.builder2006@gmail.com",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Office # 112, Park View Plaza, D-17/2, Margalla View Housing Scheme (MVHS)",
        "addressLocality": "Islamabad",
        "addressCountry": "PK",
    },
    "sameAs": [
        "https://www.facebook.com/gsbuilderengineers",
        "https://www.instagram.com/gsbuilder2006",
    ],
}


def esc(s: str) -> str:
    """Escape for a double-quoted HTML attribute — without double-escaping
    entities that are already escaped in the source markup (&amp; ...)."""
    s = s.replace("&amp;", "&")  # normalise pre-escaped entities first
    return s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;")


def head_tags(title: str, desc: str, canonical: str) -> str:
    b = BASE
    return f'''<link rel="canonical" href="{esc(canonical)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="author" content="GS Builder &amp; Engineers">
  <meta name="theme-color" content="#031427">
  <!-- Open Graph (Facebook, WhatsApp, LinkedIn sharing previews) -->
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="GS Builder &amp; Engineers">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(desc)}">
  <meta property="og:url" content="{esc(canonical)}">
  <meta property="og:image" content="{b}/assets/images/og-cover.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{esc(title)}">
  <!-- Twitter card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{esc(title)}">
  <meta name="twitter:description" content="{esc(desc)}">
  <meta name="twitter:image" content="{b}/assets/images/og-cover.jpg">'''


def ld_json(obj: dict) -> str:
    return '<script type="application/ld+json">\n  ' + json.dumps(obj, indent=2, ensure_ascii=False) + "\n  </script>"


def process(path: Path, apply: bool) -> tuple[str, str]:
    rel = path.relative_to(ROOT).as_posix()
    canonical = BASE + ("/" if rel == "index.html" else "/" + rel)
    html = path.read_text(encoding="utf-8")

    if 'rel="canonical"' in html:
        return ("skip", rel)

    m = re.search(r"<title>(.*?)</title>", html, re.S)
    if not m:
        return ("NO TITLE", rel)
    title = m.group(1).strip()
    title = re.sub(r"\s+", " ", title)  # collapse wrapped lines

    m = re.search(r'<meta\s+name="description"\s+content="(.*?)"', html, re.S)
    if not m:
        return ("NO DESCRIPTION", rel)
    desc = m.group(1).strip()
    desc = re.sub(r"\s+", " ", desc)

    block = head_tags(title, desc, canonical)

    # 1) SEO head block right before the favicon link
    anchor = re.search(r'[ \t]*<link rel="icon"', html)
    if not anchor:
        return ("NO ICON ANCHOR", rel)
    line_start = html.rfind("\n", 0, anchor.start()) + 1
    html = html[:line_start] + block + "\n" + html[line_start:]

    # 2) Organization JSON-LD before </head>
    if "application/ld+json" not in html:
        html = html.replace("</head>", "  " + ld_json(org_ld) + "\n</head>", 1)

    if apply:
        path.write_text(html, encoding="utf-8")
    return ("ok", rel)


def validate_ld(path: Path) -> list[str]:
    """Return parse errors for existing ld+json blocks."""
    errors = []
    try:
        html = path.read_text(encoding="utf-8")
    except Exception:
        return []
    for i, block in enumerate(re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)):
        try:
            json.loads(block)
        except Exception as e:
            errors.append(f"{path.name} block#{i + 1}: {e}")
    return errors


def main() -> None:
    apply = "--check" not in sys.argv
    pages = sorted(ROOT.glob("index.html")) + sorted(ROOT.glob("pages/*.html"))
    results = {}
    for p in pages:
        status, name = process(p, apply)
        results.setdefault(status, []).append(name)

    for status, names in results.items():
        print(f"{status}: {len(names)}")
        for n in names:
            print(f"  - {n}")

    ld_errors = []
    for p in pages:
        ld_errors += validate_ld(p)
    if ld_errors:
        print("LD+JSON ERRORS:")
        for e in ld_errors:
            print("  " + e)
        sys.exit(1)
    print("All ld+json blocks parse as valid JSON.")


if __name__ == "__main__":
    main()