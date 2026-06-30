import sqlite3
import json

conn = sqlite3.connect("jobs/jobs.db")
cursor = conn.cursor()
try:
    cursor.execute("SELECT id, topic, type, category, status, createdAt, output FROM jobs ORDER BY createdAt DESC LIMIT 5")
    rows = cursor.fetchall()
    for row in rows:
        print(f"ID: {row[0]}, Topic: {row[1]}, Type: {row[2]}, Niche: {row[3]}, Status: {row[4]}, CreatedAt: {row[5]}")
        if row[6]:
            try:
                out = json.loads(row[6])
                print("  Output video:", out.get("video"))
            except:
                pass
except Exception as e:
    print("Error:", e)
conn.close()
