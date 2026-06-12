# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

---

## Status

**기능 연동 중.** UI 1차 완료. Auth·실데이터·Geofencing·알림 연동 완료. 남은 작업: location.tsx 실지도, 챙길 것 담기/삭제, RevenueCat, 빌드.

---

## Dev Progress

### 완료
- [x] Expo 프로젝트 초기화 (blank-typescript, expo-router)
- [x] 핵심 패키지 설치 (expo-router, expo-location, expo-notifications, react-native-maps, supabase-js)
- [x] app/ 라우트 구조 생성 (auth, tabs, 모달)
- [x] Supabase 프로젝트 생성 (Seoul 리전)
- [x] DB 스키마 마이그레이션 적용 (users, packs, triggers, items, notification_logs, check_logs + RLS)
- [x] 도메인 모델 확정 (items.trigger_id 1:N)
- [x] babel.config.js, babel-preset-expo, react-dom, react-native-web 설치
- [x] app/index.tsx 루트 리다이렉트 (→ /(tabs)/bags)
- [x] 웹 브라우저 실행 확인 (npm run web)

### 진행 중
- [x] 디자인 토큰 (src/theme.ts) — colors, radius, shadow, typography, spacing
- [x] 내 가방 목록 화면 (mock data, src/components/BagCard + ItemChip)
- [x] 가방 상세 화면 (app/(tabs)/bags/[id].tsx — 지도 카드, 트리거 세그먼트, 챙길 것 칩 그리드, 케밥 메뉴)
- [x] 가방 생성 플로우 (app/(tabs)/bags/new.tsx — 이모지 추천, 빈 지도 카드, 담기 바텀시트 / location.tsx — 전체화면 지도, 반경 슬라이더)
- [x] 체크리스트 화면 (app/checklist.tsx — 2열 그리드, 진행 바, 전부완료 버튼, CTA)
- [x] 알림 탭 화면 (app/(tabs)/notifications/index.tsx — 감지 상태 카드, 체험 카드, 기록 리스트)

- [x] 페이월 화면 (app/paywall.tsx — 미니 가방 카드, 진입경로 2종, 플랜 요약)
- [x] 플랜 선택 화면 (app/plans.tsx — 월간/연간 토글, 스탠다드/프로 카드)

- [x] 설정 탭 (app/(tabs)/settings/index.tsx — 프로필 카드, 권한, 구독, 계정 섹션)

- [x] 온보딩 3스텝 (app/(auth)/onboarding.tsx — step 상태, 스티커 아트, 도트 인디케이터)
- [x] 소셜 로그인 (app/(auth)/login.tsx — 카카오/Google/Apple)
- [x] 권한 요청 (app/(auth)/perm-location.tsx, perm-noti.tsx)
- [x] 커스텀 AlertModal (src/components/AlertModal.tsx — 전역 상태, 하이파이 디자인, 웹 호환)
- [x] 로그아웃 연동 (설정 탭 → AlertModal 확인 → supabase.auth.signOut)
- [x] 가방 상세 실데이터 연동 (app/(tabs)/bags/[id].tsx — Supabase 쿼리, 로딩 상태)
- [x] 케밥 메뉴 연동 (이름·이모지 변경 RenameModal, 가방 삭제 AlertModal + Supabase delete)

### 진행 중
- (기능 연동 중)

### 대기
- [x] Auth — Google OAuth 연동 완료. 카카오는 Supabase 서버가 account_email 스코프 강제 포함으로 웹 KOE205 발생, 비즈니스 인증 후 해결 예정. Apple 대기.
- [x] 로그인 상태 유지 (세션 퍼시스트 확인)
- [x] 로그아웃 (설정 탭 연동)
- [x] Supabase 실데이터 연동 (가방 목록, 가방 생성, 가방 상세, 케밥 액션)
- [x] 위치 geofencing 로직 (src/lib/geofencing.ts — TaskManager 백그라운드 태스크, syncGeofencing, AsyncStorage 메타 저장)
- [x] 푸시 알림 설정 (src/lib/notifications.ts — 핸들러, Android 채널, 권한 요청)
- [ ] RevenueCat 연동

