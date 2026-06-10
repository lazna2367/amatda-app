// hifi-checklist.jsx — 출발 감지 푸시(잠금화면) + 체크리스트(C안: 위치 그리드)
//   PushLock · Checklist(진행 중) · ChecklistDone(전체 완료)
// depends on hifi-ui.jsx (window)

/* 잠금화면 다크 배경 */
function LockBg({ children }) {
  return (
    <div className="scr-body" style={{ position: 'relative',
      background: 'linear-gradient(165deg,#2a2620,#16140f 70%)' }}>
      {/* 은은한 코랄 광원 */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 36% at 50% 8%, rgba(232,103,74,.22), transparent 60%)' }}></div>
      {children}
    </div>
  );
}

/* 출발 감지 잠금화면 푸시 */
function PushLock() {
  return (
    <Phone dark>
      <StatusBar light/>
      <LockBg>
        {/* 시계 */}
        <div className="col center" style={{ marginTop: 26, color: '#fff' }}>
          <div style={{ fontSize: 17, fontWeight: 600, opacity: .85, whiteSpace: 'nowrap' }}>10월 21일 화요일</div>
          <div style={{ fontSize: 74, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1, whiteSpace: 'nowrap' }}>8:12</div>
        </div>
        {/* 푸시 카드 */}
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 26 }}>
          <div style={{ background: 'rgba(252,250,246,.92)', backdropFilter: 'blur(14px)', borderRadius: 22,
            padding: '15px 16px', boxShadow: '0 16px 40px -12px rgba(0,0,0,.5)' }}>
            <div className="row" style={{ gap: 10, marginBottom: 10 }}>
              <AppIcon size={38} radius={10}/>
              <div className="row" style={{ flex: 1, justifyContent: 'space-between' }}>
                <b style={{ fontSize: 14, letterSpacing: '-.01em' }}>아맞다</b>
                <span className="tiny">지금</span>
              </div>
            </div>
            <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 3 }}>집을 나서네요 — 빠뜨린 거 없죠?</div>
            <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              <b style={{ color: 'var(--ink)' }}>출근 가방</b> · 휴대폰 · 지갑 · 차 키 · 사원증 · 이어폰 · 우산</div>
            {/* 액션 2종 */}
            <div className="row" style={{ gap: 8, marginTop: 13 }}>
              <div className="center" style={{ flex: 1, padding: '11px 0', borderRadius: 12, background: 'var(--good)', color: '#fff', fontWeight: 700, fontSize: 14.5, gap: 6, whiteSpace: 'nowrap' }}><I.check/> 다 챙김</div>
              <div className="center" style={{ flex: 1, padding: '11px 0', borderRadius: 12, background: 'var(--surface)', border: '1.5px solid var(--line-strong)', fontWeight: 700, fontSize: 14.5, whiteSpace: 'nowrap' }}>열기</div>
            </div>
          </div>
        </div>
      </LockBg>
    </Phone>
  );
}

/* 체크리스트 타일 */
function CheckTile({ label, done }) {
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9,
      padding: '16px 8px 13px', borderRadius: '15px 13px 16px 12px',
      background: done ? 'var(--good-soft)' : 'var(--surface)',
      border: '1.5px solid ' + (done ? 'var(--good)' : 'var(--line)'),
      boxShadow: done ? 'none' : 'var(--sh-card)', opacity: done ? 1 : 1 }}>
      <span className="center" style={{ width: 50, height: 50, fontSize: 27, borderRadius: '14px 12px 15px 11px',
        background: done ? '#fff' : 'var(--surface-2)', border: '1.5px solid ' + (done ? 'var(--green-500)' : 'var(--line)') }}>
        {emo(label)}</span>
      <span style={{ fontSize: 14.5, fontWeight: 600, color: done ? 'var(--green-600)' : 'var(--ink)', whiteSpace: 'nowrap' }}>{label}</span>
      {/* 체크 동그라미 */}
      <span className="center" style={{ position: 'absolute', top: 9, right: 9, width: 24, height: 24, borderRadius: '50%',
        background: done ? 'var(--good)' : 'transparent', border: '1.5px solid ' + (done ? 'var(--green-600)' : 'var(--line-strong)'), color: '#fff' }}>
        {done && <I.check/>}</span>
    </div>
  );
}

function ChecklistShell({ items, allDone }) {
  const doneN = items.filter(i => i[1]).length;
  return (
    <>
      <AppBar title="출근 가방" sub="떠날 때 · 집 근처" back action={<Pill live><span className="dot"></span>방금</Pill>}/>
      <Body>
        <div className="col" style={{ flex: 1, overflow: 'hidden' }}>
          <div className="pad" style={{ paddingTop: 4, paddingBottom: 10 }}>
            {/* 진행 헤더 */}
            <div className="card" style={{ padding: '13px 15px', borderColor: allDone ? 'var(--good)' : 'var(--line)' }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>{allDone ? '다 챙겼어요!' : '챙기셨나요?'}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: allDone ? 'var(--good)' : 'var(--accent)' }}>{doneN}<span style={{ color: 'var(--ink-faint)', fontWeight: 600 }}>/{items.length}</span></span>
              </div>
              {/* 진행 바 */}
              <div style={{ height: 7, borderRadius: 4, background: 'var(--line)', overflow: 'hidden' }}>
                <div style={{ width: (doneN / items.length * 100) + '%', height: '100%', borderRadius: 4,
                  background: allDone ? 'var(--good)' : 'var(--accent)', transition: 'width .3s' }}></div>
              </div>
              {!allDone &&
                <div className="center" style={{ marginTop: 12, padding: '10px 0', borderRadius: 11, gap: 7,
                  border: '1.5px dashed var(--green-500)', color: 'var(--green-600)', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
                  <I.check/> 전부 챙겼어요</div>}
            </div>
          </div>
          {/* 그리드 */}
          <div className="pad" style={{ paddingTop: 0, flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
              {items.map(([l, d]) => <CheckTile key={l} label={l} done={d}/>)}
            </div>
          </div>
          {/* 하단 CTA */}
          <div className="pad" style={{ paddingTop: 10 }}>
            {allDone
              ? <Btn good full><I.check/> 확인 끝 · 가방 닫기</Btn>
              : <>
                  <Btn disabled full>확인 끝 · 가방 닫기</Btn>
                  <div className="center" style={{ marginTop: 9, fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>미완료로 닫기</div>
                </>}
          </div>
        </div>
      </Body>
    </>
  );
}

function Checklist() {
  return (
    <Phone>
      <StatusBar/>
      <ChecklistShell items={[['휴대폰', true], ['지갑', true], ['차 키', false], ['사원증', true], ['이어폰', false], ['우산', false]]}/>
    </Phone>
  );
}
function ChecklistDone() {
  return (
    <Phone>
      <StatusBar/>
      <ChecklistShell allDone items={[['휴대폰', true], ['지갑', true], ['차 키', true], ['사원증', true], ['이어폰', true], ['우산', true]]}/>
    </Phone>
  );
}

Object.assign(window, { PushLock, CheckTile, ChecklistShell, Checklist, ChecklistDone });
