import fs from "node:fs/promises";
import { RUN_DATE } from "../src/config/env.js";
import { runReport } from "../src/jobs/report.js";

runReport()
  .then(async () => {
    await fs.mkdir("reports", { recursive: true });
    await fs.writeFile("reports/.last-run", RUN_DATE ? new Date(RUN_DATE).toISOString() : new Date().toISOString(), "utf8");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
