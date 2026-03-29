import fs from "fs";
import path from "path";
import { google } from "googleapis";
import open from "open";

const CREDENTIALS_PATH = path.join(process.cwd(), "config", "client_secret.json");

if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error("❌ config/client_secret.json not found!");
    process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

const SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly"
];

const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
});

console.log("\n🔗 Authorize this app by visiting this url:\n");
console.log(authUrl);
console.log("\n📋 After authorizing, you will be redirected to localhost (which might fail to load).");
console.log("   COPY THE CODE from the address bar (everything after 'code=') and run:");
console.log("\n   node scripts/save_tokens.js YOUR_CODE_HERE\n");

// Try to open automatically
open(authUrl);
