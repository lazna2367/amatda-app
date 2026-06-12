# AGENTS.md

This file provides guidance to Codex (and other AI agents) when working with code in this repository.
The rules and context here are kept in sync with CLAUDE.md.

---

## Expo Version

**Expo SDK 56** — Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.
Do not guess API signatures from training data. Always verify against the v56 docs.

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
- [x] 디자인 토큰 (src/theme.ts) — colors, radiusExact, shadow, typography, spacing
- [x] UI 전체 화면 구현 완료 (가방 목록/상세/생성, 체크리스트, 알림, 페이월, 플랜, 설정, 온보딩, 로그인, 권한)
- [x] Google OAuth 연동 (웹 + 네이티브)
- [x] 세션 유지 (SecureStore / localStorage 플랫폼 분기)
- [x] 커스텀 AlertModal (src/components/AlertModal.tsx — 전역 Context 상태, 하이파이 디자인, 웹 호환)
- [x] 로그아웃 연동 (AlertModal 확인 → supabase.auth.signOut)
- [x] 가방 목록 실데이터 (useFocusEffect + Supabase)
- [x] 가방 생성 실데이터 (pack → departure trigger → arrival trigger → items 순 insert)
- [x] 가방 상세 실데이터 (app/(tabs)/bags/[id].tsx)
- [x] 케밥 메뉴 연동 (이름·이모지 변경 RenameModal, 가방 삭제 AlertModal + Supabase delete)
- [x] Geofencing 백그라운드 태스크 (src/lib/geofencing.ts — TaskManager, AsyncStorage 메타 저장)
- [x] 푸시 알림 설정 (src/lib/notifications.ts — 핸들러, Android 채널)

### 남은 작업 (우선순위 순)
1. [ ] location.tsx 실지도 — react-native-maps + Kakao Local API 주소검색 + 반경 슬라이더 → trigger 저장
2. [ ] 챙길 것 담기 — 가방 상세 AddChip → 아이템 추가 바텀시트 → Supabase insert
3. [ ] 챙길 것 삭제 — 아이템 칩 ··· 메뉴 → Supabase delete
4. [ ] RevenueCat 연동 — 구독 결제, users.subscription_tier 업데이트, 페이월 실제 분기
5. [ ] 체크리스트 실데이터 — notification_logs, check_logs 연동
6. [ ] 알림 탭 실데이터 — notification_logs 조회
7. [ ] 설정 탭 프로필 실데이터 — display_name, avatar_url
8. [ ] 회원 탈퇴
9. [ ] 카카오 OAuth 웹 — KOE205 비즈니스 인증 후
10. [ ] Apple Sign In — iOS 출시 전 필수
11. [ ] Android 빌드 (EAS Build)

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
- **워딩**: 가방(Pack) = 컨테이너, 챙길 것(Item) = 개별 아이템 (UI 표시 워딩. 영문 도메인은 Item 유지)
- **Type**: 위치 기반 리마인더 앱
- **운영 우산**: Surmise Lab (서마이즈랩)
- **타겟**: 남녀노소 범용 (알람 앱처럼)
- **플랫폼**: Android MVP 출시 → 추후 iOS 출시 (React Native + Expo managed workflow)

---

## Tech Stack

| 영역 | 선택 | 비고 |
|---|---|---|
| 앱 | React Native + Expo SDK 56 | expo-router v3 파일 기반 라우팅 |
| 로그인 | Google + 카카오 + Apple | expo-auth-session + PKCE |
| 백엔드 | Supabase | Auth·CRUD·RLS 내장. API 서버 불필요 |
| 결제 | RevenueCat | 구독 영수증 검증 자동화 |
| 위치 | expo-location (geofencing) | iOS CoreLocation / Android Geofencing API |
| 알림 | expo-notifications | 로컬 푸시 |
| 지도 표시 | react-native-maps | Google Maps (Android) / Apple Maps (iOS) |
| 주소 검색 | Kakao Local API | REST API, Expo managed 호환, 한국 주소 최적화 |
| 백그라운드 태스크 | expo-task-manager | geofencing 백그라운드 실행 |
| 메타 저장 (백그라운드) | @react-native-async-storage/async-storage | 트리거 메타데이터 |

### 지도 관련 결정
- **Geofencing**: expo-location — 지도 SDK 불필요, 기기 네이티브 GPS 직접 사용
- **지도 표시**: react-native-maps (Google Maps on Android) — Expo managed 호환
- **주소 검색**: Kakao Local API (REST) — 네이버/카카오 네이티브 SDK는 eject 필요하므로 v2로 연기
- **네이버/카카오 지도 네이티브**: v2에서 Expo eject 후 교체 검토

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

**triggers (떠날 때 / 도착할 때)**
```
id, pack_id → packs
type (departure | arrival)
lat, lng, radius_meters (기본 200m)
label (예: "집", "마트")
reminder_note (arrival 전용)
is_active
created_at
```

**items (챙길 것)**
```
id, trigger_id → triggers   ← 아이템은 트리거에 직속 (1:N)
name, emoji, sort_order
created_at
```

**notification_logs**
```
id, user_id → users, trigger_id → triggers
fired_at, acknowledged_at
```

**check_logs**
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

구독 관리는 RevenueCat. 웹훅으로 `users.subscription_tier` 업데이트. 별도 subscriptions 테이블 없음.

---

## File Structure (주요 파일)

