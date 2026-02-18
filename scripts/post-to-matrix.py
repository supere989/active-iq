#!/usr/bin/env python3
"""
Post new Moltbook comments to Matrix Blog Community room
"""
import os
import sys
import json
import requests
from datetime import datetime

HOMESERVER = "https://matrix.active-iq.com"
ADMIN_TOKEN = "syt_YWRtaW4_yZkGfdOskFuVVbHTsIJm_3YjjpW"
ROOM_ID = "!bvlXPoBPjsYgXDMVNz:matrix.active-iq.com"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "moltbook-data.json")
STATE_FILE = os.path.join(SCRIPT_DIR, "matrix-sync-state.json")

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            return json.load(f)
    return {"posted_comment_ids": [], "last_sync": None}

def save_state(state):
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)

def send_matrix_message(text, formatted_text=None):
    """Send a message to the Matrix room"""
    headers = {"Authorization": f"Bearer {ADMIN_TOKEN}", "Content-Type": "application/json"}
    
    msg_data = {
        "msgtype": "m.text",
        "body": text
    }
    
    if formatted_text:
        msg_data["format"] = "org.matrix.custom.html"
        msg_data["formatted_body"] = formatted_text
    
    url = f"{HOMESERVER}/_matrix/client/v3/rooms/{requests.utils.quote(ROOM_ID, safe='')}/send/m.room.message"
    r = requests.post(url, headers=headers, json=msg_data, timeout=10)
    return r.status_code == 200

def main():
    if not os.path.exists(DATA_FILE):
        print("No Moltbook data found", file=sys.stderr)
        return 1
    
    with open(DATA_FILE) as f:
        data = json.load(f)
    
    state = load_state()
    posted_ids = set(state["posted_comment_ids"])
    new_comments = []
    
    # Find new comments
    for post in data.get("posts", []):
        post_url = f"https://www.moltbook.com/post/{post['id']}"
        blog_url = f"https://www.active-iq.com/blog/{post['id']}.html"
        
        for comment in post.get("comments", []):
            if comment["id"] not in posted_ids:
                new_comments.append({
                    "comment": comment,
                    "post_title": post["title"],
                    "post_url": post_url,
                    "blog_url": blog_url
                })
                posted_ids.add(comment["id"])
    
    if not new_comments:
        print("No new comments to post")
        return 0
    
    print(f"Found {len(new_comments)} new comments")
    
    # Post to Matrix
    for item in new_comments:
        c = item["comment"]
        author = c["author"]["name"]
        karma = c["author"].get("karma", 0)
        content = c["content"][:300] + ("..." if len(c["content"]) > 300 else "")
        
        text = f"""New comment on Moltbook by {author} (karma: {karma}):

{content}

Post: {item["post_title"]}
Moltbook: {item["post_url"]}
Blog: {item["blog_url"]}"""
        
        formatted = f"""<p><strong>New comment on Moltbook</strong> by <em>{author}</em> (karma: {karma}):</p>
<blockquote>{content.replace(chr(10), "<br/>")}</blockquote>
<p>Post: <a href="{item["post_url"]}">{item["post_title"]}</a><br/>
Blog: <a href="{item["blog_url"]}">View on active-iq.com</a></p>"""
        
        if send_matrix_message(text, formatted):
            print(f"  ✓ Posted comment by {author}")
        else:
            print(f"  ✗ Failed to post comment by {author}", file=sys.stderr)
    
    # Save state
    state["posted_comment_ids"] = list(posted_ids)
    state["last_sync"] = datetime.utcnow().isoformat() + "Z"
    save_state(state)
    
    print(f"✓ Synced {len(new_comments)} new comments to Matrix")
    return 0

if __name__ == "__main__":
    sys.exit(main())
