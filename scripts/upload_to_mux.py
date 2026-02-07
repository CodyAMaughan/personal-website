#!/usr/bin/env python3
"""
Mux Video Upload Script

Uploads a local video file to Mux and returns the playback ID.

Usage:
    python upload_to_mux.py <video_file_path> [--title "Video Title"]

Example:
    python upload_to_mux.py ./my-ad.mp4 --title "Acme Corp Ad"

Environment Variables (in .env file):
    MUX_TOKEN_ID - Your Mux API token ID
    MUX_TOKEN_SECRET - Your Mux API token secret
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

try:
    import requests
    from dotenv import load_dotenv
except ImportError:
    print("Missing dependencies. Install with:")
    print("  pip install requests python-dotenv")
    sys.exit(1)

# Load environment variables from .env file
load_dotenv()

MUX_API_BASE = "https://api.mux.com"


def get_credentials():
    """Get Mux API credentials from environment."""
    token_id = os.getenv("MUX_TOKEN_ID")
    token_secret = os.getenv("MUX_TOKEN_SECRET")
    
    if not token_id or not token_secret:
        print("Error: Missing Mux credentials.")
        print("Add these to your .env file:")
        print("  MUX_TOKEN_ID=your_token_id")
        print("  MUX_TOKEN_SECRET=your_token_secret")
        sys.exit(1)
    
    return (token_id, token_secret)


def create_direct_upload(auth, title=None):
    """Create a direct upload URL from Mux."""
    url = f"{MUX_API_BASE}/video/v1/uploads"
    
    payload = {
        "cors_origin": "*",
        "new_asset_settings": {
            "playback_policy": ["public"],
            "video_quality": "basic"
        }
    }
    
    # Add passthrough metadata if title provided
    if title:
        payload["new_asset_settings"]["passthrough"] = json.dumps({"title": title})
    
    response = requests.post(url, json=payload, auth=auth)
    response.raise_for_status()
    
    data = response.json()["data"]
    return data["id"], data["url"]


def upload_file(upload_url, file_path):
    """Upload the video file to Mux's direct upload URL."""
    file_size = os.path.getsize(file_path)
    
    print(f"Uploading {file_path} ({file_size / 1024 / 1024:.1f} MB)...")
    
    with open(file_path, "rb") as f:
        response = requests.put(
            upload_url,
            data=f,
            headers={"Content-Type": "video/mp4"}
        )
    
    response.raise_for_status()
    print("Upload complete!")


def wait_for_asset(auth, upload_id, max_wait=300):
    """Wait for the upload to be processed and return the asset."""
    url = f"{MUX_API_BASE}/video/v1/uploads/{upload_id}"
    
    print("Waiting for Mux to process the video...")
    
    start_time = time.time()
    while time.time() - start_time < max_wait:
        response = requests.get(url, auth=auth)
        response.raise_for_status()
        
        data = response.json()["data"]
        status = data.get("status")
        
        if status == "asset_created":
            return data["asset_id"]
        elif status == "errored":
            print(f"Error: Upload failed - {data.get('error', 'Unknown error')}")
            sys.exit(1)
        
        print(f"  Status: {status}...")
        time.sleep(5)
    
    print("Error: Timed out waiting for asset creation")
    sys.exit(1)


def get_playback_id(auth, asset_id):
    """Get the playback ID for an asset."""
    url = f"{MUX_API_BASE}/video/v1/assets/{asset_id}"
    
    response = requests.get(url, auth=auth)
    response.raise_for_status()
    
    data = response.json()["data"]
    playback_ids = data.get("playback_ids", [])
    
    if playback_ids:
        return playback_ids[0]["id"]
    
    # Create a playback ID if none exists
    url = f"{MUX_API_BASE}/video/v1/assets/{asset_id}/playback-ids"
    response = requests.post(url, json={"policy": "public"}, auth=auth)
    response.raise_for_status()
    
    return response.json()["data"]["id"]


def main():
    parser = argparse.ArgumentParser(description="Upload a video to Mux")
    parser.add_argument("file", help="Path to the video file")
    parser.add_argument("--title", "-t", help="Title for the video")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    
    args = parser.parse_args()
    
    file_path = Path(args.file)
    if not file_path.exists():
        print(f"Error: File not found: {file_path}")
        sys.exit(1)
    
    auth = get_credentials()
    
    # Step 1: Create direct upload
    upload_id, upload_url = create_direct_upload(auth, args.title)
    
    # Step 2: Upload the file
    upload_file(upload_url, file_path)
    
    # Step 3: Wait for processing
    asset_id = wait_for_asset(auth, upload_id)
    
    # Step 4: Get playback ID
    playback_id = get_playback_id(auth, asset_id)
    
    if args.json:
        print(json.dumps({
            "asset_id": asset_id,
            "playback_id": playback_id,
            "stream_url": f"https://stream.mux.com/{playback_id}.m3u8",
            "thumbnail_url": f"https://image.mux.com/{playback_id}/thumbnail.jpg"
        }, indent=2))
    else:
        print("\n" + "=" * 50)
        print("✅ Video uploaded successfully!")
        print("=" * 50)
        print(f"Asset ID:     {asset_id}")
        print(f"Playback ID:  {playback_id}")
        print(f"Stream URL:   https://stream.mux.com/{playback_id}.m3u8")
        print(f"Thumbnail:    https://image.mux.com/{playback_id}/thumbnail.jpg")
        print("=" * 50)
        print("\nAdd this to your portfolio content:")
        print(f'  "muxPlaybackId": "{playback_id}"')


if __name__ == "__main__":
    main()
