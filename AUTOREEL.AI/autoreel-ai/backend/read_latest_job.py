import sqlite3
import json
import sys

# Ensure UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect("jobs/jobs.db")
cursor = conn.cursor()
cursor.execute("SELECT id, topic, status, output FROM jobs ORDER BY createdAt DESC LIMIT 1")
row = cursor.fetchone()
if row:
    job_id, topic, status, output = row
    print("JOB ID:", job_id)
    print("TOPIC:", topic)
    print("STATUS:", status)
    if output:
        try:
            out = json.loads(output)
            print("KEYS IN OUTPUT:", list(out.keys()))
            print("VIDEO PATH:", out.get("video"))
            print("AUDIO PATH:", out.get("audio"))
            print("SUBTITLE PATH:", out.get("subtitles"))
            images = out.get("images")
            print("IMAGES IN OUTPUT:")
            if isinstance(images, list):
                for img in images:
                    print(f"  Scene {img.get('scene_index')}: path={img.get('image_path')}, prompt={img.get('imagePrompt')}")
            else:
                print("  Images is not a list:", type(images), images)
        except Exception as e:
            print("Failed to parse output JSON:", e)
else:
    print("No jobs found in DB.")
conn.close()
