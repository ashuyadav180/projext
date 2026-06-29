import "dotenv/config";
import {
  sendWelcomeEmail,
  sendOtpEmail,
  sendResetPasswordEmail,
  sendVideoReadyEmail,
  sendVideoFailedEmail,
  sendSubscriptionSuccessEmail
} from "../services/emailService.js";

const testRecipient = process.argv[2] || "test@autoreel.ai";

console.log(`🧪 Starting Brevo Email Service Verification Test...`);
console.log(`Recipient: ${testRecipient}`);
console.log(`API Keyconfigured: ${process.env.BREVO_API_KEY ? "Yes" : "No"}`);
console.log(`Senderconfigured: ${process.env.EMAIL_FROM}\n`);

async function runTests() {
  if (!process.env.BREVO_API_KEY) {
    console.error("❌ Error: BREVO_API_KEY is not defined in the environment.");
    process.exit(1);
  }

  try {
    console.log("1. Sending Welcome Email...");
    await sendWelcomeEmail(testRecipient, "Test Creator");
    console.log("✅ Welcome Email sent successfully.\n");

    console.log("2. Sending OTP Verification Email...");
    await sendOtpEmail(testRecipient, "883904");
    console.log("✅ OTP Email sent successfully.\n");

    console.log("3. Sending Password Reset Email...");
    await sendResetPasswordEmail(testRecipient, "https://autoreel.ai/reset-password?token=verification_test");
    console.log("✅ Password Reset Email sent successfully.\n");

    console.log("4. Sending Video Ready Email...");
    await sendVideoReadyEmail(
      testRecipient, 
      "Test Creator", 
      "10 Mindset Principles (v1)", 
      "https://autoreel.ai/storage/reels/mock-reel-123.mp4", 
      "motivation"
    );
    console.log("✅ Video Ready Email sent successfully.\n");

    console.log("5. Sending Video Failed Email...");
    await sendVideoFailedEmail(
      testRecipient, 
      "Test Creator", 
      "Cinematic Reel Prompt", 
      "Leonardo AI image generation timeout (504 Gateway Timeout)"
    );
    console.log("✅ Video Failed Email sent successfully.\n");

    console.log("6. Sending Subscription Success Email...");
    await sendSubscriptionSuccessEmail(testRecipient, "Test Creator", "Pro Plan", "$29.00");
    console.log("✅ Subscription Success Email sent successfully.\n");

    console.log("🎉 All verification email templates sent successfully!");
  } catch (err) {
    console.error("❌ Test failed with error:", err.response?.body || err.message);
    process.exit(1);
  }
}

runTests();
