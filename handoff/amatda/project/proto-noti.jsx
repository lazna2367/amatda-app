// proto-noti.jsx — 알림 탭(피드) + 잠금화면 출발 푸시 + 체크리스트(C안 위치 그리드)
//   depends on hifi-ui.jsx + proto-store.jsx + proto-kit.jsx (window)

/* ===================== 알림 탭 ===================== */
function NotiScreen() {
  const { state, dispatch } = useStore();
  const onBags = state.bags.filter((b) => b.on);
  const bagById = (id) => state.bags.find((b) => b.id === id);
  return (
    <>
      <AppBar title="알림" sub="출발·도착 감지 기록"/>
      <div className="scr-body">
        <div className="scroll" style={{ flex: 1 }}>
          <div className="pad col" style={{ gap: 14 }}>
            {/* 감지 상태 */}
            <div className="card" style={{ padding: '13px 15px', borderColor: onBags.length ? 'var(--coral-200)' : 'var(--line)' }}>
              <div className="row" style={{ gap: 10 }}>
                <span className={'dot' + (onBags.length ? ' pulse' : '')} style={{ color: onBags.length ? 'var(--good)' : 'var(--ink-faint)', width: 9, height: 9 }}></span>
                <div className="col" style={{ flex: 1, gap: 2, minWidth: 0 }}>
                  <b style={{ fontSize: 15, whiteSpace: 'nowrap' }}>{onBags.length ? `${onBags.length}개 가방 감지 중` : '감지 중인 가방이 없어요'}</b>
                  <span className="tiny" style={{ whiteSpace: 'nowrap' }}>{onBags.length ? onBags.map((b) => b.name).join(' · ') : '내 가방에서 토글을 켜면 감지를 시작해요'}</span>
                </div>
              </div>
            </div>

            {/* 체험 카드 */}
            <div className="card tap" onClick={() => dispatch({ type: 'OPEN_DEPARTURE', bagId: (onBags[0] || state.bags[0] || {}).id })}
              style={{ padding: '14px 15px', background: 'var(--coral-50)', borderColor: 'var(--accent)' }}>
              <div className="row" style={{ gap: 12 }}>
                <span className="center" style={{ width: 42, height: 42, flex: 'none', fontSize: 22, background: 'var(--surface)', border: '1.5px solid var(--coral-200)', borderRadius: '13px 11px 14px 10px' }}>🚶</span>
                <div className="col" style={{ flex: 1, gap: 3, minWidth: 0 }}>
                  <b style={{ fontSize: 15.5, whiteSpace: 'nowrap' }}>지금 집을 나선다면?</b>
                  <span className="tiny" style={{ color: 'var(--accent-ink)', fontWeight: 600 }}>출발 알림이 어떻게 오는지 미리보기</span>
                </div>
                <span style={{ color: 'var(--accent)' }}><I.chev/></span>
              </div>
            </div>

            <div className="lbl" style={{ paddingLeft: 2, marginTop: 2 }}>최근 기록</div>
            <div className="col" style={{ gap: 11 }}>
              {state.notifs.map((n) => {
                const b = bagById(n.bagId);
                if (!b) return null;
                const pending = n.status === 'pending';
                return (
                  <div key={n.id} className={'card' + (pending ? ' tap' : '')} onClick={pending ? () => dispatch({ type: 'OPEN_CHECKLIST', bagId: n.bagId }) : undefined}
                    style={{ padding: '13px 15px', borderColor: pending ? 'var(--accent)' : 'var(--line)' }}>
                    <div className="row" style={{ gap: 12 }}>
                      <span className="center" style={{ width: 40, height: 40, flex: 'none', fontSize: 21, background: 'var(--surface-2)', border: '1.5px solid var(--line)', borderRadius: '12px 10px 13px 9px' }}>{b.emoji}</span>
                      <div className="col" style={{ flex: 1, gap: 3, minWidth: 0 }}>
                        <div className="row" style={{ gap: 6, justifyContent: 'space-between' }}>
                          <b style={{ fontSize: 15, whiteSpace: 'nowrap' }}>{b.name}</b>
                          <span className="tiny" style={{ whiteSpace: 'nowrap' }}>{n.time}</span>
                        </div>
                        <span className="tiny" style={{ whiteSpace: 'nowrap' }}>
                          {pending
                            ? <span style={{ color: 'var(--accent)', fontWeight: 700 }}>● 집을 나섬 · 확인 필요</span>
                            : <span style={{ color: 'var(--good)', fontWeight: 700 }}>✓ {n.checked}/{n.total} 챙김 완료</span>}
                        </span>
                      </div>
                      {pending && <span style={{ color: 'var(--accent)' }}><I.chev/></span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ height: 8 }}></div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===================== 잠금화면 출발 푸시 ===================== */
function PushLock() {
  const { state, dispatch } = useStore();
  const bag = state.bags.find((b) => b.id === state.overlay.data.bagId) || state.bags[0];
  const items = bag.depart;
  return (
    <div className="hf" style={{ position: 'absolute', inset: 0, zIndex: 80 }}>
      <div className="ph-scr" style={{ background: 'linear-gradient(165deg,#2a2620,#16140f 70%)' }}>
        <div className="ph-notch"></div>
        <StatusBar light/>
        <div className="scr-body" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 36% at 50% 8%, rgba(232,103,74,.22), transparent 60%)' }}></div>
          <div className="col center" style={{ marginTop: 26, color: '#fff' }}>
            <div style={{ fontSize: 17, fontWeight: 600, opacity: .85, whiteSpace: 'nowrap' }}>10월 21일 화요일</div>
            <div style={{ fontSize: 74, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1, whiteSpace: 'nowrap' }}>8:12</div>
          </div>
          <div style={{ position: 'absolute', left: 12, right: 12, bottom: 26 }}>
            <div style={{ background: 'rgba(252,250,246,.94)', backdropFilter: 'blur(14px)', borderRadius: 22, padding: '15px 16px', boxShadow: '0 16px 40px -12px rgba(0,0,0,.5)' }}>
              <div className="row" style={{ gap: 10, marginBottom: 10 }}>
                <AppIcon size={38} radius={10}/>
                <div className="row" style={{ flex: 1, justifyContent: 'space-between' }}>
                  <b style={{ fontSize: 14, letterSpacing: '-.01em' }}>아맞다</b>
                  <span className="tiny">지금</span>
                </div>
              </div>
              <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 3 }}>{bag.loc.label || '집'}을 나서네요 — 빠뜨린 거 없죠?</div>
              <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                <b style={{ color: 'var(--ink)' }}>{bag.name}</b> · {items.join(' · ')}</div>
              <div className="row" style={{ gap: 8, marginTop: 13 }}>
                <div className="center tap" onClick={() => dispatch({ type: 'QUICK_ALL_DONE', bagId: bag.id })}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 12, background: 'var(--good)', color: '#fff', fontWeight: 700, fontSize: 14.5, gap: 6, whiteSpace: 'nowrap' }}><I.check/> 다 챙김</div>
                <div className="center tap" onClick={() => dispatch({ type: 'OPEN_CHECKLIST', bagId: bag.id })}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 12, background: 'var(--surface)', border: '1.5px solid var(--line-strong)', fontWeight: 700, fontSize: 14.5, whiteSpace: 'nowrap' }}>열기</div>
              </div>
            </div>
            <div className="center tap" onClick={() => dispatch({ type: 'CLOSE_OVERLAY' })} style={{ marginTop: 14, color: 'rgba(255,255,255,.7)', fontSize: 13, fontWeight: 600 }}>닫기</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== 체크리스트 타일 ===================== */
