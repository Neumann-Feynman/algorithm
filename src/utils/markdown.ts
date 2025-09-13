export function renderBar(n: number) {
  return n === 0 ? "·" : "█".repeat(Math.min(n, 10));
}

export function renderDailyTable(days: { date: string; count: number }[]) {
  const rows = days.map((d) => `| ${d.date} | ${d.count} |`).join("\n");
  return ["| Date | Count |", "|---|---:|", rows].join("\n");
}