---

## Working Rules

- **새 룰은 항상 이 섹션에 추가**: 지속 적용 규칙은 반드시 이 섹션에 항목으로 추가.
- **자동 git commit / push 금지**: 히스토리를 만들거나 바꾸는 모든 git 명령은 사용자의 명시적 요청이 있을 때만 실행.
- **커밋 메시지에 Co-Authored-By 트레일러 금지**.
- **안건/이슈 물어보면 답변부터, 코드 수정 금지**: 의견·판단을 구하면 분석/제안만 답하고, 명시적 진행 신호 후에 코드 수정.
- **진행상황 기록**: 작업 완료 시마다 CLAUDE.md Dev Progress 업데이트.
- **커밋 메시지 한글 작성**: 모든 커밋 메시지는 한글로 작성.
- **AGENTS.md 동기화**: Working Rules 변경 시 AGENTS.md에도 동일하게 반영. 두 파일의 규칙은 항상 일치해야 함.

---

## Project: amatda (아맞다)

- **앱 이름**: amatda (아맞다)
- **슬로건**: 빠뜨린 거 없죠?
- **워딩**: 가방(Pack) = 컨테이너, 챙길 것(Item) = 개별 아이템 (UI 표시 워딩. 영문 도메인 모델은 Item 유지)
- **Type**: 위치 기반 리마인더 앱
- **운영 우산**: Surmise Lab (서마이즈랩)
- **타겟**: 남녀노소, 알람 앱처럼 범용
- **플랫폼**: Android MVP 출시 → 추후 iOS 출시 (React Native + Expo)

---

## Domain Model

### 테이블 구조

**users**
```
id, email, display_name, avatar_url
subscription_tier (free | standard | pro)
created_at
```

**packs (가방)**
```
id, user_id → users
name, emoji, color, sort_order
created_at, updated_at
```

**items (아이템 스티커)**
```
id, trigger_id → triggers
name, emoji, sort_order
created_at
```

**triggers (나올 때 / 들어갈 때)**
```
id, pack_id → packs
type (departure | arrival)
lat, lng, radius_meters (기본 200m)
label (예: "집", "마트")
reminder_note (arrival 전용)
is_active
created_at
```

**notification_logs**
```
id, user_id → users, trigger_id → triggers
fired_at, acknowledged_at
```

**check_logs (체크리스트 체크 기록)**
```
id, notification_log_id → notification_logs
item_id → items
checked_at
```

### 구독 제한
| 플랜 | 가방 수 | 챙길 것 | 클라우드 동기화 | 가방 공유 |
|---|---|---|---|---|
| 무료 | 2개 | 무제한 | O | X |
| 스탠다드 | 5개 | 무제한 | O | O |
| 프로 | 10개 | 무제한 | O | O |

- 챙길 것(아이템)은 전 플랜 무제한. 가방 수만 제한 변수.
- 클라우드 동기화는 계정 기반 앱 특성상 전 플랜 기본 제공.
- 가방 공유(최대 5인)는 스탠다드/프로 유료 혜택. MVP에 포함.
- 홈 위젯은 v2에서 Expo eject 시 추가 (Expo managed workflow 미지원).

구독 관리는 RevenueCat이 담당. 웹훅으로 `users.subscription_tier` 업데이트. 별도 subscriptions 테이블 불필요.

---

## Vision

물건을 빠뜨리거나 장소별로 해야 할 일을 잊는 "아 맞다!" 순간을 방지하는 위치 기반 리마인더 앱.

### 핵심 기능 (MVP 3종)

1. **아이템 스티커 + 챙길 것 번들** — 들고 다니는 물건(휴대폰·지갑·차 키 등)을 스티커로 등록하고 가방으로 묶어 한 번에 호출
2. **출발 감지 알림** — 버튼으로 현재 위치 저장 후 일정 거리 이동 시 "챙기셨나요?" 알림
3. **도착 알림** — 특정 위치 도착 시 등록한 목록 알림 (살 것, 챙겨올 것 등 포괄)

