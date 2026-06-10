// hifi-home.jsx — 내 가방 리스트 · 가방 상세(떠날 때/도착할 때) · 가방 메뉴
// depends on hifi-ui.jsx primitives (window)

/* ---------- 챙길 것 가로 스트립 ---------- */
function ChipStrip({ items, sm }) {
  return (
    <div style={{ position: 'relative', marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 7, overflow: 'hidden', paddingRight: 18 }}>
        {items.map((c) => (
          <span key={c} className="stk" style={{ fontSize: 13, padding: '5px 10px 5px 5px', flex: 'none', boxShadow: '1px 2px 0 rgba(44,42,38,.10)' }}>
            <span className="ico" style={{ width: 21, height: 21, fontSize: 12 }}>{emo(c)}</span>{c}
          </span>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 30,
        background: 'linear-gradient(90deg, transparent, var(--surface))', pointerEvents: 'none' }}></div>
    </div>
  );
}

/* ---------- 가방 카드 ---------- */
function BagCard({ name, emoji, items, label, place, last, on }) {
  return (
    <div className="card" style={{ padding: '15px 16px 13px', borderColor: on ? 'var(--coral-200)' : 'var(--line)',
      boxShadow: on ? '2px 3px 0 rgba(232,103,74,.07), 0 8px 20px -14px rgba(44,42,38,.4)' : 'var(--sh-card)' }}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 10 }}>
        <div className="row" style={{ gap: 12, minWidth: 0 }}>
          <span className="center" style={{ width: 46, height: 46, flex: 'none', fontSize: 25,
            background: on ? 'var(--coral-50)' : 'var(--surface-2)', border: '1.5px solid ' + (on ? 'var(--coral-200)' : 'var(--line)'),
            borderRadius: '14px 12px 15px 12px' }}>{emoji}</span>
          <div className="col" style={{ minWidth: 0, gap: 4 }}>
            <b style={{ fontSize: 18, letterSpacing: '-.01em', whiteSpace: 'nowrap' }}>{name}</b>
            <div className="row" style={{ gap: 6 }}>
              {on
                ? <span className="dot pulse" style={{ color: 'var(--good)', width: 7, height: 7 }}></span>
                : <span className="dot" style={{ color: 'var(--ink-faint)', width: 7, height: 7 }}></span>}
              <span className="tiny" style={{ whiteSpace: 'nowrap', color: on ? 'var(--good)' : 'var(--ink-soft)', fontWeight: 700 }}>
                {on ? '감지 중' : '꺼짐'}</span>
              <span className="tiny" style={{ whiteSpace: 'nowrap' }}>· {label} · 챙길 것 {items.length}</span>
            </div>
          </div>
        </div>
        <Toggle on={on}/>
      </div>
      <ChipStrip items={items}/>
      <Hr style={{ margin: '13px 0 10px' }}/>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="row tiny" style={{ gap: 5, whiteSpace: 'nowrap', fontWeight: 600 }}>
          <span style={{ color: 'var(--accent)', display: 'flex' }}><I.pin/></span>{place}</span>
        <span className="tiny" style={{ whiteSpace: 'nowrap', color: on ? 'var(--good)' : 'var(--ink-faint)', fontWeight: on ? 700 : 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {on && <I.check/>}{last}</span>
      </div>
    </div>
  );
}

function HomeList() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="아맞다" brand sub="빠뜨린 거 없죠?" action={<div className="iconbtn"><I.plus/></div>}/>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 13 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="tiny" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>내 가방 2개</span>
            <Pill live><span className="dot"></span>1개 감지 중</Pill>
          </div>
          <BagCard name="출근 가방" emoji="💼" label="떠날 때" place="집 · 합정동" last="오늘 08:12 챙김" on
            items={['휴대폰', '지갑', '차 키', '사원증', '이어폰', '우산']}/>
          <BagCard name="헬스장" emoji="🏋️" label="떠날 때" place="집 · 합정동" last="3일 전"
            items={['운동복', '수건', '이어폰', '셰이커']}/>
          <div className="card flat center" style={{ gap: 8, padding: '15px 0', borderStyle: 'dashed',
            borderColor: 'var(--line-strong)', color: 'var(--ink-soft)', background: 'transparent' }}>
            <I.plus/><span style={{ fontWeight: 600, fontSize: 15 }}>가방 추가</span>
            <span className="tiny">3개째부터 프로</span>
          </div>
        </div>
      </Body>
      <TabBar active="home"/>
    </Phone>
  );
}

