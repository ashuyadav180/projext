import Database from 'better-sqlite3';
import path from 'path';
const db = new Database(path.resolve(process.cwd(), 'jobs/jobs.db'));
const stuck = db.prepare("SELECT id, status, topic FROM jobs WHERE status IN ('PENDING','RUNNING')").all();
console.log('Stuck jobs:', JSON.stringify(stuck, null, 2));
const result = db.prepare("UPDATE jobs SET status='FAILED', lastError='Cleared on restart' WHERE status IN ('PENDING','RUNNING')").run();
console.log('Cleared:', result.changes, 'stuck jobs');
db.close();
