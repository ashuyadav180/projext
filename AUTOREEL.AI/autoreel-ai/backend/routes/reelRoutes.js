import express from "express";
import { getIO } from "../io-singleton.js";

const router = express.Router();

router.post("/generate-video", async (req, res) => {
  try {
    getIO().emit("progress", { percent: 10, message: "Starting generation..." });

    await new Promise((r) => setTimeout(r, 1000));
    getIO().emit("progress", { percent: 30, message: "Generating audio..." });

    await new Promise((r) => setTimeout(r, 1500));
    getIO().emit("progress", { percent: 60, message: "Burning subtitles..." });

    await new Promise((r) => setTimeout(r, 1500));
    getIO().emit("progress", { percent: 90, message: "Finalizing video..." });

    await new Promise((r) => setTimeout(r, 800));
    getIO().emit("progress", { percent: 100, message: "Done!" });

    res.json({
      success: true,
      video_path: "storage/video/final_video_demo.mp4",
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
