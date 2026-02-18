#!/usr/bin/env python3
"""
Fetch GenysisAIQ Moltbook posts and comments
Saves to moltbook-data.json for static site generation
"""
import os
import sys
import json
import requests
from datetime import datetime

API_BASE = "https://www.moltbook.com/api/v1"
API_KEY = os.getenv("MOLTBOOK_API_KEY_GENYSIS", "moltbook_sk_HczsduS6b9O2-zU4o6W71s5WKBbUPiU5")
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(SCRIPT_DIR, "moltbook-data.json")

# Known post IDs to track (add new ones as we create them)
TRACKED_POSTS = [
    "23c8e1b4-eda9-4d5c-9ab1-580e3e39df1a",  # VectorGuard-Nano intro post
]

def fetch_post_with_comments(post_id):
    """Fetch a post and all its comments"""
    headers = {"Authorization": f"Bearer {API_KEY}"}
    
    # Get post
    r = requests.get(f"{API_BASE}/posts/{post_id}", headers=headers, timeout=15)
    if r.status_code != 200:
        print(f"Error fetching post {post_id}: {r.status_code}", file=sys.stderr)
        return None
    
    post_data = r.json()["post"]
    
    # Get comments
    r = requests.get(f"{API_BASE}/posts/{post_id}/comments?sort=top&limit=100", headers=headers, timeout=15)
    comments_data = []
    if r.status_code == 200:
        comments_data = r.json().get("comments", [])
    
    # Format post
    post = {
        "id": post_data["id"],
        "title": post_data["title"],
        "content": post_data["content"],
        "upvotes": post_data.get("upvotes", 0),
        "comment_count": post_data.get("comment_count", 0),
        "created_at": post_data["created_at"],
        "submolt": post_data.get("submolt", {}).get("name", "general"),
        "url": f"https://www.moltbook.com/post/{post_data['id']}",
        "comments": []
    }
    
    # Format comments (only top-level for now)
    for c in comments_data:
        if c.get("parent_id") is None:  # Top-level only
            comment = {
                "id": c["id"],
                "author": {
                    "name": c["author"]["name"],
                    "karma": c["author"].get("karma", 0)
                },
                "content": c["content"],
                "created_at": c["created_at"],
                "upvotes": c.get("upvotes", 0),
                "replies": len(c.get("replies", []))
            }
            post["comments"].append(comment)
    
    return post

def main():
    print(f"Fetching Moltbook data for GenysisAIQ...")
    
    posts = []
    for post_id in TRACKED_POSTS:
        print(f"  Fetching post {post_id}...")
        post = fetch_post_with_comments(post_id)
        if post:
            posts.append(post)
            print(f"    ✓ {post['title'][:60]}... ({len(post['comments'])} comments)")
    
    # Save to JSON
    data = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "agent": "GenysisAIQ",
        "posts": posts
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Saved {len(posts)} posts to {OUTPUT_FILE}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
