// hifi-items.jsx — 챙길 것 편집/담기 플로우 + 키보드
//   ItemActionMenu(⋯ 편집/빼기) · ItemEditSheet · ItemAddPicker · ItemAddCreate(인라인생성) · ItemAddCreated(NEW)
// depends on hifi-ui.jsx + hifi-home.jsx (window)

const KB_H = 232;

/* ---------- iOS풍 한글 키보드 ---------- */
function Key({ children, w, dark, accent, wide }) {
  return (
    <span style={{ flex: w || 1, minWidth: 0, height: 38, margin: '0 2.5px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: dark || accent ? 13 : 17, fontWeight: dark || accent ? 600 : 500,
      borderRadius: 6, color: accent ? '#fff' : 'var(--ink)',
      background: accent ? 'var(--accent)' : (dark ? '#b3aea2' : '#fff'),
      boxShadow: '0 1px 0 rgba(44,42,38,.3)' }}>{children}</span>
  );
}
function KbdKR({ action = '확인' }) {
  const rows = [
    ['ㅂ','ㅈ','ㄷ','ㄱ','ㅅ','ㅛ','ㅕ','ㅑ','ㅐ','ㅔ'],
    ['ㅁ','ㄴ','ㅇ','ㄹ','ㅎ','ㅗ','ㅓ','ㅏ','ㅣ'],
    ['ㅋ','ㅌ','ㅊ','ㅍ','ㅠ','ㅜ','ㅡ'],
  ];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: KB_H, zIndex: 40,
      background: '#cfcabd', padding: '8px 3px 30px', display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{rows[0].map((k, i) => <Key key={i}>{k}</Key>)}</div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 18px' }}>{rows[1].map((k, i) => <Key key={i}>{k}</Key>)}</div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Key w={1.5} dark>⇧</Key>
        {rows[2].map((k, i) => <Key key={i}>{k}</Key>)}
        <Key w={1.5} dark>⌫</Key>
      </div>
      <div style={{ display: 'flex' }}>
        <Key w={1.5} dark>!#1</Key><Key w={1.2} dark>🌐</Key>
        <Key w={4.5}>스페이스</Key><Key w={2} accent>{action}</Key>
      </div>
    </div>
  );
}

/* ---------- 뒤에 깔리는 가방 상세(흐릿) ---------- */
function DetailBehind() {
  return (
    <BagDetailShell active="depart">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>떠날 때 챙길 것 <span style={{ color: 'var(--ink-soft)' }}>2</span></span>
      </div>
      <div className="row" style={{ gap: 9, flexWrap: 'wrap' }}>
        <ItemChip label="휴대폰" menu/><ItemChip label="지갑" menu/><AddChip/>
      </div>
    </BagDetailShell>
  );
}

function SheetHead({ title }) {
  return (
    <>
      <div className="grab"></div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <b style={{ fontSize: 19, letterSpacing: '-.01em', whiteSpace: 'nowrap' }}>{title}</b>
        <div className="iconbtn" style={{ width: 32, height: 32 }}><I.x/></div>
      </div>
    </>
  );
}

/* 담기 시트 트리거 세그먼트 (작은 버전) */
function PickerSeg({ active = 'depart' }) {
  return (
    <div className="seg" style={{ marginBottom: 8 }}>
      <div className={'s' + (active === 'depart' ? ' on' : '')} style={{ padding: '8px 0', fontSize: 13.5 }}><I.exit/> 떠날 때</div>
      <div className={'s' + (active === 'arrive' ? ' on' : '')} style={{ padding: '8px 0', fontSize: 13.5 }}><I.flag/> 도착할 때</div>
    </div>
  );
}

/* 다중선택 칩 */
function PickChip({ label, on, neu, glow }) {
  return (
    <span className={'stk' + (on ? ' sel' : '')} style={{ fontSize: 13.5, position: 'relative', padding: '6px 11px 6px 5px',
      boxShadow: glow ? '0 0 0 3px rgba(232,103,74,.2), 1px 2px 0 rgba(44,42,38,.12)' : '1px 2px 0 rgba(44,42,38,.1)' }}>
      <span className="ico" style={{ width: 22, height: 22, fontSize: 13 }}>{emo(label)}</span>{label}
      {neu && <span className="stk-new">NEW</span>}
      {on && <span className="stk-check"><I.check/></span>}
    </span>
  );
}

