import fs from "node:fs/promises";

const MARK_PATH = "reports/.last-run";
const now = Date.now();
let shouldRun = true;
const periodDays = Number(process.env.PERIOD_DAYS ?? 7);
const windowSec = Math.max(1, periodDays) * 24 * 60 * 60;

try {
  const buf = await fs.readFile(MARK_PATH, "utf8");
  const last = new Date(buf.trim()).getTime();
  if (Number.isFinite(last)) {
    const diffSec = Math.floor((now - last) / 1000);
    if (diffSec < windowSec) shouldRun = false;
    console.log(`last-run: ${new Date(last).toISOString()}, diff: ${diffSec}s, shouldRun=${shouldRun}`);
  }
} catch {
  // 파일이 없으면 첫 실행 → 실행
  console.log("no last-run marker → shouldRun=true");
}

const out = process.env.GITHUB_OUTPUT;
if (out) {
  await fs.appendFile(out, `should_run=${shouldRun}\n`);
} else {
  console.log(`should_run=${shouldRun}`);
}
