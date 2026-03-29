/**
 * reel.pipeline.js — Full $0.85/video Production Orchestrator
 *
 * Stage 1: Script (Gemini Flash)         ~$0.001
 * Stage 2: Scene Plan (Claude Sonnet)    ~$0.002
 * Stage 3: Images (SDXL/Stability AI)    ~$0.070  [7 images × $0.01]
 * Stage 4: img2video (RunwayML)           ~$0.770  [7 clips × $0.11]
 * Stage 5: Voice (ElevenLabs)            ~$0.002
 * Stage 6: Subtitles (Whisper)           $0.000
 * Stage 7: FFmpeg Render                 ~$0.002
 * Stage 8: YouTube Upload                $0.000
 * ──────────────────────────────────────────────
 * Total:                                 ~$0.85/video
 */

import axios from "axios";
import path from "path";
import { generateTitleAndHashtags } from "./gemini.service.js";
import storage from "./storage.service.js";
const { uploadFile, getAbsPath } = storage;

// ── AI Service URLs ────────────────────────────────────────────────────────
const SCRIPT_AI   = process.env.SCRIPT_AI_URL   || "http://127.0.0.1:8005";
const VOICE_AI    = process.env.VOICE_AI_URL    || "http://127.0.0.1:8002";
const SUBTITLE_AI = process.env.SUBTITLE_AI_URL || "http://127.0.0.1:8003";
const VIDEO_AI    = process.env.VIDEO_AI_URL    || "http://127.0.0.1:8004";
const IMAGE_AI    = process.env.IMAGE_AI_URL    || "http://127.0.0.1:8006";

// ── Progress steps (8 stages) ──────────────────────────────────────────────
const STEPS = [
  { name: "Generating Script (Gemini)",    index: 1, total: 8 },
  { name: "Planning Scenes (Claude AI)",   index: 2, total: 8 },
  { name: "Generating Images (SDXL)",      index: 3, total: 8 },
  { name: "Creating Video Clips (Runway)", index: 4, total: 8 },
  { name: "Synthesizing Voice (ElevenLabs)", index: 5, total: 8 },
  { name: "Creating Subtitles",            index: 6, total: 8 },
  { name: "Rendering Final Video (FFmpeg)", index: 7, total: 8 },
  { name: "Uploading to YouTube",          index: 8, total: 8 },
];

/**
 * Run the full $0.85/video production pipeline.
 */
