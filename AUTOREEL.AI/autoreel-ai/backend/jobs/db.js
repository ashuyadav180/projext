import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.resolve(process.cwd(), "jobs");
const DB_PATH = path.join(DB_DIR, "jobs.db");

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    topic TEXT,
    type TEXT,
    status TEXT,
    retries INTEGER DEFAULT 0,
    createdAt INTEGER,
    startedAt INTEGER,
    completedAt INTEGER,
    failedAt INTEGER,
    cancelledAt INTEGER,
    currentStep TEXT,
    stepIndex INTEGER,
    stepTotal INTEGER,
    percent INTEGER DEFAULT 0,
    lastError TEXT,
    category TEXT,
    output TEXT -- JSON string
  )
`);

try {
  db.exec("ALTER TABLE jobs ADD COLUMN category TEXT");
  console.log("✅ Added category column to jobs table");
} catch (e) {
  // Column already exists, ignore
}

console.log("🗄️ SQLite Database initialized at", DB_PATH);

export default db;
