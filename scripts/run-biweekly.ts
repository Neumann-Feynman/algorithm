import { runBiweeklyReport } from "../src/jobs/biweeklyReport.js";
import fs from "node:fs/promises";

runBiweeklyReport()
  .then(async () => {
    // ✅ 리포트 성공 시 마지막 실행 시각 기록
    await fs.mkdir("reports", { recursive: true });
    await fs.writeFile("reports/.last-run", new Date().toISOString(), "utf8");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
