// backend/utils/url.js

/**
 * Ensures a URL starts with a protocol (http:// or https://)
 * @param {string} urlStr 
 * @returns {string}
 */
export const formatUrl = (urlStr) => {
  if (!urlStr) return "";
  const trimmed = urlStr.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
};

/**
 * Resolves the service URL dynamically.
 * If base is used (e.g. from the monolith AI_SERVICE_URL), appends the servicePrefix.
 * Adds protocol formatting as a safety measure.
 * 
 * @param {string} envVar - Explicit service URL (e.g. SCRIPT_AI_URL)
 * @param {string} base - Base service URL (e.g. AI_SERVICE_URL)
 * @param {string} servicePrefix - e.g. "script", "video", "voice", "subtitle", "image"
 * @param {string} defaultUrl - Fallback URL (e.g. "http://127.0.0.1:8005")
 * @returns {string}
 */
export const getServiceUrl = (envVar, base, servicePrefix, defaultUrl) => {
  if (envVar) {
    return formatUrl(envVar);
  }
  if (base) {
    const formattedBase = formatUrl(base);
    return `${formattedBase.replace(/\/$/, "")}/${servicePrefix}`;
  }
  return defaultUrl;
};

/**
 * Safely extracts the port number from a URL string.
 * @param {string} urlStr 
 * @returns {number}
 */
export const getPort = (urlStr) => {
  try {
    const formatted = formatUrl(urlStr);
    return Number(new URL(formatted).port || 80);
  } catch (e) {
    return 80;
  }
};
