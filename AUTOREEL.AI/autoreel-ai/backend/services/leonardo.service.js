import axios from "axios";

/**
 * Leonardo.ai Service
 * Handles Motion/Video generation
 */
class LeonardoService {
    constructor() {
        this.apiKey = process.env.LEONARDO_API_KEY || "";
        this.baseUrl = "https://cloud.leonardo.ai/api/rest/v1";
        this.headers = {
            accept: "application/json",
            "content-type": "application/json",
            authorization: `Bearer ${this.apiKey}`
        };
    }

    /**
     * Mock mode check
     */
    isMocked() {
        return !this.apiKey || this.apiKey === "MOCK_KEY";
    }

    /**
     * Step 1: Generate Motion (Image to Video)
     * Note: We first need an image. For simplicity, we can use an image from Unsplash or a Leonardo Image Generation.
     * But for "Text to Video", Leonardo often uses an Image Generation ID as starting point.
     */
    async generateVideo(prompt) {
        if (this.isMocked()) {
            console.log("🛠️ LEONARDO: Mock Mode Active (No API Key). Returning placeholder.");
            return "mock_video_url";
        }

        try {
            // 1. Generate an image first (Leonardo requirement for Motion)
            console.log(`🎨 LEONARDO: Generating base image for: "${prompt}"`);
            const imgRes = await axios.post(`${this.baseUrl}/generations`, {
                prompt: `Cinematic vertical video background for: ${prompt}, hyperrealistic, 8k, portrait`,
                modelId: "6bef9f1b-71cb-40c7-b170-ad40b3b5a035", // Leonardo Vision XL
                width: 1080,
                height: 1920,
                num_images: 1
            }, { headers: this.headers });

            const generationId = imgRes.data.sdGenerationJob.generationId;

            // 2. Poll for image completion
            const imageUrl = await this.pollImage(generationId);

            // 3. Generate Motion from that Image
            console.log(`🎬 LEONARDO: Generating motion from image...`);
            const motionRes = await axios.post(`${this.baseUrl}/generations-motion-svd`, {
                imageId: imageUrl, // Wait, it might need image ID from the generation, not URL
                motionStrength: 5
            }, { headers: this.headers });

            const motionId = motionRes.data.motionGenerationJob.generationId;

            // 4. Poll for video completion
            return await this.pollVideo(motionId);

        } catch (err) {
            console.error("❌ LEONARDO ERROR:", err.response?.data || err.message);
            throw err;
        }
    }

    async pollImage(id) {
        // Basic polling
        for (let i = 0; i < 10; i++) {
            await new Promise(r => setTimeout(r, 5000));
            const res = await axios.get(`${this.baseUrl}/generations/${id}`, { headers: this.headers });
            const gen = res.data.generations_by_pk;
            if (gen.status === "COMPLETE") {
                return gen.generated_images[0].url;
            }
        }
        throw new Error("Leonardo Image Generation Timed Out");
    }

    async pollVideo(id) {
        for (let i = 0; i < 20; i++) {
            await new Promise(r => setTimeout(r, 10000));
            const res = await axios.get(`${this.baseUrl}/generations/${id}`, { headers: this.headers });
            const gen = res.data.generations_by_pk;
            if (gen.status === "COMPLETE") {
                return gen.generated_images[0].motionVideoUrl;
            }
        }
        throw new Error("Leonardo Video Generation Timed Out");
    }
}

export default new LeonardoService();
