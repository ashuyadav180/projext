const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('storage/autoreel.db');
db.serialize(() => {
  db.get("SELECT COUNT(*) as count FROM jobs", (err, row) => {
    console.log("Total jobs in DB:", row ? row.count : err);
  });
  db.get("SELECT COUNT(*) as completed FROM jobs WHERE status='COMPLETED'", (err, row) => {
    console.log("Completed jobs in DB:", row ? row.completed : err);
  });
});
db.close();