/* ===================== 챙길 것 ⋯ 액션 메뉴 ===================== */
function ItemActionMenu() {
  return (
    <Phone>
      <StatusBar/>
      <BagDetailShell active="depart">
        <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>떠날 때 챙길 것 <span style={{ color: 'var(--ink-soft)' }}>6</span></span>
        <div className="row" style={{ gap: 9, flexWrap: 'wrap' }}>
          {['휴대폰', '지갑', '차 키', '사원증', '이어폰', '우산'].map(l => <ItemChip key={l} label={l} menu/>)}
          <AddChip/>
        </div>
      </BagDetailShell>
      <div className="scrim"></div>
      <div className="card" style={{ position: 'absolute', top: 392, left: 96, width: 190, padding: 7, zIndex: 30, boxShadow: 'var(--sh-pop)' }}>
        <div className="row" style={{ gap: 11, padding: '11px 12px', fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap' }}><I.edit/> 편집</div>
        <Hr/>
        <div className="row" style={{ gap: 11, padding: '11px 12px', fontSize: 15, fontWeight: 600, color: 'var(--danger)', whiteSpace: 'nowrap' }}><I.minus/> 가방에서 빼기</div>
      </div>
    </Phone>
  );
}

/* ===================== 챙길 것 편집 바텀시트 ===================== */
function ItemEditSheet() {
  const grid = ['📱','👛','🔑','🪪','🎧','☂️','💳','💻','🔌','🥤','😷','💊','🛂','👕','🧺','📦'];
  return (
    <Phone>
      <StatusBar/>
      <DetailBehind/>
      <div className="scrim"></div>
      <div className="sheet">
        <SheetHead title="챙길 것 편집"/>
        <div className="row" style={{ gap: 12, marginBottom: 16 }}>
          <span className="center" style={{ width: 56, height: 56, flex: 'none', fontSize: 28,
            background: 'var(--mark)', border: '1.5px solid var(--ink)', borderRadius: '15px 13px 16px 12px' }}>📱</span>
          <div style={{ flex: 1 }}>
            <div className="lbl">이름</div>
            <div className="fld">휴대폰</div>
          </div>
        </div>
        <div className="lbl">이모지 고르기</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8, marginBottom: 18 }}>
          {grid.map((e, i) => (
            <span key={i} className="center" style={{ aspectRatio: '1', fontSize: 20, borderRadius: 10,
              border: '1.5px solid ' + (i === 0 ? 'var(--accent)' : 'var(--line)'),
              background: i === 0 ? 'var(--coral-50)' : '#fff' }}>{e}</span>
          ))}
        </div>
        <Btn pri full>저장</Btn>
      </div>
    </Phone>
  );
}

