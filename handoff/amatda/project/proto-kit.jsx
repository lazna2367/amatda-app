// proto-kit.jsx — 인터랙티브 공용 UI (hifi-ui.jsx의 전역 CSS 클래스 위에 핸들러를 붙임)
//   depends on hifi-ui.jsx (I, emo, EMO via window)

/* 프로토 전용 보강 CSS (전환/누름/스크롤) */
(function () {
  if (document.getElementById('proto-style')) return;
  const css = `
  .tap{ cursor:pointer; -webkit-tap-highlight-color:transparent; transition:transform .07s ease, opacity .12s; }
  .tap:active{ transform:scale(.97); }
  .btn.tap:active{ transform:translate(1px,1px); }
  .scr-body .scroll{ overflow-y:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
  .scr-body .scroll::-webkit-scrollbar{ display:none; }

  /* push 화면 전환 */
  @keyframes pushIn{ from{ transform:translateX(14px); opacity:0; } to{ transform:translateX(0); opacity:1; } }
  .pushwrap{ position:absolute; inset:0; display:flex; flex-direction:column; animation:pushIn .22s ease; background:transparent; }

  /* 시트 슬라이드업 */
  @keyframes sheetUp{ from{ transform:translateY(102%);} to{ transform:translateY(0);} }
  @keyframes scrimIn{ from{ opacity:0;} to{ opacity:1;} }
  .sheet{ animation:sheetUp .26s cubic-bezier(.2,.8,.2,1); }
  .scrim{ animation:scrimIn .2s ease; }

  /* 팝오버 */
  @keyframes popIn{ from{ transform:scale(.92); opacity:0; } to{ transform:scale(1); opacity:1; } }
  .popover{ animation:popIn .14s ease; transform-origin:top right; }

  /* 토스트 */
  @keyframes toastIn{ from{ transform:translate(-50%,14px); opacity:0; } to{ transform:translate(-50%,0); opacity:1; } }
  .toast{ position:absolute; left:50%; bottom:96px; z-index:60; transform:translateX(-50%);
    background:#2c2a26; color:#fff; font-size:14px; font-weight:700; letter-spacing:-.01em;
    padding:11px 18px; border-radius:14px 13px 15px 12px; white-space:nowrap;
    box-shadow:0 12px 30px -10px rgba(0,0,0,.5); animation:toastIn .2s ease; }

  /* 체크 타일 팝 */
  @keyframes tilePop{ 0%{ transform:scale(1);} 45%{ transform:scale(1.05);} 100%{ transform:scale(1);} }
  .tile-pop{ animation:tilePop .26s ease; }

  /* 새 아이템 강조 */
  @keyframes newGlow{ 0%{ transform:scale(.8); opacity:0; } 60%{ transform:scale(1.06);} 100%{ transform:scale(1); opacity:1; } }
  .new-pop{ animation:newGlow .3s ease; }

  input.realfld{ font-family:var(--font); font-size:15px; font-weight:600; color:var(--ink);
    border:none; outline:none; background:transparent; width:100%; padding:0; }
  input.realfld::placeholder{ color:var(--ink-faint); font-weight:500; }

  .seg .s, .tabs .t, .iconbtn, .stk, .pill, .tgl{ -webkit-tap-highlight-color:transparent; }
  `;
  const s = document.createElement('style');
  s.id = 'proto-style';
  s.textContent = css;
  document.head.appendChild(s);
})();

