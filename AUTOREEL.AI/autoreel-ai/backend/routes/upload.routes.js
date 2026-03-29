import express from "express";
import { oauthCallback, uploadToYouTube, getAuthUrl, getYouTubeStatus, disconnectYouTube } from "../controllers/uploadController.js";

const router = express.Router();

// Step 1: Get YouTube auth URL (visit this to re-authenticate)
router.get("/youtube/auth", getAuthUrl);

// Step 2: OAuth callback (Google redirects here after login)
router.get("/youtube/callback", oauthCallback);

// Step 3: Manual upload endpoint
router.post("/upload/youtube", uploadToYouTube);

// Connection management
router.get("/youtube/status", getYouTubeStatus);
router.post("/youtube/disconnect", disconnectYouTube);

export default router;
