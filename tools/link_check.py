#!/usr/bin/env python3
"""Check that every internal href/src/asset referenced by the HTML actually
exists on disk — run before deploying so a renamed image never ships broken.

    python3 tools/link_check.py            # check, exit 1 on problems
"""
import re
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_PREFIXES = ("http://", "https://", "mailto:", "tel:", "#", "data:", "javascript:", "//")
ATTR = re.compile(r'(?:href|src|poster)="([^"]+)"')

problems = []
checked = 0

for html in list(ROOT.glob("*.html")) + sorted(ROOT.glob("pages/*.html")):
    base = html.parent
    for attr in ATTR.finditer(html.read_text(encoding="utf-8")):
        raw = attr.group(1).strip()
        if raw.startswith(SKIP_PREFIXES):
            continue
        target = urllib.parse.unquote(raw.split("#")[0].split("?")[0])
        if not target:
            continue
        resolved = (base / target).resolve()
        checked += 1
        if not resolved.exists():
            problems.append(f"{html.name}: {raw} -> missing")

print(f"checked {checked} internal links")
if problems:
    print("BROKEN LINKS:")
    for p in problems:
        print("  " + p)
    sys.exit(1)
print("no broken internal links — safe to deploy")