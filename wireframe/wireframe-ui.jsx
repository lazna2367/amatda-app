// wireframe-ui.jsx — shared low-fi primitives for amatda wireframes
// Hand-drawn paper vibe: Gaegu (Korean handwriting) + mono annotations,
// paper white / ink black + single coral accent + marker-yellow highlight.
// Exports primitives to window for use by screens.jsx.

(function () {
  if (document.getElementById('wf-style')) return;
  const css = `
  @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Gothic+A1:wght@400;500;700&family=Space+Mono&display=swap');

  :root{
    --paper:#f7f6f1;
    --card:#fffefb;
    --ink:#2c2a26;
    --ink-soft:#6f6b62;
    --line:#cfcabd;
    --line-soft:#e3ded2;
    --accent:#e8674a;        /* coral */
    --accent-soft:#fbe4dd;
    --mark:#ffe7a0;          /* highlighter */
    --good:#4f9d7a;
    --hand:'Gaegu', cursive;
    --sans:'Gothic A1', sans-serif;
    --mono:'Space Mono', monospace;
  }

  .wf, .wf *{ box-sizing:border-box; }
  .wf{ font-family:var(--hand); color:var(--ink); -webkit-font-smoothing:antialiased; }

  /* ---- phone screen ---- */
  .scr{
    width:300px; height:650px; background:var(--card);
    border:2px solid var(--ink); border-radius:26px 24px 26px 25px;
    position:relative; overflow:hidden; display:flex; flex-direction:column;
    box-shadow:5px 6px 0 rgba(44,42,38,.10);
  }
  .scr-body{ flex:1; overflow:hidden; position:relative; display:flex; flex-direction:column; }
  .pad{ padding:14px 16px; }

  /* ---- status bar ---- */
  .sb{ height:30px; display:flex; align-items:center; justify-content:space-between;
       padding:0 16px; font-family:var(--mono); font-size:10px; color:var(--ink-soft);
       flex:none; letter-spacing:.5px; }
  .sb .dots{ display:flex; gap:3px; align-items:center; }
  .sb .dots i{ width:5px; height:5px; border-radius:50%; background:var(--ink-soft); display:block; }

  /* ---- app bar ---- */
  .ab{ display:flex; align-items:center; gap:10px; padding:6px 16px 10px; flex:none; }
  .ab h1{ margin:0; font-size:24px; font-weight:700; line-height:1; white-space:nowrap; }
  .ab .sub{ font-family:var(--mono); font-size:10px; color:var(--ink-soft); }
  .ab .spacer{ flex:1; }
  .iconbtn{ width:30px; height:30px; border:1.5px solid var(--ink); background:var(--card);
            border-radius:9px 8px 10px 8px; display:flex; align-items:center; justify-content:center;
            font-size:16px; cursor:default; white-space:nowrap; }

  /* ---- tab bar ---- */
  .tabs{ flex:none; display:flex; border-top:2px solid var(--ink); background:var(--card); }
  .tabs .t{ flex:1; display:flex; flex-direction:column; align-items:center; gap:3px;
            padding:9px 0 11px; font-family:var(--sans); font-size:10px; font-weight:500; color:var(--ink-soft); }
  .tabs .t.on{ color:var(--accent); }
  .tabs .t .ic{ width:20px; height:20px; display:flex; align-items:center; justify-content:center; }

  /* ---- sticker chip ---- */
  .stk{ position:relative; display:inline-flex; align-items:center; gap:7px;
        padding:7px 11px 7px 8px; background:var(--card);
        border:1.5px solid var(--ink); border-radius:13px 11px 13px 10px;
        box-shadow:2px 3px 0 rgba(44,42,38,.12); font-size:15px; white-space:nowrap; }
  .stk .ico{ width:22px; height:22px; border:1.5px solid var(--ink); border-radius:7px 6px 8px 6px;
             background:var(--mark); display:flex; align-items:center; justify-content:center; font-size:12px; flex:none; }
  .stk.peel:after{ content:''; position:absolute; top:-4px; right:9px; width:11px; height:11px;
        background:var(--card); border:1.5px solid var(--ink); border-bottom:none; border-right:none;
        border-radius:3px; transform:rotate(45deg); }

  /* ---- buttons ---- */
  .btn{ font-family:var(--hand); font-size:17px; font-weight:700; padding:11px 16px;
        border:2px solid var(--ink); border-radius:14px 12px 15px 12px; background:var(--card);
        text-align:center; line-height:1.1; cursor:default; white-space:nowrap; }
  .btn.pri{ background:var(--accent); color:#fff; box-shadow:3px 3px 0 rgba(44,42,38,.18); }
  .btn.full{ width:100%; }
  .btn.sm{ font-size:14px; padding:7px 11px; }
  .btn.ghost{ background:transparent; }

  /* ---- fields ---- */
  .fld{ border:1.5px solid var(--line); border-radius:11px 10px 12px 10px; background:#fff;
        padding:9px 11px; font-size:15px; color:var(--ink); }
  .fld.ph{ color:#a8a294; }
  .lbl{ font-family:var(--sans); font-size:10px; font-weight:700; color:var(--ink-soft);
        letter-spacing:.4px; text-transform:uppercase; margin-bottom:5px; }

  /* ---- card / list rows ---- */
  .card{ border:1.5px solid var(--ink); border-radius:16px 14px 17px 14px; background:var(--card);
         box-shadow:3px 4px 0 rgba(44,42,38,.08); }
  .row{ display:flex; align-items:center; gap:10px; }
  .hr{ height:0; border:none; border-top:1.5px dashed var(--line); margin:0; }

  .mark{ background:linear-gradient(transparent 55%, var(--mark) 55%); padding:0 2px; }
  .chipstrip{ scrollbar-width:none; -ms-overflow-style:none; }
  .chipstrip::-webkit-scrollbar{ display:none; }
  .pill{ font-family:var(--mono); font-size:9px; letter-spacing:.5px; padding:3px 7px;
         border:1.5px solid var(--ink); border-radius:20px; display:inline-flex; align-items:center; gap:4px; white-space:nowrap; }
  .pill.on{ background:var(--accent-soft); border-color:var(--accent); color:var(--accent); }
  .pill.live{ background:var(--good); border-color:var(--good); color:#fff; }
  .dot{ width:7px; height:7px; border-radius:50%; background:currentColor; display:inline-block; }

  /* annotation (margin note) */
  .note{ font-family:var(--mono); font-size:10.5px; line-height:1.45; color:var(--accent);
         display:flex; gap:6px; align-items:flex-start; }
  .note:before{ content:'↳'; }

  .muted{ color:var(--ink-soft); }
  .tiny{ font-family:var(--mono); font-size:9.5px; color:var(--ink-soft); letter-spacing:.3px; }
  .center{ display:flex; align-items:center; justify-content:center; }
  .col{ display:flex; flex-direction:column; }
  `;
  const s = document.createElement('style');
  s.id = 'wf-style';
  s.textContent = css;
  document.head.appendChild(s);
})();

