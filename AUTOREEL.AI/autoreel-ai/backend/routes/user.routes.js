import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const STORAGE_PATH = path.join(process.cwd(), "storage", "user_profile.json");

// Helper to read profile
const readProfile = () => {
    try {
        if (!fs.existsSync(STORAGE_PATH)) return null;
        return JSON.parse(fs.readFileSync(STORAGE_PATH, "utf-8"));
    } catch (err) {
        console.error("Error reading profile:", err);
        return null;
    }
};

// Helper to write profile
const writeProfile = (data) => {
    try {
        fs.writeFileSync(STORAGE_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error("Error writing profile:", err);
        return false;
    }
};

// GET /api/user/profile
router.get("/profile", (req, res) => {
    let profile = readProfile();
    
    if (!profile) {
        // Return a default profile instead of 404 to prevent blank pages
        profile = {
            displayName: "AutoReel Creator",
            email: "creator@autoreel.ai",
            plan: "Free Plan",
            memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            stats: { totalGenerated: 0, totalPosted: 0, accountAge: "0 Days" },
            preferences: { niche: "Motivation", duration: "10s", voiceLanguage: "English", autoEnhance: true },
            platformStatus: {
                youtube: { status: 'Connect', channel: null, subs: null },
                tiktok: { status: 'Connect', channel: null, subs: null },
                instagram: { status: 'Coming Soon', channel: null, subs: null }
            }
        };
    }
    
    res.json({ success: true, profile });
});

// PATCH /api/user/preferences
router.patch("/preferences", (req, res) => {
    const profile = readProfile();
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    // Update fields (handles deep merging for preferences if needed, but here simple top-level or specific nested)
    const updates = req.body;
    
    // Process updates
    Object.keys(updates).forEach(key => {
        if (key === 'preferences') {
            profile.preferences = { ...profile.preferences, ...updates.preferences };
        } else {
            profile[key] = updates[key];
        }
    });

    if (writeProfile(profile)) {
        res.json({ success: true, profile });
    } else {
        res.status(500).json({ success: false, message: "Failed to save preferences" });
    }
});

// DELETE /api/user/account (Mock)
router.delete("/account", (req, res) => {
    // In a real app, this would delete DB records. Here we just reset to a baseline.
    const baseline = {
        displayName: "AutoReel Creator",
        email: "creator@autoreel.ai",
        plan: "Free Plan",
        preferences: { niche: "Motivation", duration: "10s", voiceLanguage: "English", autoEnhance: true }
    };
    if (writeProfile(baseline)) {
        res.json({ success: true, message: "Account data cleared" });
    } else {
        res.status(500).json({ success: false, message: "Reset failed" });
    }
});

export default router;
