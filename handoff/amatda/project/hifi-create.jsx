// hifi-create.jsx — 가방 생성 플로우 + 위치 설정
//   BagCreateEmpty(빈 가방 상세) · BagCreateName(이름→이모지 추천 전환) · LocationSet(핀+반경)
// depends on hifi-ui.jsx + hifi-home.jsx (window)

const KB_H2 = 232;

/* 생성 골격: 가방 상세와 동일 레이아웃 + 하단 CTA */
function CreateShell({ children, mapBlank, nameNode, emojiNode, footer, kb }) {
  return (
    <>
      <AppBar title="새 가방" back action={null}/>
      <Body>
        <div className="col" style={{ flex: 1, overflow: 'hidden' }}>
          {/* 이름 + 이모지 */}
          <div className="pad" style={{ paddingBottom: 4 }}>
            <div className="row" style={{ gap: 9 }}>
              {emojiNode}
              <div style={{ flex: 1 }}>{nameNode}</div>
            </div>
          </div>
          <MapCard blank={mapBlank}/>
          <div className="pad col" style={{ gap: 12, flex: 1 }}>
            {children}
          </div>
        </div>
      </Body>
      {footer}
      {kb}
    </>
  );
}

/* 빈 가방 — 막 진입 (이름 비어있음, 자주 쓰는 이모지 노출) */
function BagCreateEmpty() {
  return (
    <Phone>
      <StatusBar/>
      <CreateShell
        mapBlank
        emojiNode={
          <div className="center" style={{ width: 52, height: 50, flex: 'none', fontSize: 24,
            background: 'var(--surface-2)', border: '1.5px solid var(--line-strong)', borderRadius: '14px 12px 15px 12px' }}>
            <span style={{ opacity: .4 }}>💼</span>
          </div>}
        nameNode={<div className="fld ph">가방 이름 (예: 출근 가방)</div>}
        footer={<div className="pad" style={{ paddingTop: 10 }}><Btn disabled full>가방 만들기</Btn></div>}
      >
        <TriggerSeg active="depart"/>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>떠날 때 챙길 것</span>
        </div>
        <div className="row" style={{ gap: 9, flexWrap: 'wrap' }}>
          <AddChip/>
        </div>
        <div className="center col" style={{ gap: 7, flex: 1, color: 'var(--ink-faint)', textAlign: 'center', paddingBottom: 20 }}>
          <span style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.5 }}>이름·위치·챙길 것을 채우면<br/>가방이 완성돼요</span>
        </div>
      </CreateShell>
    </Phone>
  );
}

/* 이름 입력 중 — '자주 쓰는' → '추천 이모지' 전환 (시그니처 모션) */
function BagCreateName() {
  const reco = ['💼','🏢','📊','💻','👔','🗂️'];
  return (
    <Phone>
      <StatusBar/>
      <CreateShell
        mapBlank
        emojiNode={
          <div className="center" style={{ width: 52, height: 50, flex: 'none', fontSize: 24,
            background: 'var(--mark)', border: '1.5px solid var(--ink)', borderRadius: '14px 12px 15px 12px' }}>💼</div>}
        nameNode={<div className="fld focus" style={{ padding: '13px 14px' }}><span style={{ fontWeight: 600 }}>출근 가방</span><span className="caret"></span></div>}
        kb={<KbdKR action="완료"/>}
        footer={
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: KB_H2, padding: '11px 18px',
            background: 'var(--surface)', borderTop: '1.5px solid var(--line)' }}>
            <div className="lbl" style={{ marginBottom: 9 }}>🔍 '출근'에 어울리는 이모지</div>
            <div className="row" style={{ gap: 9 }}>
              {reco.map((e, i) => (
                <span key={i} className="center" style={{ width: 42, height: 42, flex: 'none', fontSize: 22, borderRadius: 11,
                  border: '1.5px solid ' + (i === 0 ? 'var(--accent)' : 'var(--line)'), background: i === 0 ? 'var(--coral-50)' : '#fff' }}>{e}</span>
              ))}
            </div>
          </div>}
      >
        <div style={{ flex: 1 }}></div>
      </CreateShell>
    </Phone>
  );
}

/* 위치 설정 — 전체화면 지도 + 핀 + 반경 슬라이더 */
function LocationSet() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="위치 정하기" back/>
      <Body>
        <div className="col" style={{ flex: 1, position: 'relative' }}>
          {/* 전체화면 지도 */}
          <div className="map" style={{ flex: 1, position: 'relative' }}>
            <MapBlocks/>
            <div className="geo" style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)', width: 190, height: 190 }}></div>
            <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-100%)', color: 'var(--accent)', filter: 'drop-shadow(1px 3px 2px rgba(44,42,38,.35))' }}><I.pinFill/></div>
            <span className="stk" style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,10px)', fontSize: 12, padding: '4px 10px' }}>여기로 설정</span>
            <div className="iconbtn" style={{ position: 'absolute', bottom: 14, right: 14, width: 40, height: 40 }}><I.locate/></div>
            {/* 검색 바 */}
            <div className="card row" style={{ position: 'absolute', top: 12, left: 14, right: 14, padding: '11px 13px', gap: 9, color: 'var(--ink-soft)' }}>
              <I.search/><span style={{ fontSize: 14.5, fontWeight: 500 }}>주소·장소 검색</span>
            </div>
          </div>
          {/* 하단 시트: 라벨 + 반경 슬라이더 */}
          <div style={{ flex: 'none', background: 'var(--surface)', borderTop: '1.5px solid var(--line)',
            borderRadius: '20px 20px 0 0', padding: '16px 18px 20px', boxShadow: '0 -8px 24px -16px rgba(44,42,38,.4)' }}>
            <div className="lbl">이 위치 이름</div>
            <div className="fld" style={{ marginBottom: 16 }}>집</div>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 9 }}>
              <span className="lbl" style={{ margin: 0 }}>감지 반경</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>200m</span>
            </div>
            {/* 슬라이더 */}
            <div style={{ position: 'relative', height: 22, marginBottom: 4 }}>
              <div style={{ position: 'absolute', top: 9, left: 0, right: 0, height: 5, borderRadius: 3, background: 'var(--line)' }}></div>
              <div style={{ position: 'absolute', top: 9, left: 0, width: '20%', height: 5, borderRadius: 3, background: 'var(--accent)' }}></div>
              <div style={{ position: 'absolute', top: 0, left: '20%', transform: 'translateX(-50%)', width: 22, height: 22, borderRadius: '50%', background: '#fff', border: '2px solid var(--accent)', boxShadow: '0 2px 5px rgba(44,42,38,.25)' }}></div>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="tiny">50m</span><span className="tiny">1km</span>
            </div>
            <Btn pri full style={{ marginTop: 14 }}>이 위치로 정하기</Btn>
          </div>
        </div>
      </Body>
    </Phone>
  );
}

Object.assign(window, {
  CreateShell, BagCreateEmpty, BagCreateName, LocationSet,
});
