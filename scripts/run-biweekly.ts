import { runBiweeklyReport } from "../src/jobs/biweeklyReport.js";

runBiweeklyReport().catch((e) => {
  console.error(e);
  process.exit(1);
});
