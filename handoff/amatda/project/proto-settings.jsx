// proto-settings.jsx — 설정 탭 + 온보딩/로그인/권한 플로우 + 페이월 + 플랜
//   depends on hifi-ui.jsx + proto-store.jsx + proto-kit.jsx (window)

/* ===================== 설정 ===================== */
function SettRow({ icon, label, value, danger, chev = true, toggle, onClick }) {
  return (
    <div className={'row' + (onClick ? ' tap' : '')} onClick={onClick} style={{ gap: 12, padding: '14px 4px' }}>
      {icon && <span className="center" style={{ width: 30, height: 30, flex: 'none', borderRadius: 9, background: danger ? 'var(--coral-50)' : 'var(--surface-2)', color: danger ? 'var(--danger)' : 'var(--ink-soft)' }}>{icon}</span>}
      <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: danger ? 'var(--danger)' : 'var(--ink)' }}>{label}</span>
      {value && <span className="tiny" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{value}</span>}
      {toggle}
      {chev && !toggle && <span style={{ color: 'var(--ink-faint)' }}><I.chev/></span>}
    </div>
  );
}
const TIER_LABEL = { free: '무료', standard: '스탠다드', pro: '프로' };

function SettingsScreen() {
  const { state, dispatch } = useStore();
  const [notiOn, setNotiOn] = React.useState(true);
  const tier = state.tier;
  return (
    <>
      <AppBar title="설정"/>
      <div className="scr-body">
        <div className="scroll pad col" style={{ flex: 1, gap: 16 }}>
          <div className="card row" style={{ padding: '15px 16px', gap: 13 }}>
            <span className="center" style={{ width: 52, height: 52, fontSize: 24, flex: 'none', background: 'var(--coral-50)', border: '1.5px solid var(--coral-200)', borderRadius: '15px 13px 16px 12px' }}>🦊</span>
            <div className="col" style={{ flex: 1, gap: 3, minWidth: 0 }}>
              <b style={{ fontSize: 16.5 }}>{state.user.name}</b>
              <span className="tiny">{state.user.email}</span>
            </div>
            <span className={'pill' + (tier !== 'free' ? ' on' : '')}>{TIER_LABEL[tier]}</span>
          </div>

          <div>
            <div className="lbl" style={{ paddingLeft: 4 }}>권한</div>
            <div className="card" style={{ padding: '2px 14px' }}>
              <SettRow icon={<I.pin/>} label="위치" value="항상 허용" chev={false} toggle={<span className="pill on" style={{ background: 'var(--good-soft)', borderColor: 'var(--green-500)', color: 'var(--green-600)' }}>정상</span>}/>
              <hr className="hr"/>
              <SettRow icon={<I.bell/>} label="알림" chev={false} toggle={<Toggle on={notiOn} onClick={() => setNotiOn((v) => !v)}/>}/>
            </div>
          </div>

          <div>
            <div className="lbl" style={{ paddingLeft: 4 }}>구독</div>
            <div className="card" style={{ padding: '2px 14px' }}>
              <SettRow icon={<I.bag/>} label="구독 관리" value={TIER_LABEL[tier]}
                onClick={() => dispatch({ type: 'PUSH', screen: { name: 'plans' } })}/>
            </div>
          </div>

          <div>
            <div className="lbl" style={{ paddingLeft: 4 }}>도움말</div>
            <div className="card" style={{ padding: '2px 14px' }}>
              <SettRow icon={<I.bag/>} label="앱 소개 다시 보기" onClick={() => dispatch({ type: 'OPEN_ONBOARDING', step: 0 })}/>
            </div>
          </div>

          <div>
            <div className="lbl" style={{ paddingLeft: 4 }}>계정</div>
            <div className="card" style={{ padding: '2px 14px' }}>
              <SettRow icon={<I.cog/>} label="개인정보처리방침" onClick={() => dispatch({ type: 'TOAST', msg: '준비 중인 화면이에요' })}/>
              <hr className="hr"/>
              <SettRow icon={<I.cog/>} label="이용약관" onClick={() => dispatch({ type: 'TOAST', msg: '준비 중인 화면이에요' })}/>
              <hr className="hr"/>
              <SettRow icon={<I.exit/>} label="로그아웃" onClick={() => dispatch({ type: 'OPEN_ONBOARDING', step: 3 })}/>
              <hr className="hr"/>
              <SettRow icon={<I.trash/>} label="회원 탈퇴" danger onClick={() => dispatch({ type: 'TOAST', msg: '회원 탈퇴는 고객센터에서 도와드려요' })}/>
            </div>
          </div>
          <div className="center tiny" style={{ paddingBottom: 8 }}>amatda v1.0.0 · Surmise Lab</div>
        </div>
      </div>
    </>
  );
}