/* ---------- 빈 상태 ---------- */
function HomeEmpty() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="아맞다" brand sub="빠뜨린 거 없죠?" action={<div className="iconbtn"><I.plus/></div>}/>
      <Body>
        <div className="pad col center" style={{ flex: 1, gap: 16, textAlign: 'center', padding: '0 36px 40px' }}>
          <div style={{ flex: 1 }}></div>
          <div style={{ position: 'relative', width: 132, height: 110 }}>
            <span className="stk" style={{ position: 'absolute', left: 6, top: 18, transform: 'rotate(-9deg)', fontSize: 14 }}>
              <span className="ico">👛</span>지갑</span>
            <span className="stk" style={{ position: 'absolute', right: 2, top: 4, transform: 'rotate(7deg)', fontSize: 14 }}>
              <span className="ico">🔑</span>차 키</span>
            <span className="stk sel" style={{ position: 'absolute', left: 22, bottom: 4, transform: 'rotate(-3deg)', fontSize: 14 }}>
              <span className="ico">📱</span>휴대폰</span>
          </div>
          <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-.02em', marginTop: 8, whiteSpace: 'nowrap' }}>아직 가방이 없어요</div>
          <div className="muted" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
            가방을 만들고 챙길 것·위치를 정해두면,<br/>집을 나설 때 알아서 "챙기셨나요?"를 띄워줄게요.</div>
          <Btn pri style={{ marginTop: 6 }}><I.plus/> 첫 가방 만들기</Btn>
          <div style={{ flex: 1 }}></div>
        </div>
      </Body>
      <TabBar active="home"/>
    </Phone>
  );
}

/* ---------- 위치 권한 거부 배너 ---------- */
function HomePermBlocked() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="아맞다" brand sub="빠뜨린 거 없죠?" action={<div className="iconbtn"><I.plus/></div>}/>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 13 }}>
          <div className="card col" style={{ gap: 11, padding: '14px 15px', borderColor: 'var(--accent)', background: 'var(--coral-50)' }}>
            <div className="row" style={{ gap: 11, alignItems: 'flex-start' }}>
              <span className="center" style={{ width: 36, height: 36, flex: 'none', borderRadius: 11,
                background: 'var(--accent)', color: '#fff' }}><I.pin/></span>
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 700 }}>출발 감지가 멈췄어요</div>
                <div className="tiny" style={{ marginTop: 3, lineHeight: 1.5 }}>위치 권한이 '항상 허용'이 아니라, 집을 나서도 알림이 오지 않아요.</div>
              </div>
            </div>
            <Btn pri full style={{ padding: '11px 0' }}>위치 권한 켜기</Btn>
          </div>
          <span className="tiny" style={{ fontWeight: 600 }}>가방 2개 · <span style={{ color: 'var(--accent)' }}>감지 멈춤</span></span>
          <div style={{ opacity: .5, pointerEvents: 'none' }}>
            <BagCard name="출근 가방" emoji="💼" label="떠날 때" place="집 · 합정동" last="오늘 08:12 챙김"
              items={['휴대폰', '지갑', '차 키', '사원증', '이어폰']}/>
          </div>
          <div style={{ opacity: .5, pointerEvents: 'none' }}>
            <BagCard name="헬스장" emoji="🏋️" label="떠날 때" place="집 · 합정동" last="3일 전" items={['운동복', '수건', '이어폰']}/>
          </div>
        </div>
      </Body>
      <TabBar active="home"/>
    </Phone>
  );
}

