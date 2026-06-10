// screens-home.jsx — 확정 홈: 내 가방 리스트 → 가방 상세 → 위치 설정
//   가방 상세 부가 상태: ⋯ 가방 메뉴 / 준비물 ⋯ 액션 메뉴 / 준비물 편집 시트 / 준비물 추가 picker
//   모델: '내 준비물'에 원본 보관(공유) → 가방에 담음. 가방에서 빼기 ≠ 원본 삭제.
// depends on window primitives from wireframe-ui.jsx (+ LivePill from screens-core.jsx)

/* 준비물 이모지 매핑 */
const EMO = {
  '휴대폰': '📱', '지갑': '👛', '차 키': '🔑', '사원증': '🪪', '이어폰': '🎧', '우산': '☂️',
  '운동복': '👕', '수건': '🧺', '셰이커': '🥤', '노트북': '💻', '충전기': '🔌', '텀블러': '🥤',
  '마스크': '😷', '약': '💊', '여권': '🛂', '카드': '💳', '물병': '💧', '책': '📖',
  '우유': '🥛', '달걀': '🥚', '식빵': '🍞', '처방전': '📄', '세탁물': '🧺',
};
const emo = (l) => EMO[l] || '📦';

/* 준비물 가로 슬라이드 스트립 (리스트용, 한 줄) */
function ChipStrip({ items }) {
  return (
    <div style={{ position: 'relative', marginTop: 6 }}>
      <div className="chipstrip" style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 2 }}>
        {items.map((c, i) => (
          <Sticker key={c} icon={emo(c)} label={c} rot={i % 2 ? 1 : -1}
            style={{ fontSize: 11, padding: '3px 7px 3px 4px', flex: 'none' }}/>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 2, width: 26,
        background: 'linear-gradient(90deg, transparent, var(--card))', pointerEvents: 'none' }}></div>
    </div>
  );
}

/* ===================== 내 가방 리스트 (홈) ===================== */
function BagListRow({ name, emoji, items, depart, arrive, on }) {
  const trig = [depart && '떠날 때', arrive && '도착할 때'].filter(Boolean).join(' · ');
  return (
    <div className="card pad" style={{ borderColor: on ? 'var(--good)' : 'var(--line)' }}>
      <div className="row" style={{ gap: 9, justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 9, minWidth: 0 }}>
          {emoji && (
            <span className="center" style={{ width: 38, height: 38, flex: 'none', fontSize: 21,
              background: 'var(--card)', border: '1.5px solid var(--ink)', borderRadius: '12px 10px 13px 10px' }}>{emoji}</span>
          )}
          <div className="col" style={{ minWidth: 0 }}>
            <b style={{ fontSize: 17, whiteSpace: 'nowrap', lineHeight: 1.1 }}>{name}</b>
            <span className="tiny" style={{ marginTop: 2, whiteSpace: 'nowrap' }}>
              <span style={{ color: 'var(--accent)' }}>● </span>{trig} · 챙길 것 {items.length}
            </span>
          </div>
        </div>
        <Toggle on={on}/>
      </div>
      <ChipStrip items={items}/>
    </div>
  );
}
function HomeList() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="내 가방" sub="빠뜨린 거 없죠?" action={<div className="iconbtn"><Ic.plus/></div>}/>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 11 }}>
          <span className="tiny">가방 2개 · 1개 켜짐</span>
          <BagListRow name="출근 가방" emoji="💼" on depart
            items={['휴대폰', '지갑', '차 키', '사원증', '이어폰', '우산']}/>
          <BagListRow name="헬스장" emoji="🏋️" depart
            items={['운동복', '수건', '이어폰', '셰이커']}/>
          <div className="card pad row center" style={{ gap: 8, borderStyle: 'dashed', color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
            <Ic.plus/> 가방 추가 <span className="tiny">(3개째부터 프로)</span>
          </div>
          <Note>우측 토글로 이 가방 감지 켜고 끄기 · 행을 탭하면 지도 상세로 ↓</Note>
        </div>
      </Body>
      <TabBar active="list"/>
    </Phone>
  );
}

/* ===================== 내 가방 — 빈 상태 (첫 실행 · 가방 0개) ===================== */
function HomeEmpty() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="내 가방" sub="빠뜨린 거 없죠?" action={<div className="iconbtn"><Ic.plus/></div>}/>
      <Body>
        <div className="pad col center" style={{ flex: 1, gap: 14, textAlign: 'center', padding: '0 28px' }}>
          <div style={{ flex: 1 }}></div>
          <div className="center" style={{ width: 96, height: 96, border: '2px dashed var(--line)', borderRadius: 28 }}>
            <Sticker label="" style={{ width: 52, height: 52, borderRadius: 16 }} icon=""/>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>아직 가방이 없어요</div>
          <div className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>
            가방을 만들고 챙길 것·위치를 정해두면,<br/>집을 나설 때 알아서 "챙기셨나요?"를 띄워줄게요.
          </div>
          <Btn pri style={{ marginTop: 4 }}><Ic.plus/> 첫 가방 만들기</Btn>
          <Note>가방 0개일 때만 보이는 화면. 만들면 리스트로 전환</Note>
          <div style={{ flex: 1 }}></div>
        </div>
      </Body>
      <TabBar active="list"/>
    </Phone>
  );
}