/* ---------------- 인터랙티브 프리미티브 ---------------- */
function Btn({ children, pri, good, ghost, full, sm, disabled, onClick, style }) {
  const cl = 'btn tap' + (pri ? ' pri' : '') + (good ? ' good' : '') + (ghost ? ' ghost' : '')
    + (full ? ' full' : '') + (sm ? ' sm' : '') + (disabled ? ' disabled' : '');
  return <div className={cl} style={style} onClick={disabled ? undefined : onClick}>{children}</div>;
}
function IconBtn({ children, ghost, onClick, style }) {
  return <div className={'iconbtn tap' + (ghost ? ' ghost' : '')} style={style} onClick={onClick}>{children}</div>;
}
function AppBar({ title, sub, brand, onBack, action }) {
  return (
    <div className="ab">
      {onBack && <div className="iconbtn ghost tap" style={{ marginLeft: -8 }} onClick={onBack}><I.back/></div>}
      <div className="ab-title">
        <h1 style={brand ? { fontFamily: 'var(--brand)', fontWeight: 700, fontSize: 27 } : null}>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      <div className="spacer"></div>
      {action}
    </div>
  );
}
function TabBar({ active, onTab }) {
  const items = [['home', '내 가방', I.bag], ['noti', '알림', I.bell], ['settings', '설정', I.cog]];
  return (
    <div className="tabs">
      {items.map(([k, label, Ico]) => (
        <div key={k} className={'t tap' + (active === k ? ' on' : '')} onClick={() => onTab(k)}>
          <Ico/><span>{label}</span>
        </div>
      ))}
    </div>
  );
}
function Toggle({ on, onClick }) {
  return <div className={'tgl tap' + (on ? ' on' : '')} onClick={onClick}><i></i></div>;
}

/* ---------------- 지도 아트 ---------------- */
function MapBlocks() {
  const b = (l, t, w, h, c) => <div key={l + '-' + t} style={{ position: 'absolute', left: l + '%', top: t + '%', width: w + '%', height: h + '%', background: c, borderRadius: 3, boxShadow: '0 0 0 1px rgba(44,42,38,.05)' }}></div>;
  return (
    <>
      <div className="map-road" style={{ left: 0, right: 0, top: '56%', height: 13 }}></div>
      <div className="map-road" style={{ top: 0, bottom: 0, left: '30%', width: 12 }}></div>
      <div className="map-road" style={{ top: '56%', bottom: 0, left: '70%', width: 8 }}></div>
      <div style={{ position: 'absolute', left: '-6%', top: '22%', width: '120%', height: 7, background: '#fff', transform: 'rotate(-13deg)', boxShadow: '0 0 0 1px #e4e0d4' }}></div>
      <div style={{ position: 'absolute', left: '6%', top: '63%', width: '20%', height: '30%', background: 'rgba(79,157,122,.18)', border: '1.5px solid rgba(79,157,122,.32)', borderRadius: 6 }}></div>
      <div style={{ position: 'absolute', right: '-4%', top: '64%', width: '24%', height: '40%', background: 'rgba(95,150,200,.16)', border: '1.5px solid rgba(95,150,200,.28)', borderRadius: '40% 0 0 0' }}></div>
      {b(46, 8, 12, 12, '#ece8dd')}{b(60, 10, 9, 9, '#e7e2d6')}{b(74, 14, 11, 14, '#ece8dd')}
      {b(46, 24, 10, 16, '#e7e2d6')}{b(8, 8, 16, 9, '#ece8dd')}{b(8, 20, 13, 12, '#e7e2d6')}
      {b(60, 26, 13, 11, '#ece8dd')}{b(46, 70, 14, 16, '#e7e2d6')}
    </>
  );
}
// 반경(m) → 지오펜스 원 지름(px). 50~1000m → 64~190px
const radiusPx = (m) => 64 + Math.round(((Math.min(Math.max(m, 50), 1000) - 50) / 950) * 126);

function MapThumb({ bag, onClick }) {
  if (!bag || !bag.loc || !bag.loc.set) {
    return (
      <div className="map center tap" onClick={onClick} style={{ height: 184, margin: '0 18px', borderRadius: '18px 16px 19px 16px',
        border: '1.5px dashed var(--line-strong)', background: 'var(--surface-2)' }}>
        <span className="pill" style={{ background: 'var(--surface)' }}><I.pin/> 탭해서 위치 · 반경 정하기</span>
      </div>
    );
  }
  const d = Math.min(radiusPx(bag.loc.radius), 150);
  return (
    <div className="map tap" onClick={onClick} style={{ height: 184, margin: '0 18px', borderRadius: '18px 16px 19px 16px',
      border: '1.5px solid var(--ink)', boxShadow: 'var(--sh-card)' }}>
      <MapBlocks/>
      <div className="geo" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: d, height: d }}></div>
      <div style={{ position: 'absolute', left: '32%', top: '70%', width: 13, height: 13, borderRadius: '50%', background: '#5f96c8', border: '2px solid #fff', boxShadow: '0 0 0 3px rgba(95,150,200,.3), 0 1px 3px rgba(44,42,38,.3)' }}></div>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-100%)', color: 'var(--accent)', filter: 'drop-shadow(1px 3px 2px rgba(44,42,38,.35))' }}><I.pinFill/></div>
      <span className="stk" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,9px)', fontSize: 12, padding: '4px 10px' }}>{bag.loc.label || '집'}</span>
      <span style={{ position: 'absolute', left: 11, top: 11, fontSize: 9.5, fontWeight: 700, color: 'var(--ink-faint)', letterSpacing: '.04em', background: 'rgba(255,255,255,.6)', padding: '2px 6px', borderRadius: 5 }}>합정로</span>
      <span className="pill" style={{ position: 'absolute', bottom: 11, right: 11, background: 'var(--surface)' }}><I.pin/> 반경 {bag.loc.radius}m</span>
      <div className="iconbtn" style={{ position: 'absolute', top: 9, right: 9, width: 30, height: 30, borderRadius: 9 }}><I.locate/></div>
    </div>
  );
}

