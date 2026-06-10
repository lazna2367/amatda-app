// proto-store.jsx — 아맞다 클릭 프로토타입 상태 저장소
//   useReducer + Context. 새로고침하면 초기 상태로 리셋(영속 없음).
//   depends on hifi-ui.jsx (EMO, emo via window)

/* ============================ 이모지 추천 ============================ */
const BAG_RECO = [
  [/출근|회사|업무|직장|사무/, ['💼','🏢','📊','💻','👔','🗂️']],
  [/헬스|운동|짐|피트|근력/, ['🏋️','💪','🏃','🤸','🧘','👟']],
  [/여행|트립|캠핑|나들이|휴가/, ['🧳','✈️','🏕️','🗺️','📷','🕶️']],
  [/학교|수업|공부|등교|강의/, ['🎒','📚','✏️','📐','🖊️','📒']],
  [/장보|마트|쇼핑|시장|식료/, ['🛒','🛍️','🥦','🧺','🥛','🧀']],
  [/수영|풀장|물놀이/, ['🏊','🩱','🥽','🧴','🩴','🏖️']],
  [/아기|육아|기저귀|등원/, ['🍼','🧸','👶','🚼','🧷','🛁']],
  [/반려|강아지|산책|개|댕댕/, ['🐶','🦴','🦮','🐾','🎾','🥫']],
  [/병원|진료|약국/, ['🏥','💊','🩺','📋','🧴','😷']],
];
function recommendBagEmojis(text) {
  const t = (text || '').trim();
  if (t) for (const [re, list] of BAG_RECO) if (re.test(t)) return list;
  return ['💼','🎒','🛍️','🗂️','🧳','✨'];
}
const ITEM_RECO = [
  [/텀블러|물|음료|병|컵|커피|차|보틀/, ['🥤','☕','💧','🧋','🍵','🫗']],
  [/약|영양제|비타민/, ['💊','🟡','🧴','💉','🩹','🌿']],
  [/노트|책|서류|문서|메모/, ['📖','📒','📑','📓','🗒️','📚']],
  [/충전|케이블|보조배터리|배터리/, ['🔌','🔋','⚡','🪫','🧷','📱']],
  [/마스크|위생/, ['😷','🧴','🧻','🩹','🧼','🌡️']],
  [/우유|달걀|빵|식품|과일|채소/, ['🥛','🥚','🍞','🍎','🥦','🧀']],
  [/옷|티셔츠|운동복|상의/, ['👕','👚','🧥','🩳','🧦','👟']],
  [/우산|비/, ['☂️','🌂','🧥','🥾','🌧️','🩴']],
];
function recommendItemEmojis(text) {
  const t = (text || '').trim();
  const out = [];
  if (t && EMO[t]) out.push(EMO[t]);
  if (t) for (const [re, list] of ITEM_RECO) if (re.test(t)) { for (const e of list) if (!out.includes(e)) out.push(e); break; }
  for (const e of ['📦','🎒','🥤','📱','🔑','👛']) if (out.length < 6 && !out.includes(e)) out.push(e);
  return out.slice(0, 6);
}

/* ============================ 시드 데이터 ============================ */
let _uid = 100;
const uid = (p) => p + (++_uid);

function seedState() {
  const pool = [
    '휴대폰','지갑','차 키','사원증','이어폰','우산','운동복','수건','셰이커',
    '노트북','충전기','텀블러','마스크','약','카드','우유','달걀','식빵',
  ].map((label) => ({ id: uid('p'), label, emoji: emo(label) }));

  const bags = [
    {
      id: 'b1', name: '출근 가방', emoji: '💼', on: true,
      loc: { label: '집', place: '합정동', radius: 200, set: true },
      depart: ['휴대폰','지갑','차 키','사원증','이어폰','우산'],
      arrive: [],
      last: '오늘 08:12 챙김',
    },
    {
      id: 'b2', name: '헬스장', emoji: '🏋️', on: false,
      loc: { label: '집', place: '합정동', radius: 200, set: true },
      depart: ['운동복','수건','이어폰','셰이커'],
      arrive: [],
      last: '3일 전',
    },
  ];

  const notifs = [
    { id: 'n0', bagId: 'b1', kind: 'depart', time: '오늘 08:12', status: 'pending' },
    { id: 'n1', bagId: 'b2', kind: 'depart', time: '어제 19:20', status: 'done', checked: 4, total: 4 },
    { id: 'n2', bagId: 'b1', kind: 'depart', time: '어제 08:08', status: 'done', checked: 6, total: 6 },
  ];

  return {
    tier: 'free',                 // free=가방 2 / standard=5 / pro=10
    bagLimit: 2,
    user: { name: '김아맞', email: 'amat@kakao.com' },

    tab: 'home',                  // home | noti | settings
    stack: [],                    // [{name:'bagDetail',bagId} | {name:'bagCreate'} | {name:'locationSet',target} | {name:'plans'}]
    trigger: 'depart',            // 현재 상세/생성의 트리거 탭
    overlay: null,                // {flow:'onboarding'|'departure'|'paywall', step, data}
    sheet: null,                  // {type, ...}
    popover: null,                // {type, ...}
    toast: null,                  // {id, msg}

    draft: null,                  // 생성 중인 가방
    locDraft: null,               // 위치 설정 임시값
    check: null,                  // 체크리스트 상태 {bagId, checked:Set-like obj}

    bags, pool, notifs,
  };
}

