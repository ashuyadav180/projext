import { runReelPipeline } from "../services/reel.pipeline.js";
import uploadService from "../services/youtube.service.js";
const { uploadVideo } = uploadService;
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load .env from backend root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const TOPIC = "History of Coffee";

console.log(`🚀 Starting manual pipeline test for topic: "${TOPIC}"`);

const run = async () => {
    try {
        // 1. Generate Video
        console.log("🎬 Generating video...");
        const result = await runReelPipeline(TOPIC);

        console.log("✅ Video Generated!");
        console.log("Script:", result.script.slice(0, 50) + "...");
        console.log("Video Path:", result.video);
        console.log("Title:", result.title);

        // Check if video file exists
        const absVideoPath = path.resolve(process.cwd(), result.video);
        if (fs.existsSync(absVideoPath)) {
            console.log("📁 Video file confirmed on disk.");
        } else {
            console.error("❌ Video file NOT found at:", absVideoPath);
        }

        // 2. Test Upload (Optional)
        // Only if credentials exist
        const CREDENTIALS_PATH = path.resolve(process.cwd(), "config/client_secret.json");
        console.log("Checking for credentials at:", CREDENTIALS_PATH);
        if (fs.existsSync(CREDENTIALS_PATH)) {
            console.log("📤 Attempting YouTube Upload (Credentials found)...");
            try {
                const uploadRes = await uploadVideo({
                    videoPath: result.video,
                    title: result.title,
                    description: result.description
                });
                console.log("✅ Upload Successful:", `https://youtu.be/${uploadRes.id}`);
            } catch (e) {
                console.error("⚠️ Upload failed (expected if no valid token/quota):", e.message);
            }
        } else {
            console.log("ℹ️ Skipping upload test (No client_secret.json found).");
        }

    } catch (err) {
        console.error("❌ Test Failed:", err);
    }
};

run().then(() => {
    console.log("🏁 Test script finished execution.");
}).catch(err => {
    console.error("💥 Fatal error in test script:", err);
});
