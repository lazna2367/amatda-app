// proto-home.jsx — 내 가방 탭: 리스트 · 가방 상세 · 아이템 담기/편집 · 가방 생성 · 위치 설정
//   depends on hifi-ui.jsx + proto-store.jsx + proto-kit.jsx (window)

/* ===================== 챙길 것 가로 스트립 ===================== */
function ChipStrip({ items }) {
  if (!items.length) return <div className="tiny" style={{ marginTop: 12, color: 'var(--ink-faint)' }}>아직 챙길 것이 없어요</div>;
  return (
    <div style={{ position: 'relative', marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 7, overflow: 'hidden', paddingRight: 18 }}>
        {items.map((c) => (
          <span key={c} className="stk" style={{ fontSize: 13, padding: '5px 10px 5px 5px', flex: 'none', boxShadow: '1px 2px 0 rgba(44,42,38,.10)' }}>
            <span className="ico" style={{ width: 21, height: 21, fontSize: 12 }}>{emo(c)}</span>{c}
          </span>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 30, background: 'linear-gradient(90deg, transparent, var(--surface))', pointerEvents: 'none' }}></div>
    </div>
  );
}

/* ===================== 가방 카드 ===================== */
function BagCard({ bag, onOpen, onToggle }) {
  const on = bag.on;
  const items = bag.depart;
  return (
    <div className="card tap" onClick={onOpen} style={{ padding: '15px 16px 13px', borderColor: on ? 'var(--coral-200)' : 'var(--line)',
      boxShadow: on ? '2px 3px 0 rgba(232,103,74,.07), 0 8px 20px -14px rgba(44,42,38,.4)' : 'var(--sh-card)' }}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 10 }}>
        <div className="row" style={{ gap: 12, minWidth: 0 }}>
          <span className="center" style={{ width: 46, height: 46, flex: 'none', fontSize: 25,
            background: on ? 'var(--coral-50)' : 'var(--surface-2)', border: '1.5px solid ' + (on ? 'var(--coral-200)' : 'var(--line)'), borderRadius: '14px 12px 15px 12px' }}>{bag.emoji}</span>
          <div className="col" style={{ minWidth: 0, gap: 4 }}>
            <b style={{ fontSize: 18, letterSpacing: '-.01em', whiteSpace: 'nowrap' }}>{bag.name}</b>
            <div className="row" style={{ gap: 6 }}>
              <span className={'dot' + (on ? ' pulse' : '')} style={{ color: on ? 'var(--good)' : 'var(--ink-faint)', width: 7, height: 7 }}></span>
              <span className="tiny" style={{ whiteSpace: 'nowrap', color: on ? 'var(--good)' : 'var(--ink-soft)', fontWeight: 700 }}>{on ? '감지 중' : '꺼짐'}</span>
              <span className="tiny" style={{ whiteSpace: 'nowrap' }}>· 떠날 때 · 챙길 것 {items.length}</span>
            </div>
          </div>
        </div>
        <div onClick={(e) => { e.stopPropagation(); onToggle(); }}><Toggle on={on}/></div>
      </div>
      <ChipStrip items={items}/>
      <hr className="hr" style={{ margin: '13px 0 10px' }}/>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="row tiny" style={{ gap: 5, whiteSpace: 'nowrap', fontWeight: 600 }}>
          <span style={{ color: 'var(--accent)', display: 'flex' }}><I.pin/></span>{bag.loc.label || '집'} · {bag.loc.place || '합정동'}</span>
        <span className="tiny" style={{ whiteSpace: 'nowrap', color: on ? 'var(--good)' : 'var(--ink-faint)', fontWeight: on ? 700 : 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {on && <I.check/>}{bag.last || '—'}</span>
      </div>
    </div>
  );
}

/* ===================== 홈 리스트 ===================== */
function HomeScreen() {
  const { state, dispatch } = useStore();
  const bags = state.bags;
  const onCount = bags.filter((b) => b.on).length;
  const atLimit = bags.length >= TIER_LIMIT[state.tier];
  if (!bags.length) return <HomeEmpty/>;
  return (
    <>
      <AppBar title="아맞다" brand sub="빠뜨린 거 없죠?" action={<IconBtn onClick={() => dispatch({ type: 'START_CREATE' })}><I.plus/></IconBtn>}/>
      <div className="scr-body">
        <div className="scroll" style={{ flex: 1 }}>
          <div className="pad col" style={{ gap: 13 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="tiny" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>내 가방 {bags.length}개</span>
              {onCount > 0
                ? <span className="pill live"><span className="dot"></span>{onCount}개 감지 중</span>
                : <span className="pill"><span className="dot"></span>감지 꺼짐</span>}
            </div>
            {bags.map((b) => (
              <BagCard key={b.id} bag={b}
                onOpen={() => dispatch({ type: 'OPEN_DETAIL', bagId: b.id })}
                onToggle={() => dispatch({ type: 'TOGGLE_BAG', bagId: b.id })}/>
            ))}
            <div className="card flat center tap" onClick={() => dispatch({ type: 'START_CREATE' })}
              style={{ gap: 8, padding: '15px 0', borderStyle: 'dashed', borderColor: 'var(--line-strong)', color: 'var(--ink-soft)', background: 'transparent' }}>
              <I.plus/><span style={{ fontWeight: 600, fontSize: 15 }}>가방 추가</span>
              {atLimit && <span className="tiny">3개째부터 플랜</span>}
            </div>
            <div style={{ height: 8 }}></div>
          </div>
        </div>
      </div>
    </>
  );
}

function HomeEmpty() {
  const { dispatch } = useStore();
  return (
    <>
      <AppBar title="아맞다" brand sub="빠뜨린 거 없죠?" action={<IconBtn onClick={() => dispatch({ type: 'START_CREATE' })}><I.plus/></IconBtn>}/>
      <div className="scr-body">
        <div className="pad col center" style={{ flex: 1, gap: 16, textAlign: 'center', padding: '0 36px 40px' }}>
          <div style={{ flex: 1 }}></div>
          <div style={{ position: 'relative', width: 132, height: 110 }}>
            <span className="stk" style={{ position: 'absolute', left: 6, top: 18, transform: 'rotate(-9deg)', fontSize: 14 }}><span className="ico">👛</span>지갑</span>
            <span className="stk" style={{ position: 'absolute', right: 2, top: 4, transform: 'rotate(7deg)', fontSize: 14 }}><span className="ico">🔑</span>차 키</span>
            <span className="stk sel" style={{ position: 'absolute', left: 22, bottom: 4, transform: 'rotate(-3deg)', fontSize: 14 }}><span className="ico">📱</span>휴대폰</span>
          </div>
          <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-.02em', marginTop: 8, whiteSpace: 'nowrap' }}>아직 가방이 없어요</div>
          <div className="muted" style={{ fontSize: 14.5, lineHeight: 1.6 }}>가방을 만들고 챙길 것·위치를 정해두면,<br/>집을 나설 때 알아서 "챙기셨나요?"를 띄워줄게요.</div>
          <Btn pri onClick={() => dispatch({ type: 'START_CREATE' })} style={{ marginTop: 6 }}><I.plus/> 첫 가방 만들기</Btn>
          <div style={{ flex: 1 }}></div>
        </div>
      </div>
    </>
  );
}

/* ===================== 아이템 칩 (⋯ 메뉴) ===================== */
function ItemChip({ label, onMenu }) {
  return (
    <span className="stk" style={{ paddingRight: 6 }}>
      <span className="ico">{emo(label)}</span>{label}
      <span className="center tap" onClick={onMenu} style={{ width: 22, height: 22, marginLeft: 3, color: 'var(--ink-faint)', borderLeft: '1.5px solid var(--hairline)' }}><I.dots/></span>
    </span>
  );
}

/* ===================== 가방 상세 + 생성 공용 본문 ===================== */
function BagBody({ bag, creating }) {
  const { state, dispatch } = useStore();
  const trig = state.trigger;
  const items = bag[trig];
  const dep = trig === 'depart';
  return (
    <>
      <MapThumb bag={bag} onClick={() => dispatch({ type: 'OPEN_LOCATION' })}/>
      <div className="pad col" style={{ gap: 12, flex: 1 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          {bag.loc.set
            ? <span className="row tiny" style={{ gap: 6, whiteSpace: 'nowrap', fontWeight: 600 }}><I.pin/> {bag.loc.label || '집'} · 반경&nbsp; <b style={{ color: 'var(--accent)' }}>{bag.loc.radius}m</b></span>
            : <span className="row tiny" style={{ gap: 6, color: 'var(--ink-faint)', fontWeight: 600 }}><I.pin/> 위치 미설정</span>}
          {!creating && (bag.on
            ? <span className="pill live"><span className="dot"></span>켜짐</span>
            : <span className="pill"><span className="dot"></span>꺼짐</span>)}
        </div>
        <TriggerSeg active={trig} onChange={(t) => dispatch({ type: 'SET_TRIGGER', trigger: t })}/>
        <div className="tiny">{dep ? '이 구역을 나가면 "챙겼나요?" 알림' : '이 구역에 들어오면 "챙길 것" 알림'}</div>
        <hr className="hr"/>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>{dep ? '떠날 때 챙길 것' : '도착할 때 챙길 것'} <span style={{ color: 'var(--ink-soft)' }}>{items.length}</span></span>
          {!creating && items.length > 0 && <span className="row tiny" style={{ gap: 4, color: 'var(--good)', fontWeight: 700 }}><I.check/> 저장됨</span>}
        </div>
        <div className="row" style={{ gap: 9, flexWrap: 'wrap' }}>
          {items.map((l) => <ItemChip key={l} label={l} onMenu={() => dispatch({ type: 'POPOVER', popover: { type: 'itemMenu', label: l } })}/>)}
          <span className="stk dash tap" onClick={() => dispatch({ type: 'SHEET', sheet: { type: 'itemAdd', sel: {}, creating: false, newName: '', newEmoji: '' } })}
            style={{ padding: '8px 14px 8px 12px' }}><I.plus/> 챙길 것 담기</span>
        </div>
        {!dep && items.length > 0 && <div className="note">같은 가방이라도 트리거가 다르면 목록이 달라요 — 도착할 때는 '살 것·받을 것'</div>}
        {creating && items.length === 0 && (
          <div className="center col" style={{ gap: 7, flex: 1, color: 'var(--ink-faint)', textAlign: 'center', paddingBottom: 20 }}>
            <span style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.5 }}>이름·위치·챙길 것을 채우면<br/>가방이 완성돼요</span>
          </div>
        )}
      </div>
    </>
  );
}

/* ===================== 가방 상세 ===================== */
function BagDetailScreen() {
  const { state, dispatch } = useStore();
  const bag = activeBag(state);
  if (!bag) return null;
  return (
    <>
      <AppBar title={bag.name} onBack={() => dispatch({ type: 'POP' })}
        action={<IconBtn onClick={() => dispatch({ type: 'POPOVER', popover: { type: 'bagMenu' } })}><I.dots/></IconBtn>}/>
      <div className="scr-body">
        <div className="scroll col" style={{ flex: 1 }}>
          <BagBody bag={bag}/>
          <div style={{ height: 10 }}></div>
        </div>
      </div>
    </>
  );
}

/* ===================== 가방 생성 ===================== */
function BagCreateScreen() {
  const { state, dispatch } = useStore();
  const draft = state.draft;
  if (!draft) return null;
  const reco = recommendBagEmojis(draft.name);
  const ready = draft.name.trim() && draft.loc.set && draft.depart.length > 0;
  const missing = !draft.name.trim() ? '이름을 정해주세요'
    : !draft.loc.set ? '위치를 정해주세요'
    : draft.depart.length === 0 ? '챙길 것을 하나 이상 담아주세요' : '';
  return (
    <>
      <AppBar title="새 가방" onBack={() => dispatch({ type: 'POP' })}/>
      <div className="scr-body">
        <div className="scroll col" style={{ flex: 1 }}>
          {/* 이름 + 이모지 */}
          <div className="pad" style={{ paddingBottom: 4 }}>
            <div className="row" style={{ gap: 9 }}>
              <div className="center tap" onClick={() => dispatch({ type: 'SHEET', sheet: { type: 'draftEmoji' } })}
                style={{ width: 52, height: 50, flex: 'none', fontSize: 24,
                  background: draft.emoji ? 'var(--mark)' : 'var(--surface-2)',
                  border: '1.5px solid ' + (draft.emoji ? 'var(--ink)' : 'var(--line-strong)'), borderRadius: '14px 12px 15px 12px' }}>
                {draft.emoji || <span style={{ opacity: .4 }}>💼</span>}
              </div>
              <div style={{ flex: 1 }}>
                <TextField value={draft.name} autoFocus placeholder="가방 이름 (예: 출근 가방)"
                  onChange={(v) => dispatch({ type: 'DRAFT_NAME', name: v })} style={{ padding: '13px 14px' }}/>
              </div>
            </div>
            {/* 추천 이모지 */}
            <div style={{ marginTop: 10 }}>
              <div className="lbl" style={{ marginBottom: 8 }}>🔍 {draft.name.trim() ? `'${draft.name.trim()}'에 어울리는` : '자주 쓰는'} 이모지</div>
              <div className="row" style={{ gap: 9 }}>
                {reco.map((e, i) => (
                  <span key={i} className="center tap" onClick={() => dispatch({ type: 'DRAFT_EMOJI', emoji: e })}
                    style={{ width: 42, height: 42, flex: 'none', fontSize: 22, borderRadius: 11,
                      border: '1.5px solid ' + (e === draft.emoji ? 'var(--accent)' : 'var(--line)'),
                      background: e === draft.emoji ? 'var(--coral-50)' : '#fff' }}>{e}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height: 12 }}></div>
          <BagBody bag={draft} creating/>
        </div>
        <div className="pad" style={{ paddingTop: 10, flex: 'none' }}>
          {!ready && <div className="center tiny" style={{ marginBottom: 9, color: 'var(--ink-soft)', fontWeight: 600 }}>{missing}</div>}
          <Btn pri={ready} disabled={!ready} full onClick={() => ready && dispatch({ type: 'COMMIT_CREATE' })}>가방 만들기</Btn>
        </div>
      </div>
    </>
  );
}

/* ===================== 위치 설정 ===================== */
function LocationScreen() {
  const { state, dispatch } = useStore();
  const loc = state.locDraft || { label: '', radius: 200 };
  const pct = (Math.min(Math.max(loc.radius, 50), 1000) - 50) / 950;
  const d = 70 + Math.round(pct * 150);
  const onSlide = (e) => {
    const track = e.currentTarget.getBoundingClientRect();
    const move = (clientX) => {
      const r = Math.min(Math.max((clientX - track.left) / track.width, 0), 1);
      dispatch({ type: 'SET_RADIUS', radius: Math.round((50 + r * 950) / 10) * 10 });
    };
    move(e.clientX);
    const mm = (ev) => move(ev.clientX);
    const up = () => { window.removeEventListener('pointermove', mm); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', mm); window.addEventListener('pointerup', up);
  };
  return (
    <>
      <AppBar title="위치 정하기" onBack={() => dispatch({ type: 'POP' })}/>
      <div className="scr-body">
        <div className="col" style={{ flex: 1, position: 'relative' }}>
          <div className="map" style={{ flex: 1, position: 'relative' }}>
            <MapBlocks/>
            <div className="geo" style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)', width: d, height: d, transition: 'width .15s, height .15s' }}></div>
            <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-100%)', color: 'var(--accent)', filter: 'drop-shadow(1px 3px 2px rgba(44,42,38,.35))' }}><I.pinFill/></div>
            <span className="stk" style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,10px)', fontSize: 12, padding: '4px 10px' }}>여기로 설정</span>
            <div className="iconbtn tap" style={{ position: 'absolute', bottom: 14, right: 14, width: 40, height: 40 }}><I.locate/></div>
            <div className="card row" style={{ position: 'absolute', top: 12, left: 14, right: 14, padding: '11px 13px', gap: 9, color: 'var(--ink-soft)' }}>
              <I.search/><span style={{ fontSize: 14.5, fontWeight: 500 }}>주소·장소 검색</span>
            </div>
          </div>
          <div style={{ flex: 'none', background: 'var(--surface)', borderTop: '1.5px solid var(--line)', borderRadius: '20px 20px 0 0', padding: '16px 18px 20px', boxShadow: '0 -8px 24px -16px rgba(44,42,38,.4)' }}>
            <div className="lbl">이 위치 이름</div>
            <TextField value={loc.label} placeholder="집" onChange={(v) => dispatch({ type: 'SET_LOC_LABEL', label: v })} style={{ marginBottom: 16 }}/>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 9 }}>
              <span className="lbl" style={{ margin: 0 }}>감지 반경</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{loc.radius}m</span>
            </div>
            <div className="tap" style={{ position: 'relative', height: 22, marginBottom: 4 }} onPointerDown={onSlide}>
              <div style={{ position: 'absolute', top: 9, left: 0, right: 0, height: 5, borderRadius: 3, background: 'var(--line)' }}></div>
              <div style={{ position: 'absolute', top: 9, left: 0, width: (pct * 100) + '%', height: 5, borderRadius: 3, background: 'var(--accent)' }}></div>
              <div style={{ position: 'absolute', top: 0, left: (pct * 100) + '%', transform: 'translateX(-50%)', width: 22, height: 22, borderRadius: '50%', background: '#fff', border: '2px solid var(--accent)', boxShadow: '0 2px 5px rgba(44,42,38,.25)' }}></div>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="tiny">50m</span><span className="tiny">1km</span>
            </div>
            <Btn pri full onClick={() => dispatch({ type: 'SAVE_LOCATION' })} style={{ marginTop: 14 }}>이 위치로 정하기</Btn>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  ChipStrip, BagCard, HomeScreen, HomeEmpty, ItemChip, BagBody, BagDetailScreen, BagCreateScreen, LocationScreen,
});
