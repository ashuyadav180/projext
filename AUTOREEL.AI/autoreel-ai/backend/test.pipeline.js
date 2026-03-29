import { runReelPipeline } from "./services/reel.pipeline.js";

(async () => {
  try {
    const result = await runReelPipeline("discipline");
    console.log("🎉 PIPELINE RESULT:", result);
  } catch (err) {
    console.error("❌ PIPELINE FAILED:", err.message);
  }
})();
