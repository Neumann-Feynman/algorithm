export type DedupeMode = "DAILY_UNIQUE" | "WINDOW_UNIQUE" | "ALL_SUBMISSIONS";
export const API_BASE = process.env.API_BASE ?? "http://localhost:3000";
export const USERS = (process.env.USERS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
export const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL ?? "";
export const TIMEZONE = process.env.TZ ?? "Asia/Seoul";
export const DEDUPE_MODE: DedupeMode = (process.env.DEDUPE_MODE as DedupeMode) || "DAILY_UNIQUE";

// Reporting period configuration
// Default period is 1 week; user can set any number of weeks via PERIOD_WEEKS
export const PERIOD_DAYS = Number(process.env.PERIOD_DAYS ?? 7);

// Target configuration
export const TARGET_FOR_PERIOD = Number(process.env.TARGET_FOR_PERIOD ?? 7);
export const RUN_DATE = process.env.RUN_DATE ?? ""; // YYYY-MM-DD in TZ