/* ===================== 내 가방 — 위치 권한 거부 (감지 멈춤 배너) ===================== */
function HomePermBlocked() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="내 가방" sub="빠뜨린 거 없죠?" action={<div className="iconbtn"><Ic.plus/></div>}/>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 11 }}>
          {/* 능동 경고 배너 — 위치 꺼지면 앱 핵심(지오펜스)이 죽음 */}
          <div className="card col" style={{ gap: 9, padding: '12px 13px',
            borderColor: 'var(--accent)', background: 'var(--accent-soft)' }}>
            <div className="row" style={{ gap: 9, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent)', flex: 'none', marginTop: 1 }}><Ic.pin/></span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>출발 감지가 멈췄어요</div>
                <div className="tiny" style={{ marginTop: 2, lineHeight: 1.4 }}>위치 권한이 '항상 허용'이 아니라 집을 나서도 알림이 오지 않아요.</div>
              </div>
            </div>
            <Btn pri full style={{ padding: '8px 0' }}>위치 권한 켜기</Btn>
          </div>

          <span className="tiny">가방 2개 · <span style={{ color: 'var(--accent)' }}>감지 멈춤</span></span>
          <div style={{ opacity: .55 }}>
            <BagListRow name="출근 가방" emoji="💼" depart
              items={['휴대폰', '지갑', '차 키', '사원증', '이어폰', '우산']}/>
          </div>
          <div style={{ opacity: .55 }}>
            <BagListRow name="헬스장" emoji="🏋️" depart
              items={['운동복', '수건', '이어폰', '셰이커']}/>
          </div>
          <Note>권한 켤 때까지 토글 비활성 · 같은 상태가 설정 → 권한에도 '거부됨'으로 표기</Note>
        </div>
      </Body>
      <TabBar active="list"/>
    </Phone>
  );
}

/* ===================== 가방 상세 공통 조각 ===================== */
function TriggerBtn({ icon, label, on }) {
  return (
    <div className="btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 7, padding: '11px 8px',
      background: on ? 'var(--accent)' : 'var(--card)', color: on ? '#fff' : 'var(--ink)',
      boxShadow: on ? '3px 3px 0 rgba(44,42,38,.18)' : 'none' }}>
      <span style={{ flex: 'none', display: 'flex' }}>{icon}</span>
      <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}
function MapMini() {
  return (
    <div style={{ position: 'relative', height: 182, margin: '0 16px', borderRadius: 18,
      border: '1.5px solid var(--ink)', overflow: 'hidden', cursor: 'pointer',
      background: 'repeating-linear-gradient(0deg,#fff,#fff 23px,#eceae1 23px,#eceae1 24px), repeating-linear-gradient(90deg,#f4f2ec,#f4f2ec 31px,#eceae1 31px,#eceae1 32px)' }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: 100, height: 100, borderRadius: '50%', border: '1.5px dashed var(--accent)', background: 'rgba(232,103,74,.10)' }}></div>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-100%)', color: 'var(--accent)' }}><Ic.pin/></div>
      <span className="stk" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,7px)', fontSize: 12, padding: '3px 8px', whiteSpace: 'nowrap' }}>우리집</span>
      <span className="pill" style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'var(--card)', whiteSpace: 'nowrap' }}>
        <Ic.pin/> 탭해서 위치 · 반경 설정
      </span>
    </div>
  );
}
/* 준비물 칩 — menu=true면 오른쪽에 ⋯ (탭하면 편집/빼기 메뉴) */
function ItemSticker({ label, peel, menu }) {
  return (
    <span className={"stk" + (peel ? ' peel' : '')} style={{ fontSize: 15, paddingRight: menu ? 6 : 11 }}>
      <span className="ico" style={{ background: 'var(--mark)' }}>{emo(label)}</span>
      {label}
      {menu && (
        <span className="center" style={{ width: 20, height: 20, marginLeft: 4, color: 'var(--ink-soft)',
          borderLeft: '1.5px solid var(--line-soft)' }}><Ic.dots/></span>
      )}
    </span>
  );
}
function AddItemChip() {
  return (
    <span className="stk" style={{ borderStyle: 'dashed', color: 'var(--ink-soft)', fontSize: 15, padding: '7px 13px 7px 11px' }}>
      <Ic.plus/> 챙길 것 담기
    </span>
  );
}
/* 떠날 때 / 도착할 때 세그먼트 탭 */
function TriggerTabs({ active = 'depart' }) {
  return (
    <div className="row" style={{ gap: 0, border: '1.5px solid var(--ink)', borderRadius: 12, overflow: 'hidden' }}>
      <div className="center" style={{ flex: 1, gap: 6, padding: '10px 0', fontFamily: 'var(--hand)', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
        background: active === 'depart' ? 'var(--accent)' : 'transparent', color: active === 'depart' ? '#fff' : 'var(--ink-soft)' }}>
        <Ic.exit/> 떠날 때
      </div>
      <div className="center" style={{ flex: 1, gap: 6, padding: '10px 0', fontFamily: 'var(--hand)', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
        background: active === 'arrive' ? 'var(--accent)' : 'transparent', color: active === 'arrive' ? '#fff' : 'var(--ink-soft)' }}>
        <Ic.enter/> 도착할 때
      </div>
    </div>
  );
}

