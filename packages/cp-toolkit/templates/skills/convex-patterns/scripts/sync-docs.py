#!/usr/bin/env python3
"""Simple sync script to fetch Convex llms.txt and save a local copy.
Intended to be lightweight: use for periodic docs refresh by maintainers.
"""

import os
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("requests package is required. Install with: pip install requests")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
OUT_FILE = ROOT / "llms-source.txt"
URLS = [
    "https://www.convex.dev/llms.txt",
    "https://docs.convex.dev/llms.txt"
]


def fetch(url):
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        return r.text
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return None


if __name__ == "__main__":
    combined = []
    for u in URLS:
        print(f"Fetching {u}")
        txt = fetch(u)
        if txt:
            combined.append(f"# Source: {u}\n\n" + txt)

    if not combined:
        print("No content fetched.")
        sys.exit(1)

    OUT_FILE.write_text("\n\n".join(combined), encoding="utf-8")
    print(f"Saved docs to {OUT_FILE}")
