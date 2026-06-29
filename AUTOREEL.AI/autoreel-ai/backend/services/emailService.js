import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import apiInstance from "./brevo.js";

// Handle ES Modules __dirname resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.join(__dirname, "templates");

/**
 * Load HTML template and replace tokens
 * @param {string} templateName 
 * @param {Object} replacements 
 * @returns {string}
 */
const loadTemplate = (templateName, replacements = {}) => {
  const templatePath = path.join(TEMPLATE_DIR, templateName);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found at ${templatePath}`);
  }
  
  let html = fs.readFileSync(templatePath, "utf-8");
  
  // Replace all occurrences of {{token}} with the replacement value
  Object.keys(replacements).forEach((key) => {
    const value = replacements[key];
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
    html = html.replace(regex, value !== undefined && value !== null ? value : "");
  });
  
  return html;
};

/**
 * Send a transactional email using Brevo
 * @param {Object} options 
 * @param {string} options.toEmail 
 * @param {string} [options.toName] 
 * @param {string} options.subject 
 * @param {string} options.htmlContent 
 */
export const sendEmail = async ({ toEmail, toName, subject, htmlContent }) => {
  if (!process.env.BREVO_API_KEY) {
    console.warn("⚠️ Brevo API Key not configured. Skipping email send for:", toEmail);
    return { success: false, reason: "BREVO_API_KEY is not defined" };
  }

  const senderEmail = process.env.EMAIL_FROM || "noreply@autoreel.ai";
  
  const sendSmtpEmail = {
    sender: { email: senderEmail, name: "AUTOREEL.AI" },
    to: [{ email: toEmail, name: toName || toEmail.split("@")[0] }],
    subject,
    htmlContent,
  };

  try {
    const response = await apiInstance.transactionalEmails.sendTransacEmail(sendSmtpEmail);
    console.log(`✉️ Email successfully sent to ${toEmail}. Message ID:`, response.messageId);
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.error(`❌ Failed to send email to ${toEmail}:`, error.response?.body || error.message);
    throw error;
  }
};

/**
 * Send Welcome Email
 * @param {string} toEmail 
 * @param {string} name 
 */
export const sendWelcomeEmail = async (toEmail, name) => {
  const dashboardUrl = process.env.PUBLIC_BASE_URL || "http://localhost:5173";
  const htmlContent = loadTemplate("welcome.html", { name, dashboardUrl });
  
  return sendEmail({
    toEmail,
    toName: name,
    subject: "Welcome to AUTOREEL.AI! 🚀",
    htmlContent
  });
};

/**
 * Send OTP Verification Email
 * @param {string} toEmail 
 * @param {string} otpCode 
 */
export const sendOtpEmail = async (toEmail, otpCode) => {
  const htmlContent = loadTemplate("otpVerification.html", { otpCode });
  
  return sendEmail({
    toEmail,
    subject: `Verify Your Email: ${otpCode} - AUTOREEL.AI`,
    htmlContent
  });
};

/**
 * Send Password Reset Email
 * @param {string} toEmail 
 * @param {string} resetLink 
 */
export const sendResetPasswordEmail = async (toEmail, resetLink) => {
  const htmlContent = loadTemplate("resetPassword.html", { resetLink });
  
  return sendEmail({
    toEmail,
    subject: "Reset Your AUTOREEL.AI Password 🔑",
    htmlContent
  });
};

/**
 * Send Video Ready Email
 * @param {string} toEmail 
 * @param {string} name 
 * @param {string} videoTitle 
 * @param {string} videoUrl 
 * @param {string} [niche] 
 */
export const sendVideoReadyEmail = async (toEmail, name, videoTitle, videoUrl, niche = "General") => {
  const htmlContent = loadTemplate("videoReady.html", {
    name,
    videoTitle,
    niche,
    videoUrl
  });
  
  return sendEmail({
    toEmail,
    toName: name,
    subject: "🎬 Your AI video is ready to watch! - AUTOREEL.AI",
    htmlContent
  });
};

/**
 * Send Video Failed Email
 * @param {string} toEmail 
 * @param {string} name 
 * @param {string} videoTopic 
 * @param {string} errorMessage 
 */
export const sendVideoFailedEmail = async (toEmail, name, videoTopic, errorMessage) => {
  const dashboardUrl = process.env.PUBLIC_BASE_URL || "http://localhost:5173";
  const htmlContent = loadTemplate("videoFailed.html", {
    name,
    videoTopic,
    errorMessage,
    dashboardUrl
  });
  
  return sendEmail({
    toEmail,
    toName: name,
    subject: "⚠️ Video generation failed - AUTOREEL.AI",
    htmlContent
  });
};

/**
 * Send Subscription Success Email
 * @param {string} toEmail 
 * @param {string} name 
 * @param {string} planName 
 * @param {string} price 
 */
export const sendSubscriptionSuccessEmail = async (toEmail, name, planName, price) => {
  const dashboardUrl = process.env.PUBLIC_BASE_URL || "http://localhost:5173";
  const htmlContent = loadTemplate("subscription.html", {
    name,
    planName,
    price,
    dashboardUrl
  });
  
  return sendEmail({
    toEmail,
    toName: name,
    subject: "⚡ Subscription Upgrade Confirmed! - AUTOREEL.AI",
    htmlContent
  });
};
