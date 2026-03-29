import fs from "fs";
import path from "path";
import { google } from "googleapis";

const code = process.argv[2];

if (!code) {
    console.error("❌ Usage: node scripts/save_tokens.js <AUTH_CODE>");
    process.exit(1);
}

const CREDENTIALS_PATH = path.join(process.cwd(), "config", "client_secret.json");
const TOKEN_PATH = path.join(process.cwd(), "config", "youtube.oauth.json");

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

async function saveTokens() {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
        console.log("✅ Tokens saved to config/youtube.oauth.json");
        console.log("🎉 You can now enable YouTube uploads!");
    } catch (error) {
        console.error("❌ Error retrieving access token:", error.message);
    }
}

saveTokens();
