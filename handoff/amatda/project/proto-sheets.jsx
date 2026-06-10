// proto-sheets.jsx — 바텀시트 & 팝오버: 챙길 것 담기/편집 · 가방 메뉴 · 아이템 메뉴 · 이모지 선택
//   depends on hifi-ui.jsx + proto-store.jsx + proto-kit.jsx + proto-home.jsx (window)

/* 담기 선택 칩 */
function PickChip({ label, on, locked, neu, glow, onClick }) {
  return (
    <span className={'stk tap' + (on ? ' sel' : '') + (neu ? ' new-pop' : '')} onClick={locked ? undefined : onClick}
      style={{ fontSize: 13.5, position: 'relative', padding: '6px 11px 6px 5px', opacity: locked ? .55 : 1,
        boxShadow: glow ? '0 0 0 3px rgba(232,103,74,.2), 1px 2px 0 rgba(44,42,38,.12)' : '1px 2px 0 rgba(44,42,38,.1)' }}>
      <span className="ico" style={{ width: 22, height: 22, fontSize: 13 }}>{emo(label)}</span>{label}
      {neu && <span className="stk-new">NEW</span>}
      {(on || locked) && <span className="stk-check"><I.check/></span>}
    </span>
  );
}

/* ===================== 챙길 것 담기 ===================== */
function ItemAddSheet() {
  const { state, dispatch } = useStore();
  const sheet = state.sheet;
  const bag = activeBag(state);
  const trig = state.trigger;
  const have = new Set(bag[trig]);
  const selN = Object.keys(sheet.sel || {}).length;
  const reco = recommendItemEmojis(sheet.newName);
  const newEmoji = sheet.newEmoji || reco[0];

  return (
    <>
      <Scrim dark={sheet.creating} onClick={() => dispatch({ type: 'CLOSE_SHEET' })}/>
      <SheetShell title="챙길 것 담기" onClose={() => dispatch({ type: 'CLOSE_SHEET' })}
        style={sheet.creating ? { bottom: 0, maxHeight: '88%', overflowY: 'auto' } : null}>
        <TriggerSeg small active={trig} onChange={(t) => dispatch({ type: 'SET_TRIGGER', trigger: t })}/>
        <div className="tiny" style={{ marginBottom: 13 }}>떠날 때 = 챙길 소지품 · 도착할 때 = 챙길 것 (살 것·받을 것 등)</div>

        {/* 새 소지품 만들기 */}
        {!sheet.creating ? (
          <div className="fld tap" onClick={() => dispatch({ type: 'SHEET_PATCH', patch: { creating: true, newName: '', newEmoji: '' } })}
            style={{ color: 'var(--accent)', borderColor: 'var(--accent)', borderStyle: 'dashed', marginBottom: 14, fontWeight: 600, cursor: 'pointer' }}>
            <I.plus/> 새 소지품 만들기</div>
        ) : (
          <div style={{ border: '1.5px solid var(--accent)', borderRadius: 14, background: 'var(--coral-50)', padding: 11, margin: '0 0 14px' }}>
            <div className="row" style={{ gap: 9 }}>
              <span className="center" style={{ width: 44, height: 44, flex: 'none', fontSize: 23, background: 'var(--mark)', border: '1.5px solid var(--ink)', borderRadius: '13px 11px 14px 10px' }}>{newEmoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <TextField value={sheet.newName} autoFocus placeholder="소지품 이름" style={{ padding: '11px 12px' }}
                  onChange={(v) => dispatch({ type: 'SHEET_PATCH', patch: { newName: v, newEmoji: '' } })}
                  onEnter={() => dispatch({ type: 'CONFIRM_NEW_ITEM' })}/>
              </div>
              <Btn pri={!!sheet.newName.trim()} disabled={!sheet.newName.trim()} sm style={{ flex: 'none' }}
                onClick={() => dispatch({ type: 'CONFIRM_NEW_ITEM' })}>추가</Btn>
            </div>
            {sheet.newName.trim() && (
              <>
                <div className="tiny" style={{ margin: '11px 0 7px' }}>🔍 '{sheet.newName.trim()}' 검색 결과</div>
                <div className="row" style={{ gap: 8 }}>
                  {reco.map((e, i) => (
                    <span key={i} className="center tap" onClick={() => dispatch({ type: 'SHEET_PATCH', patch: { newEmoji: e } })}
                      style={{ width: 34, height: 34, flex: 'none', fontSize: 18, borderRadius: 9,
                        border: '1.5px solid ' + (e === newEmoji ? 'var(--accent)' : 'var(--line)'), background: e === newEmoji ? '#fff' : 'var(--surface-2)' }}>{e}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 내 소지품 풀 */}
        <div className="lbl">{sheet.justAdded ? `방금 만든 ${sheet.justAdded}가 맨 앞에` : '내 소지품 — 탭해서 담기'}</div>
        <div className="row" style={{ gap: 10, flexWrap: 'wrap', marginBottom: 16, paddingTop: 4 }}>
          {state.pool.map((p) => {
            const locked = have.has(p.label);
            const on = !!sheet.sel[p.label];
            const isNew = p.label === sheet.justAdded;
            return <PickChip key={p.id} label={p.label} on={on} locked={locked} neu={isNew} glow={isNew}
              onClick={() => dispatch({ type: 'TOGGLE_PICK', label: p.label })}/>;
          })}
        </div>
        <Btn pri={selN > 0} disabled={selN === 0} full onClick={() => dispatch({ type: 'APPLY_PICK' })}>
          {selN > 0 ? `가방에 담기 · ${selN}개` : '담을 것을 골라주세요'}</Btn>
      </SheetShell>
    </>
  );
}

/* ===================== 챙길 것 편집 ===================== */
function ItemEditSheet() {
  const { state, dispatch } = useStore();
  const sheet = state.sheet;
  const val = sheet.newEmoji || emo(sheet.orig);
  return (
    <>
      <Scrim onClick={() => dispatch({ type: 'CLOSE_SHEET' })}/>
      <SheetShell title="챙길 것 편집" onClose={() => dispatch({ type: 'CLOSE_SHEET' })}>
        <div className="row" style={{ gap: 12, marginBottom: 16 }}>
          <span className="center" style={{ width: 56, height: 56, flex: 'none', fontSize: 28, background: 'var(--mark)', border: '1.5px solid var(--ink)', borderRadius: '15px 13px 16px 12px' }}>{val}</span>
          <div style={{ flex: 1 }}>
            <div className="lbl">이름</div>
            <TextField value={sheet.newName} onChange={(v) => dispatch({ type: 'SHEET_PATCH', patch: { newName: v } })}/>
          </div>
        </div>
        <div className="lbl">이모지 고르기</div>
        <div style={{ marginBottom: 18 }}>
          <EmojiGrid list={EMOJI_BANK} value={val} onPick={(e) => dispatch({ type: 'SHEET_PATCH', patch: { newEmoji: e } })}/>
        </div>
        <Btn pri full onClick={() => dispatch({ type: 'SAVE_ITEM_EDIT' })}>저장</Btn>
      </SheetShell>
    </>
  );
}

/* ===================== 가방 이름·이모지 변경 ===================== */
function BagEditSheet() {
  const { state, dispatch } = useStore();
  const sheet = state.sheet;
  const bag = activeBag(state);
  const val = sheet.newEmoji || bag.emoji;
  return (
    <>
      <Scrim onClick={() => dispatch({ type: 'CLOSE_SHEET' })}/>
      <SheetShell title="가방 이름·이모지" onClose={() => dispatch({ type: 'CLOSE_SHEET' })}>
        <div className="row" style={{ gap: 12, marginBottom: 16 }}>
          <span className="center" style={{ width: 56, height: 56, flex: 'none', fontSize: 28, background: 'var(--coral-50)', border: '1.5px solid var(--coral-200)', borderRadius: '15px 13px 16px 12px' }}>{val}</span>
          <div style={{ flex: 1 }}>
            <div className="lbl">이름</div>
            <TextField value={sheet.newName} onChange={(v) => dispatch({ type: 'SHEET_PATCH', patch: { newName: v } })}/>
          </div>
        </div>
        <div className="lbl">이모지 고르기</div>
        <div style={{ marginBottom: 18 }}>
          <EmojiGrid list={EMOJI_BANK} value={val} onPick={(e) => dispatch({ type: 'SHEET_PATCH', patch: { newEmoji: e } })}/>
        </div>
        <Btn pri full onClick={() => dispatch({ type: 'SAVE_BAG_EDIT' })}>저장</Btn>
      </SheetShell>
    </>
  );
}

/* ===================== 가방 생성: 이모지 선택 ===================== */
function DraftEmojiSheet() {
  const { state, dispatch } = useStore();
  const list = [...recommendBagEmojis(state.draft.name), ...EMOJI_BANK.filter((e) => !recommendBagEmojis(state.draft.name).includes(e))];
  return (
    <>
      <Scrim onClick={() => dispatch({ type: 'CLOSE_SHEET' })}/>
      <SheetShell title="가방 이모지" onClose={() => dispatch({ type: 'CLOSE_SHEET' })}>
        <div style={{ marginBottom: 8 }}>
          <EmojiGrid list={list.slice(0, 32)} value={state.draft.emoji}
            onPick={(e) => { dispatch({ type: 'DRAFT_EMOJI', emoji: e }); dispatch({ type: 'CLOSE_SHEET' }); }}/>
        </div>
      </SheetShell>
    </>
  );
}

/* ===================== 가방 ⋯ 팝오버 ===================== */
function BagMenuPopover() {
  const { state, dispatch } = useStore();
  const bag = activeBag(state);
  return (
    <>
      <Scrim onClick={() => dispatch({ type: 'CLOSE_POPOVER' })}/>
      <div className="card popover" style={{ position: 'absolute', top: 56, right: 16, width: 204, padding: 7, zIndex: 30, boxShadow: 'var(--sh-pop)' }}>
        <div className="row tap" onClick={() => dispatch({ type: 'SHEET', sheet: { type: 'bagEdit', newName: bag ? bag.name : '', newEmoji: '' } })}
          style={{ gap: 11, padding: '11px 12px', fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap' }}><I.edit/> 이름·이모지 변경</div>
        <hr className="hr"/>
        <div className="row tap" onClick={() => dispatch({ type: 'DELETE_BAG' })}
          style={{ gap: 11, padding: '11px 12px', fontSize: 15, fontWeight: 600, color: 'var(--danger)', whiteSpace: 'nowrap' }}><I.trash/> 가방 삭제</div>
      </div>
    </>
  );
}

/* ===================== 아이템 ⋯ 액션시트 ===================== */
function ItemMenuSheet() {
  const { state, dispatch } = useStore();
  const label = state.popover.label;
  return (
    <>
      <Scrim onClick={() => dispatch({ type: 'CLOSE_POPOVER' })}/>
      <div className="sheet" style={{ paddingBottom: 26 }}>
        <div className="grab"></div>
        <div className="row" style={{ gap: 10, marginBottom: 6, padding: '0 2px 10px', borderBottom: '1.5px solid var(--hairline)' }}>
          <span className="center" style={{ width: 38, height: 38, flex: 'none', fontSize: 20, background: 'var(--mark)', border: '1.5px solid var(--ink)', borderRadius: '12px 10px 13px 9px' }}>{emo(label)}</span>
          <b style={{ fontSize: 16 }}>{label}</b>
        </div>
        <div className="row tap" onClick={() => dispatch({ type: 'SHEET', sheet: { type: 'itemEdit', orig: label, newName: label, newEmoji: '' } })}
          style={{ gap: 12, padding: '14px 4px', fontSize: 15.5, fontWeight: 600 }}><span style={{ color: 'var(--ink-soft)', display: 'flex' }}><I.edit/></span> 편집</div>
        <hr className="hr"/>
        <div className="row tap" onClick={() => dispatch({ type: 'REMOVE_ITEM', label })}
          style={{ gap: 12, padding: '14px 4px', fontSize: 15.5, fontWeight: 600, color: 'var(--danger)' }}><span style={{ display: 'flex' }}><I.minus/></span> 가방에서 빼기</div>
      </div>
    </>
  );
}

Object.assign(window, {
  PickChip, ItemAddSheet, ItemEditSheet, BagEditSheet, DraftEmojiSheet, BagMenuPopover, ItemMenuSheet,
});
