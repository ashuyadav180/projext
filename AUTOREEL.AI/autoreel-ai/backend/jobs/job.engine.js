import { Worker } from "worker_threads";
import path from "path";
import {
  updateJob,
  failJob,
  completeJob,
  incrementRetry,
  getJob,
  listJobs
} from "./job.store.js";

import { getIO } from "../io-singleton.js";

const MAX_RETRIES = 3;

/**
 * BullMQ-lite Queue Implementation
 */
class JobQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.activeWorkers = new Map(); // jobId -> Worker
  }

  add(job) {
    console.log(`📥 Job added to queue: ${job.id}`);
    this.queue.push(job);
    this.processNext();
  }

  async processNext() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    const job = this.queue.shift();
    try {
      await runJob(job);
    } catch (err) {
      console.error(`❌ Queue process error [${job.id}]:`, err.message);
    } finally {
      this.processing = false;
      this.processNext(); // Loop
    }
  }

  cancelJob(jobId) {
    const worker = this.activeWorkers.get(jobId);
    if (worker) {
        console.log(`🛑 Terminating worker for cancelled job: ${jobId}`);
        worker.terminate();
        this.activeWorkers.delete(jobId);
    }
  }
}

export const queue = new JobQueue();

/**
 * Main Job Runner (Spawns Worker)
 */
export const runJob = async (job) => {
  const jobId = job.id;

  // Fetch latest state to ensure it wasn't cancelled while in queue
  const latestJob = getJob(jobId);
  if (latestJob && latestJob.status === "CANCELLED") {
    console.log(`🛑 Skipping cancelled job before start: ${jobId}`);
    return;
  }

  return new Promise((resolve, reject) => {
    console.log(`🚀 Job started (Worker): ${jobId} | topic="${job.topic}"`);

    updateJob(jobId, { status: "RUNNING", startedAt: Date.now() });
    getIO().emit("job:update", { jobId, status: "RUNNING" });

    const workerPath = path.resolve(process.cwd(), "jobs", "job.worker.js");
    const worker = new Worker(workerPath, {
      workerData: { job }
    });

    queue.activeWorkers.set(jobId, worker);

    worker.on("message", (msg) => {
      const io = getIO();
      
      switch (msg.type) {
        case "progress":
          updateJob(jobId, msg.data);
          io.emit("job:progress", { jobId, ...msg.data });
          break;

        case "youtube":
          io.emit("job:youtube", { jobId, ...msg.data });
          break;

        case "completed":
          completeJob(jobId, { output: msg.result, completedAt: Date.now() });
          io.emit("job:update", { jobId, status: "COMPLETED", output: msg.result });
          queue.activeWorkers.delete(jobId);
          resolve(msg.result);
          break;

        case "failed":
          handleFailure(jobId, msg.error);
          queue.activeWorkers.delete(jobId);
          resolve(null);
          break;
      }
    });

    worker.on("error", (err) => {
      console.error(`❌ Worker error [${jobId}]:`, err.message);
      handleFailure(jobId, err.message);
      queue.activeWorkers.delete(jobId);
      resolve(null);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`❌ Worker exited with code ${code} [${jobId}]`);
        // If not already handled by 'message:failed' or 'error'
        const current = getJob(jobId);
        if (current && current.status === "RUNNING") {
            handleFailure(jobId, `Worker exited with code ${code}`);
        }
      }
      queue.activeWorkers.delete(jobId);
    });
  });
};

const handleFailure = (jobId, errorMessage) => {
  const io = getIO();
  console.error(`❌ Job failure: ${jobId} | ${errorMessage}`);
  
  const retries = incrementRetry(jobId);
  const isPermanent = ["quota", "limit", "exceeded", "authorized"].some(
      (k) => errorMessage.toLowerCase().includes(k)
  );

  if (isPermanent || retries > MAX_RETRIES) {
    failJob(jobId, { status: "FAILED", lastError: errorMessage, failedAt: Date.now() });
    io.emit("job:update", { jobId, status: "FAILED", error: errorMessage });
  } else {
    updateJob(jobId, { status: "PAUSED", lastError: errorMessage });
    io.emit("job:update", { jobId, status: "PAUSED", retries });
  }
};

/**
 * Resume jobs that were interrupted on server restart
 */
export const resumePendingJobs = () => {
  console.log("🔄 Checking for interrupted jobs...");
  const jobs = listJobs();
  const interrupted = jobs.filter((j) => j.status === "PENDING" || j.status === "RUNNING");

  if (!interrupted.length) { console.log("✅ No interrupted jobs."); return; }

  console.log(`⚠️ Marking ${interrupted.length} interrupted jobs as PAUSED (Manual start required)...`);
  interrupted.forEach((job) => {
    updateJob(job.id, { status: "PAUSED", lastError: "Interrupted by server restart" });
    // DO NOT queue.add(job) -> Wait for user to click Resume
  });
};
