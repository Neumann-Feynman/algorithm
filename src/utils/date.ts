export function toKstDateString(tsSec: number, tz = "Asia/Seoul") {
  return new Date(tsSec * 1000).toLocaleDateString("sv-SE", { timeZone: tz }); // YYYY-MM-DD
}

export function kstRangeLast14Days(tz = "Asia/Seoul") {
  const now = new Date();
  const nowKst = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const start = new Date(nowKst);
  start.setDate(start.getDate() - 13);
  return { startKst: start, endKst: nowKst };
}
