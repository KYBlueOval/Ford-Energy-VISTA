#!/usr/bin/env python3
"""Synchronize the VISTA sponsor directory from Apps Script to GitHub Pages JSON."""
from __future__ import annotations

import argparse
import json
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def endpoint_with_action(url: str) -> str:
    parsed = urllib.parse.urlsplit(url.strip())
    query = dict(urllib.parse.parse_qsl(parsed.query, keep_blank_values=True))
    query["action"] = "listSponsors"
    query["source"] = "github-actions"
    return urllib.parse.urlunsplit(
        (parsed.scheme, parsed.netloc, parsed.path, urllib.parse.urlencode(query), parsed.fragment)
    )


def fetch_json(url: str) -> dict[str, Any]:
    req = urllib.request.Request(
        endpoint_with_action(url),
        headers={
            "Accept": "application/json,text/plain,*/*",
            "User-Agent": "Ford-Energy-VISTA-GitHub-Actions/1.6.1",
            "Cache-Control": "no-cache",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as response:
        body = response.read().decode("utf-8-sig")
    data = json.loads(body)
    if not isinstance(data, dict) or data.get("ok") is not True:
        raise ValueError(f"Apps Script returned an unsuccessful response: {data!r}")
    return data


def normalize(data: dict[str, Any]) -> list[dict[str, str]]:
    raw = data.get("sponsors", [])
    if not isinstance(raw, list):
        raise ValueError("The sponsor response did not contain a sponsors array.")

    sponsors: list[dict[str, str]] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        sponsor = {
            "sponsorId": str(item.get("sponsorId") or item.get("SponsorID") or "").strip(),
            "name": str(item.get("name") or item.get("SponsorName") or "").strip(),
            "email": str(item.get("email") or item.get("SponsorEmail") or "").strip(),
            "department": str(item.get("department") or item.get("Department") or "").strip(),
            "keywords": str(item.get("keywords") or item.get("SearchKeywords") or "").strip(),
        }
        if sponsor["name"] and sponsor["email"]:
            sponsors.append(sponsor)

    sponsors.sort(key=lambda row: (row["name"].casefold(), row["email"].casefold()))
    return sponsors


def load_existing(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    try:
        current = json.loads(path.read_text(encoding="utf-8"))
        return current if isinstance(current, dict) else None
    except (OSError, json.JSONDecodeError):
        return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--endpoint", required=True, help="Apps Script /exec URL")
    parser.add_argument("--output", required=True, help="Target sponsors.json path")
    args = parser.parse_args()

    try:
        data = fetch_json(args.endpoint)
        sponsors = normalize(data)
        if not sponsors:
            raise ValueError(
                "The Apps Script response contained zero active sponsors; preserving the current directory."
            )

        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        existing = load_existing(output)
        if existing and existing.get("sponsors") == sponsors:
            print(f"Sponsor directory is already current with {len(sponsors)} active sponsor(s).")
            return 0

        document = {
            "generatedAt": datetime.now(timezone.utc)
            .replace(microsecond=0)
            .isoformat()
            .replace("+00:00", "Z"),
            "source": "Ford Energy VISTA Sponsors worksheet via Apps Script",
            "count": len(sponsors),
            "sponsors": sponsors,
        }
        output.write_text(
            json.dumps(document, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )
        print(f"Wrote {len(sponsors)} active sponsor(s) to {output}")
        return 0
    except Exception as exc:
        print(f"Sponsor synchronization failed: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
