import fs from "fs";
import path from "path";

/* ---------------- CONFIG ---------------- */

const STORAGE_DIRS = [
  "storage/audio",
  "storage/video",
  "storage/subtitles",
  "storage/tmp"
];

// files older than this will be deleted (in ms)
const MAX_FILE_AGE = 24 * 60 * 60 * 1000; // 24 hours

// safety limit (in bytes)
const MAX_TOTAL_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

/* ---------------- HELPERS ---------------- */

const getDirSize = (dir) => {
  let size = 0;
  if (!fs.existsSync(dir)) return 0;

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      size += getDirSize(fullPath);
    } else {
      size += stat.size;
    }
  }
  return size;
};

/* ---------------- CLEANUP ---------------- */

export const cleanupOldFiles = () => {
  const now = Date.now();

  for (const relDir of STORAGE_DIRS) {
    const dir = path.resolve(relDir);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (!stat.isFile()) continue;

      const age = now - stat.mtimeMs;
      if (age > MAX_FILE_AGE) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`🧹 Deleted old file: ${fullPath}`);
        } catch (err) {
          console.warn(`⚠️ Failed to delete ${fullPath}`);
        }
      }
    }
  }
};

/* ---------------- DISK GUARD ---------------- */

export const enforceDiskLimit = () => {
  let totalSize = 0;

  for (const relDir of STORAGE_DIRS) {
    totalSize += getDirSize(path.resolve(relDir));
  }

  if (totalSize > MAX_TOTAL_SIZE) {
    console.warn("⚠️ Disk limit exceeded. Triggering cleanup.");
    cleanupOldFiles();
  }
};