---

## Business Model

| 항목 | 내용 |
|---|---|
| 수익 모델 | 프리미엄 구독 |
| 무료 | 가방 2개 |
| 스탠다드 | 가방 5개 — $1.99/월 (한국 2,500원/월), 연간 $15.99/년 |
| 프로 | 가방 10개 + 가방 공유 — $3.99/월 (한국 3,900원/월), 연간 $29.99/년 |
| 결제 관리 | RevenueCat (월 수익 $2,500 이하 무료, 이후 수익의 1%) |

---

## Design

| 항목 | 내용 |
|---|---|
| 무드 | 깔끔하고 심플 + 스티커 컨셉 포인트 |
| 폰트 | Pretendard Variable |
| 다크모드 | 라이트 모드 단일 (v2 검토) |

### Hi-fi 비주얼 방향 (확정)

**살릴 것 (로파이 → Hi-fi 이식)**
- 비대칭 border-radius — 모서리마다 1~2px 차이 (스티커 컨셉의 시각 DNA)
- Flat offset shadow — `2~4px offset, 그라디언트 없음` (폴리시와 양립)
- 스티커 peel 효과 — 모서리 살짝 들린 장치 유지
- 마커 노랑 `#ffe7a0` — 선택/하이라이트 상태
- 크림 배경 `#f7f6f1` — 순백보다 따뜻한 배경 유지
- 점선(dashed) 테두리 — 빈 상태·미설정 영역에만

**제거할 것**
- Gaegu 손글씨 폰트 → Pretendard Variable로 교체
- 종이 격자 텍스처 → 지도 영역에만 허용, 전체 배경에선 제거

**색상 체계 (모노 코랄 확정)**
| 역할 | 색상 | 용도 |
|---|---|---|
| 강조/액션 | `#e8674a` 코랄 | CTA, 활성 탭, 선택 상태, 토글 on |
| 상태 틴트 | `#fdeee9` 코랄 50 | 감지 중·완료 등 상태 표시 (작게만) |
| 선택/하이라이트 | `#ffe7a0` 마커 노랑 | 이모지 타일 배경에만 |

