import fs from "fs";
import path from "path";
import { google } from "googleapis";
import youtubeService from "../services/youtube.service.js";

const PROJECT_ROOT = process.cwd();
const CREDENTIALS_PATH = path.join(PROJECT_ROOT, "config", "client_secret.json");

/* ---------- Get Auth URL (for re-authentication) ---------- */
export const getAuthUrl = (req, res) => {
  try {
    const raw = fs.readFileSync(CREDENTIALS_PATH, "utf-8").trim();
    const credentials = JSON.parse(raw);

    const oauth2Client = new google.auth.OAuth2(
      credentials.installed?.client_id || credentials.web?.client_id,
      credentials.installed?.client_secret || credentials.web?.client_secret,
      (credentials.installed?.redirect_uris || credentials.web?.redirect_uris)?.[0]
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent", // forces refresh_token to be returned
      scope: [
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.readonly",
      ],
    });

    return res.json({ success: true, authUrl });
  } catch (err) {
    console.error("❌ Failed to generate auth URL:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/* ---------- OAuth Callback ---------- */
export const oauthCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send("Missing code");

    await youtubeService.handleOAuthCallback(code);
    res.send("✅ YouTube connected successfully. You can close this tab and the upload will work automatically.");
  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth failed: " + err.message);
  }
};

/* ---------- Upload (Immediate or Scheduled) ---------- */
export const uploadToYouTube = async (req, res) => {
  try {
    const { videoPath, title, description, scheduleAt } = req.body;

    if (!videoPath) {
      return res.status(400).json({ success: false, error: "videoPath required" });
    }

    const absolutePath = path.resolve(videoPath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, error: "Video not found" });
    }

    // 🔥 SCHEDULED UPLOAD
    if (scheduleAt) {
      const delay = new Date(scheduleAt).getTime() - Date.now();

      if (delay <= 0) {
        return res.status(400).json({ success: false, error: "Invalid schedule time" });
      }

      setTimeout(async () => {
        try {
          await youtubeService.uploadVideo({
            videoPath: absolutePath,
            title: title || "AutoReel Scheduled Video",
            description: description || "",
          });
          console.log("✅ Scheduled upload completed");
        } catch (err) {
          console.error("❌ Scheduled upload failed", err);
        }
      }, delay);

      return res.json({
        success: true,
        message: "Upload scheduled",
        scheduledAt: scheduleAt,
      });
    }

    // 🚀 IMMEDIATE UPLOAD
    const result = await youtubeService.uploadVideo({
      videoPath: absolutePath,
      title: title || "AutoReel Video",
      description: description || "",
    });

    return res.json({
      success: true,
      youtubeVideoId: result.id,
      youtubeUrl: `https://youtu.be/${result.id}`,
    });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ---------- Get YouTube Connection Status ---------- */
export const getYouTubeStatus = async (req, res) => {
  try {
    const status = await youtubeService.getConnectionStatus();
    res.json({ success: true, ...status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ---------- Disconnect YouTube ---------- */
export const disconnectYouTube = async (req, res) => {
  try {
    const result = await youtubeService.disconnect();
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
