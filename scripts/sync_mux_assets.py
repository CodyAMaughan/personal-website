#!/usr/bin/env python3
"""
Sync Mux assets into local portfolio JSON content.

Features:
- Lists all Mux assets using page/cursor pagination.
- Extracts asset_id, title, playback_id, created_at, status.
- Syncs existing portfolio entries by title match.
- Optionally creates new portfolio entries for unmatched titled assets.

Usage examples:
  python scripts/sync_mux_assets.py --limit 100
  python scripts/sync_mux_assets.py --sync-portfolio
  python scripts/sync_mux_assets.py --sync-portfolio --create-missing
  python scripts/sync_mux_assets.py --sync-portfolio --dry-run
"""

from __future__ import annotations

import argparse
import difflib
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

MUX_API_BASE = "https://api.mux.com"
DEFAULT_PORTFOLIO_DIR = Path("src/content/portfolio")
FOLLOW_HIM_PROFILE_LINKS = [
    {"name": "YouTube", "url": "https://www.youtube.com/@FollowHimScriptureShorts"},
    {"name": "X", "url": "https://x.com/followhimshorts"},
]


@dataclass
class AssetSummary:
    asset_id: str
    title: str
    playback_id: str | None
    aspect_ratio: str | None
    created_at: str | None
    status: str | None


def load_dotenv_file(path: Path) -> None:
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key and key not in os.environ:
            os.environ[key] = value


def get_credentials() -> tuple[str, str]:
    load_dotenv_file(Path(".env"))

    token_id = os.getenv("MUX_TOKEN_ID")
    token_secret = os.getenv("MUX_TOKEN_SECRET")

    if not token_id or not token_secret:
        print("Error: Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET.", file=sys.stderr)
        print("Set them in environment or in .env.", file=sys.stderr)
        sys.exit(1)

    return token_id, token_secret