/* ---------- 지도 카드 ---------- */
function MapBlocks() {
  // 건물 블록 — 따뜻한 회색 톤
  const b = (l, t, w, h, c) => <div key={l+'-'+t} style={{ position: 'absolute', left: l + '%', top: t + '%', width: w + '%', height: h + '%', background: c, borderRadius: 3, boxShadow: '0 0 0 1px rgba(44,42,38,.05)' }}></div>;
  return (
    <>
      {/* 도로 (넓은→좁은) */}
      <div className="map-road" style={{ left: 0, right: 0, top: '56%', height: 13 }}></div>
      <div className="map-road" style={{ top: 0, bottom: 0, left: '30%', width: 12 }}></div>
      <div className="map-road" style={{ top: '56%', bottom: 0, left: '70%', width: 8 }}></div>
      <div style={{ position: 'absolute', left: '-6%', top: '22%', width: '120%', height: 7, background: '#fff', transform: 'rotate(-13deg)', boxShadow: '0 0 0 1px #e4e0d4' }}></div>
      {/* 공원 */}
      <div style={{ position: 'absolute', left: '6%', top: '63%', width: '20%', height: '30%', background: 'rgba(79,157,122,.18)', border: '1.5px solid rgba(79,157,122,.32)', borderRadius: 6 }}></div>
      {/* 물 */}
      <div style={{ position: 'absolute', right: '-4%', top: '64%', width: '24%', height: '40%', background: 'rgba(95,150,200,.16)', border: '1.5px solid rgba(95,150,200,.28)', borderRadius: '40% 0 0 0' }}></div>
      {/* 건물 블록 */}
      {b(46, 8, 12, 12, '#ece8dd')}{b(60, 10, 9, 9, '#e7e2d6')}{b(74, 14, 11, 14, '#ece8dd')}
      {b(46, 24, 10, 16, '#e7e2d6')}{b(8, 8, 16, 9, '#ece8dd')}{b(8, 20, 13, 12, '#e7e2d6')}
      {b(60, 26, 13, 11, '#ece8dd')}{b(46, 70, 14, 16, '#e7e2d6')}
    </>
  );
}
function MapCard({ blank, label = '우리집', radius = '200m' }) {
  if (blank) {
    return (
      <div className="map center" style={{ height: 184, margin: '0 18px', borderRadius: '18px 16px 19px 16px',
        border: '1.5px dashed var(--line-strong)', background: 'var(--surface-2)' }}>
        <Pill style={{ background: 'var(--surface)' }}><I.pin/> 탭해서 위치 · 반경 정하기</Pill>
      </div>
    );
  }
  return (
    <div className="map" style={{ height: 184, margin: '0 18px', borderRadius: '18px 16px 19px 16px',
      border: '1.5px solid var(--ink)', cursor: 'pointer', boxShadow: 'var(--sh-card)' }}>
      <MapBlocks/>
      {/* 지오펜스 */}
      <div className="geo" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 124, height: 124 }}></div>
      {/* 현위치 점 */}
      <div style={{ position: 'absolute', left: '32%', top: '70%', width: 13, height: 13, borderRadius: '50%', background: '#5f96c8', border: '2px solid #fff', boxShadow: '0 0 0 3px rgba(95,150,200,.3), 0 1px 3px rgba(44,42,38,.3)' }}></div>
      {/* 집 핀 */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-100%)', color: 'var(--accent)', filter: 'drop-shadow(1px 3px 2px rgba(44,42,38,.35))' }}><I.pinFill/></div>
      <span className="stk" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,9px)', fontSize: 12, padding: '4px 10px' }}>{label}</span>
      {/* 거리 라벨 */}
      <span style={{ position: 'absolute', left: 11, top: 11, fontSize: 9.5, fontWeight: 700, color: 'var(--ink-faint)', letterSpacing: '.04em', background: 'rgba(255,255,255,.6)', padding: '2px 6px', borderRadius: 5 }}>합정로</span>
      <Pill style={{ position: 'absolute', bottom: 11, right: 11, background: 'var(--surface)' }}><I.pin/> 반경 {radius}</Pill>
      <div className="iconbtn" style={{ position: 'absolute', top: 9, right: 9, width: 30, height: 30, borderRadius: 9 }}><I.locate/></div>
    </div>
  );
}

/* ---------- 트리거 세그먼트 ---------- */
function TriggerSeg({ active = 'depart' }) {
  return (
    <div className="seg">
      <div className={'s' + (active === 'depart' ? ' on' : '')}><I.exit/> 떠날 때</div>
      <div className={'s' + (active === 'arrive' ? ' on' : '')}><I.flag/> 도착할 때</div>
    </div>
  );
}

/* ---------- 챙길 것 칩 (⋯ 메뉴 포함) ---------- */
function ItemChip({ label, menu }) {
  return (
    <span className="stk" style={{ paddingRight: menu ? 6 : 13 }}>
      <span className="ico">{emo(label)}</span>{label}
      {menu && <span className="center" style={{ width: 22, height: 22, marginLeft: 3, color: 'var(--ink-faint)', borderLeft: '1.5px solid var(--hairline)' }}><I.dots/></span>}
    </span>
  );
}
function AddChip() {
  return <Sticker label="챙길 것 담기" dash icon={<I.plus/>} style={{ padding: '8px 14px 8px 12px' }}/>;
}

