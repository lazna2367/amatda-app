// hifi-more.jsx — 페이월(A안: 투자심리, 진입 경로 2종) + 플랜 선택 + 설정
//   PaywallFilled · PaywallOther · Plans · Settings
// depends on hifi-ui.jsx + hifi-home.jsx (window)

/* 페이월 골격 */
function PaywallShell({ headline, sub, bags }) {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="" action={<div className="iconbtn" style={{ width: 32, height: 32 }}><I.x/></div>}/>
      <Body>
        <div className="col" style={{ flex: 1, padding: '0 22px 28px', overflow: 'hidden' }}>
          {/* 가방 미리보기 (이미 채운 가방 = 투자) */}
          <div className="center" style={{ gap: -10, marginTop: 4, marginBottom: 22, position: 'relative', height: 96 }}>
            {bags}
          </div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.35, textAlign: 'center' }}>{headline}</h2>
          <p style={{ margin: '12px 0 0', fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6, textAlign: 'center' }}>{sub}</p>

          <div style={{ flex: 1 }}></div>

          {/* 플랜 요약 카드 */}
          <div className="card" style={{ padding: '15px 16px', marginBottom: 12, borderColor: 'var(--accent)' }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 11 }}>
              <span style={{ fontSize: 16, fontWeight: 800, whiteSpace: 'nowrap' }}>스탠다드</span>
              <span><b style={{ fontSize: 17 }}>₩2,500</b><span className="tiny">/월</span></span>
            </div>
            <div className="col" style={{ gap: 8 }}>
              {['가방 5개까지', '챙길 것 무제한', '가방 공유 5명'].map(b => (
                <div key={b} className="row" style={{ gap: 9 }}>
                  <span className="center" style={{ width: 20, height: 20, flex: 'none', borderRadius: 6, background: 'var(--good-soft)', color: 'var(--green-600)' }}><I.check/></span>
                  <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
          <Btn pri full>플랜 선택하기</Btn>
          <div className="center" style={{ marginTop: 11, fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>지금은 괜찮아요</div>
        </div>
      </Body>
    </Phone>
  );
}

/* 미니 가방 칩 (페이월 상단) */
function MiniBag({ emoji, name, x, rot, on }) {
  return (
    <div className="card" style={{ position: 'absolute', left: x, top: on ? 4 : 12, width: 132, padding: '10px 12px',
      transform: `rotate(${rot}deg)`, borderColor: on ? 'var(--green-500)' : 'var(--line)' }}>
      <div className="row" style={{ gap: 9 }}>
        <span className="center" style={{ width: 34, height: 34, fontSize: 18, flex: 'none',
          background: on ? 'var(--green-50)' : 'var(--surface-2)', border: '1.5px solid ' + (on ? 'var(--green-500)' : 'var(--line)'), borderRadius: '11px 9px 12px 9px' }}>{emoji}</span>
        <div className="col" style={{ gap: 2, minWidth: 0 }}>
          <b style={{ fontSize: 13.5, whiteSpace: 'nowrap' }}>{name}</b>
          <span className="tiny" style={{ color: on ? 'var(--good)' : 'var(--ink-faint)', fontWeight: 700 }}>● {on ? '감지 중' : '꺼짐'}</span>
        </div>
      </div>
    </div>
  );
}

function PaywallFilled() {
  return (
    <PaywallShell
      headline={<>가방 2개가 꽉 찼어요<br/><span className="mark">세 번째 차례예요</span></>}
      sub="공들여 만든 가방 2개, 잘 쓰고 계시네요. 더 담고 싶다면 플랜을 열어보세요."
      bags={<>
        <MiniBag emoji="💼" name="출근 가방" x={28} rot={-7} on/>
        <MiniBag emoji="🏋️" name="헬스장" x={148} rot={6} on/>
      </>}
    />
  );
}
function PaywallOther() {
  return (
    <PaywallShell
      headline={<>무료는 가방 2개까지<br/><span className="mark">세 번째부터 플랜이 필요해요</span></>}
      sub="가방을 더 만들면 상황별로 더 촘촘하게 챙길 수 있어요."
      bags={<>
        <MiniBag emoji="💼" name="출근 가방" x={28} rot={-7} on/>
        <MiniBag emoji="🏋️" name="헬스장" x={148} rot={6}/>
      </>}
    />
  );
}

/* 플랜 선택 */
function PlanCard({ name, price, yearly, bags, feats, best, sel }) {
  return (
    <div className="card" style={{ padding: '16px 17px', position: 'relative',
      borderColor: sel ? 'var(--accent)' : 'var(--line)', borderWidth: sel ? 2 : 1.5,
      boxShadow: sel ? '3px 4px 0 rgba(232,103,74,.12), 0 8px 20px -14px rgba(44,42,38,.4)' : 'var(--sh-card)' }}>
      {best && <span className="pill on" style={{ position: 'absolute', top: -11, right: 14, background: 'var(--accent)', color: '#fff', borderColor: 'var(--coral-600)' }}>인기</span>}
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 17, fontWeight: 800 }}>{name}</span>
        <span className="center" style={{ width: 22, height: 22, borderRadius: '50%', background: sel ? 'var(--accent)' : 'transparent', border: '1.5px solid ' + (sel ? 'var(--coral-600)' : 'var(--line-strong)'), color: '#fff' }}>{sel && <I.check/>}</span>
      </div>
      <div className="row" style={{ alignItems: 'baseline', gap: 5, marginBottom: 10 }}>
        <b style={{ fontSize: 21 }}>{price}</b><span className="tiny">/월</span>
        {yearly && <span className="tiny" style={{ marginLeft: 4 }}>· 연 {yearly} (-35%)</span>}
      </div>
      <div className="col" style={{ gap: 7 }}>
        {feats.map(f => (
          <div key={f} className="row" style={{ gap: 8 }}>
            <span style={{ color: 'var(--good)', display: 'flex' }}><I.check/></span>
            <span style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap' }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function Plans() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="플랜 선택" back/>
      <Body>
        <div className="col" style={{ flex: 1, padding: '4px 18px 26px', overflow: 'hidden' }}>
          {/* 연/월 토글 */}
          <div className="seg" style={{ marginBottom: 16 }}>
            <div className="s on">월간</div>
            <div className="s">연간 <span style={{ fontSize: 11, marginLeft: 4 }}>-35%</span></div>
          </div>
          <div className="col" style={{ gap: 13, flex: 1 }}>
            <PlanCard name="스탠다드" price="₩2,500" yearly="₩19,900" best sel
              feats={['가방 5개', '챙길 것 무제한', '가방 공유 (5명)', '클라우드 동기화']}/>
            <PlanCard name="프로" price="₩3,900" yearly="₩29,900"
              feats={['가방 10개', '챙길 것 무제한', '가방 공유 (5명)', '우선 지원']}/>
          </div>
          <Btn pri full style={{ marginTop: 14 }}>스탠다드 구독하기</Btn>
          <div className="center" style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>언제든 해지 가능 · 자동 갱신</div>
        </div>
      </Body>
    </Phone>
  );
}

/* 설정 */
function SettRow({ icon, label, value, danger, chev = true, toggle }) {
  return (
    <div className="row" style={{ gap: 12, padding: '14px 4px' }}>
      {icon && <span className="center" style={{ width: 30, height: 30, flex: 'none', borderRadius: 9, background: danger ? 'var(--coral-50)' : 'var(--surface-2)', color: danger ? 'var(--danger)' : 'var(--ink-soft)' }}>{icon}</span>}
      <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: danger ? 'var(--danger)' : 'var(--ink)' }}>{label}</span>
      {value && <span className="tiny" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{value}</span>}
      {toggle}
      {chev && !toggle && <span style={{ color: 'var(--ink-faint)' }}><I.chev/></span>}
    </div>
  );
}
function Settings() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="설정"/>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 16, overflowY: 'auto' }}>
          {/* 프로필 */}
          <div className="card row" style={{ padding: '15px 16px', gap: 13 }}>
            <span className="center" style={{ width: 52, height: 52, fontSize: 24, flex: 'none', background: 'var(--coral-50)', border: '1.5px solid var(--coral-200)', borderRadius: '15px 13px 16px 12px' }}>🦊</span>
            <div className="col" style={{ flex: 1, gap: 3, minWidth: 0 }}>
              <b style={{ fontSize: 16.5 }}>김아맞</b>
              <span className="tiny">amat@kakao.com</span>
            </div>
            <Pill on>스탠다드</Pill>
          </div>

          <div>
            <div className="lbl" style={{ paddingLeft: 4 }}>권한</div>
            <div className="card" style={{ padding: '2px 14px' }}>
              <SettRow icon={<I.pin/>} label="위치" value="항상 허용" chev={false} toggle={<Pill on style={{ background: 'var(--good-soft)', borderColor: 'var(--green-500)', color: 'var(--green-600)' }}>정상</Pill>}/>
              <Hr/>
              <SettRow icon={<I.bell/>} label="알림" value="" chev={false} toggle={<Toggle on/>}/>
            </div>
          </div>

          <div>
            <div className="lbl" style={{ paddingLeft: 4 }}>구독</div>
            <div className="card" style={{ padding: '2px 14px' }}>
              <SettRow icon={<I.bag/>} label="구독 관리" value="스탠다드"/>
            </div>
          </div>

          <div>
            <div className="lbl" style={{ paddingLeft: 4 }}>계정</div>
            <div className="card" style={{ padding: '2px 14px' }}>
              <SettRow icon={<I.cog/>} label="개인정보처리방침"/>
              <Hr/>
              <SettRow icon={<I.cog/>} label="이용약관"/>
              <Hr/>
              <SettRow icon={<I.exit/>} label="로그아웃"/>
              <Hr/>
              <SettRow icon={<I.trash/>} label="회원 탈퇴" danger/>
            </div>
          </div>
          <div className="center tiny" style={{ paddingBottom: 6 }}>amatda v1.0.0 · Surmise Lab</div>
        </div>
      </Body>
      <TabBar active="cog"/>
    </Phone>
  );
}

Object.assign(window, {
  PaywallShell, MiniBag, PaywallFilled, PaywallOther, PlanCard, Plans, SettRow, Settings,
});
