import axios from "axios";
import path from "path";
import { generateLipSync } from "./synclabs.service.js";

/* AI service URLs — match start_services.bat port assignments */
const SCRIPT_AI_URL   = "http://127.0.0.1:8001";   // Script AI  → port 8001
const VOICE_AI_URL    = "http://127.0.0.1:8002";   // Voice AI   → port 8002
const SUBTITLE_AI_URL = "http://127.0.0.1:8003";   // Subtitle AI → port 8003
const VIDEO_AI_URL    = "http://127.0.0.1:8004";   // Video AI   → port 8004

const axiosInstance = axios.create({ timeout: 900000 }); // 15min — AI generation is slow

const PROJECT_ROOT = path.resolve(process.cwd(), "..");

/* ---------- HELPERS ---------- */
const normalizePath = (abs) => {
  if (!abs || typeof abs !== "string") {
    throw new Error("INVALID_PATH_RECEIVED");
  }
  return path.relative(PROJECT_ROOT, abs).replace(/\\/g, "/");
};

const ensureMinText = (text, min = 30) => {
  let t = text.trim();
  while (t.length < min) t += " " + t;
  return t;
};

const assertPath = (value, label) => {
  if (!value || typeof value !== "string") {
    throw new Error(`${label}_PATH_INVALID`);
  }
};

/* ---------- PIPELINE ---------- */
/**
 * Full Vid.AI-style pipeline:
 * Script AI → Voice AI → Subtitle AI → Video AI
 *
 * @param {Object} payload
 * @param {string} payload.topic       - Topic of the video
 * @param {string} payload.category    - e.g. "motivation", "finance", "dark_psychology"
 * @param {number} payload.duration    - 30 | 60 | 90 seconds
 * @param {string} payload.language    - e.g. "en-US", "hi-IN"
 * @param {string} payload.gender      - "male" | "female"
 * @param {string} payload.layout      - "full" | "split"
 * @param {string} payload.caption_style - "tiktok" | "minimal"
 */
export const generateReelPipeline = async ({
  topic,
  category    = "motivation",
  duration    = 60,
  language    = "en-US",
  gender      = "male",
  layout      = "full",
  caption_style = "tiktok",
  render_mode = "stock",
}) => {
  try {
    /* ── STEP 1: SCRIPT ─────────────────────────────────────────────── */
    console.log(`📜 [1/4] Generating script for "${topic}" [${category}] ${duration}s`);
    const scriptRes = await axiosInstance.post(
      `${SCRIPT_AI_URL}/generate-script`,
      { topic, category, duration }
    );

    if (!scriptRes.data?.script) {
      throw new Error("SCRIPT_AI_INVALID_RESPONSE");
    }

    const script     = scriptRes.data.script;
    const scenes     = scriptRes.data.scenes || [];   // AI scene plan (Phase 2)
    const hook       = scriptRes.data.hook   || "";

    console.log(`✅ Script done (${script.length} chars, ${scenes.length} scenes)`);

    /* ── STEP 2: VOICE ──────────────────────────────────────────────── */
    console.log(`🗣️  [2/4] Generating voice [${language}/${gender}]`);
    const voiceRes = await axiosInstance.post(
      `${VOICE_AI_URL}/generate-voice`,
      { text: script, language, gender }
    );

    assertPath(voiceRes.data?.audio_path, "AUDIO");
    const audioPath = voiceRes.data.audio_path;
    console.log(`✅ Voice done: ${audioPath}`);

    /* ── STEP 3: SUBTITLES ──────────────────────────────────────────── */
    console.log(`📝 [3/4] Generating subtitles`);
    const subtitleRes = await axiosInstance.post(
      `${SUBTITLE_AI_URL}/generate-subtitles`,
      { text: ensureMinText(script) }
    );

    assertPath(subtitleRes.data?.subtitle_path, "SUBTITLE");
    const subtitlePath = subtitleRes.data.subtitle_path;
    console.log(`✅ Subtitles done: ${subtitlePath}`);

    /* ── STEP 4: VIDEO ──────────────────────────────────────────────── */
    console.log(`🎬 [4/4] Generating video [layout=${layout}]`);

    // Build video payload — pass all context including AI scene plan
    const videoPayload = {
      topic,
      category,
      caption_style,
      layout,
      audio_path:    normalizePath(audioPath),
      subtitle_path: normalizePath(subtitlePath),
      render_mode,                   // stock | ai_video
      script,                        // full script → scene segmentation fallback
      scenes_json:   scenes.length > 0 ? JSON.stringify(scenes) : null,  // AI scene plan
    };

    const videoRes = await axiosInstance.post(
      `${VIDEO_AI_URL}/generate-video`,
      videoPayload
    );

    if (videoRes.data?.success === false) {
      throw new Error(videoRes.data.message || videoRes.data.error_code || "VIDEO_GENERATION_FAILED");
    }

    assertPath(videoRes.data?.video_path, "VIDEO");
    const videoPath      = videoRes.data.video_path;
    const thumbnailPath  = videoRes.data.thumbnail_path || null;
    console.log(`✅ Video done: ${videoPath}`);

    /* ── STEP 5: LIP SYNC ───────────────────────────────────────────── */
    let finalVideoPath = videoPath;
    if (process.env.SYNCLABS_API_KEY && process.env.PUBLIC_BASE_URL) {
      console.log(`👄 [5/5] Generating Lip Sync (SyncLabs)`);
      const baseUrl = process.env.PUBLIC_BASE_URL.replace(/\/$/, ""); 
      const publicVideoUrl = `${baseUrl}/${videoPath}`;
      const publicAudioUrl = `${baseUrl}/${audioPath}`;
      
      try {
        const syncRes = await generateLipSync(publicVideoUrl, publicAudioUrl);
        if (syncRes.success && syncRes.localVideoPath) {
          finalVideoPath = syncRes.localVideoPath; 
        }
      } catch(e) {
         console.warn("⚠️ Lip sync failed, falling back to original video:", e.message);
      }
    } else if (process.env.SYNCLABS_API_KEY) {
      console.warn("⚠️ SYNCLABS_API_KEY is set but PUBLIC_BASE_URL is missing! Skipping Lip Sync. (Use ngrok for local testing)");
    } else {
      console.log("ℹ️  Skipping Lip Sync (SyncLabs API key not configured)");
    }

    return {
      status:    "COMPLETED",
      script,
      hook,
      scenes,
      audio:     normalizePath(audioPath),
      subtitles: normalizePath(subtitlePath),
      video:     finalVideoPath,
      thumbnail: thumbnailPath,
    };

  } catch (err) {
    console.error(
      "❌ ORCHESTRATOR ERROR:",
      err.response?.data || err.message
    );
    throw err;
  }
};
