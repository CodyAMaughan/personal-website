#!/usr/bin/env python3
"""
Sync YouTube channel videos into local portfolio JSON content.

Scrapes the Follow Him Scripture Shorts channel page for video data
and generates portfolio entries with youtubeId (replacing muxPlaybackId).

Usage examples:
  python scripts/sync_youtube.py --dry-run
  python scripts/sync_youtube.py --clean
  python scripts/sync_youtube.py --clean --max 14
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

CHANNEL_HANDLE = "FollowHimScriptureShorts"
CHANNEL_URL = f"https://www.youtube.com/@{CHANNEL_HANDLE}/videos"
DEFAULT_PORTFOLIO_DIR = Path("src/content/portfolio")
PROJECT = "follow-him-scripture-shorts"

PROFILE_LINKS = [
    {"name": "YouTube", "url": f"https://www.youtube.com/@{CHANNEL_HANDLE}"},
    {"name": "X", "url": "https://x.com/followhimshorts"},
]


def fetch_channel_page(url: str) -> str:
    try:
        result = subprocess.run(
            ["curl", "-sS", "-L", url],
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        detail = (exc.stderr or exc.stdout or "Unknown curl error").strip()
        raise RuntimeError(f"Failed to fetch channel page: {detail}") from exc
    return result.stdout


def parse_channel_videos(html: str) -> list[dict]:
    """Extract video data from the ytInitialData JSON embedded in the page."""
    match = re.search(r"var ytInitialData = ({.*?});</script>", html)
    if not match:
        raise RuntimeError("Could not find ytInitialData in channel page")

    data = json.loads(match.group(1))
    tabs = (
        data.get("contents", {})
        .get("twoColumnBrowseResultsRenderer", {})
        .get("tabs", [])
    )

    videos = []
    for tab in tabs:
        tr = tab.get("tabRenderer", {})
        if not tr.get("selected"):
            continue

        items = tr.get("content", {}).get("richGridRenderer", {}).get("contents", [])
        for item in items:
            rir = (
                item.get("richItemRenderer", {}).get("content", {})
            )

            # Shorts use shortsLockupViewModel.
            slvm = rir.get("shortsLockupViewModel", {})
            if slvm:
                endpoint = (
                    slvm.get("onTap", {})
                    .get("innertubeCommand", {})
                    .get("reelWatchEndpoint", {})
                )
                video_id = endpoint.get("videoId", "")
                access_text = slvm.get("accessibilityText", "")
                # Parse title: "Genesis 6:8 - Grace, 103 views - play Short"
                title = access_text.rsplit(",", 1)[0].strip() if "," in access_text else ""
                if video_id and title:
                    videos.append({"videoId": video_id, "title": title})
                continue

            # Regular videos use videoRenderer.
            vr = rir.get("videoRenderer", {})
            if vr:
                video_id = vr.get("videoId", "")
                runs = vr.get("title", {}).get("runs", [])
                title = runs[0].get("text", "") if runs else ""
                published = vr.get("publishedTimeText", {}).get("simpleText", "")
                if video_id and title:
                    videos.append({
                        "videoId": video_id,
                        "title": title,
                        "publishedRelative": published,
                    })

    return videos


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value.replace(" ", "-")


def parse_scripture(title: str) -> str | None:
    """Extract scripture reference from title like 'Genesis 6:8 - Grace'."""
    match = re.match(r"^(\d?\s*[A-Za-z]+\s+\d+:\d+(?:-\d+)?)", title)
    if match:
        return match.group(1).strip()
    return None


def default_description(title: str) -> str:
    return (
        "A reverent short-form scripture video created for the weekly "
        "Come, Follow Me study and daily publishing cadence."
    )


def build_portfolio_entry(entry: dict, pub_date: str) -> dict:
    title = entry["title"]

    return {
        "title": title,
        "description": default_description(title),
        "youtubeId": entry["videoId"],
        "pubDate": pub_date,
        "project": PROJECT,
        "scripture": parse_scripture(title),
        "aspectRatio": "9:16",
        "profiles": PROFILE_LINKS,
    }


def clean_existing(portfolio_dir: Path, *, dry_run: bool) -> int:
    """Remove existing follow-him-scripture-shorts portfolio entries."""
    removed = 0
    for path in sorted(portfolio_dir.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue
        if data.get("project") == PROJECT:
            if dry_run:
                print(f"  Would remove: {path.name}")
            else:
                path.unlink()
                print(f"  Removed: {path.name}")
            removed += 1
    return removed


def write_json(path: Path, data: dict) -> None:
    cleaned = {k: v for k, v in data.items() if v is not None}
    path.write_text(json.dumps(cleaned, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Sync YouTube channel videos into portfolio content"
    )
    parser.add_argument(
        "--max",
        type=int,
        default=14,
        help="Maximum number of videos to sync (default: 14)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without writing files",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Remove existing follow-him-scripture-shorts entries before writing",
    )
    parser.add_argument(
        "--portfolio-dir",
        type=Path,
        default=DEFAULT_PORTFOLIO_DIR,
        help="Portfolio JSON directory (default: src/content/portfolio)",
    )
    parser.add_argument(
        "--channel-url",
        type=str,
        default=CHANNEL_URL,
        help="YouTube channel videos URL",
    )

    args = parser.parse_args()
    portfolio_dir: Path = args.portfolio_dir

    if not portfolio_dir.exists():
        print(f"Error: Portfolio directory not found: {portfolio_dir}", file=sys.stderr)
        sys.exit(1)

    # Fetch and parse channel page.
    print(f"Fetching channel page: {args.channel_url}")
    html = fetch_channel_page(args.channel_url)
    entries = parse_channel_videos(html)
    print(f"Found {len(entries)} videos on channel")

    if not entries:
        print("No entries found. Exiting.")
        return

    # Limit to --max.
    entries = entries[: args.max]
    print(f"Processing {len(entries)} videos (--max {args.max})")

    # Use today as the base date and decrement by one day per video
    # (most recent first) to preserve ordering since we don't have exact dates.
    today = datetime.now(timezone.utc).date()

    # Clean existing entries if requested.
    if args.clean:
        print(f"\nCleaning existing {PROJECT} entries...")
        removed = clean_existing(portfolio_dir, dry_run=args.dry_run)
        print(f"{'Would remove' if args.dry_run else 'Removed'}: {removed} entries")

    # Write new entries.
    print(f"\n{'Preview of' if args.dry_run else 'Writing'} new entries:\n")
    created = 0
    for i, entry in enumerate(entries):
        from datetime import timedelta

        pub_date = (today - timedelta(days=i)).isoformat()
        portfolio_data = build_portfolio_entry(entry, pub_date)
        slug = slugify(entry["title"])
        if not slug:
            print(f"  Skipped (empty slug): {entry['title']}")
            continue

        file_path = portfolio_dir / f"{slug}.json"

        # Handle slug collisions.
        suffix = 2
        while file_path.exists() and not args.clean:
            file_path = portfolio_dir / f"{slug}-{suffix}.json"
            suffix += 1

        if args.dry_run:
            print(f"  Would create: {file_path.name}")
            print(f"    title: {portfolio_data['title']}")
            print(f"    youtubeId: {portfolio_data['youtubeId']}")
            print(f"    scripture: {portfolio_data.get('scripture', '(none)')}")
            print(f"    pubDate: {portfolio_data['pubDate']}")
        else:
            write_json(file_path, portfolio_data)
            print(f"  Created: {file_path.name}")

        created += 1

    # Summary.
    print(f"\nSummary:")
    print(f"  Videos from channel: {len(entries)}")
    print(f"  Entries {'previewed' if args.dry_run else 'created'}: {created}")
    if args.dry_run:
        print("\n(Dry run — no files were modified)")


if __name__ == "__main__":
    main()