/* ===================== 가방 상세 (기본 골격) ===================== */
function BagDetailBase({ children, trigCaption = true, active = 'depart' }) {
  return (
    <>
      <AppBar title="출근 가방" back action={<div className="iconbtn"><Ic.dots/></div>}/>
      <Body>
        <div className="col" style={{ flex: 1 }}>
          <MapMini/>
          <div className="pad col" style={{ gap: 11, flex: 1 }}>
            <div className="row tiny" style={{ gap: 6, whiteSpace: 'nowrap' }}><Ic.pin/> 우리집 · 반경 <b style={{ color: 'var(--accent)' }}>200m</b></div>
            <TriggerTabs active={active}/>
            {trigCaption && (
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="tiny">{active === 'arrive' ? '이 구역에 들어오면 알림' : '이 구역을 나가면 “챙겼나요?” 알림'}</span>
                <span className="tiny" style={{ color: 'var(--good)' }}>켜짐</span>
              </div>
            )}
            <Hr/>
            {children}
          </div>
        </div>
      </Body>
    </>
  );
}
function BagMap() {
  return (
    <Phone>
      <StatusBar/>
      <BagDetailBase>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="tiny">떠날 때 챙길 것 6</div>
          <span className="tiny" style={{ color: 'var(--good)' }}>✓ 저장됨</span>
        </div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <ItemSticker label="휴대폰" peel menu/><ItemSticker label="지갑" menu/>
          <ItemSticker label="차 키" menu/><ItemSticker label="사원증" peel menu/>
          <ItemSticker label="이어폰" menu/><ItemSticker label="우산" menu/>
          <AddItemChip/>
        </div>
        <Note>세그먼트로 트리거 전환 · 각 챙길 것의 ⋯ → 편집·빼기 · 즉시 저장</Note>
      </BagDetailBase>
    </Phone>
  );
}

/* ===================== 가방 상세 — 도착할 때 탭 (살 것) ===================== */
function BagMapArrive() {
  return (
    <Phone>
      <StatusBar/>
      <BagDetailBase active="arrive">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="tiny">도착할 때 챙길 것 3</div>
          <span className="tiny" style={{ color: 'var(--good)' }}>✓ 저장됨</span>
        </div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <ItemSticker label="우유" menu/><ItemSticker label="달걀" menu/><ItemSticker label="식빵" menu/>
          <AddItemChip/>
        </div>
        <Note>같은 가방이라도 트리거가 다르면 목록이 다름 — 도착할 때는 ‘살 것’</Note>
      </BagDetailBase>
    </Phone>
  );
}

/* ===================== 가방 상세 — ⋯ 가방 메뉴 ===================== */
function BagMapMenu() {
  return (
    <Phone>
      <StatusBar/>
      <BagDetailBase>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <ItemSticker label="휴대폰" peel menu/><ItemSticker label="지갑" menu/><ItemSticker label="차 키" menu/>
          <ItemSticker label="사원증" peel menu/><ItemSticker label="이어폰" menu/><ItemSticker label="우산" menu/>
          <AddItemChip/>
        </div>
      </BagDetailBase>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,42,38,.18)' }}></div>
      <div className="card" style={{ position: 'absolute', top: 46, right: 14, width: 188, padding: 6,
        boxShadow: '4px 6px 0 rgba(44,42,38,.18)' }}>
        <div className="row" style={{ gap: 9, padding: '10px 11px' }}><Ic.edit/><span style={{ fontSize: 15 }}>이름·이모지 변경</span></div>
        <Hr/>
        <div className="row" style={{ gap: 9, padding: '10px 11px', color: 'var(--accent)' }}><Ic.trash/><span style={{ fontSize: 15 }}>가방 삭제</span></div>
      </div>
      <div style={{ position: 'absolute', top: 39, right: 22, width: 12, height: 12, background: 'var(--card)',
        border: '1.5px solid var(--ink)', borderBottom: 'none', borderRight: 'none', transform: 'rotate(45deg)' }}></div>
    </Phone>
  );
}

/* 가방 이름·이모지 편집기 — [이모지][이름] + 추천 스트립 (편집 시트용) */
function EmojiNameEditor({ emoji, value, hi = 1 }) {
  const sug = ['🎒', '💼', '🧳', '👔', '🏢', '🚪'];
  return (
    <div>
      <div className="row" style={{ gap: 9 }}>
        <span className="center" style={{ width: 44, height: 44, flex: 'none', fontSize: 23,
          background: 'var(--card)', border: '1.5px solid var(--ink)', borderRadius: '13px 11px 14px 11px' }}>{emoji}</span>
        <div className="row" style={{ flex: 1, minWidth: 0, gap: 1, background: '#fff', border: '1.5px solid var(--ink)',
          borderRadius: 11, padding: '11px 12px', fontSize: 16 }}>
          <span>{value}</span>
          <span style={{ width: 1.5, height: 18, background: 'var(--accent)', display: 'inline-block', marginLeft: 1 }}></span>
        </div>
      </div>
      <div className="tiny" style={{ margin: '10px 0 6px' }}>🔍 ‘{value}’ 추천 이모지</div>
      <div className="row" style={{ gap: 7, overflowX: 'hidden' }}>
        {sug.map((e, i) => (
          <span key={i} className="center" style={{ width: 34, height: 34, flex: 'none', fontSize: 18, borderRadius: 9,
            border: '1.5px solid ' + (i === hi ? 'var(--accent)' : 'var(--line-soft)'),
            background: i === hi ? 'var(--accent-soft)' : '#fff' }}>{e}</span>
        ))}
      </div>
    </div>
  );
}

