import sqlite3
import json

conn = sqlite3.connect("jobs/jobs.db")
cursor = conn.cursor()
cursor.execute("SELECT output FROM jobs WHERE id='job_1780124873874_90e789c0'")
row = cursor.fetchone()
if row and row[0]:
    out = json.loads(row[0])
    print("IMAGES GENERATED IN LATEST JOB:")
    for img in out.get("images", []):
        print(f"Scene: {img.get('scene_index')}, Path: {img.get('image_path')}, Prompt: {img.get('imagePrompt')}, Error: {img.get('error')}")
else:
    print("Job output not found")
conn.close()