/* ===================== 온보딩 / 로그인 / 권한 오버레이 ===================== */
function OverlayPhone({ children, dark }) {
  return (
    <div className="hf" style={{ position: 'absolute', inset: 0, zIndex: 80 }}>
      <div className="ph-scr" style={dark ? { background: '#16140f' } : null}>
        <div className="ph-notch"></div>
        {children}
      </div>
    </div>
  );
}

function OnboardStep({ step }) {
  const { dispatch } = useStore();
  const next = (to) => dispatch({ type: 'OVERLAY_STEP', step: to });
  const arts = [
    <div style={{ position: 'relative', width: 180, height: 180 }} key="a">
      <AppIcon size={104} radius={26}/>
      <span className="stk" style={{ position: 'absolute', left: -10, top: 6, transform: 'rotate(-12deg)', fontSize: 14 }}><span className="ico">👛</span>지갑</span>
      <span className="stk" style={{ position: 'absolute', right: -18, top: 40, transform: 'rotate(8deg)', fontSize: 14 }}><span className="ico">🔑</span>차 키</span>
      <span className="stk sel" style={{ position: 'absolute', left: 4, bottom: -6, transform: 'rotate(-4deg)', fontSize: 14 }}><span className="ico">📱</span>휴대폰</span>
    </div>,
    <div className="card" style={{ width: 230, padding: '15px 16px' }} key="b">
      <div className="row" style={{ gap: 11, marginBottom: 12 }}>
        <span className="center" style={{ width: 44, height: 44, fontSize: 23, background: 'var(--coral-50)', border: '1.5px solid var(--coral-200)', borderRadius: '13px 11px 14px 11px' }}>💼</span>
        <div className="col" style={{ gap: 3, minWidth: 0 }}><b style={{ fontSize: 16, whiteSpace: 'nowrap' }}>출근 가방</b><span className="tiny" style={{ color: 'var(--good)', fontWeight: 700, whiteSpace: 'nowrap' }}>● 감지 중</span></div>
      </div>
      <div className="row" style={{ gap: 7, flexWrap: 'wrap' }}>
        {['휴대폰', '지갑', '차 키'].map((l) => <span key={l} className="stk" style={{ fontSize: 12.5, padding: '4px 9px 4px 4px' }}><span className="ico" style={{ width: 20, height: 20, fontSize: 12 }}>{emo(l)}</span>{l}</span>)}
      </div>
    </div>,
    <div className="map center" style={{ width: 200, height: 150, borderRadius: '18px 16px 19px 16px', border: '1.5px solid var(--ink)' }} key="c">
      <MapBlocks/>
      <div className="geo" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 100, height: 100 }}></div>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-100%)', color: 'var(--accent)' }}><I.pinFill/></div>
    </div>,
  ];
  const copy = [
    { title: <>나설 때마다 <span className="mark">빠뜨리는</span> 그거</>, body: "휴대폰, 지갑, 차 키… 매번 '아 맞다!' 하죠. 아맞다가 대신 기억할게요.", cta: '시작하기' },
    { title: <>가방으로 <span className="mark">묶어서</span> 한 번에</>, body: '출근 가방, 헬스장 가방… 챙길 것을 가방에 담아두면 상황별로 딱 맞게 알려줘요.', cta: '다음' },
    { title: <>집을 나서면 <span className="mark">알아서</span> 띄워요</>, body: '위치를 정해두면, 그 구역을 벗어날 때 자동으로 체크리스트를 보내드려요.', cta: '시작하기' },
  ];
  const c = copy[step];
  return (
    <OverlayPhone>
      <StatusBar/>
      <div className="scr-body">
        <div className="col" style={{ flex: 1, padding: '8px 26px 30px' }}>
          <div className="row" style={{ justifyContent: 'flex-end', height: 32 }}>
            {step < 2 && <span className="tiny tap" style={{ fontWeight: 600 }} onClick={() => next(3)}>건너뛰기</span>}
          </div>
          <div className="center" style={{ flex: 1 }}>{arts[step]}</div>
          <div className="col" style={{ gap: 11, textAlign: 'center', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.25, textWrap: 'balance' }}>{c.title}</h2>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 260 }}>{c.body}</p>
          </div>
          <div className="row center" style={{ gap: 7, margin: '22px 0' }}>
            {[0, 1, 2].map((i) => <span key={i} style={{ width: i === step ? 22 : 7, height: 7, borderRadius: 4, background: i === step ? 'var(--accent)' : 'var(--line-strong)', transition: 'width .2s' }}></span>)}
          </div>
          <Btn pri full onClick={() => next(step + 1)}>{c.cta}</Btn>
        </div>
      </div>
    </OverlayPhone>
  );
}