/* ===================== 가방 편집 — 이름·이모지 변경 시트 (⋯ 메뉴에서) ===================== */
function BagEditSheet() {
  return (
    <Phone>
      <StatusBar/>
      <BagDetailBase>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <ItemSticker label="휴대폰" peel menu/><ItemSticker label="지갑" menu/><AddItemChip/>
        </div>
      </BagDetailBase>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,42,38,.30)' }}></div>
      <div className="card" style={{ position: 'absolute', left: 0, right: 0, bottom: KB_H, borderRadius: '20px 20px 0 0',
        padding: '11px 16px 16px', boxShadow: '0 -4px 0 rgba(44,42,38,.06)' }}>
        <div className="center" style={{ marginBottom: 9 }}>
          <span style={{ width: 38, height: 5, borderRadius: 4, background: 'var(--line)' }}></span>
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 13 }}>
          <b style={{ fontSize: 18 }}>가방 편집</b><div className="iconbtn"><Ic.x/></div>
        </div>
        <EmojiNameEditor emoji="💼" value="출근 가방"/>
        <Btn pri full style={{ marginTop: 16 }}>저장</Btn>
      </div>
      <MiniKeyboard/>
    </Phone>
  );
}

/* ===================== 준비물 ⋯ 액션 메뉴 (편집 / 가방에서 빼기) ===================== */
function ItemActionMenu() {
  return (
    <Phone>
      <StatusBar/>
      <BagDetailBase trigCaption={false}>
        <div className="tiny" style={{ marginBottom: 2 }}>떠날 때 챙길 것 6</div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <ItemSticker label="휴대폰" peel menu/><ItemSticker label="지갑" menu/><ItemSticker label="차 키" menu/>
          <ItemSticker label="사원증" peel menu/><ItemSticker label="이어폰" menu/><ItemSticker label="우산" menu/>
          <AddItemChip/>
        </div>
        <Note>챙길 것의 ⋯ 탭 → 편집 / 가방에서 빼기 (원본은 ‘내 챙길 것’에 남음)</Note>
      </BagDetailBase>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,42,38,.18)' }}></div>
      <div className="card" style={{ position: 'absolute', top: 360, left: 92, width: 168, padding: 6,
        boxShadow: '4px 6px 0 rgba(44,42,38,.18)' }}>
        <div className="row" style={{ gap: 9, padding: '10px 11px' }}><Ic.edit/><span style={{ fontSize: 15 }}>편집</span></div>
        <Hr/>
        <div className="row" style={{ gap: 9, padding: '10px 11px', color: 'var(--accent)' }}><Ic.minus/><span style={{ fontSize: 15 }}>가방에서 빼기</span></div>
      </div>
    </Phone>
  );
}

/* ===================== 준비물 편집 바텀시트 (이모지 + 이름) ===================== */
function ItemEditSheet() {
  const grid = ['📱', '👛', '🔑', '🪪', '🎧', '☂️', '💳', '💻', '🔌', '🥤', '😷', '💊', '🛂', '👕', '🧺', '📦'];
  return (
    <Phone>
      <StatusBar/>
      <BagDetailBase trigCaption={false}>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <ItemSticker label="휴대폰" peel menu/><ItemSticker label="지갑" menu/><ItemSticker label="차 키" menu/><AddItemChip/>
        </div>
      </BagDetailBase>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,42,38,.22)' }}></div>
      <div className="card" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderRadius: '20px 20px 0 0',
        padding: '12px 16px 18px', boxShadow: '0 -4px 0 rgba(44,42,38,.06)' }}>
        <div className="center" style={{ marginBottom: 10 }}>
          <span style={{ width: 38, height: 5, borderRadius: 4, background: 'var(--line)' }}></span>
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <b style={{ fontSize: 18 }}>챙길 것 편집</b>
          <div className="iconbtn"><Ic.x/></div>
        </div>
        <div className="row" style={{ gap: 11, marginBottom: 12 }}>
          <span className="center" style={{ width: 54, height: 54, flex: 'none', fontSize: 28,
            background: 'var(--mark)', border: '1.5px solid var(--ink)', borderRadius: '15px 13px 16px 12px' }}>📱</span>
          <div style={{ flex: 1 }}>
            <div className="lbl">이름</div>
            <div className="fld">휴대폰</div>
          </div>
        </div>
        <div className="lbl">이모지 고르기</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 7, marginBottom: 14 }}>
          {grid.map((e, i) => (
            <span key={i} className="center" style={{ aspectRatio: '1', fontSize: 19, borderRadius: 9,
              border: '1.5px solid ' + (i === 0 ? 'var(--accent)' : 'var(--line-soft)'),
              background: i === 0 ? 'var(--accent-soft)' : '#fff' }}>{e}</span>
          ))}
        </div>
        <Btn pri full>저장</Btn>
      </div>
    </Phone>
  );
}

/* 담기 시트 공용 — 트리거 선택 세그먼트 (시트 안에서 떠날/도착 전환) */
function PickerTriggerSeg({ active = 'depart' }) {
  return (
    <div className="row" style={{ gap: 0, border: '1.5px solid var(--ink)', borderRadius: 12, overflow: 'hidden', marginBottom: 7 }}>
      <div className="center" style={{ flex: 1, gap: 6, padding: '9px 0', fontFamily: 'var(--hand)', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
        background: active === 'depart' ? 'var(--accent)' : 'transparent', color: active === 'depart' ? '#fff' : 'var(--ink-soft)' }}><Ic.pin/> 떠날 때</div>
      <div className="center" style={{ flex: 1, gap: 6, padding: '9px 0', fontFamily: 'var(--hand)', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
        background: active === 'arrive' ? 'var(--accent)' : 'transparent', color: active === 'arrive' ? '#fff' : 'var(--ink-soft)' }}><Ic.cart/> 도착할 때</div>
    </div>
  );
}