/* ============================ 헬퍼 ============================ */
const TIER_LIMIT = { free: 2, standard: 5, pro: 10 };
const topScreen = (s) => s.stack[s.stack.length - 1] || null;
function activeBag(s) {
  const t = topScreen(s);
  if (t && t.name === 'bagCreate') return s.draft;
  if (t && (t.name === 'bagDetail')) return s.bags.find((b) => b.id === t.bagId) || null;
  if (t && t.name === 'locationSet' && t.target === 'draft') return s.draft;
  if (t && t.name === 'locationSet' && t.bagId) return s.bags.find((b) => b.id === t.bagId);
  return null;
}
const isDraftContext = (s) => { const t = topScreen(s); return !!(t && (t.name === 'bagCreate' || (t.name === 'locationSet' && t.target === 'draft'))); };

// 현재 컨테이너(가방 or 초안)에 매핑 함수 적용
function mapContainer(s, fn) {
  if (isDraftContext(s)) return { ...s, draft: fn(s.draft) };
  const t = topScreen(s);
  const id = t && (t.bagId);
  return { ...s, bags: s.bags.map((b) => (b.id === id ? fn(b) : b)) };
}

/* ============================ 리듀서 ============================ */
function reducer(s, a) {
  switch (a.type) {
    case 'TAB':
      return { ...s, tab: a.tab, stack: [], sheet: null, popover: null };

    case 'POP': {
      if (s.stack.length) return { ...s, stack: s.stack.slice(0, -1), sheet: null, popover: null };
      return s;
    }
    case 'PUSH':
      return { ...s, stack: [...s.stack, a.screen], sheet: null, popover: null,
        trigger: a.screen.name === 'bagDetail' || a.screen.name === 'bagCreate' ? 'depart' : s.trigger };

    /* ---- 가방 토글 / 상세 ---- */
    case 'TOGGLE_BAG':
      return { ...s, bags: s.bags.map((b) => (b.id === a.bagId ? { ...b, on: !b.on } : b)) };
    case 'OPEN_DETAIL':
      return { ...s, stack: [...s.stack, { name: 'bagDetail', bagId: a.bagId }], trigger: 'depart' };
    case 'SET_TRIGGER':
      return { ...s, trigger: a.trigger };

    /* ---- 팝오버 ---- */
    case 'POPOVER':
      return { ...s, popover: a.popover };
    case 'CLOSE_POPOVER':
      return { ...s, popover: null };

    /* ---- 아이템 제거 ---- */
    case 'REMOVE_ITEM':
      return mapContainer({ ...s, popover: null, toast: { id: uid('t'), msg: '✓ 가방에서 뺐어요' } },
        (b) => ({ ...b, [s.trigger]: b[s.trigger].filter((l) => l !== a.label) }));

    /* ---- 시트 ---- */
    case 'SHEET':
      return { ...s, sheet: a.sheet, popover: null };
    case 'CLOSE_SHEET':
      return { ...s, sheet: null };
    case 'SHEET_PATCH':
      return { ...s, sheet: { ...s.sheet, ...a.patch } };

    /* ---- 담기: 선택 토글 ---- */
    case 'TOGGLE_PICK': {
      const sel = { ...s.sheet.sel };
      if (sel[a.label]) delete sel[a.label]; else sel[a.label] = true;
      return { ...s, sheet: { ...s.sheet, sel } };
    }
    /* ---- 담기: 새 소지품 생성 확정 ---- */
    case 'CONFIRM_NEW_ITEM': {
      const name = (s.sheet.newName || '').trim();
      if (!name) return s;
      const emoji = s.sheet.newEmoji || emo(name);
      const exists = s.pool.find((p) => p.label === name);
      const pool = exists ? s.pool : [{ id: uid('p'), label: name, emoji, _new: true }, ...s.pool.map((p) => ({ ...p, _new: false }))];
      const sel = { ...s.sheet.sel, [name]: true };
      return { ...s, pool, sheet: { ...s.sheet, sel, creating: false, newName: '', newEmoji: '', justAdded: name } };
    }
    /* ---- 담기: 적용 ---- */
    case 'APPLY_PICK': {
      const labels = Object.keys(s.sheet.sel || {});
      const ns = mapContainer(s, (b) => {
        const cur = b[s.trigger];
        const merged = [...cur];
        labels.forEach((l) => { if (!merged.includes(l)) merged.push(l); });
        return { ...b, [s.trigger]: merged };
      });
      return { ...ns, sheet: null, toast: { id: uid('t'), msg: '✓ 저장됨' } };
    }
    /* ---- 아이템 편집 저장 ---- */
    case 'SAVE_ITEM_EDIT': {
      const { orig, newName, newEmoji } = s.sheet;
      const name = (newName || '').trim() || orig;
      const ns = mapContainer(s, (b) => ({ ...b, [s.trigger]: b[s.trigger].map((l) => (l === orig ? name : l)) }));
      const pool = ns.pool.map((p) => (p.label === orig ? { ...p, label: name, emoji: newEmoji || p.emoji } : p));
      EMO[name] = newEmoji || emo(orig);
      return { ...ns, pool, sheet: null, toast: { id: uid('t'), msg: '✓ 저장됨' } };
    }

    /* ---- 가방 이름·이모지 변경 ---- */
    case 'SAVE_BAG_EDIT': {
      const name = (s.sheet.newName || '').trim() || activeBag(s).name;
      const emoji = s.sheet.newEmoji || activeBag(s).emoji;
      return mapContainer({ ...s, sheet: null, toast: { id: uid('t'), msg: '✓ 저장됨' } },
        (b) => ({ ...b, name, emoji }));
    }
    case 'DELETE_BAG': {
      const id = topScreen(s).bagId;
      return { ...s, stack: [], popover: null, sheet: null,
        bags: s.bags.filter((b) => b.id !== id),
        toast: { id: uid('t'), msg: '가방을 삭제했어요' } };
    }

    /* ---- 가방 생성 ---- */
    case 'START_CREATE': {
      const limit = TIER_LIMIT[s.tier];
      if (s.bags.length >= limit) {
        const filled = s.bags.length >= 2;
        return { ...s, overlay: { flow: 'paywall', step: 0, data: { variant: filled ? 'filled' : 'other' } } };
      }
      const draft = { id: uid('b'), name: '', emoji: '', on: false,
        loc: { label: '', place: '', radius: 200, set: false }, depart: [], arrive: [], last: null };
      return { ...s, draft, stack: [...s.stack, { name: 'bagCreate' }], trigger: 'depart' };
    }
    case 'DRAFT_NAME':
      return { ...s, draft: { ...s.draft, name: a.name } };
    case 'DRAFT_EMOJI':
      return { ...s, draft: { ...s.draft, emoji: a.emoji } };
    case 'COMMIT_CREATE': {
      const d = s.draft;
      const bag = { ...d, name: d.name.trim() || '새 가방', emoji: d.emoji || '📦', on: true, last: '방금 만듦' };
      return { ...s, draft: null, stack: [], tab: 'home',
        bags: [...s.bags, bag], toast: { id: uid('t'), msg: '✓ 가방을 만들었어요' } };
    }

    /* ---- 위치 설정 ---- */
    case 'OPEN_LOCATION': {
      const b = activeBag(s);
      const target = isDraftContext(s) ? 'draft' : 'bag';
      return { ...s, locDraft: { ...(b.loc || { label: '', radius: 200 }) },
        stack: [...s.stack, { name: 'locationSet', target, bagId: target === 'bag' ? topScreen(s).bagId : null }] };
    }
    case 'SET_RADIUS':
      return { ...s, locDraft: { ...s.locDraft, radius: a.radius } };
    case 'SET_LOC_LABEL':
      return { ...s, locDraft: { ...s.locDraft, label: a.label } };
    case 'SAVE_LOCATION': {
      const loc = { ...s.locDraft, place: '합정동', set: true, label: (s.locDraft.label || '').trim() || '집' };
      const t = topScreen(s);
      const ns = t.target === 'draft'
        ? { ...s, draft: { ...s.draft, loc } }
        : { ...s, bags: s.bags.map((b) => (b.id === t.bagId ? { ...b, loc } : b)) };
      return { ...ns, locDraft: null, stack: s.stack.slice(0, -1), toast: { id: uid('t'), msg: '✓ 위치를 정했어요' } };
    }

    /* ---- 출발 알림 / 체크리스트 ---- */
    case 'OPEN_DEPARTURE':
      return { ...s, overlay: { flow: 'departure', step: 0, data: { bagId: a.bagId || 'b1' } } };
    case 'OPEN_CHECKLIST': {
      const bagId = a.bagId || s.overlay?.data?.bagId || 'b1';
      const bag = s.bags.find((b) => b.id === bagId);
      const checked = {};
      (bag ? bag.depart : []).forEach((l, i) => { checked[l] = false; });
      return { ...s, overlay: { flow: 'departure', step: 1, data: { bagId } }, check: { bagId, checked } };
    }
    case 'TOGGLE_CHECK': {
      const checked = { ...s.check.checked, [a.label]: !s.check.checked[a.label] };
      return { ...s, check: { ...s.check, checked } };
    }
    case 'CHECK_ALL': {
      const checked = {};
      Object.keys(s.check.checked).forEach((l) => { checked[l] = true; });
      return { ...s, check: { ...s.check, checked } };
    }
    case 'CLOSE_CHECKLIST': {
      // 알림 로그 갱신 + 가방 last 갱신
      const bagId = s.check?.bagId || s.overlay?.data?.bagId;
      const total = s.check ? Object.keys(s.check.checked).length : 0;
      const done = s.check ? Object.values(s.check.checked).filter(Boolean).length : 0;
      const acked = a.acknowledge !== false;
      const notifs = s.notifs.map((n) => (n.bagId === bagId && n.status === 'pending'
        ? { ...n, status: 'done', checked: acked ? total : done, total } : n));
      const bags = s.bags.map((b) => (b.id === bagId ? { ...b, last: '방금 챙김' } : b));
      return { ...s, overlay: null, check: null, notifs, bags,
        toast: acked ? { id: uid('t'), msg: '✓ 다 챙겼어요!' } : null };
    }
    case 'QUICK_ALL_DONE': {
      const bagId = a.bagId;
      const bag = s.bags.find((b) => b.id === bagId);
      const total = bag ? bag.depart.length : 0;
      const notifs = s.notifs.map((n) => (n.bagId === bagId && n.status === 'pending'
        ? { ...n, status: 'done', checked: total, total } : n));
      const bags = s.bags.map((b) => (b.id === bagId ? { ...b, last: '방금 챙김' } : b));
      return { ...s, overlay: null, check: null, notifs, bags, toast: { id: uid('t'), msg: '✓ 다 챙겼어요!' } };
    }
    case 'ACK_NOTIF':
      return { ...s, notifs: s.notifs.map((n) => (n.id === a.id ? { ...n, status: 'done' } : n)) };

    /* ---- 온보딩 / 로그인 / 권한 ---- */
    case 'OPEN_ONBOARDING':
      return { ...s, overlay: { flow: 'onboarding', step: a.step || 0 } };
    case 'OVERLAY_STEP':
      return { ...s, overlay: { ...s.overlay, step: a.step } };
    case 'FINISH_ONBOARDING':
      return { ...s, overlay: null, tab: 'home', stack: [],
        toast: a.silent ? null : { id: uid('t'), msg: '준비 완료! 빠뜨린 거 없죠?' } };

    /* ---- 페이월 / 플랜 ---- */
    case 'PAYWALL_TO_PLANS':
      return { ...s, overlay: { ...s.overlay, step: 1 } };
    case 'SUBSCRIBE': {
      const tier = a.tier || 'standard';
      return { ...s, tier, bagLimit: TIER_LIMIT[tier], overlay: null,
        toast: { id: uid('t'), msg: '✓ ' + (tier === 'pro' ? '프로' : '스탠다드') + ' 시작! 이제 가방을 더 만들 수 있어요' } };
    }
    case 'CLOSE_OVERLAY':
      return { ...s, overlay: null };

    case 'TOAST':
      return { ...s, toast: { id: uid('t'), msg: a.msg } };
    case 'CLEAR_TOAST':
      return s.toast && s.toast.id === a.id ? { ...s, toast: null } : s;

    case 'RESET':
      return seedState();

    default:
      return s;
  }
}

/* ============================ Context ============================ */
const StoreCtx = React.createContext(null);
function StoreProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, undefined, seedState);
  return <StoreCtx.Provider value={{ state, dispatch }}>{children}</StoreCtx.Provider>;
}
const useStore = () => React.useContext(StoreCtx);

Object.assign(window, {
  StoreProvider, useStore, seedState, reducer,
  recommendBagEmojis, recommendItemEmojis, activeBag, isDraftContext, topScreen, TIER_LIMIT, uid,
});