/* ===================== 담기 피커 (다중선택) ===================== */
function ItemAddPicker() {
  const mine = [['휴대폰',1],['지갑',1],['차 키',1],['사원증',1],['이어폰',1],['우산',1],
    ['노트북',0],['충전기',0],['텀블러',0],['마스크',0],['약',0],['카드',0]];
  return (
    <Phone>
      <StatusBar/>
      <DetailBehind/>
      <div className="scrim"></div>
      <div className="sheet">
        <SheetHead title="챙길 것 담기"/>
        <PickerSeg active="depart"/>
        <div className="tiny" style={{ marginBottom: 13 }}>떠날 때 = 챙길 소지품 · 도착할 때 = 챙길 것 (살 것·받을 것 등)</div>
        <div className="fld" style={{ color: 'var(--accent)', borderColor: 'var(--accent)', borderStyle: 'dashed', marginBottom: 14, fontWeight: 600 }}>
          <I.plus/> 새 소지품 만들기</div>
        <div className="lbl">내 소지품 — 탭해서 담기</div>
        <div className="row" style={{ gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          {mine.map(([l, on]) => <PickChip key={l} label={l} on={!!on}/>)}
        </div>
        <Btn pri full>가방에 담기 · 6개</Btn>
      </div>
    </Phone>
  );
}

/* ===================== 새 소지품 인라인 생성 (키보드 ON) ===================== */
function ItemAddCreate() {
  const strip = ['🥤','☕','💧','🧋','🍵','🫗'];
  const mine = [['휴대폰',1],['지갑',1],['차 키',0],['사원증',0]];
  return (
    <Phone>
      <StatusBar/>
      <DetailBehind/>
      <div className="scrim" style={{ background: 'rgba(36,33,29,.5)' }}></div>
      <div className="sheet" style={{ bottom: KB_H, paddingBottom: 14 }}>
        <SheetHead title="챙길 것 담기"/>
        <PickerSeg active="depart"/>
        {/* 인라인 생성 줄 */}
        <div style={{ border: '1.5px solid var(--accent)', borderRadius: 14, background: 'var(--coral-50)', padding: 11, margin: '6px 0 14px' }}>
          <div className="row" style={{ gap: 9 }}>
            <span className="center" style={{ width: 44, height: 44, flex: 'none', fontSize: 23,
              background: 'var(--mark)', border: '1.5px solid var(--ink)', borderRadius: '13px 11px 14px 10px' }}>🥤</span>
            <div className="fld focus" style={{ flex: 1, minWidth: 0, padding: '11px 12px' }}>
              <span style={{ fontWeight: 600 }}>텀블러</span><span className="caret"></span>
            </div>
            <Btn pri sm style={{ flex: 'none' }}>추가</Btn>
          </div>
          <div className="tiny" style={{ margin: '11px 0 7px' }}>🔍 '텀블러' 검색 결과</div>
          <div className="row" style={{ gap: 8 }}>
            {strip.map((e, i) => (
              <span key={i} className="center" style={{ width: 34, height: 34, flex: 'none', fontSize: 18, borderRadius: 9,
                border: '1.5px solid ' + (i === 0 ? 'var(--accent)' : 'var(--line)'), background: i === 0 ? '#fff' : 'var(--surface-2)' }}>{e}</span>
            ))}
          </div>
        </div>
        <div className="lbl">내 소지품</div>
        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          {mine.map(([l, on]) => <PickChip key={l} label={l} on={!!on}/>)}
        </div>
      </div>
      <KbdKR action="추가"/>
    </Phone>
  );
}

/* ===================== 추가 직후 (NEW · 선택된 채 등장) ===================== */
function ItemAddCreated() {
  const mine = [['휴대폰',1],['지갑',1],['차 키',0],['사원증',0],['이어폰',0],['우산',0],['노트북',0],['충전기',0]];
  return (
    <Phone>
      <StatusBar/>
      <DetailBehind/>
      <div className="scrim"></div>
      <div className="sheet">
        <SheetHead title="챙길 것 담기"/>
        <PickerSeg active="depart"/>
        <div className="tiny" style={{ marginBottom: 13 }}>떠날 때 = 챙길 소지품 · 도착할 때 = 챙길 것 (살 것·받을 것 등)</div>
        <div className="fld" style={{ color: 'var(--accent)', borderColor: 'var(--accent)', borderStyle: 'dashed', marginBottom: 14, fontWeight: 600 }}>
          <I.plus/> 새 소지품 만들기</div>
        <div className="lbl">내 소지품 — 방금 만든 텀블러가 맨 앞에</div>
        <div className="row" style={{ gap: 11, flexWrap: 'wrap', marginBottom: 16, paddingTop: 4 }}>
          <PickChip label="텀블러" on neu glow/>
          {mine.map(([l, on]) => <PickChip key={l} label={l} on={!!on}/>)}
        </div>
        <Btn pri full>가방에 담기 · 3개</Btn>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  KbdKR, ItemActionMenu, ItemEditSheet, ItemAddPicker, ItemAddCreate, ItemAddCreated,
});