function CheckTile({ label, done, onClick }) {
  return (
    <div className={'tap' + (done ? ' tile-pop' : '')} onClick={onClick} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9,
      padding: '16px 8px 13px', borderRadius: '15px 13px 16px 12px', background: done ? 'var(--good-soft)' : 'var(--surface)',
      border: '1.5px solid ' + (done ? 'var(--good)' : 'var(--line)'), boxShadow: done ? 'none' : 'var(--sh-card)' }}>
      <span className="center" style={{ width: 50, height: 50, fontSize: 27, borderRadius: '14px 12px 15px 11px', background: done ? '#fff' : 'var(--surface-2)', border: '1.5px solid ' + (done ? 'var(--green-500)' : 'var(--line)') }}>{emo(label)}</span>
      <span style={{ fontSize: 14.5, fontWeight: 600, color: done ? 'var(--green-600)' : 'var(--ink)', whiteSpace: 'nowrap' }}>{label}</span>
      <span className="center" style={{ position: 'absolute', top: 9, right: 9, width: 24, height: 24, borderRadius: '50%', background: done ? 'var(--good)' : 'transparent', border: '1.5px solid ' + (done ? 'var(--green-600)' : 'var(--line-strong)'), color: '#fff' }}>{done && <I.check/>}</span>
    </div>
  );
}

