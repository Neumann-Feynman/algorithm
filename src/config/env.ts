export type DedupeMode = "DAILY_UNIQUE" | "WINDOW_UNIQUE" | "ALL_SUBMISSIONS";
export const API_BASE = process.env.API_BASE ?? "http://localhost:3000";
export const USERS = (process.env.USERS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
export const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL ?? "";
export const TARGET_2WEEKS = Number(process.env.TARGET_2WEEKS ?? 20);
export const TIMEZONE = process.env.TZ ?? "Asia/Seoul";
export const DEDUPE_MODE: DedupeMode = (process.env.DEDUPE_MODE as DedupeMode) || "DAILY_UNIQUE";
