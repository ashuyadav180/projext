import "dotenv/config";
import db from "../jobs/db.js";
import { initJobStore, createNewJob, getJob, listJobs, updateJob } from "../jobs/job.store.js";
import storage from "../services/storage.service.js";
import { queue } from "../jobs/job.engine.js";

async function testSQLite() {
    console.log("--- Testing SQLite ---");
    initJobStore();
    const job = createNewJob("Test Topic", "REEL");
    console.log("Inserted job:", job.id);
    
    updateJob(job.id, { status: "RUNNING", percent: 50 });
    const updated = getJob(job.id);
    console.log("Updated job status:", updated.status, "percent:", updated.percent);
    
    const all = listJobs();
    console.log("Total jobs in DB:", all.length);
}

async function testStorage() {
    console.log("\n--- Testing Storage ---");
    console.log("STORAGE_TYPE:", process.env.STORAGE_TYPE || "local");
    // Just testing logic, not actual S3 upload unless creds are valid
    try {
        const url = storage.getFileUrl("video/test.mp4");
        console.log("Sample URL:", url);
    } catch (e) {
        console.log("Storage test failed (expected if s3 without creds):", e.message);
    }
}

async function run() {
    await testSQLite();
    await testStorage();
    console.log("\n✅ Base logic verification complete.");
    process.exit(0);
}

run();
