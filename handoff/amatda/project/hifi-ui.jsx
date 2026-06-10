// hifi-ui.jsx — 아맞다 하이파이 디자인 토대 (토큰 + 프리미티브)
// "폴리싱된 스티커 노트 앱": Pretendard 본문 · 비대칭 radius · flat offset shadow ·
// 스티커 peel · 코랄(액션)/그린(감지·완료)/마커노랑(선택) 3색 · 크림 배경.
// window로 프리미티브 export → 화면 jsx에서 사용.

(function () {
  if (document.getElementById('hf-style')) return;
  const css = `
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
  @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@700&display=swap');

  :root{
    /* ---- warm neutrals ---- */
    --paper:#f4f1ea;        /* app bg — warm cream */
    --surface:#fffefb;      /* cards */
    --surface-2:#faf8f2;    /* inset / subtle raise */
    --ink:#2c2a26;
    --ink-soft:#6f6b62;
    --ink-faint:#a6a092;
    --line:#e6e1d5;
    --line-strong:#d3cdbe;
    --hairline:#efebe1;

    /* ---- coral (action / selection) ---- */
    --coral-50:#fdeee9; --coral-100:#fbe0d7; --coral-200:#f6c5b5;
    --coral-300:#f0a088; --coral-400:#ec7e5e; --coral-500:#e8674a;
    --coral-600:#d24e2f; --coral-700:#ad3c21;

    /* ---- status (MONO CORAL: active / detecting / done = coral tints) ---- */
    --green-50:#fdeee9; --green-100:#fbe0d7; --green-500:#e8674a; --green-600:#d24e2f;

    /* ---- marker yellow (selected / highlight) ---- */
    --mark:#ffe7a0; --mark-soft:#fff4d2; --mark-edge:#f0cf7e;

    /* ---- semantic ---- */
    --accent:var(--coral-500); --accent-soft:var(--coral-100); --accent-ink:var(--coral-700);
    --good:var(--coral-500); --good-soft:var(--coral-100);
    --danger:var(--coral-600);

    /* ---- radius (asymmetric DNA, subtle) ---- */
    --r-card:18px 16px 19px 16px;
    --r-btn:14px 12px 15px 13px;
    --r-chip:13px 11px 13px 10px;
    --r-tile:12px 11px 13px 10px;
    --r-field:12px 11px 13px 11px;
    --r-sheet:22px 22px 0 0;

    /* ---- shadow (flat offset + soft ambient) ---- */
    --sh-card:2px 3px 0 rgba(44,42,38,.045), 0 8px 20px -14px rgba(44,42,38,.4);
    --sh-raise:3px 4px 0 rgba(44,42,38,.06), 0 10px 24px -14px rgba(44,42,38,.45);
    --sh-sticker:1.5px 2.5px 0 rgba(44,42,38,.12);
    --sh-btn:3px 3px 0 rgba(207,73,42,.28);
    --sh-pop:0 18px 40px -12px rgba(44,42,38,.35), 0 4px 10px -6px rgba(44,42,38,.3);

    --font:'Pretendard Variable','Pretendard',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;
    --brand:'Gaegu', var(--font);
  }

  .hf, .hf *{ box-sizing:border-box; }
  .hf{ font-family:var(--font); color:var(--ink); -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; word-break:keep-all; }
  .hf b, .hf strong{ font-weight:700; }

  /* ---------- phone frame ---------- */
  .ph{
    width:340px; height:736px; position:relative; flex:none;
    background:#1d1b18; border-radius:46px; padding:7px;
    box-shadow:0 2px 2px rgba(255,255,255,.18) inset, 0 30px 60px -24px rgba(44,42,38,.5);
  }
  .ph-scr{
    position:relative; width:100%; height:100%; border-radius:40px; overflow:hidden; display:flex; flex-direction:column;
    background:
      radial-gradient(120% 80% at 80% -8%, rgba(232,103,74,.06), transparent 46%),
      radial-gradient(120% 70% at -10% 108%, rgba(212,170,110,.06), transparent 50%),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.025'/%3E%3C/svg%3E"),
      var(--paper);
  }
  .ph-notch{ position:absolute; top:9px; left:50%; transform:translateX(-50%);
    width:106px; height:26px; background:#1d1b18; border-radius:16px; z-index:40; }

  .scr-body{ flex:1; overflow:hidden; position:relative; display:flex; flex-direction:column; }
  .pad{ padding:16px 18px; }

  /* ---------- status bar ---------- */
  .sb{ height:48px; flex:none; display:flex; align-items:flex-end; justify-content:space-between;
       padding:0 26px 7px; font-size:14px; font-weight:600; letter-spacing:.2px; }
  .sb-r{ display:flex; align-items:center; gap:6px; }
  .sb-r svg{ display:block; }

  /* ---------- app bar ---------- */
  .ab{ display:flex; align-items:center; gap:10px; padding:6px 18px 12px; flex:none; }
  .ab h1{ margin:0; font-size:23px; font-weight:800; letter-spacing:-.02em; line-height:1.1; white-space:nowrap; }
  .ab .sub{ font-size:12.5px; font-weight:500; color:var(--ink-soft); margin-top:3px; white-space:nowrap; }
  .ab .ab-title{ min-width:0; flex:none; }
  .ab .spacer{ flex:1; }

  /* ---------- icon button ---------- */
  .iconbtn{ width:38px; height:38px; flex:none; display:flex; align-items:center; justify-content:center;
    border-radius:12px 11px 13px 11px; background:var(--surface); border:1.5px solid var(--line);
    color:var(--ink); box-shadow:var(--sh-card); cursor:pointer; }
  .iconbtn.ghost{ background:transparent; border-color:transparent; box-shadow:none; }

  /* ---------- buttons ---------- */
  .btn{ font-family:var(--font); font-size:16px; font-weight:700; letter-spacing:-.01em;
    padding:14px 18px; border-radius:var(--r-btn); border:1.5px solid var(--ink);
    background:var(--surface); color:var(--ink); display:inline-flex; align-items:center;
    justify-content:center; gap:8px; line-height:1.1; cursor:pointer; white-space:nowrap;
    box-shadow:2px 2px 0 rgba(44,42,38,.1); transition:transform .08s ease; }
  .btn:active{ transform:translate(1px,1px); }
  .btn.pri{ background:var(--accent); border-color:var(--coral-600); color:#fff; box-shadow:var(--sh-btn); }
  .btn.good{ background:var(--good); border-color:var(--green-600); color:#fff; box-shadow:3px 3px 0 rgba(207,73,42,.28); }
  .btn.full{ width:100%; }
  .btn.sm{ font-size:14px; padding:9px 14px; border-radius:11px 10px 12px 10px; box-shadow:2px 2px 0 rgba(44,42,38,.1); }
  .btn.ghost{ background:transparent; border-color:transparent; box-shadow:none; color:var(--ink-soft); }
  .btn.disabled{ background:var(--surface-2); border-color:var(--line); color:var(--ink-faint);
    box-shadow:none; border-style:dashed; cursor:default; }

  /* ---------- card ---------- */
  .card{ background:var(--surface); border:1.5px solid var(--line); border-radius:var(--r-card);
    box-shadow:var(--sh-card); }
  .card.flat{ box-shadow:none; }
  .row{ display:flex; align-items:center; gap:10px; }
  .col{ display:flex; flex-direction:column; }
  .center{ display:flex; align-items:center; justify-content:center; }
  .hr{ height:0; border:none; border-top:1.5px solid var(--hairline); margin:0; }

  /* ---------- sticker chip (signature) ---------- */
  .stk{ position:relative; display:inline-flex; align-items:center; gap:8px;
    padding:7px 13px 7px 7px; background:var(--surface);
    border:1.5px solid var(--ink); border-radius:var(--r-chip);
    box-shadow:var(--sh-sticker); font-size:15px; font-weight:600; white-space:nowrap; color:var(--ink); }
  .stk:before{ content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
    background:linear-gradient(160deg, rgba(255,255,255,.7), rgba(255,255,255,0) 42%); mix-blend-mode:soft-light; }
  .stk .ico{ width:26px; height:26px; flex:none; display:flex; align-items:center; justify-content:center; position:relative;
    font-size:15px; background:linear-gradient(155deg, #fff0bd, var(--mark) 55%, var(--mark-edge)); border:1.5px solid var(--ink); border-radius:var(--r-tile);
    box-shadow:inset 0 1px 1px rgba(255,255,255,.6), inset 0 -2px 3px rgba(190,150,40,.25); }
  .stk.sel{ border-color:var(--accent); background:var(--coral-50); }
  .stk.dash{ border-style:dashed; border-color:var(--line-strong); color:var(--ink-soft); box-shadow:none; background:transparent; }
  .stk-check{ position:absolute; top:-7px; right:-7px; width:20px; height:20px; border-radius:50%;
    background:var(--accent); color:#fff; border:1.5px solid var(--ink); display:flex; align-items:center; justify-content:center; }
  .stk-new{ position:absolute; top:-8px; left:-6px; padding:1px 6px; border-radius:7px;
    font-size:8.5px; font-weight:800; letter-spacing:.4px; background:var(--accent); color:#fff; border:1.5px solid var(--ink); }

  /* ---------- pill / badge ---------- */
  .pill{ display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:700; letter-spacing:.1px;
    padding:4px 9px; border-radius:20px; border:1.5px solid var(--line-strong); color:var(--ink-soft); background:var(--surface); white-space:nowrap; }
  .pill.on{ background:var(--coral-50); border-color:var(--accent); color:var(--accent-ink); }
  .pill.live{ background:var(--good); border-color:var(--green-600); color:#fff; }
  .dot{ width:7px; height:7px; border-radius:50%; background:currentColor; display:inline-block; }
  .dot.pulse{ box-shadow:0 0 0 0 rgba(232,103,74,.5); animation:pulse 1.8s infinite; }
  @keyframes pulse{ 70%{ box-shadow:0 0 0 7px rgba(232,103,74,0); } 100%{ box-shadow:0 0 0 0 rgba(232,103,74,0); } }

  /* ---------- field ---------- */
  .lbl{ font-size:11.5px; font-weight:700; color:var(--ink-soft); letter-spacing:.2px; margin-bottom:7px; }
  .fld{ border:1.5px solid var(--line-strong); border-radius:var(--r-field); background:#fff;
    padding:13px 14px; font-size:15px; font-weight:500; color:var(--ink); display:flex; align-items:center; gap:8px; white-space:nowrap; }
  .fld.ph{ color:var(--ink-faint); }
  .fld.focus{ border-color:var(--accent); box-shadow:0 0 0 3px var(--coral-50); }
  .caret{ width:2px; height:18px; background:var(--accent); display:inline-block; border-radius:2px; animation:blink 1.1s steps(1) infinite; }
  @keyframes blink{ 50%{ opacity:0; } }

  /* ---------- highlight mark ---------- */
  .mark{ background:linear-gradient(transparent 58%, var(--mark) 58%); padding:0 2px; }

  /* ---------- toggle (green = on/detecting) ---------- */
  .tgl{ width:46px; height:27px; border-radius:20px; border:1.5px solid var(--line-strong);
    background:#fff; position:relative; flex:none; transition:background .15s, border-color .15s; cursor:pointer; }
  .tgl i{ position:absolute; top:2px; left:2px; width:20px; height:20px; border-radius:50%; background:#fff;
    border:1.5px solid var(--line-strong); transition:left .15s, border-color .15s; }
  .tgl.on{ background:var(--good); border-color:var(--green-600); }
  .tgl.on i{ left:21px; border-color:var(--green-600); }

  /* ---------- segmented control ---------- */
  .seg{ display:flex; padding:3px; gap:3px; background:var(--surface-2); border:1.5px solid var(--line); border-radius:13px; }
  .seg .s{ flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:9px 0;
    font-size:14px; font-weight:700; color:var(--ink-soft); border-radius:10px; white-space:nowrap; cursor:pointer; }
  .seg .s.on{ background:var(--accent); color:#fff; box-shadow:1.5px 2px 0 rgba(44,42,38,.16); }

  /* ---------- tab bar ---------- */
  .tabs{ flex:none; display:flex; padding:8px 10px 22px; background:var(--surface); border-top:1.5px solid var(--line); }
  .tabs .t{ flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; font-size:11px; font-weight:600; color:var(--ink-faint); cursor:pointer; white-space:nowrap; }
  .tabs .t.on{ color:var(--accent); }

  /* ---------- bottom sheet ---------- */
  .scrim{ position:absolute; inset:0; background:rgba(36,33,29,.42); backdrop-filter:blur(1.5px); z-index:20; }
  .sheet{ position:absolute; left:0; right:0; bottom:0; z-index:30; background:var(--surface);
    border-radius:var(--r-sheet); border-top:1.5px solid var(--line); box-shadow:0 -10px 40px -16px rgba(44,42,38,.4);
    padding:12px 18px 22px; }
  .grab{ width:40px; height:5px; border-radius:4px; background:var(--line-strong); margin:0 auto 12px; }

  /* ---------- map (paper grid lives ONLY here) ---------- */
  .map{ position:relative; overflow:hidden;
    background:
      radial-gradient(circle at 22% 30%, rgba(79,157,122,.07), transparent 40%),
      radial-gradient(circle at 78% 72%, rgba(232,103,74,.06), transparent 42%),
      repeating-linear-gradient(0deg,#fbfaf5,#fbfaf5 26px,#ece9df 26px,#ece9df 27px),
      repeating-linear-gradient(90deg,#f6f4ee,#f6f4ee 32px,#ece9df 32px,#ece9df 33px); }
  .map-road{ position:absolute; background:#fff; box-shadow:0 0 0 1px #e4e0d4; }
  .geo{ border-radius:50%; border:1.5px dashed var(--accent); background:rgba(232,103,74,.10); }

  .tiny{ font-size:11.5px; font-weight:500; color:var(--ink-soft); letter-spacing:.1px; }
  .muted{ color:var(--ink-soft); }
  .note{ font-size:12px; line-height:1.5; color:var(--accent-ink); background:var(--coral-50);
    border:1.5px dashed var(--coral-200); border-radius:11px; padding:9px 11px; display:flex; gap:7px; }
  .note:before{ content:'✎'; flex:none; }
  `;
  const s = document.createElement('style');
  s.id = 'hf-style';
  s.textContent = css;
  document.head.appendChild(s);
})();

