export function toKstDateString(tsSec: number, tz = "Asia/Seoul") {
  return new Date(tsSec * 1000).toLocaleDateString("sv-SE", { timeZone: tz }); // YYYY-MM-DD
}

export function kstRangeLastNDays(days: number, tz = "Asia/Seoul") {
  const now = new Date();
  const nowKst = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const start = new Date(nowKst);
  const span = Math.max(1, Math.floor(days));
  start.setDate(start.getDate() - (span - 1));
  return { startKst: start, endKst: nowKst };
}
