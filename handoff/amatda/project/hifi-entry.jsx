// hifi-entry.jsx — 온보딩 + 소셜 로그인 + 권한 요청
//   Onboard1/2/3 · Login · PermLocation · PermNoti
// depends on hifi-ui.jsx (window)

/* 온보딩 골격 */
function OnboardShell({ step, art, title, body, cta }) {
  return (
    <Phone>
      <StatusBar/>
      <Body>
        <div className="col" style={{ flex: 1, padding: '8px 26px 30px' }}>
          {/* skip */}
          <div className="row" style={{ justifyContent: 'flex-end', height: 32 }}>
            {step < 3 && <span className="tiny" style={{ fontWeight: 600 }}>건너뛰기</span>}
          </div>
          <div className="center" style={{ flex: 1 }}>{art}</div>
          <div className="col" style={{ gap: 11, textAlign: 'center', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.25, textWrap: 'balance' }}>{title}</h2>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 260 }}>{body}</p>
          </div>
          {/* dots */}
          <div className="row center" style={{ gap: 7, margin: '22px 0' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ width: i === step - 1 ? 22 : 7, height: 7, borderRadius: 4,
                background: i === step - 1 ? 'var(--accent)' : 'var(--line-strong)', transition: 'width .2s' }}></span>
            ))}
          </div>
          <Btn pri full>{cta}</Btn>
        </div>
      </Body>
    </Phone>
  );
}

function Onboard1() {
  return (
    <OnboardShell step={1}
      title={<>나설 때마다 <span className="mark">빠뜨리는</span> 그거</>}
      body="휴대폰, 지갑, 차 키… 매번 '아 맞다!' 하죠. 아맞다가 대신 기억할게요."
      cta="시작하기"
      art={
        <div style={{ position: 'relative', width: 180, height: 180 }}>
          <AppIcon size={104} radius={26}/>
          <span className="stk" style={{ position: 'absolute', left: -10, top: 6, transform: 'rotate(-12deg)', fontSize: 14 }}><span className="ico">👛</span>지갑</span>
          <span className="stk" style={{ position: 'absolute', right: -18, top: 40, transform: 'rotate(8deg)', fontSize: 14 }}><span className="ico">🔑</span>차 키</span>
          <span className="stk sel" style={{ position: 'absolute', left: 4, bottom: -6, transform: 'rotate(-4deg)', fontSize: 14 }}><span className="ico">📱</span>휴대폰</span>
        </div>}
    />
  );
}
function Onboard2() {
  return (
    <OnboardShell step={2}
      title={<>가방으로 <span className="mark">묶어서</span> 한 번에</>}
      body="출근 가방, 헬스장 가방… 챙길 것을 가방에 담아두면 상황별로 딱 맞게 알려줘요."
      cta="다음"
      art={
        <div className="card" style={{ width: 230, padding: '15px 16px' }}>
          <div className="row" style={{ gap: 11, marginBottom: 12 }}>
            <span className="center" style={{ width: 44, height: 44, fontSize: 23, background: 'var(--green-50)', border: '1.5px solid var(--green-500)', borderRadius: '13px 11px 14px 11px' }}>💼</span>
            <div className="col" style={{ gap: 3, minWidth: 0 }}><b style={{ fontSize: 16, whiteSpace: 'nowrap' }}>출근 가방</b><span className="tiny" style={{ color: 'var(--good)', fontWeight: 700, whiteSpace: 'nowrap' }}>● 감지 중</span></div>
          </div>
          <div className="row" style={{ gap: 7, flexWrap: 'wrap' }}>
            {['휴대폰', '지갑', '차 키'].map(l => <span key={l} className="stk" style={{ fontSize: 12.5, padding: '4px 9px 4px 4px' }}><span className="ico" style={{ width: 20, height: 20, fontSize: 12 }}>{emo(l)}</span>{l}</span>)}
          </div>
        </div>}
    />
  );
}
function Onboard3() {
  return (
    <OnboardShell step={3}
      title={<>집을 나서면 <span className="mark">알아서</span> 띄워요</>}
      body="위치를 정해두면, 그 구역을 벗어날 때 자동으로 체크리스트를 보내드려요."
      cta="시작하기"
      art={
        <div className="map center" style={{ width: 200, height: 150, borderRadius: '18px 16px 19px 16px', border: '1.5px solid var(--ink)' }}>
          <MapBlocks/>
          <div className="geo" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 100, height: 100 }}></div>
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-100%)', color: 'var(--accent)' }}><I.pinFill/></div>
        </div>}
    />
  );
}