/* ---------------- icons ---------------- */
const I = {
  home: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" {...p}><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9.5h12V10"/></svg>,
  bag: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" {...p}><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>,
  bell: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" {...p}><path d="M6 16V10a6 6 0 1 1 12 0v6l1.6 2H4.4L6 16Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>,
  cog: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2 7.3 7.3M16.7 16.7l2.1 2.1M18.8 5.2 16.7 7.3M7.3 16.7 5.2 18.8"/></svg>,
  pin: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" {...p}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>,
  pinFill: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 22s7-6.4 7-11.6A7 7 0 1 0 5 10.4C5 15.6 12 22 12 22Z"/><circle cx="12" cy="10" r="2.6" fill="#fff"/></svg>,
  plus: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  chev: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m9 5 7 7-7 7"/></svg>,
  back: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m15 5-7 7 7 7"/></svg>,
  check: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m5 12.5 4.5 4.5L19 6.5"/></svg>,
  x: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>,
  dots: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>,
  edit: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" {...p}><path d="M14 5.5 18.5 10M4 20l1-4.2L15.5 5.3a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.2 19 4 20Z"/></svg>,
  trash: (p) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16M9 7V5h6v2M6.5 7l1 13h9l1-13"/><path d="M10 11v5.5M14 11v5.5"/></svg>,
  minus: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" {...p}><path d="M5 12h14"/></svg>,
  search: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.8-3.8"/></svg>,
  locate: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="4.4"/><path d="M12 2v3.4M12 18.6V22M2 12h3.4M18.6 12H22"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>,
  exit: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7"/><path d="M10 12h11"/><path d="m18 9 3 3-3 3"/></svg>,
  enter: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 4h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7"/><path d="M3 12h11"/><path d="m11 9 3 3-3 3"/></svg>,
  cart: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" {...p}><path d="M3.5 4.5H6l1.8 10.5h9.4L19 7.5H8"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg>,
  basket: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" {...p}><path d="M5 9h14l-1.3 9.5a1.5 1.5 0 0 1-1.5 1.3H7.8a1.5 1.5 0 0 1-1.5-1.3L5 9Z"/><path d="M9 9 11 4M15 9 13 4M9.5 13v3M14.5 13v3"/></svg>,
  flag: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" {...p}><path d="M6 21V4M6 4.5h11l-2.2 4 2.2 4H6"/></svg>,
  drag: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>,
  google: (p) => <svg width="20" height="20" viewBox="0 0 48 48" {...p}><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.7-.4-3.9H24v7.1h12.1c-.2 1.8-1.6 4.5-4.5 6.3l6.9 5.3c4.1-3.8 6.6-9.4 6.6-14.8Z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-1.9 14.5-5.3l-6.9-5.3c-1.9 1.3-4.3 2.2-7.6 2.2-5.8 0-10.7-3.9-12.5-9.2l-7.1 5.5C8 41.1 15.4 46 24 46Z"/><path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.1-5.5C2.9 17 2 20.4 2 24s.9 7 2.4 9.9l7.1-5.5Z"/><path fill="#EA4335" d="M24 10.4c3.2 0 5.4 1.4 6.6 2.5l6.1-6C33 3.5 28.9 2 24 2 15.4 2 8 6.9 4.4 14.1l7.1 5.5C13.3 14.3 18.2 10.4 24 10.4Z"/></svg>,
};