function LoginStep() {
  const { dispatch } = useStore();
  const SBtn = ({ bg, border, color, icon, label }) => (
    <div className="row tap" onClick={() => dispatch({ type: 'OVERLAY_STEP', step: 4 })}
      style={{ width: '100%', justifyContent: 'center', gap: 10, padding: '14px 0', borderRadius: 'var(--r-btn)', background: bg, border: '1.5px solid ' + (border || bg), color, fontSize: 15.5, fontWeight: 700, boxShadow: '2px 2px 0 rgba(44,42,38,.08)' }}>
      {icon}{label}
    </div>
  );
  return (
    <OverlayPhone>
      <StatusBar/>
      <div className="scr-body">
        <div className="col" style={{ flex: 1, padding: '0 26px 34px', alignItems: 'center' }}>
          <div className="center col" style={{ flex: 1, gap: 16 }}>
            <AppIcon size={92}/>
            <div className="col center" style={{ gap: 5 }}>
              <span style={{ fontFamily: 'var(--brand)', fontWeight: 700, fontSize: 38, lineHeight: 1, whiteSpace: 'nowrap' }}>아맞다</span>
              <span style={{ fontSize: 15, color: 'var(--ink-soft)', fontWeight: 500, whiteSpace: 'nowrap' }}>빠뜨린 거 없죠?</span>
            </div>
          </div>
          <div className="col" style={{ gap: 11, width: '100%' }}>
            <SBtn bg="#FEE500" color="#191600" icon={<span style={{ fontSize: 17 }}>💬</span>} label="카카오로 시작"/>
            <SBtn bg="#fff" border="var(--line-strong)" color="var(--ink)" icon={<I.google/>} label="Google로 시작"/>
            <SBtn bg="#1d1b18" color="#fff" icon={<span style={{ fontSize: 18 }}></span>} label="Apple로 시작"/>
            <p className="tiny" style={{ textAlign: 'center', marginTop: 6, lineHeight: 1.6 }}>계속하면 <u>이용약관</u>과 <u>개인정보처리방침</u>에 동의하는 것으로 간주돼요.</p>
          </div>
        </div>
      </div>
    </OverlayPhone>
  );
}