def mux_get(path: str, token_id: str, token_secret: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    cmd = [
        "curl",
        "-sS",
        "--fail",
        "--get",
        f"{MUX_API_BASE}{path}",
        "-H",
        "Content-Type: application/json",
        "-u",
        f"{token_id}:{token_secret}",
    ]

    for key, value in (params or {}).items():
        if value is None:
            continue
        cmd.extend(["--data-urlencode", f"{key}={value}"])

    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
    except subprocess.CalledProcessError as exc:
        stderr = (exc.stderr or "").strip()
        stdout = (exc.stdout or "").strip()
        detail = stderr or stdout or "Unknown curl error"
        raise RuntimeError(f"Mux API request failed: {detail}") from exc

    return json.loads(result.stdout)


def extract_title(asset: dict[str, Any]) -> str:
    meta = asset.get("meta") or {}
    title = (meta.get("title") or "").strip()
    if title:
        return title

    passthrough = asset.get("passthrough")
    if passthrough:
        try:
            data = json.loads(passthrough)
            passthrough_title = (data.get("title") or "").strip()
            if passthrough_title:
                return passthrough_title
        except json.JSONDecodeError:
            pass

    return "Untitled"


def extract_playback_id(asset: dict[str, Any]) -> str | None:
    playback_ids = asset.get("playback_ids") or []
    if not playback_ids:
        return None
    first = playback_ids[0] or {}
    return first.get("id")


def list_assets(
    token_id: str,
    token_secret: str,
    *,
    limit: int,
    page: int,
    cursor: str | None,
    live_stream_id: str | None,
    upload_id: str | None,
    max_pages: int | None,
) -> list[AssetSummary]:
    assets: list[AssetSummary] = []
    pages_fetched = 0
    next_cursor = cursor
    current_page = page

    while True:
        params: dict[str, Any] = {
            "limit": limit,
            "live_stream_id": live_stream_id,
            "upload_id": upload_id,
        }

        # If cursor is present, prefer cursor pagination.
        if next_cursor:
            params["cursor"] = next_cursor
        else:
            params["page"] = current_page

        payload = mux_get("/video/v1/assets", token_id, token_secret, params)
        data = payload.get("data") or []

        for asset in data:
            assets.append(
                AssetSummary(
                    asset_id=asset.get("id", ""),
                    title=extract_title(asset),
                    playback_id=extract_playback_id(asset),
                    aspect_ratio=asset.get("aspect_ratio"),
                    created_at=asset.get("created_at"),
                    status=asset.get("status"),
                )
            )

        pages_fetched += 1
        next_cursor = payload.get("next_cursor")

        if max_pages is not None and pages_fetched >= max_pages:
            break

        if next_cursor:
            continue

        if not data:
            break

        current_page += 1

    return assets


def normalize_title(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def slugify(value: str) -> str:
    value = normalize_title(value)
    return value.replace(" ", "-")


def classify_project(title: str) -> str:
    normalized = normalize_title(title)
    follow_him_keywords = [
        "follow him",
        "scripture",
        "come follow me",
        "come follow",
        "lds",
        "book of mormon",
        "new testament",
        "old testament",
        "doctrine and covenants",
        "pearl of great price",
    ]
    if any(keyword in normalized for keyword in follow_him_keywords):
        return "follow-him-scripture-shorts"

    scripture_book_prefixes = [
        "genesis",
        "exodus",
        "leviticus",
        "numbers",
        "deuteronomy",
        "joshua",
        "judges",
        "ruth",
        "samuel",
        "kings",
        "chronicles",
        "ezra",
        "nehemiah",
        "esther",
        "job",
        "psalm",
        "proverbs",
        "ecclesiastes",
        "isaiah",
        "jeremiah",
        "ezekiel",
        "daniel",
        "hosea",
        "joel",
        "amos",
        "obadiah",
        "jonah",
        "micah",
        "nahum",
        "habakkuk",
        "zephaniah",
        "haggai",
        "zechariah",
        "malachi",
        "matthew",
        "mark",
        "luke",
        "john",
        "acts",
        "romans",
        "corinthians",
        "galatians",
        "ephesians",
        "philippians",
        "colossians",
        "thessalonians",
        "timothy",
        "titus",
        "philemon",
        "hebrews",
        "james",
        "peter",
        "jude",
        "revelation",
        "nephi",
        "jacob",
        "enos",
        "jarom",
        "omni",
        "mosiah",
        "alma",
        "helaman",
        "mormon",
        "ether",
        "moroni",
        "moses",
        "abraham",
    ]
    if any(normalized.startswith(prefix + " ") for prefix in scripture_book_prefixes):
        return "follow-him-scripture-shorts"

    libremotion_keywords = [
        "libremotion",
        "ad",
        "creative",
        "listing",
        "real estate",
        "promo",
        "commercial",
        "social short",
        "short form",
        "performance",
    ]
    if any(keyword in normalized for keyword in libremotion_keywords):
        return "libremotion"

    return "unknown"


def default_description(title: str, project: str) -> str:
    if project == "follow-him-scripture-shorts":
        return (
            "A reverent short-form scripture video created for the weekly "
            "Come, Follow Me study and daily publishing cadence."
        )

    if project == "libremotion":
        if "listing" in normalize_title(title):
            return (
                "A vertical real-estate listing ad produced with LibreMotion, "
                "designed to highlight key property details and drive inquiry."
            )
        return (
            "A short-form ad creative produced with LibreMotion, built for "
            "rapid iteration and polished social delivery."
        )

    return "Video imported from Mux."


def print_asset_table(assets: list[AssetSummary]) -> None:
    print("\nMux assets:\n")
    print(f"{'ASSET ID':<28} {'PLAYBACK ID':<24} {'STATUS':<10} TITLE")
    print("-" * 110)
    for asset in assets:
        playback = asset.playback_id or "(none)"
        status = asset.status or "(unknown)"
        print(f"{asset.asset_id:<28} {playback:<24} {status:<10} {asset.title}")

    untitled = sum(1 for a in assets if a.title == "Untitled")
    with_playback = sum(1 for a in assets if a.playback_id)
    print("\nSummary:")
    print(f"- Total assets: {len(assets)}")
    print(f"- With playback IDs: {with_playback}")
    print(f"- Untitled assets: {untitled}")


def parse_date(date_value: str | None) -> str:
    if not date_value:
        return datetime.now(timezone.utc).date().isoformat()

    if date_value.isdigit():
        timestamp = int(date_value)
        # Heuristic: 13+ digits means milliseconds.
        if timestamp > 10**12:
            timestamp = timestamp // 1000
        return datetime.fromtimestamp(timestamp, tz=timezone.utc).date().isoformat()

    # Handles "2026-02-09T18:14:00Z"
    if "T" in date_value:
        return date_value.split("T", 1)[0]

    return date_value[:10]


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict[str, Any]) -> None:
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def sync_portfolio(
    assets: list[AssetSummary],
    *,
    portfolio_dir: Path,
    dry_run: bool,
    create_missing: bool,
    fuzzy_threshold: float,
) -> None:
    if not portfolio_dir.exists():
        print(f"Portfolio directory not found: {portfolio_dir}", file=sys.stderr)
        sys.exit(1)

    asset_candidates = [a for a in assets if a.playback_id and a.title != "Untitled"]
    by_normalized_title: dict[str, list[AssetSummary]] = {}
    for asset in asset_candidates:
        by_normalized_title.setdefault(normalize_title(asset.title), []).append(asset)

    portfolio_files = sorted(portfolio_dir.glob("*.json"))
    if not portfolio_files:
        print("No portfolio JSON files found.")
        return

    used_asset_ids: set[str] = set()
    updated_count = 0

    for file_path in portfolio_files:
        entry = load_json(file_path)
        title = str(entry.get("title", "")).strip()
        normalized = normalize_title(title)

        matched: AssetSummary | None = None

        # Exact normalized title match first.
        exact_candidates = [a for a in by_normalized_title.get(normalized, []) if a.asset_id not in used_asset_ids]
        if exact_candidates:
            matched = exact_candidates[0]

        # Fuzzy fallback match.
        if matched is None:
            best_ratio = 0.0
            best_asset: AssetSummary | None = None
            for asset in asset_candidates:
                if asset.asset_id in used_asset_ids:
                    continue
                ratio = difflib.SequenceMatcher(None, normalized, normalize_title(asset.title)).ratio()
                if ratio > best_ratio:
                    best_ratio = ratio
                    best_asset = asset

            if best_asset and best_ratio >= fuzzy_threshold:
                matched = best_asset

        if matched is None:
            print(f"No asset match for: {file_path.name} ({title})")
            continue

        used_asset_ids.add(matched.asset_id)

        changes: list[str] = []
        existing = str(entry.get("muxPlaybackId", ""))
        if existing != matched.playback_id:
            entry["muxPlaybackId"] = matched.playback_id
            changes.append(f"playback_id {existing or '(empty)'} -> {matched.playback_id}")

        current_aspect_ratio = entry.get("aspectRatio")
        if matched.aspect_ratio and current_aspect_ratio != matched.aspect_ratio:
            entry["aspectRatio"] = matched.aspect_ratio
            changes.append(f"aspectRatio {current_aspect_ratio or '(empty)'} -> {matched.aspect_ratio}")

        if changes:
            if not dry_run:
                write_json(file_path, entry)
            updated_count += 1
            print(
                f"Updated {file_path.name}: {'; '.join(changes)} "
                f"(asset {matched.asset_id}, title: {matched.title})"
            )
        else:
            print(f"No change {file_path.name}: playback/aspect already up to date")

    if create_missing:
        existing_titles = {normalize_title(load_json(path).get("title", "")) for path in portfolio_files}
        created_count = 0

        for asset in asset_candidates:
            if asset.asset_id in used_asset_ids:
                continue

            normalized_title = normalize_title(asset.title)
            if normalized_title in existing_titles:
                continue

            slug = slugify(asset.title)
            if not slug:
                continue

            file_path = portfolio_dir / f"{slug}.json"
            suffix = 2
            while file_path.exists():
                file_path = portfolio_dir / f"{slug}-{suffix}.json"
                suffix += 1

            entry = {
                "title": asset.title,
                "description": default_description(asset.title, classify_project(asset.title)),
                "muxPlaybackId": asset.playback_id,
                "aspectRatio": asset.aspect_ratio or "16:9",
                "pubDate": parse_date(asset.created_at),
                "project": classify_project(asset.title),
            }

            if entry["project"] == "unknown":
                print(
                    f"Skipped create for asset {asset.asset_id} ({asset.title}): "
                    "title does not clearly map to a known project"
                )
                continue

            if entry["project"] == "follow-him-scripture-shorts":
                entry["profiles"] = FOLLOW_HIM_PROFILE_LINKS

            if not dry_run:
                write_json(file_path, entry)
            created_count += 1
            print(f"Created {file_path.name} from asset {asset.asset_id} ({asset.title})")

        print(f"Created new entries: {created_count}")

    print(f"Portfolio updates applied: {updated_count}")


def main() -> None:
    parser = argparse.ArgumentParser(description="List and sync Mux assets into portfolio content")
    parser.add_argument("--limit", type=int, default=100, help="Items per request (default 100)")
    parser.add_argument("--page", type=int, default=1, help="Starting page when cursor is not used")
    parser.add_argument("--cursor", type=str, default=None, help="Starting cursor")
    parser.add_argument("--live-stream-id", type=str, default=None, help="Filter by live stream ID")
    parser.add_argument("--upload-id", type=str, default=None, help="Filter by upload ID")
    parser.add_argument("--max-pages", type=int, default=None, help="Optional safety limit for pagination")

    parser.add_argument("--write-json", type=Path, default=None, help="Write listed assets to a JSON file")

    parser.add_argument("--sync-portfolio", action="store_true", help="Update src/content/portfolio entries by title")
    parser.add_argument("--portfolio-dir", type=Path, default=DEFAULT_PORTFOLIO_DIR, help="Portfolio JSON directory")
    parser.add_argument("--dry-run", action="store_true", help="Print changes without writing files")
    parser.add_argument("--create-missing", action="store_true", help="Create new portfolio entries for unmatched titled assets")
    parser.add_argument(
        "--fuzzy-threshold",
        type=float,
        default=0.78,
        help="Fuzzy title match threshold between 0 and 1 (default 0.78)",
    )

    args = parser.parse_args()

    token_id, token_secret = get_credentials()
    assets = list_assets(
        token_id,
        token_secret,
        limit=args.limit,
        page=args.page,
        cursor=args.cursor,
        live_stream_id=args.live_stream_id,
        upload_id=args.upload_id,
        max_pages=args.max_pages,
    )

    print_asset_table(assets)

    if args.write_json:
        args.write_json.parent.mkdir(parents=True, exist_ok=True)
        payload = [
            {
                "asset_id": a.asset_id,
                "title": a.title,
                "playback_id": a.playback_id,
                "aspect_ratio": a.aspect_ratio,
                "created_at": a.created_at,
                "status": a.status,
            }
            for a in assets
        ]
        args.write_json.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
        print(f"\nWrote {len(payload)} assets to {args.write_json}")

    if args.sync_portfolio:
        print("\nSyncing portfolio entries...\n")
        sync_portfolio(
            assets,
            portfolio_dir=args.portfolio_dir,
            dry_run=args.dry_run,
            create_missing=args.create_missing,
            fuzzy_threshold=args.fuzzy_threshold,
        )


if __name__ == "__main__":
    main()