/* ---------------- emoji map (shared model) ---------------- */
const EMO = {
  '휴대폰':'📱','지갑':'👛','차 키':'🔑','사원증':'🪪','이어폰':'🎧','우산':'☂️',
  '운동복':'👕','수건':'🧺','셰이커':'🥤','노트북':'💻','충전기':'🔌','텀블러':'🥤',
  '마스크':'😷','약':'💊','여권':'🛂','카드':'💳','물병':'💧','책':'📖',
  '우유':'🥛','달걀':'🥚','식빵':'🍞','처방전':'📄','세탁물':'🧺','커피':'☕',
};
const emo = (l) => EMO[l] || '📦';

/* ---------------- primitives ---------------- */
function Phone({ children, dark }) {
  return (
    <div className="hf">
      <div className="ph">
        <div className="ph-scr" style={dark ? { background: '#16140f' } : null}>
          <div className="ph-notch"></div>
          {children}
        </div>
      </div>
    </div>
  );
}
function StatusBar({ light }) {
  const c = light ? '#fff' : 'var(--ink)';
  return (
    <div className="sb" style={{ color: c }}>
      <span>9:41</span>
      <span className="sb-r">
        <svg width="18" height="12" viewBox="0 0 18 12" fill={c}><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="4.5" y="4.5" width="3" height="7.5" rx="1"/><rect x="9" y="2" width="3" height="10" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1" opacity=".35"/></svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke={c} strokeWidth="1.3"><path d="M1 4.5C4.5 1 12.5 1 16 4.5M3.2 6.8c2.6-2.4 8-2.4 10.6 0M5.5 9c1.4-1.2 4.6-1.2 6 0" strokeLinecap="round"/></svg>
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="1" y="1" width="21" height="11" rx="3" stroke={c} strokeWidth="1.2" opacity=".5"/><rect x="3" y="3" width="15" height="7" rx="1.5" fill={c}/><rect x="23.5" y="4" width="2" height="5" rx="1" fill={c} opacity=".5"/></svg>
      </span>
    </div>
  );
}
function Body({ children, style, className = '' }) {
  return <div className={'scr-body ' + className} style={style}>{children}</div>;
}
function AppBar({ title, sub, back, action, brand }) {
  return (
    <div className="ab">
      {back && <div className="iconbtn ghost" style={{ marginLeft: -8 }}><I.back/></div>}
      <div className="ab-title">
        <h1 style={brand ? { fontFamily: 'var(--brand)', fontWeight: 700, fontSize: 27 } : null}>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      <div className="spacer"></div>
      {action}
    </div>
  );
}
function TabBar({ active = 'home' }) {
  const items = [['home', '내 가방', I.bag], ['noti', '알림', I.bell], ['cog', '설정', I.cog]];
  return (
    <div className="tabs">
      {items.map(([k, label, Ico]) => (
        <div key={k} className={'t' + (active === k ? ' on' : '')}>
          <Ico/><span>{label}</span>
        </div>
      ))}
    </div>
  );
}
function Btn({ children, pri, good, ghost, full, sm, disabled, style }) {
  const cl = 'btn' + (pri ? ' pri' : '') + (good ? ' good' : '') + (ghost ? ' ghost' : '')
    + (full ? ' full' : '') + (sm ? ' sm' : '') + (disabled ? ' disabled' : '');
  return <div className={cl} style={style}>{children}</div>;
}
function Sticker({ label, icon, peel, sel, dash, rot = 0, badge, neu, style }) {
  return (
    <span className={'stk' + (peel ? ' peel' : '') + (sel ? ' sel' : '') + (dash ? ' dash' : '')}
      style={{ transform: rot ? `rotate(${rot}deg)` : null, ...style }}>
      {!dash && <span className="ico">{icon != null ? icon : emo(label)}</span>}
      {label}
      {neu && <span className="stk-new">NEW</span>}
      {badge && <span className="stk-check"><I.check/></span>}
    </span>
  );
}
function Toggle({ on }) { return <div className={'tgl' + (on ? ' on' : '')}><i></i></div>; }
function Pill({ children, on, live, style }) {
  return <span className={'pill' + (on ? ' on' : '') + (live ? ' live' : '')} style={style}>{children}</span>;
}
function Note({ children }) { return <div className="note">{children}</div>; }
function Hr({ style }) { return <hr className="hr" style={style}/>; }

