import { generateReelPipeline } from "../services/orchestrator.service.js";
import { getIO } from "../io-singleton.js";

export const generateReel = async (req, res) => {
  try {
    const { topic, template } = req.body;

    /* ---------- VALIDATION ---------- */
    if (!topic || typeof topic !== "string" || topic.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error_code: "INVALID_TOPIC",
        message: "Topic must be at least 3 characters long"
      });
    }

    if (
      template &&
      !["motivation", "dark", "facts"].includes(template)
    ) {
      return res.status(400).json({
        success: false,
        error_code: "INVALID_TEMPLATE",
        message: "Invalid template"
      });
    }

    /* ---------- PIPELINE ---------- */
    const result = await generateReelPipeline(
      topic.trim(),
      { template },
      getIO()
    );

    return res.json({
      success: true,
      data: {
        topic: topic.trim(),
        template: result.template,
        script: result.script,
        audio_path: result.audio,
        subtitle_path: result.subtitles,
        video_path: result.video
      }
    });

  } catch (error) {
    console.error("❌ REEL ERROR:", error.message);

    return res.status(500).json({
      success: false,
      error_code: "REEL_GENERATION_FAILED",
      message: error.message
    });
  }
};
