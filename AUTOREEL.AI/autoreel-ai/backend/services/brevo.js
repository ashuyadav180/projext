import { BrevoClient } from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY;

let brevoClient = null;
if (apiKey) {
  if (apiKey.startsWith("xsmtpsib-")) {
    console.warn(
      "\n⚠️  [Brevo API Warning] BREVO_API_KEY starts with 'xsmtpsib-', which is a Brevo SMTP Key (password) rather than a REST API Key.\n" +
      "   The Brevo Node.js SDK requires a REST API Key (which typically starts with 'xkeysib-').\n" +
      "   Please go to Settings -> SMTP & API -> API Keys tab on your Brevo Dashboard, generate a new API Key, and update your .env file.\n"
    );
  }
  brevoClient = new BrevoClient({ apiKey });
  console.log("📨 Brevo Transactional Email client initialized.");
} else {
  console.warn("⚠️ Warning: BREVO_API_KEY is not defined in the environment.");
}

export default brevoClient;