/* ---------------- 트리거 세그먼트 ---------------- */
function TriggerSeg({ active, onChange, small }) {
  const sp = small ? { padding: '8px 0', fontSize: 13.5 } : null;
  return (
    <div className="seg" style={small ? { marginBottom: 8 } : null}>
      <div className={'s tap' + (active === 'depart' ? ' on' : '')} style={sp} onClick={() => onChange('depart')}><I.exit/> 떠날 때</div>
      <div className={'s tap' + (active === 'arrive' ? ' on' : '')} style={sp} onClick={() => onChange('arrive')}><I.flag/> 도착할 때</div>
    </div>
  );
}

/* ---------------- 시트 / 스크림 ---------------- */
function Scrim({ onClick, dark }) {
  return <div className="scrim" onClick={onClick} style={dark ? { background: 'rgba(36,33,29,.5)' } : null}></div>;
}
function SheetShell({ title, onClose, children, style }) {
  return (
    <div className="sheet" style={style}>
      <div className="grab"></div>
      {title != null && (
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
          <b style={{ fontSize: 19, letterSpacing: '-.01em', whiteSpace: 'nowrap' }}>{title}</b>
          <div className="iconbtn tap" style={{ width: 32, height: 32 }} onClick={onClose}><I.x/></div>
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------------- 이모지 그리드 ---------------- */
function EmojiGrid({ list, value, onPick, cols = 8 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
      {list.map((e, i) => (
        <span key={i} className="center tap" onClick={() => onPick(e)} style={{ aspectRatio: '1', fontSize: 20, borderRadius: 10,
          border: '1.5px solid ' + (e === value ? 'var(--accent)' : 'var(--line)'),
          background: e === value ? 'var(--coral-50)' : '#fff' }}>{e}</span>
      ))}
    </div>
  );
}
const EMOJI_BANK = ['📱','👛','🔑','🪪','🎧','☂️','💳','💻','🔌','🥤','😷','💊','🛂','👕','🧺','📦',
  '💼','🏢','🎒','🏋️','💪','🧳','✈️','📚','🛒','🛍️','🥛','🥚','🍞','☕','💧','🐶'];

/* ---------------- 실제 입력 필드 ---------------- */
function TextField({ value, onChange, placeholder, autoFocus, onEnter, style, className = '' }) {
  const ref = React.useRef(null);
  React.useEffect(() => { if (autoFocus && ref.current) ref.current.focus(); }, [autoFocus]);
  return (
    <div className={'fld' + (value ? ' focus' : '') + ' ' + className} style={style}>
      <input ref={ref} className="realfld" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && onEnter) onEnter(); }}/>
    </div>
  );
}

/* ---------------- 토스트 ---------------- */
function Toast({ toast, onClear }) {
  React.useEffect(() => {
    if (!toast) return;
    const id = toast.id;
    const t = setTimeout(() => onClear(id), 1800);
    return () => clearTimeout(t);
  }, [toast && toast.id]);
  if (!toast) return null;
  return <div className="toast" key={toast.id}>{toast.msg}</div>;
}

Object.assign(window, {
  Btn, IconBtn, AppBar, TabBar, Toggle, MapBlocks, MapThumb, radiusPx,
  TriggerSeg, Scrim, SheetShell, EmojiGrid, EMOJI_BANK, TextField, Toast,
});
