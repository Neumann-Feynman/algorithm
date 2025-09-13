# Algo by Moo & Ryu 🧩

> Biweekly LeetCode Study Report Automation

이 저장소는 [LeetCode](https://leetcode.com)에서 Moo & Ryu의 문제 풀이 현황을 **2주 단위**로 집계하고,  
자동으로 Discord 및 GitHub에 리포트를 기록하는 프로젝트입니다.

---

## 📌 기능

- **LeetCode API 연동**
  - Docker 기반 `alfaarghya/alfa-leetcode-api:2.0.1` 컨테이너에서 제출 내역을 수집
- **Bun 기반 스크립트**
  - `scripts/run-biweekly.ts` 실행 → 2주간의 문제 풀이 기록 집계
- **자동화 파이프라인**
  - GitHub Actions (self-hosted runner)
  - 매일 오전 10시(KST) 실행, 내부 게이트로 정확히 **14일마다 리포트 생성**
- **결과물 관리**
  - `reports/` 폴더에 마크다운 리포트 자동 커밋
  - Discord Webhook으로 알림 전송

---

## 📂 디렉토리 구조

```
.
├── reports/                  # 📊 자동 생성된 리포트 저장소
│   ├── 2025-09-13.md
│   ├── 2025-09-27.md
│   └── ...
├── scripts/
│   ├── run-biweekly.ts       # 메인 리포트 실행 스크립트
│   ├── biweekly_gate.mjs     # 14일 게이트 스크립트
│   └── ...
├── src/                      # TypeScript 소스코드
│   ├── api/                  # API 클라이언트
│   ├── jobs/                 # 집계 로직
│   ├── types/                # 타입 정의
│   └── utils/                # 유틸리티
└── .github/
    └── workflows/
        └── biweekly-leetcode.yml   # GitHub Actions 워크플로
```

---

## ⚙️ 실행 방법

### 1. LeetCode API 컨테이너 실행

```bash
docker run -d --name leet-api -p 3000:3000 alfaarghya/alfa-leetcode-api:2.0.1
```

### 2. Bun 스크립트 로컬 실행

```bash
bun scripts/run-biweekly.ts
```

### 3. GitHub Actions 자동화

- `.github/workflows/biweekly-leetcode.yml`
- 스케줄: 매일 오전 10시 (KST)
- 게이트 스텝(`biweekly_gate.mjs`)에서 14일 주기를 보장

---

## 🔑 환경 변수

| 변수명                | 설명                       | 예시값                  |
| --------------------- | -------------------------- | ----------------------- |
| `API_BASE`            | LeetCode API 주소          | `http://localhost:3000` |
| `USERS`               | 사용자 ID 목록 (콤마 구분) | `moo,ryu`               |
| `DISCORD_WEBHOOK_URL` | Discord Webhook URL        | _(Secrets로 관리)_      |
| `TARGET_2WEEKS`       | 2주 목표 문제 수           | `10`                    |
| `TZ`                  | 타임존                     | `Asia/Seoul`            |
| `DEDUPE_MODE`         | 중복 제거 모드             | `WINDOW_UNIQUE`         |

Secrets는 GitHub Repository Settings → Secrets → Actions에서 등록합니다.

---

## 📊 리포트 바로 가기

- 최신 리포트는 [**reports/**](./reports) 디렉토리에서 확인할 수 있습니다.
- 각 리포트 파일은 `YYYY-MM-DD.md` 형식으로 저장됩니다.
  - 예: [2025-09-13.md](./reports/2025-09-13.md)

---

## 🤝 기여 & 라이선스

- 개인 스터디 목적 프로젝트
- 기여는 내부 참가자(Moo & Ryu) 위주
- License: MIT
