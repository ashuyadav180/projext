import { parentPort, workerData } from "worker_threads";
import fs from "fs";
import path from "path";
import axios from "axios";

// We need to import the pipeline and storage logic
import { runReelPipeline } from "../services/reel.pipeline.js";
import uploadService from "../services/youtube.service.js";
const { uploadVideo } = uploadService;

const VIDEO_AI_URL = process.env.VIDEO_AI_URL || "http://127.0.0.1:8004";
const CREDITS_PATH = "storage/credits.json";

/**
 * Deduct credits - simplified for worker
 * Note: Since this writes to a file, we might have contention if multiple workers do it.
 * In a real app, this should be in the main thread or use a DB.
 */
const deductRunwayCredit = () => {
    try {
        if (!fs.existsSync(CREDITS_PATH)) return;
        const data = JSON.parse(fs.readFileSync(CREDITS_PATH, "utf-8"));
        data.runway.used += 1;
        data.runway.lastUpdated = new Date().toISOString();
        fs.writeFileSync(CREDITS_PATH, JSON.stringify(data, null, 2));
    } catch (e) { console.error("Worker: Failed to deduct credit:", e); }
};

async function start() {
    const { job } = workerData;
    const jobId = job.id;

    console.log(`🧵 Worker started for job: ${jobId}`);

    try {
        if (job.type === "PROMPT_TO_VIDEO") {
            await runPromptToVideoJob(job);
        } else {
            await runStandardJob(job);
        }
    } catch (err) {
        const msg = err.message || "WORKER_ERROR";
        parentPort.postMessage({ type: "failed", error: msg });
    }
}

async function runStandardJob(job) {
    const jobId = job.id;

    const onProgress = (currentStep, index, total, percent) => {
        parentPort.postMessage({ 
            type: "progress", 
            data: { currentStep, stepIndex: index, stepTotal: total, percent } 
        });
    };

    const result = await runReelPipeline(
        job.topic,
        job.category || "motivation",
        job.language || "en-US",
        job.voiceGender || "male",
        job.reelDuration || 60,
        async () => {
             // Cancellation check
             // This is tricky in a worker. We'll rely on the parent to terminate the worker
             // but the pipeline has a callback. We can pass a flag via a shared buffer if needed
             // or just check a variable that we set when parent sends a 'cancel' message.
             return false; 
        },
        onProgress,
        job.renderMode || "stock"
    );

    // YouTube Upload logic
    if (result.video) {
        const CATEGORY_TAGS = {
            motivation:      ["motivation", "mindset", "discipline", "success", "shorts", "viral"],
            storytelling:    ["story", "inspiration", "transformation", "shorts", "viral"],
            finance:         ["finance", "money", "investing", "wealth", "shorts", "viral"],
            dark_psychology: ["psychology", "mindset", "darkpsychology", "awareness", "shorts"],
            ai_news:         ["ai", "artificialintelligence", "tech", "chatgpt", "shorts", "viral"],
        };
        const tags = CATEGORY_TAGS[result.category] || ["shorts", "viral", "motivation"];

        if (!job.isMock) {
            try {
                parentPort.postMessage({ type: "progress", data: { currentStep: "Uploading to YouTube", percent: 98 } });

                const uploadResult = await uploadVideo({
                    videoPath:   result.video,
                    title:       result.title,
                    description: result.description,
                    tags,
                });

                result.youtubeId  = uploadResult.id;
                result.youtubeUrl = `https://youtu.be/${uploadResult.id}`;
                
                parentPort.postMessage({ type: "youtube", data: { youtubeId: result.youtubeId, youtubeUrl: result.youtubeUrl } });
            } catch (uploadErr) {
                console.error("Worker: YouTube upload failed:", uploadErr.message);
                result.uploadError = uploadErr.message;
            }
        }
    }

    parentPort.postMessage({ type: "completed", result });
}

async function runPromptToVideoJob(job) {
    const jobId = job.id;

    parentPort.postMessage({ type: "progress", data: { currentStep: "Initializing generation...", percent: 10 } });
    parentPort.postMessage({ type: "progress", data: { currentStep: "Requesting AI Video Generation...", percent: 30 } });

    const response = await axios.post(`${VIDEO_AI_URL}/generate-raw-clip`, {
        prompt: job.topic,
        duration: job.reelDuration || 5
    }, { timeout: 600000 });

    if (!response.data.success) {
        throw new Error(response.data.message || "Video generation failed");
    }

    deductRunwayCredit();

    const result = {
        video: response.data.video_path,
        title: job.topic.substring(0, 50),
        description: `AI Generated video for: ${job.topic}`,
        category: job.category || "motivation"
    };

    parentPort.postMessage({ type: "progress", data: { currentStep: "Finalizing clip...", percent: 90 } });
    parentPort.postMessage({ type: "completed", result });
}

start();