function PermStep({ kind }) {
  const { dispatch } = useStore();
  const loc = kind === 'loc';
  const data = loc
    ? { icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>,
        title: "위치를 '항상 허용'으로", body: '집을 나서는 순간을 감지하려면 백그라운드 위치 권한이 필요해요.',
        bullets: ['위치는 감지에만 쓰고 기기에 저장돼요', '이동경로를 따로 수집하지 않아요'], cta: '위치 권한 허용', sub: '나중에 설정에서 바꿀 수 있어요', to: 5 }
    : { icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"><path d="M6 16V10a6 6 0 1 1 12 0v6l1.6 2H4.4L6 16Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>,
        title: '알림을 켜 주세요', body: "'빠뜨린 거 없죠?' 알림이 와야 체크리스트를 띄울 수 있어요.",
        bullets: ['집 나설 때 챙길 것 체크리스트', '도착하면 챙길 것 알림'], cta: '알림 켜기', sub: '이게 없으면 앱이 조용해요', to: 'finish' };
  return (
    <OverlayPhone>
      <StatusBar/>
      <div className="scr-body">
        <div className="col" style={{ flex: 1, padding: '0 26px 30px' }}>
          <div className="col center" style={{ flex: 1, gap: 18, textAlign: 'center' }}>
            <span className="center" style={{ width: 86, height: 86, borderRadius: 26, background: 'var(--coral-50)', border: '1.5px solid var(--coral-200)', color: 'var(--accent)' }}>{data.icon}</span>
            <h2 style={{ margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.3, textWrap: 'balance' }}>{data.title}</h2>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 270 }}>{data.body}</p>
            <div className="col" style={{ gap: 10, width: '100%', marginTop: 4 }}>
              {data.bullets.map((b, i) => (
                <div key={i} className="row" style={{ gap: 10, padding: '11px 14px', background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 13, textAlign: 'left' }}>
                  <span className="center" style={{ width: 26, height: 26, flex: 'none', borderRadius: 8, background: 'var(--good-soft)', color: 'var(--green-600)' }}><I.check/></span>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
          <Btn pri full onClick={() => data.to === 'finish' ? dispatch({ type: 'FINISH_ONBOARDING' }) : dispatch({ type: 'OVERLAY_STEP', step: data.to })}>{data.cta}</Btn>
          <div className="center tap" style={{ marginTop: 11, fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}
            onClick={() => data.to === 'finish' ? dispatch({ type: 'FINISH_ONBOARDING' }) : dispatch({ type: 'OVERLAY_STEP', step: data.to })}>{data.sub}</div>
        </div>
      </div>
    </OverlayPhone>
  );
}

function OnboardingOverlay() {
  const { state } = useStore();
  const step = state.overlay.step;
  if (step <= 2) return <OnboardStep step={step}/>;
  if (step === 3) return <LoginStep/>;
  if (step === 4) return <PermStep kind="loc"/>;
  return <PermStep kind="noti"/>;
}

/* ===================== 페이월 + 플랜 ===================== */
function MiniBag({ emoji, name, x, rot, on }) {
  return (
    <div className="card" style={{ position: 'absolute', left: x, top: on ? 4 : 12, width: 132, padding: '10px 12px', transform: `rotate(${rot}deg)`, borderColor: on ? 'var(--coral-200)' : 'var(--line)' }}>
      <div className="row" style={{ gap: 9 }}>
        <span className="center" style={{ width: 34, height: 34, fontSize: 18, flex: 'none', background: on ? 'var(--coral-50)' : 'var(--surface-2)', border: '1.5px solid ' + (on ? 'var(--coral-200)' : 'var(--line)'), borderRadius: '11px 9px 12px 9px' }}>{emoji}</span>
        <div className="col" style={{ gap: 2, minWidth: 0 }}>
          <b style={{ fontSize: 13.5, whiteSpace: 'nowrap' }}>{name}</b>
          <span className="tiny" style={{ color: on ? 'var(--good)' : 'var(--ink-faint)', fontWeight: 700 }}>● {on ? '감지 중' : '꺼짐'}</span>
        </div>
      </div>
    </div>
  );
}
function PaywallOverlay() {
  const { state, dispatch } = useStore();
  const variant = state.overlay.data.variant;
  const filled = variant === 'filled';
  const b = state.bags;
  return (
    <OverlayPhone>
      <StatusBar/>
      <AppBar title="" action={<IconBtn style={{ width: 32, height: 32 }} onClick={() => dispatch({ type: 'CLOSE_OVERLAY' })}><I.x/></IconBtn>}/>
      <div className="scr-body">
        <div className="col" style={{ flex: 1, padding: '0 22px 28px', overflow: 'hidden' }}>
          <div className="center" style={{ marginTop: 4, marginBottom: 22, position: 'relative', height: 96 }}>
            <MiniBag emoji={b[0] ? b[0].emoji : '💼'} name={b[0] ? b[0].name : '출근 가방'} x={28} rot={-7} on/>
            <MiniBag emoji={b[1] ? b[1].emoji : '🏋️'} name={b[1] ? b[1].name : '헬스장'} x={148} rot={6} on={filled || (b[1] && b[1].on)}/>
          </div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.35, textAlign: 'center' }}>
            {filled ? <>가방 2개가 꽉 찼어요<br/><span className="mark">세 번째 차례예요</span></> : <>무료는 가방 2개까지<br/><span className="mark">세 번째부터 플랜이 필요해요</span></>}
          </h2>
          <p style={{ margin: '12px 0 0', fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.6, textAlign: 'center' }}>
            {filled ? '공들여 만든 가방 2개, 잘 쓰고 계시네요. 더 담고 싶다면 플랜을 열어보세요.' : '가방을 더 만들면 상황별로 더 촘촘하게 챙길 수 있어요.'}</p>
          <div style={{ flex: 1 }}></div>
          <div className="card" style={{ padding: '15px 16px', marginBottom: 12, borderColor: 'var(--accent)' }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 11 }}>
              <span style={{ fontSize: 16, fontWeight: 800, whiteSpace: 'nowrap' }}>스탠다드</span>
              <span><b style={{ fontSize: 17 }}>₩2,500</b><span className="tiny">/월</span></span>
            </div>
            <div className="col" style={{ gap: 8 }}>
              {['가방 5개까지', '챙길 것 무제한', '가방 공유 5명'].map((x) => (
                <div key={x} className="row" style={{ gap: 9 }}>
                  <span className="center" style={{ width: 20, height: 20, flex: 'none', borderRadius: 6, background: 'var(--good-soft)', color: 'var(--green-600)' }}><I.check/></span>
                  <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>{x}</span>
                </div>
              ))}
            </div>
          </div>
          <Btn pri full onClick={() => dispatch({ type: 'PAYWALL_TO_PLANS' })}>플랜 선택하기</Btn>
          <div className="center tap" onClick={() => dispatch({ type: 'CLOSE_OVERLAY' })} style={{ marginTop: 11, fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>지금은 괜찮아요</div>
        </div>
      </div>
    </OverlayPhone>
  );
}

function PlanCard({ name, price, yearly, feats, best, sel, onClick }) {
  return (
    <div className="card tap" onClick={onClick} style={{ padding: '16px 17px', position: 'relative', borderColor: sel ? 'var(--accent)' : 'var(--line)', borderWidth: sel ? 2 : 1.5, boxShadow: sel ? '3px 4px 0 rgba(232,103,74,.12), 0 8px 20px -14px rgba(44,42,38,.4)' : 'var(--sh-card)' }}>
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
        {feats.map((f) => <div key={f} className="row" style={{ gap: 8 }}><span style={{ color: 'var(--good)', display: 'flex' }}><I.check/></span><span style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap' }}>{f}</span></div>)}
      </div>
    </div>
  );
}
function PlansScreen({ overlay }) {
  const { dispatch } = useStore();
  const [sel, setSel] = React.useState('standard');
  const [yearly, setYearly] = React.useState(false);
  const back = () => overlay ? dispatch({ type: 'CLOSE_OVERLAY' }) : dispatch({ type: 'POP' });
  const std = yearly ? '₩1,325' : '₩2,500';
  const pro = yearly ? '₩2,490' : '₩3,900';
  return (
    <>
      <AppBar title="플랜 선택" onBack={back}/>
      <div className="scr-body">
        <div className="scroll col" style={{ flex: 1, padding: '4px 18px 0' }}>
          <div className="seg" style={{ marginBottom: 16 }}>
            <div className={'s tap' + (!yearly ? ' on' : '')} onClick={() => setYearly(false)}>월간</div>
            <div className={'s tap' + (yearly ? ' on' : '')} onClick={() => setYearly(true)}>연간 <span style={{ fontSize: 11, marginLeft: 4 }}>-35%</span></div>
          </div>
          <div className="col" style={{ gap: 13 }}>
            <PlanCard name="스탠다드" price={std} yearly="₩19,900" best sel={sel === 'standard'} onClick={() => setSel('standard')}
              feats={['가방 5개', '챙길 것 무제한', '가방 공유 (5명)', '클라우드 동기화']}/>
            <PlanCard name="프로" price={pro} yearly="₩29,900" sel={sel === 'pro'} onClick={() => setSel('pro')}
              feats={['가방 10개', '챙길 것 무제한', '가방 공유 (5명)', '우선 지원']}/>
          </div>
          <div style={{ height: 12 }}></div>
        </div>
        <div className="pad" style={{ paddingTop: 12, flex: 'none' }}>
          <Btn pri full onClick={() => dispatch({ type: 'SUBSCRIBE', tier: sel })}>{sel === 'pro' ? '프로' : '스탠다드'} 구독하기</Btn>
          <div className="center" style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>언제든 해지 가능 · 자동 갱신</div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  SettRow, SettingsScreen, OverlayPhone, OnboardStep, LoginStep, PermStep, OnboardingOverlay,
  MiniBag, PaywallOverlay, PlanCard, PlansScreen,
});