/* ===================== 챙길 것 담기 — ‘내 챙길 것’에서 (다중선택 + 새로 만들기) ===================== */
function ItemAddPicker() {
  const mine = [['휴대폰', 1], ['지갑', 1], ['차 키', 1], ['사원증', 1], ['이어폰', 1], ['우산', 1],
    ['노트북', 0], ['충전기', 0], ['텀블러', 0], ['마스크', 0], ['약', 0], ['카드', 0]];
  return (
    <Phone>
      <StatusBar/>
      <BagDetailBase trigCaption={false}>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <ItemSticker label="휴대폰" peel menu/><ItemSticker label="지갑" menu/><AddItemChip/>
        </div>
      </BagDetailBase>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,42,38,.22)' }}></div>
      <div className="card" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderRadius: '20px 20px 0 0',
        padding: '12px 16px 18px', boxShadow: '0 -4px 0 rgba(44,42,38,.06)' }}>
        <div className="center" style={{ marginBottom: 10 }}>
          <span style={{ width: 38, height: 5, borderRadius: 4, background: 'var(--line)' }}></span>
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
          <b style={{ fontSize: 18 }}>챙길 것 담기</b>
          <div className="iconbtn"><Ic.x/></div>
        </div>
        {/* 트리거 선택 — 떠날/도착 */}
        <PickerTriggerSeg active="depart"/>
        <div className="tiny" style={{ marginBottom: 12 }}>떠날 때 = 챙길 소지품 · 도착할 때 = 살 것</div>
        <div className="fld row" style={{ gap: 7, marginBottom: 12, color: 'var(--accent)', borderColor: 'var(--accent)', borderStyle: 'dashed' }}><Ic.plus/> 새 소지품 만들기</div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {mine.map(([l, on]) => (
            <span key={l} className="stk" style={{ fontSize: 13, position: 'relative',
              borderColor: on ? 'var(--accent)' : 'var(--ink)', background: on ? 'var(--accent-soft)' : 'var(--card)' }}>
              <span className="ico" style={{ background: 'var(--mark)' }}>{emo(l)}</span>{l}
              {on === 1 && (
                <span className="center" style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--accent)', color: '#fff', border: '1.5px solid var(--ink)' }}><Ic.check/></span>
              )}
            </span>
          ))}
        </div>
        <Btn pri full>가방에 담기 · 6개</Btn>
      </div>
    </Phone>
  );
}

/* ===================== 챙길 것 담기 — 새 소지품 인라인 생성 (펼친 상태 + 키보드) ===================== */
const KB_H = 196;
function MiniKey({ children, w, dark, accent }) {
  return (
    <span style={{ flex: w || 1, minWidth: 0, height: 28, margin: '0 2px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 500,
      borderRadius: 5, color: '#2c2a26',
      background: accent ? 'var(--accent)' : (dark ? '#b9b4a8' : '#fff'),
      boxShadow: '0 1px 0 rgba(44,42,38,.28)' }}>{accent ? <span style={{ color: '#fff' }}>{children}</span> : children}</span>
  );
}
function MiniKeyboard() {
  const rows = [['ㅂ','ㅈ','ㄷ','ㄱ','ㅅ','ㅛ','ㅕ','ㅑ','ㅐ','ㅔ'],
    ['ㅁ','ㄴ','ㅇ','ㄹ','ㅎ','ㅗ','ㅓ','ㅏ','ㅣ'],
    ['⇧','ㅋ','ㅌ','ㅊ','ㅍ','ㅠ','ㅜ','ㅡ','⌫']];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: KB_H,
      background: '#cdc8bc', padding: '7px 2px 5px', display: 'flex', flexDirection: 'column', gap: 6, zIndex: 3 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'center', padding: i === 1 ? '0 13px' : 0 }}>
          {r.map((k, j) => <MiniKey key={j} dark={k === '⇧' || k === '⌫'}>{k}</MiniKey>)}
        </div>
      ))}
      <div style={{ display: 'flex' }}>
        <MiniKey w={1.4} dark>123</MiniKey><MiniKey w={1.2} dark>😀</MiniKey>
        <MiniKey w={4}>space</MiniKey><MiniKey w={1.8} accent>확인</MiniKey>
      </div>
    </div>
  );
}
function ItemAddCreate() {
  const strip = ['🥤', '☕', '💧', '🧋', '🍵', '🫗'];
  const mine = [['휴대폰', 1], ['지갑', 1], ['차 키', 0], ['사원증', 0]];
  return (
    <Phone>
      <StatusBar/>
      <BagDetailBase trigCaption={false}>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <ItemSticker label="휴대폰" peel menu/><ItemSticker label="지갑" menu/><AddItemChip/>
        </div>
      </BagDetailBase>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,42,38,.30)' }}></div>
      {/* 담기 시트 — 키보드 위로 올라와 붙음 */}
      <div className="card" style={{ position: 'absolute', left: 0, right: 0, bottom: KB_H, borderRadius: '20px 20px 0 0',
        padding: '11px 16px 14px', boxShadow: '0 -4px 0 rgba(44,42,38,.06)' }}>
        <div className="center" style={{ marginBottom: 9 }}>
          <span style={{ width: 38, height: 5, borderRadius: 4, background: 'var(--line)' }}></span>
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 11 }}>
          <b style={{ fontSize: 18 }}>챙길 것 담기</b><div className="iconbtn"><Ic.x/></div>
        </div>
        {/* 트리거 선택 — 떠날/도착 */}
        <PickerTriggerSeg active="depart"/>
        <div style={{ height: 5 }}></div>
        {/* ▼ 인라인 생성 줄 — 시트 최상단, 키보드 바로 위 */}
        <div style={{ border: '1.5px solid var(--accent)', borderRadius: 13, background: 'var(--accent-soft)', padding: 9, marginBottom: 12 }}>
          <div className="row" style={{ gap: 8 }}>
            <span className="center" style={{ width: 40, height: 40, flex: 'none', fontSize: 21,
              background: 'var(--mark)', border: '1.5px solid var(--ink)', borderRadius: '12px 10px 13px 10px' }}>🥤</span>
            <div className="row" style={{ flex: 1, minWidth: 0, gap: 1, background: '#fff', border: '1.5px solid var(--ink)',
              borderRadius: 10, padding: '9px 11px', fontSize: 15 }}>
              <span>텀블러</span>
              <span style={{ width: 1.5, height: 17, background: 'var(--accent)', display: 'inline-block', marginLeft: 1 }}></span>
            </div>
            <div className="btn pri sm" style={{ flex: 'none', padding: '9px 14px' }}>추가</div>
          </div>
          <div className="tiny" style={{ margin: '9px 0 5px' }}>🔍 ‘텀블러’ 검색 결과</div>
          <div className="row" style={{ gap: 6, overflowX: 'hidden' }}>
            {strip.map((e, i) => (
              <span key={i} className="center" style={{ width: 30, height: 30, flex: 'none', fontSize: 16, borderRadius: 8,
                border: '1.5px solid ' + (i === 0 ? 'var(--accent)' : 'var(--line-soft)'),
                background: i === 0 ? '#fff' : 'var(--card)' }}>{e}</span>
            ))}
          </div>
        </div>
        <div className="tiny" style={{ marginBottom: 8 }}>내 소지품 — 탭해서 가방에 담기</div>
        <div className="row" style={{ gap: 7, flexWrap: 'wrap' }}>
          {mine.map(([l, on]) => (
            <span key={l} className="stk" style={{ fontSize: 13, position: 'relative',
              borderColor: on ? 'var(--accent)' : 'var(--ink)', background: on ? 'var(--accent-soft)' : 'var(--card)' }}>
              <span className="ico" style={{ background: 'var(--mark)' }}>{emo(l)}</span>{l}
              {on === 1 && (
                <span className="center" style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--accent)', color: '#fff', border: '1.5px solid var(--ink)' }}><Ic.check/></span>
              )}
            </span>
          ))}
        </div>
      </div>
      <MiniKeyboard/>
    </Phone>
  );
}