/* ===================== 체크리스트 ===================== */
function ChecklistScreen() {
  const { state, dispatch } = useStore();
  const check = state.check;
  const bag = state.bags.find((b) => b.id === check.bagId);
  const items = bag ? bag.depart : [];
  const doneN = items.filter((l) => check.checked[l]).length;
  const allDone = doneN === items.length && items.length > 0;
  return (
    <div className="hf" style={{ position: 'absolute', inset: 0, zIndex: 80 }}>
      <div className="ph-scr">
        <div className="ph-notch"></div>
        <StatusBar/>
        <AppBar title={bag.name} sub="떠날 때 · 집 근처" onBack={() => dispatch({ type: 'CLOSE_CHECKLIST', acknowledge: false })}
          action={<span className="pill live"><span className="dot"></span>방금</span>}/>
        <div className="scr-body">
          <div className="col" style={{ flex: 1, overflow: 'hidden' }}>
            <div className="pad" style={{ paddingTop: 4, paddingBottom: 10 }}>
              <div className="card" style={{ padding: '13px 15px', borderColor: allDone ? 'var(--good)' : 'var(--line)' }}>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>{allDone ? '다 챙겼어요!' : '챙기셨나요?'}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: allDone ? 'var(--good)' : 'var(--accent)' }}>{doneN}<span style={{ color: 'var(--ink-faint)', fontWeight: 600 }}>/{items.length}</span></span>
                </div>
                <div style={{ height: 7, borderRadius: 4, background: 'var(--line)', overflow: 'hidden' }}>
                  <div style={{ width: (items.length ? doneN / items.length * 100 : 0) + '%', height: '100%', borderRadius: 4, background: allDone ? 'var(--good)' : 'var(--accent)', transition: 'width .3s' }}></div>
                </div>
                {!allDone &&
                  <div className="center tap" onClick={() => dispatch({ type: 'CHECK_ALL' })} style={{ marginTop: 12, padding: '10px 0', borderRadius: 11, gap: 7, border: '1.5px dashed var(--green-500)', color: 'var(--green-600)', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
                    <I.check/> 전부 챙겼어요</div>}
              </div>
            </div>
            <div className="scroll pad" style={{ paddingTop: 0, flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
                {items.map((l) => <CheckTile key={l} label={l} done={check.checked[l]} onClick={() => dispatch({ type: 'TOGGLE_CHECK', label: l })}/>)}
              </div>
            </div>
            <div className="pad" style={{ paddingTop: 10 }}>
              {allDone
                ? <Btn good full onClick={() => dispatch({ type: 'CLOSE_CHECKLIST', acknowledge: true })}><I.check/> 확인 끝 · 가방 닫기</Btn>
                : <>
                    <Btn disabled full>확인 끝 · 가방 닫기</Btn>
                    <div className="center tap" onClick={() => dispatch({ type: 'CLOSE_CHECKLIST', acknowledge: false })} style={{ marginTop: 9, fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>미완료로 닫기</div>
                  </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NotiScreen, PushLock, CheckTile, ChecklistScreen });