/* 소셜 로그인 */
function Login() {
  const SButton = ({ bg, border, color, icon, label }) => (
    <div className="row" style={{ width: '100%', justifyContent: 'center', gap: 10, padding: '14px 0', borderRadius: 'var(--r-btn)',
      background: bg, border: '1.5px solid ' + (border || bg), color, fontSize: 15.5, fontWeight: 700,
      boxShadow: '2px 2px 0 rgba(44,42,38,.08)' }}>
      {icon}{label}
    </div>
  );
  return (
    <Phone>
      <StatusBar/>
      <Body>
        <div className="col" style={{ flex: 1, padding: '0 26px 34px', alignItems: 'center' }}>
          <div className="center col" style={{ flex: 1, gap: 16 }}>
            <AppIcon size={92}/>
            <div className="col center" style={{ gap: 5 }}>
              <span style={{ fontFamily: 'var(--brand)', fontWeight: 700, fontSize: 38, lineHeight: 1, whiteSpace: 'nowrap' }}>아맞다</span>
              <span style={{ fontSize: 15, color: 'var(--ink-soft)', fontWeight: 500, whiteSpace: 'nowrap' }}>빠뜨린 거 없죠?</span>
            </div>
          </div>
          <div className="col" style={{ gap: 11, width: '100%' }}>
            <SButton bg="#FEE500" color="#191600" icon={<span style={{ fontSize: 17 }}>💬</span>} label="카카오로 시작"/>
            <SButton bg="#fff" border="var(--line-strong)" color="var(--ink)" icon={<I.google/>} label="Google로 시작"/>
            <SButton bg="#1d1b18" color="#fff" icon={<span style={{ fontSize: 18 }}></span>} label="Apple로 시작"/>
            <p className="tiny" style={{ textAlign: 'center', marginTop: 6, lineHeight: 1.6 }}>
              계속하면 <u>이용약관</u>과 <u>개인정보처리방침</u>에 동의하는 것으로 간주돼요.</p>
          </div>
        </div>
      </Body>
    </Phone>
  );
}

/* 권한 요청 골격 */
function PermShell({ icon, title, body, bullets, cta, sub, system }) {
  return (
    <Phone>
      <StatusBar/>
      <Body>
        <div className="col" style={{ flex: 1, padding: '0 26px 30px' }}>
          <div className="col center" style={{ flex: 1, gap: 18, textAlign: 'center' }}>
            <span className="center" style={{ width: 86, height: 86, borderRadius: 26, background: 'var(--coral-50)', border: '1.5px solid var(--coral-200)', color: 'var(--accent)' }}>{icon}</span>
            <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.3, textWrap: 'balance' }}>{title}</h2>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 270 }}>{body}</p>
            <div className="col" style={{ gap: 10, width: '100%', marginTop: 4 }}>
              {bullets.map((b, i) => (
                <div key={i} className="row" style={{ gap: 10, padding: '11px 14px', background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 13, textAlign: 'left' }}>
                  <span className="center" style={{ width: 26, height: 26, flex: 'none', borderRadius: 8, background: 'var(--good-soft)', color: 'var(--green-600)' }}><I.check/></span>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
          <Btn pri full>{cta}</Btn>
          {sub && <div className="center" style={{ marginTop: 11, fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>{sub}</div>}
        </div>
      </Body>
    </Phone>
  );
}

function PermLocation() {
  return (
    <PermShell
      icon={<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>}
      title="위치를 '항상 허용'으로"
      body="집을 나서는 순간을 감지하려면 백그라운드 위치 권한이 필요해요."
      bullets={['위치는 감지에만 쓰고 기기에 저장돼요', '이동경로를 따로 수집하지 않아요']}
      cta="위치 권한 허용"
      sub="나중에 설정에서 바꿀 수 있어요"
    />
  );
}
function PermNoti() {
  return (
    <PermShell
      icon={<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"><path d="M6 16V10a6 6 0 1 1 12 0v6l1.6 2H4.4L6 16Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>}
      title="알림을 켜 주세요"
      body="'빠뜨린 거 없죠?' 알림이 와야 체크리스트를 띄울 수 있어요."
      bullets={['집 나설 때 챙길 것 체크리스트', '도착하면 챙길 것 알림']}
      cta="알림 켜기"
      sub="이게 없으면 앱이 조용해요"
    />
  );
}

Object.assign(window, {
  OnboardShell, Onboard1, Onboard2, Onboard3, Login, PermShell, PermLocation, PermNoti,
});