/* ===================== 챙길 것 담기 — 추가 직후 (방금 만든 칩이 선택된 채 등장) ===================== */
function ItemAddCreated() {
  // 텀블러 = 방금 만든 것(맨 앞 · 선택 · NEW). 나머지는 기존 소지품.
  const mine = [['휴대폰', 1], ['지갑', 1], ['차 키', 0], ['사원증', 0], ['이어폰', 0], ['우산', 0],
    ['노트북', 0], ['충전기', 0]];
  return (
    <Phone>
      <StatusBar/>
      <BagDetailBase trigCaption={false}>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <ItemSticker label="휴대폰" peel menu/><ItemSticker label="지갑" menu/><AddItemChip/>
        </div>
      </BagDetailBase>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,42,38,.22)' }}></div>
      <div className="card" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderRadius: '20px 20px 0 0',
        padding: '12px 16px 18px', boxShadow: '0 -4px 0 rgba(44,42,38,.06)' }}>
        <div className="center" style={{ marginBottom: 10 }}>
          <span style={{ width: 38, height: 5, borderRadius: 4, background: 'var(--line)' }}></span>
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
          <b style={{ fontSize: 18 }}>챙길 것 담기</b>
          <div className="iconbtn"><Ic.x/></div>
        </div>
        {/* 트리거 선택 — 떠날/도착 */}
        <PickerTriggerSeg active="depart"/>
        <div className="tiny" style={{ marginBottom: 12 }}>떠날 때 = 챙길 소지품 · 도착할 때 = 살 것</div>
        {/* 생성 줄은 다시 접힘 → 트리거로 복귀 */}
        <div className="fld row" style={{ gap: 7, marginBottom: 12, color: 'var(--accent)', borderColor: 'var(--accent)', borderStyle: 'dashed' }}><Ic.plus/> 새 소지품 만들기</div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {/* 방금 만든 텀블러 — 맨 앞 · 선택 · NEW 배지 */}
          <span className="stk" style={{ fontSize: 13, position: 'relative', borderColor: 'var(--accent)', background: 'var(--accent-soft)',
            boxShadow: '0 0 0 3px rgba(232,103,74,.18), 2px 3px 0 rgba(44,42,38,.12)' }}>
            <span className="ico" style={{ background: 'var(--mark)' }}>{emo('텀블러')}</span>텀블러
            <span className="center" style={{ position: 'absolute', top: -7, left: -6, padding: '1px 5px', borderRadius: 8,
              fontFamily: 'var(--mono)', fontSize: 8, background: 'var(--accent)', color: '#fff', border: '1.5px solid var(--ink)' }}>NEW</span>
            <span className="center" style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%',
              background: 'var(--accent)', color: '#fff', border: '1.5px solid var(--ink)' }}><Ic.check/></span>
          </span>
          {mine.map(([l, on]) => (
            <span key={l} className="stk" style={{ fontSize: 13, position: 'relative',
              borderColor: on ? 'var(--accent)' : 'var(--ink)', background: on ? 'var(--accent-soft)' : 'var(--card)' }}>
              <span className="ico" style={{ background: 'var(--mark)' }}>{emo(l)}</span>{l}
              {on === 1 && (
                <span className="center" style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--accent)', color: '#fff', border: '1.5px solid var(--ink)' }}><Ic.check/></span>
              )}
            </span>
          ))}
        </div>
        <Note>추가하면 키보드 내려가고 → 방금 만든 소지품이 선택된 채로 등장</Note>
        <Btn pri full style={{ marginTop: 12 }}>가방에 담기 · 3개</Btn>
      </div>
    </Phone>
  );
}

