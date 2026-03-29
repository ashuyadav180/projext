import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const SYNCLABS_API_KEY = process.env.SYNCLABS_API_KEY;
const STORAGE_DIR = path.resolve(process.cwd(), "storage", "video");

export const generateLipSync = async (videoUrl, audioUrl) => {
  if (!SYNCLABS_API_KEY) {
    console.warn("⚠️ SYNCLABS_API_KEY not provided. Skipping lip sync and returning original video.");
    return { success: false, videoUrl };
  }

  try {
    console.log(`👄 Starting SyncLabs LipSync for Video: ${videoUrl}`);
    console.log(`   Audio: ${audioUrl}`);

    const response = await axios.post(
      "https://api.synclabs.so/lipsync",
      {
        audioUrl: audioUrl,
        videoUrl: videoUrl,
        synergize: true,      // default sync parameters
        webhookUrl: ""        // synchronous polling if we don't supply webhook (depending on their API)
      },
      {
        headers: {
          "x-api-key": SYNCLABS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const jobId = response.data.id;
    console.log(`✅ SyncLabs job created: ${jobId}. Polling for completion...`);

    // Poll the job status until completed
    const result = await pollSyncLabsJob(jobId);
    
    if (result.success) {
       console.log(`📥 Downloading synced video from SyncLabs...`);
       const localPath = await downloadVideo(result.videoUrl);
       return { success: true, localVideoPath: localPath };
    }
    return result;

  } catch (error) {
    console.error("❌ SyncLabs API Error:", error.response?.data || error.message);
    throw new Error("LIP_SYNC_FAILED");
  }
};

const pollSyncLabsJob = async (jobId) => {
  const maxRetries = 120; // 10 minutes (5s delay * 120)
  for (let i = 0; i < maxRetries; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await axios.get(`https://api.synclabs.so/lipsync/${jobId}`, {
      headers: { "x-api-key": SYNCLABS_API_KEY }
    });

    const status = response.data.status;
    console.log(`   ⏳ SyncLabs job ${jobId} status at ${i*5}s: ${status}`);

    if (status === "COMPLETED") {
      console.log(`✅ SyncLabs LipSync successful! Video URL: ${response.data.videoUrl}`);
      return { success: true, videoUrl: response.data.videoUrl };
    }

    if (status === "FAILED") {
      console.error("❌ SyncLabs LipSync failed:", response.data);
      throw new Error("LIP_SYNC_JOB_FAILED");
    }
  }

  throw new Error("LIP_SYNC_TIMEOUT");
};

// Helper to download the video back to local storage
const downloadVideo = async (url) => {
  const filename = `lipsync_${Date.now()}.mp4`;
  const absolutePath = path.join(STORAGE_DIR, filename);
  
  const writer = fs.createWriteStream(absolutePath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(`storage/video/${filename}`));
    writer.on("error", reject);
  });
};
