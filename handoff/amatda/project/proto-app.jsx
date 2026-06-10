// proto-app.jsx — 라우터: 탭/스택 화면 + 시트 + 팝오버 + 오버레이 + 토스트 + 폰 스케일링
//   depends on 모든 proto-*.jsx (window)

/* 현재 탭/스택 화면 */
function Screen() {
  const { state } = useStore();
  const t = topScreen(state);
  if (!t) {
    if (state.tab === 'noti') return <NotiScreen/>;
    if (state.tab === 'settings') return <SettingsScreen/>;
    return <HomeScreen/>;
  }
  if (t.name === 'bagDetail') return <BagDetailScreen/>;
  if (t.name === 'bagCreate') return <BagCreateScreen/>;
  if (t.name === 'locationSet') return <LocationScreen/>;
  if (t.name === 'plans') return <PlansScreen/>;
  return null;
}

function SheetLayer() {
  const { state } = useStore();
  const s = state.sheet;
  if (!s) return null;
  if (s.type === 'itemAdd') return <ItemAddSheet/>;
  if (s.type === 'itemEdit') return <ItemEditSheet/>;
  if (s.type === 'bagEdit') return <BagEditSheet/>;
  if (s.type === 'draftEmoji') return <DraftEmojiSheet/>;
  return null;
}
function PopoverLayer() {
  const { state } = useStore();
  const p = state.popover;
  if (!p) return null;
  if (p.type === 'bagMenu') return <BagMenuPopover/>;
  if (p.type === 'itemMenu') return <ItemMenuSheet/>;
  return null;
}
function OverlayLayer() {
  const { state } = useStore();
  const o = state.overlay;
  if (!o) return null;
  if (o.flow === 'onboarding') return <OnboardingOverlay/>;
  if (o.flow === 'departure') return o.step === 0 ? <PushLock/> : <ChecklistScreen/>;
  if (o.flow === 'paywall') return o.step === 0 ? <PaywallOverlay/> : (
    <OverlayPhone><StatusBar/><PlansScreen overlay/></OverlayPhone>
  );
  return null;
}

/* 폰 본체 */
function PhoneApp() {
  const { state, dispatch } = useStore();
  const t = topScreen(state);
  const showTabs = !t;
  const stackKey = state.tab + '|' + state.stack.map((s) => s.name + (s.bagId || '')).join('>');
  return (
    <div className="hf">
      <div className="ph">
        <div className="ph-scr">
          <div className="ph-notch"></div>
          <StatusBar/>
          <div key={stackKey} className="pushwrap" style={{ position: 'relative', flex: 1, animation: t ? undefined : 'none' }}>
            <Screen/>
          </div>
          {showTabs && <TabBar active={state.tab} onTab={(k) => dispatch({ type: 'TAB', tab: k })}/>}
          <SheetLayer/>
          <PopoverLayer/>
          <OverlayLayer/>
          <Toast toast={state.toast} onClear={(id) => dispatch({ type: 'CLEAR_TOAST', id })}/>
        </div>
      </div>
    </div>
  );
}

/* 스케일링 무대 + 재시작 */
function Stage() {
  const { dispatch } = useStore();
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const PW = 354, PH = 750;
    const fit = () => {
      const sw = (window.innerWidth - 28) / PW;
      const sh = (window.innerHeight - 84) / PH;
      setScale(Math.min(1.18, sw, sh));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <PhoneApp/>
      </div>
      <div onClick={() => dispatch({ type: 'RESET' })} title="처음 상태로"
        style={{ position: 'fixed', bottom: 16, right: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font)', fontSize: 12.5, fontWeight: 700, color: '#8b8578',
          background: 'rgba(255,255,255,.7)', border: '1.5px solid #e0dacd', borderRadius: 11, padding: '7px 11px',
          backdropFilter: 'blur(6px)', WebkitTapHighlightColor: 'transparent', whiteSpace: 'nowrap' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
        처음으로
      </div>
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <Stage/>
    </StoreProvider>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
