# 프로젝트 맵: `nh-example`

## 스택

- **Next.js 16.2.9** + **React 19.2.4** + **TypeScript** + **Tailwind CSS v4**
- App Router (파일 기반 라우팅, `app/` 디렉토리)

---

## 모듈 구조

```
app/
├── layout.tsx          — RootLayout: HTML 셸, Geist 폰트 주입, globals.css 로드
├── page.tsx            — Home: 진입점. WorldClockBar + PomodoroTimer 조합
├── globals.css         — Tailwind 기본 스타일
└── components/
    ├── WorldClockBar.tsx   — 상단 고정 세계시계 바 (Client Component)
    └── PomodoroTimer.tsx   — 뽀모도로 타이머 본체 (Client Component)
```

---

## 도메인 용어 & 컴포넌트 책임

| 컴포넌트 | 역할 | 핵심 상태 |
|---|---|---|
| `WorldClockBar` | 1초마다 갱신되는 5개 도시 시계 (한국/중국/일본/뉴욕/멕시코) | `now: Date \| null` |
| `PomodoroTimer` | 모드 전환·타이머 카운트다운·세션 추적·완료 알림 | `mode`, `seconds`, `running`, `sessions`, `done` |

### `PomodoroTimer` 내부 도메인 모델

```
Mode = 'work' | 'short' | 'long'
  work  → 집중 (25분)
  short → 짧은 휴식 (5분)
  long  → 긴 휴식 (15분)

sessions: number  — work 모드 완료 횟수 (도트로 시각화)
done: boolean     — 타이머 완료 후 배너 표시 여부
```

### 주요 함수/로직

| 이름 | 위치 | 역할 |
|---|---|---|
| `playDoneChime()` | `PomodoroTimer.tsx:46` | Web Audio API로 880Hz 사인파 완료음 재생 |
| `reset(m)` | `PomodoroTimer.tsx:85` | 모드 변경 없이 해당 모드 시간으로 초기화 |
| `switchMode(m)` | `PomodoroTimer.tsx:91` | 모드 변경 + reset |
| `formatTime(seconds)` | `PomodoroTimer.tsx:65` | `MM:SS` 포맷터 |
| `formatTime(date, tz)` | `WorldClockBar.tsx:13` | `Intl.toLocaleTimeString` 래퍼 |

SVG 원형 프로그레스바: `RADIUS=90`, `CIRCUMFERENCE=2πr`, `strokeDashoffset`으로 진행률 표현

---

## 데이터 흐름

```
layout.tsx
  └─► page.tsx (Home)
        ├─► WorldClockBar   ← setInterval(1s) → Intl.toLocaleTimeString
        └─► PomodoroTimer   ← setInterval(1s) → countdown
                                └─► AudioContext (완료 시)
```

---

## 특이사항

- **Next.js 16** — AGENTS.md 경고대로 훈련 데이터와 다를 수 있음. 코드 수정 전 `node_modules/next/dist/docs/` 확인 필요
- 두 컴포넌트 모두 `'use client'` — 서버 컴포넌트 없음
- 외부 API·DB·라우트 핸들러·미들웨어 없음. 완전히 프론트엔드 전용 앱
