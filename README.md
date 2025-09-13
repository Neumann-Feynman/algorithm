# Algo by Moo & Ryu 🧩

> Automated Biweekly LeetCode Study Reports

This repository tracks Moo & Ryu’s progress on [LeetCode](https://leetcode.com),  
automatically generating **biweekly reports** of solved problems,  
with results shared to both **Discord** and **GitHub**.

---

## 📌 Features

- **LeetCode API Integration**
  - Powered by the Docker image `alfaarghya/alfa-leetcode-api:2.0.1` to fetch submission data
- **Bun-based Scripts**
  - `scripts/run-biweekly.ts` aggregates problem-solving activity over 2 weeks
- **Automated Workflow**
  - GitHub Actions (self-hosted runner)
  - Runs daily at 10:00 KST, with an internal gate to ensure reports are only generated every 14 days
- **Result Management**
  - Markdown reports are auto-committed into the `reports/` folder
  - Discord notifications via Webhook

---

## 📂 Project Structure

```
.
├── reports/                  # 📊 Auto-generated reports
│   ├── 2025-09-13.md
│   ├── 2025-09-27.md
│   └── ...
├── scripts/
│   ├── run-biweekly.ts       # Main reporting script
│   ├── biweekly_gate.mjs     # 14-day gating logic
│   └── ...
├── src/                      # TypeScript source
│   ├── api/                  # API client
│   ├── jobs/                 # Aggregation logic
│   ├── types/                # Type definitions
│   └── utils/                # Utilities
└── .github/
    └── workflows/
        └── biweekly-leetcode.yml   # GitHub Actions workflow
```

---

## ⚙️ Usage

### 1. Run the LeetCode API container

```bash
docker run -d --name leet-api -p 3000:3000 alfaarghya/alfa-leetcode-api:2.0.1
```

### 2. Execute the Bun script locally

```bash
bun scripts/run-biweekly.ts
```

### 3. Automate with GitHub Actions

- Workflow: `.github/workflows/biweekly-leetcode.yml`
- Schedule: Daily at 10:00 KST
- Gate step (`biweekly_gate.mjs`) ensures exact 14-day intervals

---

## 🔑 Environment Variables

| Variable              | Description                         | Example                 |
| --------------------- | ----------------------------------- | ----------------------- |
| `API_BASE`            | Base URL for LeetCode API           | `http://localhost:3000` |
| `USERS`               | User IDs (comma-separated)          | `moo,ryu`               |
| `DISCORD_WEBHOOK_URL` | Discord Webhook URL                 | _(stored as Secret)_    |
| `TARGET_2WEEKS`       | Goal for problems solved in 2 weeks | `10`                    |
| `TZ`                  | Timezone                            | `Asia/Seoul`            |
| `DEDUPE_MODE`         | Deduplication mode                  | `WINDOW_UNIQUE`         |

Secrets are stored in GitHub Repository Settings → **Secrets and variables → Actions**.

---

## 📊 Reports

- The latest reports are available in the [**reports/**](./reports) directory.
- Each report file is named `YYYY-MM-DD.md`.
  - Example: [2025-09-13.md](./reports/2025-09-13.md)

---

## 🤝 Contributing & License

- Built for personal study purposes
- Contributions are limited to Moo & Ryu
- License: MIT
