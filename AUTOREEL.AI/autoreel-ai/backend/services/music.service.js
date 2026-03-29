/**
 * music.service.js
 * Auto-downloads royalty-free background music per category from Pixabay.
 * Music is saved to: backend/storage/music/<category>/track.mp3
 *
 * Pixabay Audio API: https://pixabay.com/api/docs/#api_music
 * No API key required for music search (free endpoint).
 */

import axios from "axios";
import fs from "fs";
import path from "path";

const PROJECT_ROOT = process.cwd();
const MUSIC_ROOT = path.join(PROJECT_ROOT, "storage", "music");

// ── CATEGORY → SEARCH QUERY ─────────────────────────────────────────────────
const CATEGORY_QUERIES = {
    motivation: "epic motivational",
    storytelling: "emotional cinematic piano",
    finance: "corporate ambient luxury",
    dark_psychology: "dark suspense thriller",
    ai_news: "futuristic electronic technology",
};

// ── HELPERS ──────────────────────────────────────────────────────────────────

async function downloadFile(url, destPath) {
    const res = await axios.get(url, { responseType: "stream", timeout: 30000 });
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(destPath);
        res.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
}

async function fetchTrackForCategory(category, query) {
    const catDir = path.join(MUSIC_ROOT, category);
    const trackPath = path.join(catDir, "track.mp3");

    // Skip if already downloaded
    if (fs.existsSync(trackPath)) {
        console.log(`🎵 Music already exists for [${category}] — skipping download`);
        return;
    }

    fs.mkdirSync(catDir, { recursive: true });

    try {
        const searchUrl = `https://pixabay.com/api/music/?q=${encodeURIComponent(query)}&per_page=10&page=1`;
        const res = await axios.get(searchUrl, { timeout: 10000 });
        const hits = res.data?.hits || [];

        if (!hits.length) {
            console.warn(`⚠️ No music found for query: "${query}"`);
            return;
        }

        // Pick a random track from the results
        const track = hits[Math.floor(Math.random() * hits.length)];
        const audioUrl = track.audio || track.user_imageURL;

        if (!audioUrl) {
            console.warn(`⚠️ No audio URL found for category: ${category}`);
            return;
        }

        console.log(`📥 Downloading [${category}] music: ${track.title || query}`);
        await downloadFile(audioUrl, trackPath);
        console.log(`✅ Saved: storage/music/${category}/track.mp3`);
    } catch (err) {
        console.error(`❌ Music download failed for [${category}]: ${err.message}`);
    }
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────

/**
 * Initialize background music library.
 * Downloads one track per category if not already present.
 * Call this on server startup (non-blocking).
 */
export const initMusicLibrary = () => {
    fs.mkdirSync(MUSIC_ROOT, { recursive: true });
    console.log("🎵 Initializing music library...");

    // Run async but don't block server startup
    (async () => {
        for (const [category, query] of Object.entries(CATEGORY_QUERIES)) {
            await fetchTrackForCategory(category, query);
        }
        console.log("✅ Music library initialization complete");
    })().catch((err) => {
        console.error("❌ Music library init error:", err.message);
    });
};

/**
 * Get the path to the music track for a given category.
 * Falls back to any .mp3 in storage/music/ if category-specific doesn't exist.
 *
 * @param {string} category
 * @returns {string|null} absolute path to mp3 file, or null
 */
export const getMusicPath = (category) => {
    const catTrack = path.join(MUSIC_ROOT, category, "track.mp3");
    if (fs.existsSync(catTrack)) return catTrack;

    // Fallback: any mp3 in the music root
    try {
        const files = fs.readdirSync(MUSIC_ROOT).filter((f) => f.endsWith(".mp3"));
        if (files.length) return path.join(MUSIC_ROOT, files[0]);
    } catch { }

    return null;
};