그린(#4f9d7a) 폐기 — 코랄과 한/난색 충돌. 지도 공원·물 초록은 예외적 허용.

**Hi-fi 1차 범위**
내 가방 리스트 + 상세 → 가방 생성 플로우 → 체크리스트 순. 온보딩·설정·페이월은 2차.

---

## Handoff Files

개발 시 디자인 참고 파일 위치: `.claude/handoff/project/`

| 파일 | 내용 |
|---|---|
| `hifi-ui.jsx` | 디자인 토큰 — 색상·radius·shadow·폰트·공통 컴포넌트 |
| `hifi-home.jsx` | 내 가방 리스트 · 가방 상세(떠날 때/도착할 때) · 케밥 메뉴 |
| `hifi-items.jsx` | 챙길 것 편집·담기 플로우 · 인라인 생성 |
| `hifi-create.jsx` | 가방 생성 · 위치 설정 전체화면 |
| `hifi-checklist.jsx` | 잠금화면 푸시 · 체크리스트 (진행 중/완료) |
| `hifi-more.jsx` | 페이월(2종) · 플랜 선택 · 설정 탭 |
| `hifi-entry.jsx` | 온보딩 3스텝 · 소셜 로그인 · 권한 요청 |
| `아맞다 하이파이.html` | 브라우저에서 전체 화면 확인 |
| `아맞다 프로토타입.html` | 클릭 가능한 인터랙티브 프로토타입 |
| `아맞다 디자인 시스템.html` | 컴포넌트·토큰 레퍼런스 |

---

## Page Structure

### 탭 구조
```
내 가방 | 알림 | 설정
```

### 탭별 화면

**내 가방 탭**
- 가방 목록 (가방 카드: 이모지 아바타 + 이름 + 트리거·개수 서브타이틀 + 활성화 토글)
- 가방 상세
  - 지도 썸네일 (탭 → 위치 설정 전체화면)
  - 떠날 때 / 도착할 때 세그먼트 탭 (트리거별 독립 아이템 리스트)
  - 챙길 것 스티커 그리드 + 담기 칩
  - ··· 케밥 메뉴 → 이름·이모지 변경 / 가방 삭제
  - 챙길 것 ··· 메뉴 → 편집(바텀시트) / 가방에서 빼기
  - 즉시저장 (글로벌 저장 버튼 없음, ✓ 저장됨 피드백)
- 가방 생성 = 빈 가방 상세 (같은 레이아웃, 하단 CTA "가방 만들기")
  - 가방 이름 + 이모지 — [이모지▾][이름 입력], 이름이 이모지 검색어 겸용
  - 위치 미설정 빈 지도 → 탭 시 위치 설정 화면
  - 떠날 때 / 도착할 때 세그먼트
  - 챙길 것 담기 바텀시트 (풀페이지 라이브러리 없음)
    - 트리거 세그먼트 (어느 탭에 담는지 표시)
    - 내 소지품 풀에서 다중선택
    - 새 소지품 인라인 생성 (이름 = 이모지 검색어, 추가 후 선택된 채 등장)
- 가방 2개 초과 시 페이월 진입

**설정 탭**
- 계정 (프로필, 로그아웃, 탈퇴)
- 위치/알림 권한 상태
- 구독 관리
- 개인정보처리방침 / 이용약관

### 탭 외 화면
| 화면 | 진입 시점 |
|---|---|
| 온보딩 (3~4스텝) | 최초 실행 |
| 소셜 로그인 | 온보딩 마지막 |
| 권한 요청 (위치/알림) | 로그인 직후 |
| 알림 체크리스트 | 출발 감지 알림 탭했을 때 |
| 페이월 | 가방 3개 이상 생성 시도 시 |
| 구독 플랜 선택 | 페이월에서 진입 |

### 페이월 전환 전략
트리거(위치) + 챙길 것을 직접 설정한 사용자는 가방 애착이 생김.
가방 2개 설정 완료 후 3번째 시도 시 페이월 노출 → 투자 심리로 전환율 높음.

**페이월 A — 진입 경로별 카피 분기**
- 가방 2개 꽉 찬 상태에서 진입: "가방 2개가 꽉 찼어요 / 세 번째 차례예요"
- 빈 가방 또는 다른 경로로 진입: "무료는 가방 2개까지 / 세 번째부터 플랜이 필요해요"

**알림 체크리스트 — C안 (위치 그리드) 확정**
- 잠금화면 푸시: "다 챙김"(즉시 완료) / "열기"(체크리스트 진입) 버튼 2종
- 알림 미리보기에 아이템 목록 텍스트 노출 (휴대폰·지갑·차키 등)
- 체크리스트: 2열 그리드 + 상단 "전부 챙겼어요" 빠른완료 버튼 + N/전체 카운터
- CTA("확인 끝·가방 닫기")는 전체 체크 완료 시 활성화. "미완료로 닫기" 링크 병행
- ⚠️ 미결: "전부 챙겼어요" 상단 버튼 동작 — 한번에 전체 체크인지, 현재 체크된 채 완료인지

---

## Tech Stack

| 영역 | 선택 | 이유 |
|---|---|---|
| 앱 | React Native + Expo | 크로스플랫폼, 기존 경험 |
| 로그인 | Google + 카카오 + Apple | 한국 앱 커버리지 완벽. iOS 정책상 Apple 필수 |
| 백엔드 | **Supabase** | Auth 3종 + 실시간 동기화 + CRUD 내장. React Native + Expo 공식 추천 스택 (2026 기준). API 서버 따로 불필요 |
| 결제 | RevenueCat | App Store / Play Store 구독 영수증 검증 자동화 |
| 위치 | expo-location (geofencing) | Expo 내장, iOS/Android 크로스플랫폼 |
| 알림 | expo-notifications | Expo 내장 로컬 푸시 |

### Supabase 무료 → Pro 전환 기준

- 무료: MAU 50K, DB 500MB
- **Pro $25/월**: MAU 100K까지 커버. 전환 트리거 = MAU 4~5만 도달 시
- 비활성 1주 슬립은 배포 후 실사용자 있으면 해당 없음

### 마이그레이션 플랜 (50만 MAU 도달 시)

Supabase는 50만 MAU 초과 시 MAU당 과금으로 ~$1,300/월까지 오름.
단, 50만 MAU면 구독 전환율 2% 기준 월 수익 ~$25,000 이상 예상 → 그 시점에 마이그레이션 진행.

**마이그레이션 타겟 스택**: NestJS (TypeScript 통일) + PostgreSQL + 전용 서버
- Supabase PostgreSQL 데이터 그대로 export 가능
- Supabase Auth → 자체 JWT 인증으로 교체
- 실시간 동기화 → Socket.io 또는 직접 구현

---

## Open Decisions

- [x] ~~슬로건~~ — "빠뜨린 거 없죠?"
- [x] ~~폰트~~ — Pretendard Variable
- [x] ~~다크모드 지원 여부~~ — 라이트 모드 단일 (v2 검토)
- [x] ~~iOS 먼저 출시 vs 동시 출시~~ — Android MVP 먼저, 추후 iOS 출시
- [x] ~~구독 가격~~ — 스탠다드 $1.99/월, 프로 $3.99/월, 연간 -35%
- [x] ~~컬러 팔레트~~ — 모노 코랄 확정. 코랄(#e8674a) 단일색 + 명도 위계. 그린 폐기(지도 공원·물 초록만 예외). --good/--green-* 토큰은 코랄로 매핑
- [x] ~~도메인 모델~~ — items.trigger_id(1:N) 확정. 트리거(떠날 때/도착할 때)에 아이템 직속 귀속, 트리거별 완전 독립 리스트. 별도 소지품 관리 페이지 없음, 가방 생성/편집 플로우에서만 추가.
- [x] ~~도착할 때 UI 라벨~~ — "챙길 것" 통일
- [x] ~~도착할 때 탭 아이콘~~ — flag 아이콘 확정 (hi-fi 적용 완료, 🛒 장바구니 폐기)
- [x] ~~알림 탭 화면~~ — 출발 감지 푸시 + 체크리스트 C(위치 그리드) 확정
- [x] ~~체크리스트 A(리스트) vs B(스와이프 카드)~~ — C안(위치 그리드) 확정
- [x] ~~페이월 A(투자심리) vs B(비교표)~~ — A안(투자심리) 확정, 진입 경로별 카피 분기
- [x] ~~체크리스트 "전부 챙겼어요" 버튼 동작~~ — 한 번에 전체 체크 후 완료 상태 전환

---

## Decision Log

| Phase | 항목 | 결정 |
|---|---|---|
| 1 | 앱 이름 | amatda (아맞다) — 한국어 감탄사, 영문 표기로 글로벌 노출 |
| 1 | 컨셉 | 위치 기반 리마인더 — 출발 체크 + 도착 구매 알림 |
| 1 | 타겟 | 남녀노소 범용 (알람 앱처럼) |
| 1 | 운영 우산 | Surmise Lab (서마이즈랩) |
| 2 | MVP 기능 | 챙길 것 번들 + 출발 감지 + 도착 알림 3종 모두 |
| 2 | 수익 모델 | 프리미엄 구독 (가방 2개 무료 → 스탠다드 $1.99/월 → 프로 $3.99/월) |
| 2 | 구독 가격 | 스탠다드 $1.99/월(2,500원) 가방 5개, 프로 $3.99/월(3,900원) 가방 10개+무제한 챙길 것. 연간 -35% |
| 2 | 결제 관리 | RevenueCat |
| 3 | 플랫폼 | React Native + Expo — Android MVP 출시 → 추후 iOS |
| 3 | 로그인 | Google + 카카오 + Apple |
| 3 | 동기화 | 계정 기반 클라우드 동기화 |
| 4 | 디자인 | 깔끔하고 심플 + 스티커 컨셉 포인트 |
| 5 | 백엔드 | Supabase — Auth·실시간·CRUD 내장, React Native 공식 추천. 50만 MAU 넘으면 NestJS + PostgreSQL로 마이그레이션 |
| 6 | 아이템 워딩 | "준비물" → "챙길 것" (UI 표시). 영문 도메인은 Item 유지. "챙기다"가 소지·구매·할 일 모두 포괄 |
| 6 | 트리거별 목록 분리 | 떠날 때 = 챙길 것(소지품), 도착할 때 = 할 것(구매·수령 등 포괄). 별도 리스트로 관리 (A안) |
| 6 | 아이템 소속 | items.pack_id → items.trigger_id. 아이템은 가방이 아닌 트리거에 속함. 트리거별 완전히 독립된 리스트 |
| 6 | 가방 상세 UX | 편집 버튼 → ··· 케밥 메뉴 (가방 이름 변경·삭제). 챙길 것은 인라인 편집. 즉시저장. 꾹 누르면 드래그 → 하단 휴지통으로 삭제 |
| 6 | 위치 설정 UX | 가방 상세의 지도 썸네일 탭 → 별도 위치 설정 화면. 지도 탭해서 핀 이동 + 반경 슬라이더(50m~1km). 떠날 때/도착할 때 반경 공용 |
| 7 | 구독 차별화 | 챙길 것 전 플랜 무제한, 클라우드 동기화 전 플랜 기본 제공. 가방 공유(최대 5인) = 스탠다드/프로 유료 혜택 (MVP 포함). 홈 위젯은 v2에서 Expo eject 시 추가 |
| 7 | 페이월 UX | A안(투자심리) 확정. 진입 경로 2종 분기 — ①가방 2개 꽉 찬 경우 ②빈 가방·다른 진입 |
| 7 | 체크리스트 UI | C안(위치 그리드) 확정 — 2열 그리드 + 상단 빠른완료 + N/전체 카운터 + CTA 전체완료 시 활성화 |
| 7 | 알림 푸시 UX | 잠금화면 푸시에 아이템 미리보기 텍스트 노출. "다 챙김"(즉시완료) / "열기"(체크리스트 진입) 버튼 2종 |
| 8 | 도착할 때 라벨 | "챙길 것" 통일 — 떠날 때·도착할 때 모두 동일 워딩. "할 것" 폐기 |
| 8 | 체크리스트 전부완료 버튼 | "전부 챙겼어요" = 한 번에 전체 체크 → allDone 상태 전환 (현재 체크 상태 무시하고 전부 완료) |
| 8 | Hi-fi 비주얼 | "폴리싱된 스티커 노트 앱" — Pretendard 본문, 워드마크만 Gaegu. 비대칭 radius·flat offset shadow·스티커 칩·크림 배경(종이 노이즈)·종이격자는 지도에만 |
| 8 | 앱 아이콘 | 흰 물방울 핀 + 굵은 코랄 느낌표, 코랄 라디얼 배경. hifi-ui.jsx `AppIcon` 컴포넌트 |
| 8 | 컬러 시스템 | 모노 코랄 — 코랄 단일색 + 명도 위계. 누르는 것=솔리드, 상태=옅은 틴트(작게). 코랄+그린 한/난색 충돌 해소. 활성 가방 카드는 중립 테두리(면적 색칠 X) |
| 8 | 한글 타이포 | word-break:keep-all 전역 — 음절 중간 줄바꿈 방지, 단어 단위로만 끊김 |
| 8 | 도착할 때 탭 아이콘 | flag 아이콘 확정 (🛒 장바구니 폐기) |
| 8 | Hi-fi 1차 범위 | 내 가방 리스트+상세 → 가방 생성 → 체크리스트. 온보딩·설정·페이월은 2차 |
| 9 | 도메인 모델 | items.trigger_id(1:N) 확정 — 트리거(떠날 때/도착할 때)에 직속. 별도 소지품 페이지 없음, 담기 시트의 "내 소지품" 목록은 유저의 기존 아이템 파생 뷰 |
