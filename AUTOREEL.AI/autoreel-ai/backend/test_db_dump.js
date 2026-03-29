import Database from "better-sqlite3";

const db = new Database("./jobs/jobs.db");
const jobs = db.prepare("SELECT * FROM jobs WHERE status = 'COMPLETED' LIMIT 5").all();
jobs.forEach(j => {
  if (j.output) {
    try {
      j.output = JSON.parse(j.output);
    } catch(e) {}
  }
});
console.log(JSON.stringify(jobs, null, 2));
db.close();