// ---------- icons (simple geometric placeholders) ----------
const Ic = {
  home: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...p}><path d="M4 11 12 4l8 7"/><path d="M6 10v9h12v-9"/></svg>,
  set: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...p}><rect x="4" y="4" width="11" height="11" rx="2"/><rect x="9" y="9" width="11" height="11" rx="2" fill="var(--card)"/></svg>,
  cog: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M18.5 5.5l-2 2M7.5 16.5l-2 2"/></svg>,
  pin: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...p}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>,
  bell: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...p}><path d="M6 16V10a6 6 0 1 1 12 0v6l2 2H4l2-2Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>,
  plus: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  chev: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m9 6 6 6-6 6"/></svg>,
  back: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m15 6-6 6 6 6"/></svg>,
  check: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m5 12 5 5 9-11"/></svg>,
  cart: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...p}><path d="M4 5h2l2 11h10l2-8H7"/><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>,
  x: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>,
  search: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="6"/><path d="m20 20-3.6-3.6"/></svg>,
  locate: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="4.2"/><path d="M12 2v3.2M12 18.8V22M2 12h3.2M18.8 12H22"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/></svg>,
  minus: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M5 12h14"/></svg>,
  dots: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></svg>,
  edit: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...p}><path d="M14 5l5 5M4 20l1-4L16 5l3 3L8 19l-4 1Z"/></svg>,
  trash: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/><path d="M10 11v5M14 11v5"/></svg>,
  drag: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><circle cx="9" cy="6" r="1.3" fill="currentColor"/><circle cx="15" cy="6" r="1.3" fill="currentColor"/><circle cx="9" cy="12" r="1.3" fill="currentColor"/><circle cx="15" cy="12" r="1.3" fill="currentColor"/><circle cx="9" cy="18" r="1.3" fill="currentColor"/><circle cx="15" cy="18" r="1.3" fill="currentColor"/></svg>,
};

// ---------- primitives ----------
function Phone({ children, style }) {
  return <div className="wf"><div className="scr" style={style}>{children}</div></div>;
}
function StatusBar() {
  return <div className="sb"><span>9:41</span><span className="dots"><i></i><i></i><i></i><span style={{marginLeft:2}}>56%</span></span></div>;
}
function Body({ children, style, className = '' }) {
  return <div className={"scr-body " + className} style={style}>{children}</div>;
}
function AppBar({ title, sub, back, action }) {
  return (
    <div className="ab">
      {back && <div className="iconbtn"><Ic.back/></div>}
      <div>
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      <div className="spacer"></div>
      {action}
    </div>
  );
}
function TabBar({ active = 'list' }) {
  const items = [['list', '내 가방', Ic.set], ['noti', '알림', Ic.bell], ['cog', '설정', Ic.cog]];
  return (
    <div className="tabs">
      {items.map(([k, label, I]) => (
        <div key={k} className={"t" + (active === k ? ' on' : '')}>
          <span className="ic"><I/></span>{label}
        </div>
      ))}
    </div>
  );
}
function Sticker({ icon = '', label, rot = 0, peel = false, style }) {
  return (
    <span className={"stk" + (peel ? ' peel' : '')} style={{ transform: `rotate(${rot}deg)`, ...style }}>
      <span className="ico">{icon}</span>{label}
    </span>
  );
}
function Btn({ children, pri, ghost, full, sm, style }) {
  return <div className={"btn" + (pri ? ' pri' : '') + (ghost ? ' ghost' : '') + (full ? ' full' : '') + (sm ? ' sm' : '')} style={style}>{children}</div>;
}
function Field({ label, value, ph, style }) {
  return (
    <div style={style}>
      {label && <div className="lbl">{label}</div>}
      <div className={"fld" + (ph ? ' ph' : '')}>{value || ph}</div>
    </div>
  );
}
function Toggle({ on }) {
  return (
    <div style={{ width: 40, height: 23, borderRadius: 20, border: '1.5px solid var(--ink)',
      background: on ? 'var(--accent)' : '#fff', position: 'relative', flex: 'none' }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 19 : 2, width: 17, height: 17,
        borderRadius: '50%', background: '#fff', border: '1.5px solid var(--ink)' }}></div>
    </div>
  );
}
function Note({ children }) { return <div className="note">{children}</div>; }
function Hr({ style }) { return <hr className="hr" style={style}/>; }

Object.assign(window, { Ic, Phone, StatusBar, Body, AppBar, TabBar, Sticker, Btn, Field, Toggle, Note, Hr });
