import express from "express";
import {
  createJob,
  getJobById,
  getAllJobs,
  cancelJobById,
  retryJobById,
  uploadJobToYoutube
} from "../controllers/job.controller.js";
import { syncPendingUploads } from "../controllers/sync.controller.js";

const router = express.Router();

router.post("/api/jobs", createJob);
router.post("/api/jobs/sync-youtube", syncPendingUploads);
router.post("/api/jobs/:id/cancel", cancelJobById);
router.post("/api/jobs/:id/retry", retryJobById);
router.post("/api/jobs/:id/upload", uploadJobToYoutube);
router.get("/api/jobs", getAllJobs);
router.get("/api/jobs/:id", getJobById);

export default router;
