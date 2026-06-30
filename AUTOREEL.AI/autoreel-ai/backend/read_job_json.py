import sqlite3
import json

conn = sqlite3.connect("jobs/jobs.db")
cursor = conn.cursor()
cursor.execute("SELECT output FROM jobs WHERE id='job_1780120994957_8a51ebfc'")
row = cursor.fetchone()
if row and row[0]:
    out = json.loads(row[0])
    print("GENERATED SCRIPT:")
    print(out.get("script"))
    print("\nSCRIPT LENGTH:", len(out.get("script", "")))
    print("\nAUDIO PATH:", out.get("audio"))
    print("\nSUBTITLE PATH:", out.get("subtitles"))
else:
    print("Job output not found")
conn.close()
