/**
 * scheduler.routes.js — AutoReel.ai
 * API routes for controlling the automation scheduler from the Dashboard.
 *
 * GET  /api/scheduler/status  → current state
 * POST /api/scheduler/start   → configure + unpause
 * POST /api/scheduler/stop    → pause
 */

import express from "express";
import {
    getSchedulerStatus,
    setSchedule,
    pauseScheduler,
    resumeScheduler,
} from "../scheduler/scheduler.service.js";

const router = express.Router();

/** GET /api/scheduler/status */
router.get("/api/scheduler/status", (req, res) => {
    res.json({ success: true, ...getSchedulerStatus() });
});

/** POST /api/scheduler/start
 *  Body: { times: ["06:00","12:00","18:00"], category, language, voiceGender, reelDuration }
 */
router.post("/api/scheduler/start", (req, res) => {
    const { times, category, language, voiceGender, reelDuration } = req.body;
    setSchedule({ times, category, language, voiceGender, reelDuration });
    resumeScheduler();
    res.json({ success: true, message: "Scheduler started", ...getSchedulerStatus() });
});

/** POST /api/scheduler/stop */
router.post("/api/scheduler/stop", (req, res) => {
    pauseScheduler();
    res.json({ success: true, message: "Scheduler paused", ...getSchedulerStatus() });
});

export default router;