/* ---------------- app icon (CONFIRMED: 물방울 핀 + 굵은 코랄 느낌표) ---------------- */
const DROP_PATH = 'M12 23c0 0 8-7.2 8-13A8 8 0 1 0 4 10c0 5.8 8 13 8 13Z';
function AppIcon({ size = 96, radius }) {
  const s = size / 124;
  const r = radius != null ? radius : Math.round(size * 0.226);
  const pinS = 106 * s;
  return (
    <div style={{ width: size, height: size, borderRadius: r, position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(120% 120% at 30% 18%, #f5906f, #e8674a 56%, #c5451e)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.35), 0 ' + (size*0.08) + 'px ' + (size*0.18) + 'px -' + (size*0.07) + 'px rgba(44,42,38,.45)' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
        background: 'linear-gradient(165deg, rgba(255,255,255,.24), rgba(255,255,255,0) 46%)' }}></div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 3 * s }}>
        <div style={{ position: 'relative', width: pinS, height: pinS }}>
          <svg width={pinS} height={pinS} viewBox="0 0 24 24" fill="#fff" style={{ filter: 'drop-shadow(0 ' + (4*s) + 'px ' + (4*s) + 'px rgba(120,30,10,.28))' }}><path d={DROP_PATH}/></svg>
          <div style={{ position: 'absolute', top: 24 * s, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 * s }}>
              <div style={{ width: 10 * s, height: 28 * s, background: '#e8674a', borderRadius: 5 * s }}></div>
              <div style={{ width: 11 * s, height: 11 * s, borderRadius: '50%', background: '#e8674a' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  I, EMO, emo, Phone, StatusBar, Body, AppBar, TabBar, Btn, Sticker, Toggle, Pill, Note, Hr, AppIcon,
});
