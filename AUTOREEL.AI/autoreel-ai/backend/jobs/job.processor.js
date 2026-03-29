import { createNewJob, updateJob } from "./job.store.js";
import { generateReelPipeline } from "../services/orchestrator.service.js";

/**
 * Process a video generation job.
 */
export const processJob = async (payload) => {
  const { topic, category = "motivation", duration = 60,
          language = "en-US", gender = "male",
          layout = "full", caption_style = "tiktok" } = payload;

  const job = createNewJob(topic, "REEL");

  try {
    console.log(`🧠 Processing job ${job.id} | topic="${topic}" | category=${category}`);

    const result = await generateReelPipeline({
      topic,
      category,
      duration,
      language,
      gender,
      layout,
      caption_style,
    });

    updateJob(job.id, {
      status: result.status || "COMPLETED",
      output: {
        script:    result.script,
        hook:      result.hook,
        scenes:    result.scenes,
        audio:     result.audio,
        subtitles: result.subtitles,
        video:     result.video,
        thumbnail: result.thumbnail,
      }
    });

    console.log(`✅ Job ${job.id} completed → ${result.video}`);
    return job;

  } catch (err) {
    console.error(`❌ Job ${job.id} failed`, err.message);

    updateJob(job.id, {
      status: "FAILED",
      error: err.message
    });

    throw err;
  }
};
