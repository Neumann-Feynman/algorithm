import fs from "node:fs/promises";
import { fetchRecentAccepted } from "../api/leetcode";
import { DEDUPE, DISCORD_WEBHOOK_URL, TARGET_2WEEKS, TIMEZONE } from "../config/env";
import { kstRangeLast14Days, toKstDateString } from "../utils/date";
import { renderBar, renderDailyTable } from "../utils/markdown";

export async function runBiweeklyReport() {
  const { startKst, endKst } = kstRangeLast14Days(TIMEZONE);
  const startTs = Math.floor(startKst.getTime() / 1000);
  const endTs = Math.floor(endKst.getTime() / 1000);

  const data = await fetchRecentAccepted(20);
  const perDay = new Map<string, Set<string> | number>();

  const inRange = (t: number) => t >= startTs && t <= endTs;

  for (const s of data.submission) {
    if (s.statusDisplay !== "Accepted") continue;
    const ts = Number(s.timestamp);
    if (!Number.isFinite(ts) || !inRange(ts)) continue;

    const day = toKstDateString(ts, TIMEZONE);
    if (!perDay.has(day)) perDay.set(day, DEDUPE ? new Set() : 0);

    if (DEDUPE) (perDay.get(day) as Set<string>).add(s.titleSlug);
    else perDay.set(day, (perDay.get(day) as number) + 1);
  }

  const days: { date: string; count: number }[] = [];
  const cur = new Date(startKst);
  for (let i = 0; i < 14; i++) {
    const key = cur.toLocaleDateString("sv-SE", { timeZone: TIMEZONE });
    const v = perDay.get(key);
    const count = DEDUPE ? (v as Set<string>)?.size ?? 0 : (v as number) ?? 0;
    days.push({ date: key, count });
    cur.setDate(cur.getDate() + 1);
  }

  const total = days.reduce((s, d) => s + d.count, 0);
  const pct = Math.round((total / TARGET_2WEEKS) * 100);
  const todayStr = endKst.toLocaleDateString("sv-SE", { timeZone: TIMEZONE });
  const reportPath = `reports/${todayStr}.md`;

  const md = [
    `# Biweekly LeetCode Report (${todayStr} KST)`,
    ``,
    `- Range: **${startKst.toLocaleDateString("sv-SE", { timeZone: TIMEZONE })} ~ ${endKst.toLocaleDateString("sv-SE", { timeZone: TIMEZONE })}** (14일)`,
    `- Dedupe: **${DEDUPE}**`,
    `- Total: **${total}/${TARGET_2WEEKS} (${pct}%)**`,
    ``,
    `## Daily Counts`,
    renderDailyTable(days),
    ``,
    `## Sparkline`,
    days.map((d) => renderBar(d.count)).join(" "),
  ].join("\n");

  await fs.mkdir("reports", { recursive: true });
  await fs.writeFile(reportPath, md, "utf8");
  await fs.appendFile("reports/SUMMARY.md", `- ${todayStr}: ${total}/${TARGET_2WEEKS} (${pct}%)\n`, "utf8");

  if (DISCORD_WEBHOOK_URL) {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: [
          `📊 **Algorithm by Neumann-Feynman — 2주 리포트**`,
          `Range: ${days[0]?.date} ~ ${days[days.length - 1]?.date} (KST)`,
          `Total: **${total}/${TARGET_2WEEKS} (${pct}%)** — Dedupe: ${DEDUPE}`,
          `Daily: ${days.map((d) => `${d.date.slice(5)}:${d.count}`).join(" | ")}`,
          `Report: \`${reportPath}\``,
        ].join("\n"),
      }),
    }).catch(() => {});
  }

  console.log(`✔ report written: ${reportPath} (total ${total})`);
}
