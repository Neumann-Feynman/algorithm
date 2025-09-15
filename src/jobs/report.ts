import fs from "node:fs/promises";
import { fetchRecentAccepted } from "../api/leetcode";
import { DISCORD_WEBHOOK_URL, TARGET_FOR_PERIOD, TIMEZONE, USERS, DEDUPE_MODE, PERIOD_DAYS } from "../config/env";
import { kstRangeLastNDays, toKstDateString } from "../utils/date";
import { renderBar, renderDailyTable } from "../utils/markdown";

type Daily = { date: string; count: number };
type UserReport = { user: string; days: Daily[]; total: number; pct: number };

const inRange = (tsSec: number, startTs: number, endTs: number) => tsSec >= startTs && tsSec <= endTs;

function summarize(days: Daily[]) {
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const pct = Math.round((total / TARGET_FOR_PERIOD) * 100);
  return { total, pct };
}

async function buildUserReport(user: string, startTs: number, endTs: number): Promise<UserReport> {
  const periodDays = Math.max(1, PERIOD_DAYS);
  const data = await fetchRecentAccepted(20, user);

  const perDay = new Map<string, number>();
  const { startKst } = kstRangeLastNDays(periodDays, TIMEZONE);
  const cur = new Date(startKst);
  for (let i = 0; i < periodDays; i++) {
    const key = cur.toLocaleDateString("sv-SE", { timeZone: TIMEZONE });
    perDay.set(key, 0);
    cur.setDate(cur.getDate() + 1);
  }

  const seenInWindow = new Set<string>();
  const seenPerDay = new Map<string, Set<string>>();

  for (const s of data.submission) {
    if (s.statusDisplay !== "Accepted") continue;
    const ts = Number(s.timestamp);
    if (!Number.isFinite(ts) || !inRange(ts, startTs, endTs)) continue;

    const day = toKstDateString(ts, TIMEZONE);
    const slug = s.titleSlug;

    switch (DEDUPE_MODE) {
      case "ALL_SUBMISSIONS": {
        perDay.set(day, (perDay.get(day) ?? 0) + 1);
        break;
      }
      case "WINDOW_UNIQUE": {
        if (seenInWindow.has(slug)) break;
        seenInWindow.add(slug);
        perDay.set(day, (perDay.get(day) ?? 0) + 1);
        break;
      }
      case "DAILY_UNIQUE":
      default: {
        let set = seenPerDay.get(day);
        if (!set) {
          set = new Set<string>();
          seenPerDay.set(day, set);
        }
        if (set.has(slug)) break;
        set.add(slug);
        perDay.set(day, (perDay.get(day) ?? 0) + 1);
        break;
      }
    }
  }

  const days: Daily[] = Array.from(perDay, ([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
  const { total, pct } = summarize(days);
  return { user, days, total, pct };
}

export async function runReport() {
  if (USERS.length === 0) throw new Error("No USERS configured (USERS=moo,ryu)");
  const periodDays = Math.max(1, PERIOD_DAYS);
  const { startKst, endKst } = kstRangeLastNDays(periodDays, TIMEZONE);
  const startTs = Math.floor(startKst.getTime() / 1000);
  const endTs = Math.floor(endKst.getTime() / 1000);
  const rangeStartStr = startKst.toLocaleDateString("sv-SE", { timeZone: TIMEZONE });
  const rangeEndStr = endKst.toLocaleDateString("sv-SE", { timeZone: TIMEZONE });

  const reports = await Promise.all(USERS.map((u) => buildUserReport(u, startTs, endTs)));
  const ranked = [...reports].sort((a, b) => b.total - a.total);

  const teamTotal = reports.reduce((sum, r) => sum + r.total, 0);
  const teamTarget = USERS.length * TARGET_FOR_PERIOD;
  const teamPct = Math.round((teamTotal / teamTarget) * 100);

  const todayStr = endKst.toLocaleDateString("sv-SE", { timeZone: TIMEZONE });
  const reportPath = `reports/${todayStr}.md`;

  const md: string[] = [];
  md.push(`# LeetCode Report — ${PERIOD_DAYS} day${PERIOD_DAYS === 1 ? "" : "s"} (${todayStr} KST)`);
  md.push("");
  md.push(`- Range: **${rangeStartStr} ~ ${rangeEndStr}** (${periodDays}일)`);
  md.push(`- Users: ${USERS.join(", ")}`);
  md.push(`- Target per user: **${TARGET_FOR_PERIOD}**`);
  md.push(`- Dedupe policy: **${DEDUPE_MODE}**`);
  md.push("");

  md.push("## Ranking");
  md.push("| Rank | User | Total | % |");
  md.push("|---:|---|---:|---:|");
  ranked.forEach((r, i) => md.push(`| ${i + 1} | ${r.user} | ${r.total} | ${r.pct}% |`));
  md.push("");
  md.push(`**Team total: ${teamTotal} / ${teamTarget} (${teamPct}%)**`);
  md.push("");

  for (const r of ranked) {
    md.push(`## ${r.user}`);
    md.push(`- Total: **${r.total}/${TARGET_FOR_PERIOD} (${r.pct}%)**`);
    md.push("");
    md.push(renderDailyTable(r.days));
    md.push("");
    md.push("### Sparkline");
    md.push(r.days.map((d) => renderBar(d.count)).join(" "));
    md.push("");
  }

  await fs.mkdir("reports", { recursive: true });
  await fs.writeFile(reportPath, md.join("\n"), "utf8");
  await fs.appendFile(
    "reports/SUMMARY.md",
    `- ${todayStr}: ${ranked.map((r) => `${r.user} ${r.total}/${TARGET_FOR_PERIOD} (${r.pct}%)`).join(" | ")}  | Team: ${teamTotal}/${teamTarget} (${teamPct}%)\n`,
    "utf8"
  );

  if (DISCORD_WEBHOOK_URL) {
    const content = [
      `📊 **Algo by Moo&Ryu — ${PERIOD_DAYS}일 리포트**`,
      `Range: ${rangeStartStr} ~ ${rangeEndStr} (KST)`,
      `Target per user: ${TARGET_FOR_PERIOD}, Dedupe: ${DEDUPE_MODE}`,
      `🏆 Ranking: ${ranked.map((r, i) => `${i + 1}) ${r.user} ${r.total}`).join("  |  ")}`,
      `Team: ${teamTotal} / ${teamTarget} (${teamPct}%)`,
      ...reports.map((r) => `• ${r.user}: ${r.days.map((d) => `${d.date.slice(5)}:${d.count}`).join(" | ")}`),
      `Report: \`${reportPath}\``,
    ].join("\n");

    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }).catch(() => {});
  }

  console.log(`✔ report written: ${reportPath} (users: ${USERS.length})`);
}