/* ---------- 가방 상세 골격 ---------- */
function BagDetailShell({ active = 'depart', children, blankMap }) {
  const dep = active === 'depart';
  return (
    <>
      <AppBar title="출근 가방" back action={<div className="iconbtn"><I.dots/></div>}/>
      <Body>
        <div className="col" style={{ flex: 1, overflow: 'hidden' }}>
          <MapCard blank={blankMap}/>
          <div className="pad col" style={{ gap: 12, flex: 1 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="row tiny" style={{ gap: 6, whiteSpace: 'nowrap', fontWeight: 600 }}>
                <I.pin/> 우리집 · 반경&nbsp; <b style={{ color: 'var(--accent)' }}>200m</b></span>
              <Pill live><span className="dot"></span>켜짐</Pill>
            </div>
            <TriggerSeg active={active}/>
            <div className="tiny">{dep ? '이 구역을 나가면 "챙겼나요?" 알림' : '이 구역에 들어오면 "챙길 것" 알림'}</div>
            <Hr/>
            {children}
          </div>
        </div>
      </Body>
    </>
  );
}

function BagDepart() {
  return (
    <Phone>
      <StatusBar/>
      <BagDetailShell active="depart">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>떠날 때 챙길 것 <span style={{ color: 'var(--ink-soft)' }}>6</span></span>
          <span className="row tiny" style={{ gap: 4, color: 'var(--good)', fontWeight: 700 }}><I.check/> 저장됨</span>
        </div>
        <div className="row" style={{ gap: 9, flexWrap: 'wrap' }}>
          {['휴대폰', '지갑', '차 키', '사원증', '이어폰', '우산'].map(l => <ItemChip key={l} label={l} menu/>)}
          <AddChip/>
        </div>
      </BagDetailShell>
    </Phone>
  );
}

function BagArrive() {
  return (
    <Phone>
      <StatusBar/>
      <BagDetailShell active="arrive">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>도착할 때 챙길 것 <span style={{ color: 'var(--ink-soft)' }}>3</span></span>
          <span className="row tiny" style={{ gap: 4, color: 'var(--good)', fontWeight: 700 }}><I.check/> 저장됨</span>
        </div>
        <div className="row" style={{ gap: 9, flexWrap: 'wrap' }}>
          {['우유', '달걀', '식빵'].map(l => <ItemChip key={l} label={l} menu/>)}
          <AddChip/>
        </div>
        <Note>같은 가방이라도 트리거가 다르면 목록이 달라요 — 도착할 때는 '살 것·받을 것'</Note>
      </BagDetailShell>
    </Phone>
  );
}

/* ---------- 가방 ⋯ 메뉴 ---------- */
function BagMenu() {
  return (
    <Phone>
      <StatusBar/>
      <BagDetailShell active="depart">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>떠날 때 챙길 것 <span style={{ color: 'var(--ink-soft)' }}>6</span></span>
        </div>
        <div className="row" style={{ gap: 9, flexWrap: 'wrap' }}>
          {['휴대폰', '지갑', '차 키', '사원증', '이어폰', '우산'].map(l => <ItemChip key={l} label={l} menu/>)}
          <AddChip/>
        </div>
      </BagDetailShell>
      <div className="scrim"></div>
      <div className="card" style={{ position: 'absolute', top: 56, right: 16, width: 204, padding: 7, zIndex: 30, boxShadow: 'var(--sh-pop)' }}>
        <div className="row" style={{ gap: 11, padding: '11px 12px', fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap' }}><I.edit/> 이름·이모지 변경</div>
        <Hr/>
        <div className="row" style={{ gap: 11, padding: '11px 12px', fontSize: 15, fontWeight: 600, color: 'var(--danger)', whiteSpace: 'nowrap' }}><I.trash/> 가방 삭제</div>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  ChipStrip, BagCard, HomeList, HomeEmpty, HomePermBlocked,
  MapCard, TriggerSeg, ItemChip, AddChip, BagDetailShell, BagDepart, BagArrive, BagMenu,
});
