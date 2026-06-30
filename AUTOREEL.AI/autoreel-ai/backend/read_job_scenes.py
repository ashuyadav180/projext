import sqlite3
import json

conn = sqlite3.connect("jobs/jobs.db")
cursor = conn.cursor()
cursor.execute("SELECT output FROM jobs WHERE id='job_1780120994957_8a51ebfc'")
row = cursor.fetchone()
if row and row[0]:
    out = json.loads(row[0])
    print("SCENES PLANNED:")
    for s in out.get("scenes", []):
        print(f"Scene {s.get('scene_index')}:")
        print("  Text:", s.get("text"))
        print("  ImagePrompt:", s.get("imagePrompt"))
        print("  Mood:", s.get("mood"))
else:
    print("Job output not found")
conn.close()
