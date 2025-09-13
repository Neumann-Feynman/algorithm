export const API_BASE = process.env.API_BASE ?? "http://localhost:3000";
export const LEETCODE_USERNAME = process.env.LEETCODE_USERNAME ?? "";
export const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL ?? "";
export const TARGET_2WEEKS = Number(process.env.TARGET_2WEEKS ?? 20);
export const TIMEZONE = process.env.TZ ?? "Asia/Seoul";
export const DEDUPE = (process.env.DEDUPE ?? "true") === "true";
