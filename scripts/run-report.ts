import { runReport } from "../src/jobs/report.js";
import fs from "node:fs/promises";

runReport()
  .then(async () => {
    await fs.mkdir("reports", { recursive: true });
    await fs.writeFile("reports/.last-run", new Date().toISOString(), "utf8");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
