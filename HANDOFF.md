# nh-example 프로젝트 핸드오프 문서

> 작성일: 2026-06-16

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | `nh-example` |
| 프레임워크 | Next.js **16.2.9** (비표준 버전 — 아래 주의사항 필독) |
| React | 19.2.4 |
| 언어 | TypeScript 5 |
| 스타일 | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| 패키지 매니저 | npm |
| Git | 미초기화 상태 |

---

## 중요 주의사항

`AGENTS.md` / `CLAUDE.md`에 명시된 규칙:

> **This is NOT the Next.js you know.**  
> 이 버전(16.2.9)은 훈련 데이터와 다른 파괴적 변경(breaking changes)이 포함되어 있음.  
> 코드 작성 전 반드시 `node_modules/next/dist/docs/` 내부 가이드를 먼저 읽을 것.  
> Deprecation 경고를 반드시 따를 것.

---

## 현재 구현된 기능

### 1. 뽀모도로 타이머 (`app/components/PomodoroTimer.tsx`)

- **모드**: 집중(25분) / 짧은 휴식(5분) / 긴 휴식(15분)
- **UI**: SVG 원형 프로그레스 바, 모드별 색상 테마(장미/틸/파랑)
- **기능**:
  - 시작 / 일시정지 / 초기화
  - 집중 세션 완료 카운터 (점 표시)
  - 다크모드 지원 (`dark:` Tailwind 클래스 사용)
- **구현 방식**: `'use client'`, `useState` + `useEffect` + `useRef(setInterval)`

### 2. 세계 시계 바 (`app/components/WorldClockBar.tsx`)

- **표시 도시**: 한국(Seoul) / 중국(Shanghai) / 일본(Tokyo) / 미국 뉴욕
- **UI**: 상단 고정(`fixed top-0`) 반투명 바, 1초마다 갱신
- **구현 방식**: `'use client'`, SSR hydration 불일치 방지를 위해 초기 `now` 상태를 `null`로 설정 후 `useEffect`에서 초기화

### 3. 메인 페이지 (`app/page.tsx`)

- `WorldClockBar` + `PomodoroTimer` 조합
- 배경: `bg-zinc-100 dark:bg-zinc-900`
- 한국어 제목: "뽀모도로 타이머"

### 4. 레이아웃 (`app/layout.tsx`)

- Geist / Geist Mono 폰트
- `<html>` 전체 높이 레이아웃 (`h-full`)
- `<body>` flex 컬럼 레이아웃 (`min-h-full flex flex-col`)

---

## 파일 구조

```
nh-example/
├── app/
│   ├── components/
│   │   ├── PomodoroTimer.tsx   # 뽀모도로 타이머 컴포넌트
│   │   └── WorldClockBar.tsx   # 세계 시계 바 컴포넌트
│   ├── globals.css             # Tailwind 글로벌 스타일
│   ├── layout.tsx              # 루트 레이아웃
│   └── page.tsx                # 홈 페이지
├── public/                     # 정적 에셋
├── AGENTS.md                   # 에이전트 규칙 (Next.js 버전 주의)
├── CLAUDE.md                   # @AGENTS.md 참조
├── next.config.ts
├── tsconfig.json
├── package.json
└── eslint.config.mjs
```

---

## 개발 서버 실행

```bash
npm run dev
```

---

## 다음 세션에서 이어갈 작업 (미결 사항)

- [ ] 특정 추가 기능 요청 없음 — 이전 대화에서 별도로 정의된 다음 작업 없음
- [ ] 필요 시 `node_modules/next/dist/docs/` 가이드 선검토 후 기능 추가

---

## 추천 스킬 (다음 세션용)

| 스킬 | 용도 |
|------|------|
| `/run` | 개발 서버 실행 및 실제 브라우저 동작 확인 |
| `/verify` | 기능 변경 후 실제 동작 검증 |
| `/code-review` | 새 기능 추가 후 코드 품질 리뷰 |