export const runReelPipeline = async (
  topic,
  category     = "motivation",
  language     = "en-US",
  voiceGender  = "male",
  reelDuration = 60,
  checkCancelled = async () => false,
  onProgress     = () => {},
  renderMode     = "ai_video"
) => {
  const progress = (stepIdx, extraPercent = null) => {
    const s = STEPS[stepIdx];
    const percent = extraPercent ?? Math.round((s.index / s.total) * 100);
    onProgress(s.name, s.index, s.total, percent);
  };

  try {
    // ─────────────────────────────────────────────────────────────────────
    // STAGE 1: Script — Gemini Flash
    // ─────────────────────────────────────────────────────────────────────
    if (await checkCancelled()) throw new Error("CANCELLED");
    progress(0);
    console.log(`\n📜 [Stage 1] Script | topic="${topic}" | category=${category}`);

    const scriptRes = await axios.post(`${SCRIPT_AI}/generate-script`, {
      topic, category, duration: reelDuration, language,
    }, { timeout: 30000 });

    if (!scriptRes.data.success) throw new Error(`Stage 1 Script AI: ${scriptRes.data.message}`);

    const script = scriptRes.data.script;
    const hook   = scriptRes.data.hook || "";
    console.log(`✅ [Stage 1] Script: ${script.length} chars`);

    // ─────────────────────────────────────────────────────────────────────
    // STAGE 1b: Title & Hashtags — Gemini
    // ─────────────────────────────────────────────────────────────────────
    const { title, description } = await generateTitleAndHashtags(topic, category, script).catch(() => ({
      title: `${topic} | ${category} #shorts`,
      description: `${script.slice(0, 120)}...\n#shorts #viral`,
    }));
    console.log(`✅ [Stage 1b] Title: "${title}"`);

    // ─────────────────────────────────────────────────────────────────────
    // STAGE 2: Scene Plan — Claude Sonnet
    // ─────────────────────────────────────────────────────────────────────
    if (await checkCancelled()) throw new Error("CANCELLED");
    progress(1);
    console.log(`\n🧠 [Stage 2] Scene Planner (Claude Sonnet)...`);

    let scenes = [];
    try {
      const planRes = await axios.post(`${SCRIPT_AI}/plan-scenes`, {
        script, topic, category, num_scenes: 7,
      }, { timeout: 30000 });

      if (planRes.data.success && planRes.data.scenes?.length > 0) {
        scenes = planRes.data.scenes;
        console.log(`✅ [Stage 2] ${scenes.length} scenes planned by ${planRes.data.provider || "Claude"}`);
      }
    } catch (e) {
      console.warn(`⚠️ [Stage 2] Scene planning failed, using script directly: ${e.message}`);
    }

    // ─────────────────────────────────────────────────────────────────────
    // STAGE 3: Images — SDXL via Stability AI
    // ─────────────────────────────────────────────────────────────────────
    if (await checkCancelled()) throw new Error("CANCELLED");
    progress(2);
    console.log(`\n🎨 [Stage 3] SDXL Image Generation (${scenes.length} images)...`);

    let generatedImages = [];
    if (scenes.length > 0) {
      try {
        const imgRes = await axios.post(`${IMAGE_AI}/generate-images`, {
          scenes: scenes.map((s, i) => ({
            scene_index: s.scene_index ?? i,
            imagePrompt: s.imagePrompt || `cinematic ${topic} ${s.mood || "inspiring"} 4K portrait`,
            mood: s.mood || "inspiring",
            duration_s: s.duration_s || 5,
          })),
          topic,
          category,
        }, { timeout: 300000 }); // 5 min for 7 images

        if (imgRes.data.success) {
          generatedImages = imgRes.data.images;
          const successCount = generatedImages.filter(img => img.image_path).length;
          console.log(`✅ [Stage 3] ${successCount}/${scenes.length} images generated`);
        }
      } catch (e) {
        console.warn(`⚠️ [Stage 3] Image generation failed: ${e.message}`);
      }
    }

    // ─────────────────────────────────────────────────────────────────────
    // STAGE 5: Voice — ElevenLabs
    // ─────────────────────────────────────────────────────────────────────
    if (await checkCancelled()) throw new Error("CANCELLED");
    progress(4);
    console.log(`\n🎙️ [Stage 5] Voice | lang=${language} | gender=${voiceGender}`);

    const voiceRes = await axios.post(`${VOICE_AI}/generate-voice`, {
      text: script, language, gender: voiceGender,
    }, { timeout: 60000 });

    if (!voiceRes.data.success) throw new Error(`Stage 5 Voice AI: ${voiceRes.data.message}`);
    const rawAudioPath = voiceRes.data.audio_path;
    const audioPath = await uploadFile(getAbsPath(rawAudioPath), "audio");
    const voiceProvider = voiceRes.data.provider || "elevenlabs";
    console.log(`✅ [Stage 5] Voice [${voiceProvider}]: ${audioPath}`);

    // ─────────────────────────────────────────────────────────────────────
    // STAGE 6: Subtitles — Whisper
    // ─────────────────────────────────────────────────────────────────────
    if (await checkCancelled()) throw new Error("CANCELLED");
    progress(5);
    console.log(`\n📝 [Stage 6] Subtitles...`);

    const subRes = await axios.post(`${SUBTITLE_AI}/transcribe`, {
      audio_path: audioPath,
    }, { timeout: 30000 });

    if (!subRes.data.success) throw new Error(`Stage 6 Subtitle AI: ${subRes.data.message}`);
    const rawSubtitlePath = subRes.data.subtitle_path;
    const subtitlePath = await uploadFile(getAbsPath(rawSubtitlePath), "subtitles");
    console.log(`✅ [Stage 6] Subtitles: ${path.basename(subtitlePath)}`);

    // ─────────────────────────────────────────────────────────────────────
    // STAGE 4 + 7: RunwayML img2video + FFmpeg Render
    //   If we have SDXL images → use /render-full (Runway + FFmpeg)
    //   Fallback → /generate-video (Pexels stock + FFmpeg)
    // ─────────────────────────────────────────────────────────────────────
    if (await checkCancelled()) throw new Error("CANCELLED");
    progress(3);

    let videoRelPath, videoAbsPath, thumbnailPath;
    const hasImages = generatedImages.filter(img => img.image_path).length > 0;

    if (hasImages) {
      // Full Runway img2video pipeline
      console.log(`\n🎬 [Stage 4+7] RunwayML img2video + FFmpeg render...`);
      progress(6);

      const renderRes = await axios.post(`${VIDEO_AI}/render-full`, {
        images: generatedImages,
        audio_path: getAbsPath(audioPath),
        subtitle_path: getAbsPath(subtitlePath),
        category,
        topic,
        caption_style: "tiktok",
      }, { timeout: 3600000 }); // 60 min — 7 Runway clips take time

      if (!renderRes.data?.success) {
        throw new Error(`Stage 4+7 render-full: ${renderRes.data?.message || "Unknown error"}`);
      }

      videoRelPath  = renderRes.data.video_path;
      thumbnailPath = renderRes.data.thumbnail_path || null;
      console.log(`✅ [Stage 4+7] Rendered: ${videoRelPath}`);

    } else {
      // Fallback: stock video pipeline (Pexels)
      console.log(`\n📦 [Stage 7 Fallback] No SDXL images — using Pexels stock + FFmpeg...`);
      progress(6);

      const videoRes = await axios.post(`${VIDEO_AI}/generate-video`, {
        topic, category,
        audio_path:    audioPath,
        subtitle_path: subtitlePath,
        template:      category,
        caption_style: "tiktok",
        layout:        "full",
        render_mode:   "stock",
        script,
        scenes_json:   scenes.length > 0 ? JSON.stringify(scenes) : null,
      }, { timeout: 900000 });

      if (!videoRes.data?.success) {
        throw new Error(`Stage 7 generate-video: ${videoRes.data?.message || "Unknown error"}`);
      }

      videoRelPath  = videoRes.data.video_path;
      thumbnailPath = videoRes.data.thumbnail_path || null;
      console.log(`✅ [Stage 7 Fallback] Stock render done: ${videoRelPath}`);
    }

    videoAbsPath = getAbsPath(videoRelPath);

    // ─────────────────────────────────────────────────────────────────────
    // COMPLETE: Return result
    // ─────────────────────────────────────────────────────────────────────
    return {
      script,
      hook,
      scenes,
      images: generatedImages,
      audio:       audioPath,
      subtitles:   subtitlePath,
      video:       videoAbsPath,
      videoRel:    videoRelPath,
      thumbnail:   thumbnailPath,
      title,
      description,
      category,
      language,
    };

  } catch (err) {
    console.error("❌ PIPELINE ERROR:", err.response?.data || err.message);
    throw err;
  }
};
