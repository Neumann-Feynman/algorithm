export function toKstDateString(tsSec: number, tz = "Asia/Seoul") {
  return new Date(tsSec * 1000).toLocaleDateString("sv-SE", { timeZone: tz }); // YYYY-MM-DD
}

export function kstRangeLastNDays(days: number, tz = "Asia/Seoul", endKstOverride?: Date) {
  const now = new Date();
  const nowKst = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const span = Math.max(1, Math.floor(days));
  const report = endKstOverride ? new Date(endKstOverride) : new Date(nowKst);
  const end = new Date(report);
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - (span - 1));
  return { startKst: start, endKst: end, reportKst: report };
}