/* ===================== 위치 설정 (지도 탭 → 전체화면) ===================== */
function LocationPicker() {
  return (
    <Phone>
      <StatusBar/>
      <Body>
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden',
          background: 'repeating-linear-gradient(0deg,#fff,#fff 27px,#eceae1 27px,#eceae1 28px), repeating-linear-gradient(90deg,#f4f2ec,#f4f2ec 33px,#eceae1 33px,#eceae1 34px)' }}>
          <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', gap: 8, zIndex: 2 }}>
            <div className="center" style={{ width: 36, height: 36, flex: 'none', border: '1.5px solid var(--ink)', background: 'var(--card)', borderRadius: 10 }}><Ic.back/></div>
            <div className="row" style={{ flex: 1, minWidth: 0, gap: 7, background: 'var(--card)', border: '1.5px solid var(--ink)', borderRadius: 11, padding: '8px 11px', fontSize: 14, color: 'var(--ink-soft)' }}>
              <span style={{ flex: 'none', display: 'flex' }}><Ic.search/></span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>지역·주소 검색</span>
            </div>
            <div className="center" title="현위치" style={{ width: 36, height: 36, flex: 'none', border: '1.5px solid var(--ink)', background: 'var(--card)', borderRadius: 10 }}><Ic.locate/></div>
          </div>
          <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)',
            width: 188, height: 188, borderRadius: '50%', border: '1.5px dashed var(--accent)', background: 'rgba(232,103,74,.12)' }}></div>
          <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-100%)', color: 'var(--accent)' }}><Ic.pin/></div>
          <span className="tiny" style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,10px)', background: 'var(--card)', padding: '2px 7px', borderRadius: 6, border: '1.5px solid var(--ink)', whiteSpace: 'nowrap' }}>탭해서 핀 이동</span>
          <div className="card pad col" style={{ position: 'absolute', left: 12, right: 12, bottom: 12, gap: 11 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>감지 반경</span>
              <span className="pill on">200m</span>
            </div>
            <div className="row" style={{ gap: 9 }}>
              <div className="center" style={{ width: 26, height: 26, flex: 'none', border: '1.5px solid var(--ink)', borderRadius: 7 }}><Ic.minus/></div>
              <div style={{ flex: 1, height: 6, borderRadius: 5, border: '1.5px solid var(--ink)', background: 'var(--line-soft)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '52%', background: 'var(--accent)', borderRadius: 5 }}></div>
                <div style={{ position: 'absolute', left: '52%', top: '50%', transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: '50%', background: '#fff', border: '1.5px solid var(--ink)' }}></div>
              </div>
              <div className="center" style={{ width: 26, height: 26, flex: 'none', border: '1.5px solid var(--ink)', borderRadius: 7 }}><Ic.plus/></div>
            </div>
            <div className="tiny" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>우리집 · 서울시 성동구 — 핀 위치 기준으로 감지해요</div>
            <Btn pri full>이 위치로 확인</Btn>
          </div>
        </div>
      </Body>
    </Phone>
  );
}

/* ===================== 가방 생성 = 빈 가방 상세 ===================== */
/* 위치 미설정 빈 지도 (MapMini의 placeholder 버전) */
function MapBlank() {
  return (
    <div style={{ position: 'relative', height: 182, margin: '0 16px', borderRadius: 18,
      border: '1.5px dashed var(--line)', overflow: 'hidden', cursor: 'pointer',
      background: 'repeating-linear-gradient(45deg,#fff,#fff 9px,#f1efe7 9px,#f1efe7 18px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="pill" style={{ background: 'var(--card)', whiteSpace: 'nowrap' }}>
        <Ic.pin/> 탭해서 위치 · 반경 정하기
      </span>
    </div>
  );
}
/* 이름 필드 (상세에선 AppBar 제목·이모지가 되는 값) — [이모지][이름] */
function NameField({ emoji, value, ph }) {
  return (
    <div className="pad" style={{ paddingBottom: 0 }}>
      <div className="lbl">가방 이름</div>
      <div className="row" style={{ gap: 9 }}>
        <span className="row center" style={{ gap: 3, height: 44, padding: '0 9px', flex: 'none',
          background: value ? 'var(--card)' : 'transparent', borderRadius: '13px 11px 14px 11px',
          border: '1.5px ' + (value ? 'solid' : 'dashed') + ' var(--ink)', opacity: value ? 1 : .6 }}>
          <span style={{ fontSize: 21 }}>{emoji || '🎒'}</span>
          <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>▾</span>
        </span>
        <div className={"fld" + (value ? '' : ' ph')} style={{ flex: 1, fontSize: 17, fontFamily: 'var(--hand)' }}>
          {value || ph}
        </div>
      </div>
    </div>
  );
}
/* 생성 공통 골격 — 상세(BagDetailBase)와 같은 순서: 이름 → 지도 → 트리거 → 챙길 것 → CTA */
function BagCreateShell({ emoji, name, map, locLine, count, items, ready, note }) {
  return (
    <>
      <AppBar title="새 가방" back/>
      <Body>
        <div className="col" style={{ flex: 1 }}>
          <NameField emoji={emoji} value={name} ph="예) 출근 가방 · 헬스장 · 장보기"/>
          <div style={{ height: 12 }}></div>
          {map}
          <div className="pad col" style={{ gap: 11, flex: 1 }}>
            {locLine}
            <TriggerTabs active="depart"/>
            <span className="tiny">이 구역을 나가면 “챙겼나요?” 알림</span>
            <Hr/>
            <div className="tiny">떠날 때 챙길 것 {count}</div>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              {items}
              <AddItemChip/>
            </div>
            <Note>{note}</Note>
            <div style={{ flex: 1 }}></div>
            {ready
              ? <Btn pri full>가방 만들기</Btn>
              : <Btn full style={{ opacity: .45, borderStyle: 'dashed' }}>이름·위치·챙길 것을 채워주세요</Btn>}
          </div>
        </div>
      </Body>
    </>
  );
}
/* 빈 상태 — + 눌러 막 진입한 화면 */
function BagCreate() {
  return (
    <Phone>
      <StatusBar/>
      <BagCreateShell
        map={<MapBlank/>}
        locLine={<div className="row tiny" style={{ gap: 6, color: 'var(--ink-soft)' }}><Ic.pin/> 위치 미설정 — 위 지도를 탭하세요</div>}
        count={0}
        items={null}
        ready={false}
        note="생성 = 빈 가방 상세. 같은 레이아웃으로 만들고 → 그대로 씀"
      />
    </Phone>
  );
}
/* 작성 중 → 만들 준비됨 */
function BagCreateFilled() {
  return (
    <Phone>
      <StatusBar/>
      <BagCreateShell
        emoji="💼"
        name="출근 가방"
        map={<MapMini/>}
        locLine={<div className="row tiny" style={{ gap: 6, whiteSpace: 'nowrap' }}><Ic.pin/> 우리집 · 반경 <b style={{ color: 'var(--accent)' }}>200m</b></div>}
        count={3}
        items={<><ItemSticker label="휴대폰" peel menu/><ItemSticker label="지갑" menu/><ItemSticker label="차 키" menu/></>}
        ready
        note="도착할 때 목록은 만든 뒤 세그먼트만 바꿔 그대로 추가"
      />
    </Phone>
  );
}

/* 이름·이모지 입력 포커싱 — 🎒/이름칸 탭 시 키보드 + 추천 스트립 인라인 (별도 화면 X) */
function BagCreateName() {
  const def = ['🎒', '💼', '🧳', '🏋️', '🛍️', '👜'];
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="새 가방" back/>
      <Body>
        <div className="col" style={{ flex: 1 }}>
          <div className="pad" style={{ paddingBottom: 4 }}>
            <div className="lbl">가방 이름</div>
            <div className="row" style={{ gap: 9 }}>
              <span className="row center" style={{ gap: 3, height: 44, padding: '0 9px', flex: 'none',
                background: 'var(--card)', border: '1.5px solid var(--accent)', borderRadius: '13px 11px 14px 11px',
                boxShadow: '0 0 0 3px rgba(232,103,74,.16)' }}>
                <span style={{ fontSize: 21 }}>🎒</span><span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>▾</span>
              </span>
              <div className="row" style={{ flex: 1, minWidth: 0, gap: 1, background: '#fff', border: '1.5px solid var(--ink)',
                borderRadius: 11, padding: '11px 12px', fontSize: 16 }}>
                <span style={{ color: '#a8a294' }}>이름 입력</span>
                <span style={{ width: 1.5, height: 18, background: 'var(--accent)', display: 'inline-block', marginLeft: 1 }}></span>
              </div>
            </div>
            <div className="tiny" style={{ margin: '10px 0 6px' }}>자주 쓰는 이모지</div>
            <div className="row" style={{ gap: 7, overflowX: 'hidden' }}>
              {def.map((e, i) => (
                <span key={i} className="center" style={{ width: 34, height: 34, flex: 'none', fontSize: 18, borderRadius: 9,
                  border: '1.5px solid ' + (i === 0 ? 'var(--accent)' : 'var(--line-soft)'),
                  background: i === 0 ? 'var(--accent-soft)' : '#fff' }}>{e}</span>
              ))}
            </div>
          </div>
          <div style={{ opacity: .35, marginTop: 8 }}>
            <div style={{ height: 88, margin: '0 16px', borderRadius: 18, border: '1.5px dashed var(--line)',
              background: 'repeating-linear-gradient(45deg,#fff,#fff 9px,#f1efe7 9px,#f1efe7 18px)' }}></div>
          </div>
          <Note>이름 치기 시작하면 ‘🔍 추천 이모지’로 전환 · 키보드 😀로 직접 입력도 가능</Note>
        </div>
        <MiniKeyboard/>
      </Body>
    </Phone>
  );
}

Object.assign(window, { HomeList, HomeEmpty, HomePermBlocked, BagMap, BagMapArrive, BagMapMenu, BagEditSheet, ItemActionMenu, ItemEditSheet, ItemAddPicker, ItemAddCreate, ItemAddCreated, LocationPicker, BagCreate, BagCreateName, BagCreateFilled });