```
app/
  _layout.tsx              # 루트 레이아웃 — AlertProvider, NotificationHandler, Auth Guard
  index.tsx                # /(tabs)/bags 리다이렉트
  (auth)/
    login.tsx              # Google/카카오/Apple OAuth
    onboarding.tsx         # 3스텝 온보딩
    perm-location.tsx      # 위치 권한 요청
    perm-noti.tsx          # 알림 권한 요청
  (tabs)/
    _layout.tsx            # 탭 바 (내 가방 | 알림 | 설정)
    bags/
      index.tsx            # 가방 목록 (실데이터)
      [id].tsx             # 가방 상세 (실데이터)
      new.tsx              # 가방 생성 (실데이터)
      location.tsx         # 위치 설정 전체화면 (react-native-maps + Kakao 주소검색)
    notifications/
      index.tsx            # 알림 탭
    settings/
      index.tsx            # 설정 탭
  auth/callback.tsx        # OAuth 딥링크 콜백 (exchangeCodeForSession)
  checklist.tsx            # 체크리스트 (알림 탭에서 진입)
  paywall.tsx              # 페이월
  plans.tsx                # 구독 플랜 선택

src/
  theme.ts                 # 디자인 토큰 (colors, radiusExact, shadow, spacing, typography)
  types/db.ts              # Supabase 도메인 타입 (Pack, Trigger, Item, PackWithTriggers 등)
  components/
    BagCard.tsx            # 가방 카드 컴포넌트
    AlertModal.tsx         # 커스텀 Alert 모달 (전역 상태)
  store/
    alertStore.ts          # AlertProvider, useAlert, useAlertState
  lib/
    supabase.ts            # Supabase 클라이언트 (플랫폼 분기 스토리지)
    geofencing.ts          # Geofencing 태스크 정의 + syncGeofencing
    notifications.ts       # 알림 핸들러 설정
```

---

## Design System

### 색상 (src/theme.ts)
```typescript
colors.paper      = '#f4f1ea'   // 앱 배경 (크림)
colors.surface    = '#fffefb'   // 카드 배경
colors.surface2   = '#faf8f2'   // 인셋/서브 배경
colors.ink        = '#2c2a26'   // 기본 텍스트
colors.inkSoft    = '#6f6b62'   // 보조 텍스트
colors.inkFaint   = '#a6a092'   // 힌트 텍스트
colors.line       = '#e6e1d5'   // 기본 테두리
colors.accent     = '#e8674a'   // 코랄 — CTA, 활성 탭, 선택 상태
colors.coral600   = '#d24e2f'   // 코랄 테두리 (버튼 등)
colors.danger     = '#d24e2f'   // 삭제/위험
colors.mark       = '#ffe7a0'   // 마커 노랑 — 이모지 타일 배경 전용
```

### 비대칭 border-radius (스티커 DNA)
```typescript
radiusExact.card  = { tl:18, tr:16, br:19, bl:16 }
radiusExact.btn   = { tl:14, tr:12, br:15, bl:13 }
radiusExact.chip  = { tl:13, tr:11, br:13, bl:10 }
radiusExact.tile  = { tl:12, tr:11, br:13, bl:10 }
radiusExact.field = { tl:12, tr:11, br:13, bl:11 }
```

### 그림자 (flat offset shadow)
```typescript
shadow.card    // 2px 3px offset, elevation 2
shadow.sticker // 1.5px 2.5px offset, elevation 2
shadow.btn     // 3px 3px 코랄 그림자, elevation 3
shadow.pop     // 18px Y offset, 큰 소프트 그림자, elevation 12
```

### 디자인 참고 파일
`.claude/handoff/project/` 폴더의 hifi-*.jsx 파일들이 디자인 레퍼런스.
새 화면 구현 전에 해당 파일을 먼저 읽을 것.

---

## Key Patterns

### Supabase 데이터 조회
```typescript
// 가방 + 트리거 + 아이템 전체 조회
const { data } = await supabase
  .from('packs')
  .select('*, triggers(*, items(*))')
  .eq('user_id', user.id)
  .order('sort_order', { ascending: true });
```

### 화면 포커스 시 데이터 갱신
```typescript
useFocusEffect(
  useCallback(() => {
    let active = true;
    const load = async () => { /* ... */ };
    load();
    return () => { active = false; };
  }, [deps])
);
```

### 커스텀 Alert (웹/네이티브 모두 동작)
```typescript
const showAlert = useAlert(); // React Native Alert.alert 대신 사용

showAlert({
  title: '제목',
  message: '메시지',
  buttons: [
    { text: '취소', style: 'cancel' },
    { text: '확인', style: 'destructive', onPress: async () => { /* ... */ } },
  ],
});
```

### Geofencing 갱신
```typescript
import { syncGeofencing } from '@/lib/geofencing';
// 가방 토글 변경 후 호출
await syncGeofencing(userId);
```

### 플랫폼 분기
```typescript
import { Platform } from 'react-native';
if (Platform.OS === 'web') { /* 웹 전용 */ }
if (Platform.OS !== 'web') { /* 네이티브 전용 (geofencing, SecureStore 등) */ }
```

---

## Business Model

| 플랜 | 가방 수 | 월 가격 | 연 가격 |
|---|---|---|---|
| 무료 | 2개 | - | - |
| 스탠다드 | 5개 | $1.99 (₩2,500) | $15.99 |
| 프로 | 10개 + 공유 | $3.99 (₩3,900) | $29.99 |

---

## Open Decisions / Pending

- 카카오 OAuth 웹: Supabase 서버가 account_email 스코프 강제 → KOE205 발생. 카카오 비즈니스 인증 후 해결 예정.
- Apple Sign In: iOS 출시 전 구현 필요.
- 네이버/카카오 지도 네이티브 SDK: v2 (Expo eject 이후) 검토.
- 홈 위젯: v2 (Expo eject 이후) 추가.
