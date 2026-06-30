import sqlite3
import json

conn = sqlite3.connect("jobs/jobs.db")
cursor = conn.cursor()
cursor.execute("SELECT id, topic, type, createdAt, output FROM jobs WHERE id='job_1780120994957_8a51ebfc'")
row = cursor.fetchone()
if row:
    print("ID:", row[0])
    print("Topic:", row[1])
    print("Type:", row[2])
    print("CreatedAt:", row[3])
    if row[4]:
        out = json.loads(row[4])
        print("Output Keys:", out.keys())
        print("Video:", out.get("video"))
        print("Thumbnail:", out.get("thumbnail"))
        # Let's find the job parameters by listing all columns
        cursor.execute("PRAGMA table_info(jobs)")
        columns = [col[1] for col in cursor.fetchall()]
        print("Columns:", columns)
else:
    print("Job not found")
conn.close()
