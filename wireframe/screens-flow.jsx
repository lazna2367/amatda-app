// screens-flow.jsx — 온보딩/로그인/권한 · 알림(출발·체크리스트 2변형·도착) · 페이월(2변형)/플랜 · 설정
// depends on window primitives from wireframe-ui.jsx (+ LivePill from screens-core.jsx)

/* ===================== 온보딩 ===================== */
function Dots({ i = 0, n = 3 }) {
  return (
    <div className="row center" style={{ gap: 7 }}>
      {Array.from({ length: n }).map((_, k) => (
        <span key={k} style={{ width: k === i ? 18 : 7, height: 7, borderRadius: 6,
          background: k === i ? 'var(--accent)' : 'var(--line)', display: 'block' }}></span>
      ))}
    </div>
  );
}
function Placeholder({ children, h = 168 }) {
  return (
    <div className="center" style={{ height: h, borderRadius: 18, border: '1.5px dashed var(--line)',
      background: 'repeating-linear-gradient(45deg,#fff,#fff 9px,#f1efe7 9px,#f1efe7 18px)' }}>
      <span className="tiny" style={{ background: 'var(--card)', padding: '3px 8px', borderRadius: 6 }}>{children}</span>
    </div>
  );
}
function Onb({ i, kicker, title, body, art }) {
  return (
    <Phone>
      <StatusBar/>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 16, padding: '20px 20px 24px' }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span style={{ fontSize: 20, fontWeight: 700, whiteSpace: 'nowrap' }}>아맞다</span>
            <span className="tiny">건너뛰기</span>
          </div>
          <Placeholder>{art}</Placeholder>
          <div className="col" style={{ gap: 8 }}>
            <span className="pill on" style={{ alignSelf: 'flex-start' }}>{kicker}</span>
            <div style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.25 }}>{title}</div>
            <div className="muted" style={{ fontSize: 15, lineHeight: 1.4 }}>{body}</div>
          </div>
          <div style={{ flex: 1 }}></div>
          <Dots i={i}/>
          <Btn pri full>{i === 2 ? '시작하기' : '다음'}</Btn>
        </div>
      </Body>
    </Phone>
  );
}
const Onb1 = () => <Onb i={0} kicker="01 · 스티커" title={<>들고 다니는 챙길 것,<br/><span className="mark">스티커로 붙여두세요</span></>} body="휴대폰·지갑·차 키를 가방으로 묶어 한 번에 챙겨요." art="스티커 붙이는 일러스트"/>;
const Onb2 = () => <Onb i={1} kicker="02 · 출발 감지" title={<>한 발 떼면,<br/><span className="mark">챙겼는지 확인</span></>} body="집에서 멀어지면 '빠뜨린 거 없죠?' 하고 알려드려요." art="위치 반경 · 출발 일러스트"/>;
const Onb3 = () => <Onb i={2} kicker="03 · 도착 구매" title={<>마트에 도착하면,<br/><span className="mark">살 것을 딱</span></>} body="등록한 장소에 가면 사야 할 목록을 알림으로 띄워요." art="장바구니 · 도착 일러스트"/>;

/* ===================== 소셜 로그인 ===================== */
function SocialBtn({ children, mark }) {
  return (
    <div className="btn full row" style={{ justifyContent: 'flex-start', gap: 10, fontSize: 15, fontWeight: 700 }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, border: '1.5px solid var(--ink)',
        background: mark || '#fff', display: 'block', flex: 'none' }}></span>
      {children}
    </div>
  );
}
function Login() {
  return (
    <Phone>
      <StatusBar/>
      <Body>
        <div className="pad col" style={{ flex: 1, padding: '20px', gap: 14 }}>
          <div style={{ flex: 1 }} className="center col">
            <div className="center col" style={{ gap: 10 }}>
              <div className="stk" style={{ fontSize: 24, padding: '14px 20px', transform: 'rotate(-4deg)', whiteSpace: 'nowrap' }}>아맞다</div>
              <div className="tiny" style={{ transform: 'rotate(-2deg)' }}>빠뜨린 거 없죠?</div>
            </div>
          </div>
          <div className="tiny center" style={{ marginBottom: 2 }}>3초 만에 시작 · 가방은 클라우드 동기화</div>
          <SocialBtn mark="#fff">Google로 계속하기</SocialBtn>
          <SocialBtn mark="var(--mark)">카카오로 계속하기</SocialBtn>
          <SocialBtn mark="var(--ink)">Apple로 계속하기</SocialBtn>
          <div className="tiny center" style={{ lineHeight: 1.5 }}>계속하면 이용약관 · 개인정보처리방침에 동의합니다</div>
        </div>
      </Body>
    </Phone>
  );
}

/* ===================== 권한 요청 ===================== */
function PermRow({ icon, title, body, why }) {
  return (
    <div className="card pad col" style={{ gap: 7 }}>
      <div className="row" style={{ gap: 9 }}>
        <div className="iconbtn" style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent)', color: 'var(--accent)' }}>{icon}</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
      </div>
      <div className="muted" style={{ fontSize: 14, lineHeight: 1.4 }}>{body}</div>
      <div className="tiny" style={{ color: 'var(--accent)' }}>왜 필요한가요 — {why}</div>
    </div>
  );
}
function Permission() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="시작 전에 두 가지만" sub="권한이 있어야 감지가 됩니다"/>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 12 }}>
          <PermRow icon={<Ic.pin/>} title="위치 — 항상 허용" body="앱이 꺼져 있어도 출발·도착을 감지해요." why="백그라운드 지오펜싱"/>
          <PermRow icon={<Ic.bell/>} title="알림" body="'챙기셨나요?'를 푸시로 띄워요." why="로컬 푸시 알림"/>
          <Note>'사용 중에만'은 감지가 안 됨 → '항상'으로 유도하는 안내 1줄</Note>
          <div style={{ flex: 1 }}></div>
          <Btn pri full>권한 허용하고 시작</Btn>
          <div className="tiny center">나중에 설정에서 바꿀 수 있어요</div>
        </div>
      </Body>
    </Phone>
  );
}

/* ===================== 출발 감지 푸시 (잠금화면) ===================== */
function DepartPush() {
  return (
    <Phone style={{ background: '#2c2a26', borderColor: '#2c2a26' }}>
      <div className="sb" style={{ color: '#cfcabd' }}><span>9:41</span><span className="dots"><i style={{ background: '#cfcabd' }}></i><i style={{ background: '#cfcabd' }}></i><i style={{ background: '#cfcabd' }}></i></span></div>
      <Body>
        <div className="col" style={{ flex: 1, padding: '14px', gap: 14, color: '#f7f6f1' }}>
          <div className="center col" style={{ gap: 2, marginTop: 18 }}>
            <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1 }}>9:41</div>
            <div className="tiny" style={{ color: '#cfcabd' }}>4월 18일 목요일</div>
          </div>
          <div style={{ flex: 1 }}></div>
          <div className="card pad col" style={{ gap: 9, boxShadow: 'none', color: 'var(--ink)' }}>
            <div className="row" style={{ gap: 8 }}>
              <div className="iconbtn" style={{ background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' }}><Ic.bell/></div>
              <div><div style={{ fontWeight: 700, fontSize: 15 }}>아맞다</div><div className="tiny">지금 · 출발 감지</div></div>
            </div>
            <div style={{ fontSize: 17 }}>출근 가방 <span className="mark">챙기셨나요?</span></div>
            <div className="tiny">휴대폰 · 지갑 · 차 키 · 사원증</div>
            <Hr/>
            <div className="row" style={{ gap: 8 }}>
              <Btn sm style={{ flex: 1 }}>다 챙김</Btn>
              <Btn sm pri style={{ flex: 1 }}>열기</Btn>
            </div>
          </div>
          <div className="tiny center" style={{ color: '#cfcabd' }}>탭 = 체크리스트 화면으로</div>
        </div>
      </Body>
    </Phone>
  );
}

/* ===================== 체크리스트 — 변형 A: 리스트 ===================== */
function CheckItem({ label, done }) {
  return (
    <div className="card pad row" style={{ gap: 10, padding: '11px 13px', borderColor: done ? 'var(--good)' : 'var(--ink)' }}>
      <div className="center" style={{ width: 24, height: 24, borderRadius: 8, flex: 'none',
        border: '1.5px solid ' + (done ? 'var(--good)' : 'var(--ink)'), background: done ? 'var(--good)' : '#fff', color: '#fff' }}>
        {done && <Ic.check/>}
      </div>
      <span style={{ fontSize: 16, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--ink-soft)' : 'var(--ink)' }}>{label}</span>
      <div style={{ flex: 1 }}></div>
      <Sticker label="" style={{ width: 22, padding: 4 }} icon=""/>
    </div>
  );
}
function ChecklistA() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="챙기셨나요?" sub="출근 가방 · 출발 감지" action={<div className="iconbtn"><Ic.x/></div>}/>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 9 }}>
          <div className="tiny">하나씩 탭해서 확인하세요 · 2 / 4</div>
          <CheckItem label="휴대폰" done/>
          <CheckItem label="지갑" done/>
          <CheckItem label="차 키"/>
          <CheckItem label="사원증"/>
          <Note>체크 안 한 항목이 있으면 코랄로 강조 → 되돌아가게 유도</Note>
          <div style={{ flex: 1 }}></div>
          <Btn pri full>다 챙겼어요 — 닫기</Btn>
        </div>
      </Body>
    </Phone>
  );
}

/* ===================== 체크리스트 — 변형 B: 스와이프 카드 ===================== */
function ChecklistB() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="챙기셨나요?" sub="출근 가방 · 3 / 4 남음" action={<div className="iconbtn"><Ic.x/></div>}/>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 12 }}>
          <div style={{ position: 'relative', height: 300, marginTop: 6 }}>
            <div className="card center col" style={{ position: 'absolute', inset: '14px 26px 0', transform: 'rotate(3deg)', opacity: .5 }}></div>
            <div className="card center col" style={{ position: 'absolute', inset: '7px 16px 0', transform: 'rotate(-2deg)', opacity: .7 }}></div>
            <div className="card center col" style={{ position: 'absolute', inset: 0, gap: 14, padding: 18 }}>
              <Sticker label="" style={{ width: 80, height: 80, borderRadius: 20 }} icon=""/>
              <div style={{ fontSize: 26, fontWeight: 700, whiteSpace: 'nowrap' }}>차 키</div>
              <div className="tiny">3개 중 3번째</div>
            </div>
          </div>
          <div className="row center tiny" style={{ gap: 16 }}>
            <span>← 아직</span><span style={{ color: 'var(--good)' }}>챙김 →</span>
          </div>
          <Note>한 손 엄지 조작 · 빠짐없이 하나씩. A안보다 '의식적 확인'에 강함</Note>
          <div style={{ flex: 1 }}></div>
          <div className="row" style={{ gap: 9 }}>
            <Btn full>아직</Btn><Btn pri full>챙겼어요</Btn>
          </div>
        </div>
      </Body>
    </Phone>
  );
}

/* ===================== 도착 구매 알림 ===================== */
function ArriveBuy() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="이마트 성수 도착" sub="도착 구매 · 살 것 3개" action={<div className="iconbtn"><Ic.x/></div>}/>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 9 }}>
          <div className="card pad row" style={{ gap: 8 }}><Ic.pin/><span className="tiny">등록한 위치에 도착해서 알림이 떴어요</span></div>
          <CheckItem label="우유 2개"/>
          <CheckItem label="계란 한 판" done/>
          <CheckItem label="식빵"/>
          <div className="row" style={{ gap: 7 }}>
            <div className="fld ph row" style={{ flex: 1, gap: 6 }}><Ic.plus/> 살 것 추가</div>
          </div>
          <Note>마트·약국 등 위치별 쇼핑 리스트. 체크 UI는 출발 체크리스트와 공유</Note>
          <div style={{ flex: 1 }}></div>
          <Btn pri full>다 샀어요</Btn>
        </div>
      </Body>
    </Phone>
  );
}

/* ===================== 페이월 — 변형 A: 투자심리 히어로 ===================== */
function PaywallA() {
  return (
    <Phone>
      <div className="sb"><span>9:41</span><span className="tiny">✕</span></div>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 13, padding: '8px 18px 22px' }}>
          <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
            <Sticker label="출근 가방" rot={-3} peel/><Sticker label="헬스장" rot={2} peel/>
          </div>
          <div style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.25 }}>
            가방 2개를 다 쓰셨네요.<br/><span className="mark">3개째부터는 프로예요</span>
          </div>
          <div className="muted" style={{ fontSize: 14 }}>이미 만든 가방은 그대로 유지돼요. 더 담을 공간만 열려요.</div>
          <div className="card pad col" style={{ gap: 9 }}>
            {[['가방 5개까지', '스탠다드'], ['가방 10개까지', '프로'], ['챙길 것 무제한 · 클라우드 동기화', '전부']].map(([t, tag]) => (
              <div key={t} className="row" style={{ gap: 9 }}>
                <span className="center" style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--accent)', color: '#fff', flex: 'none' }}><Ic.check/></span>
                <span style={{ fontSize: 15, flex: 1 }}>{t}</span><span className="tiny">{tag}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}></div>
          <Btn pri full>프로 시작 · 월 3,900원</Btn>
          <div className="tiny center">연간 결제 시 -35% · 언제든 해지</div>
        </div>
      </Body>
    </Phone>
  );
}

/* ===================== 페이월 — 변형 B: 플랜 비교 ===================== */
function PlanCol({ name, price, sets, hi }) {
  return (
    <div className="card pad col" style={{ gap: 7, flex: 1, padding: '12px 10px',
      borderColor: hi ? 'var(--accent)' : 'var(--ink)', background: hi ? 'var(--accent-soft)' : 'var(--card)' }}>
      <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
      <div style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap' }}>{price}</div>
      <Hr/>
      <div className="tiny">가방 {sets}</div>
      <div className="tiny">챙길 것 무제한</div>
    </div>
  );
}
function PaywallB() {
  return (
    <Phone>
      <div className="sb"><span>9:41</span><span className="tiny">✕</span></div>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 13, padding: '10px 16px 22px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.25 }}>플랜 비교</div>
          <div className="row center" style={{ gap: 0, border: '1.5px solid var(--ink)', borderRadius: 12, overflow: 'hidden', fontSize: 13 }}>
            <span style={{ flex: 1, textAlign: 'center', padding: '7px 0', background: 'var(--ink)', color: '#fff' }}>연간 -35%</span>
            <span style={{ flex: 1, textAlign: 'center', padding: '7px 0' }}>월간</span>
          </div>
          <div className="row" style={{ gap: 8, alignItems: 'stretch' }}>
            <PlanCol name="무료" price="0원" sets="2개"/>
            <PlanCol name="스탠다드" price="2,500원" sets="5개"/>
            <PlanCol name="프로" price="3,900원" sets="10개" hi/>
          </div>
          <Note>표로 한눈에 비교 → 가격 민감 사용자 설득. 프로 강조</Note>
          <div style={{ flex: 1 }}></div>
          <Btn pri full>프로 선택</Btn>
          <Btn full>스탠다드 선택</Btn>
        </div>
      </Body>
    </Phone>
  );
}

/* ===================== 구독 플랜 선택 ===================== */
function PlanSelect() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="구독" back/>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 12 }}>
          <div className="row center" style={{ border: '1.5px solid var(--ink)', borderRadius: 12, overflow: 'hidden', fontSize: 14 }}>
            <span style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: 'var(--accent)', color: '#fff' }}>연간 · 2개월 무료</span>
            <span style={{ flex: 1, textAlign: 'center', padding: '8px 0' }}>월간</span>
          </div>
          <div className="card pad row" style={{ justifyContent: 'space-between', borderColor: 'var(--accent)' }}>
            <div><div style={{ fontSize: 16, fontWeight: 700 }}>프로 · 연간</div><div className="tiny">가방 10개 + 챙길 것 무제한</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 700 }}>29,900원</div><div className="tiny">/년</div></div>
          </div>
          <div className="card pad row" style={{ justifyContent: 'space-between' }}>
            <div><div style={{ fontSize: 16, fontWeight: 700 }}>스탠다드 · 연간</div><div className="tiny">가방 5개</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 700 }}>19,900원</div><div className="tiny">/년</div></div>
          </div>
          <Note>RevenueCat 영수증 검증 · 복원 링크 하단</Note>
          <div style={{ flex: 1 }}></div>
          <Btn pri full>프로 구독하기</Btn>
          <div className="tiny center">구매 복원 · 약관</div>
        </div>
      </Body>
    </Phone>
  );
}

/* ===================== 설정 ===================== */
function SetRow2({ label, value, danger }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', padding: '11px 0' }}>
      <span style={{ fontSize: 15, color: danger ? 'var(--accent)' : 'var(--ink)' }}>{label}</span>
      <span className="row tiny" style={{ gap: 6 }}>{value}<Ic.chev/></span>
    </div>
  );
}
function Settings() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="설정"/>
      <Body>
        <div className="pad col" style={{ flex: 1, gap: 10 }}>
          <div className="card pad row" style={{ gap: 11 }}>
            <div className="iconbtn" style={{ width: 38, height: 38, borderRadius: 12 }}></div>
            <div><div style={{ fontSize: 16, fontWeight: 700 }}>김아맞</div><div className="tiny">카카오 · amatda@kakao</div></div>
            <div style={{ flex: 1 }}></div><span className="pill on">프로</span>
          </div>
          <div className="card pad col">
            <div className="lbl">권한</div>
            <SetRow2 label="위치 — 항상 허용" value={<span className="pill on">정상</span>}/>
            <Hr/>
            <SetRow2 label="알림" value={<span className="pill" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>꺼짐</span>}/>
          </div>
          <div className="card pad col">
            <SetRow2 label="구독 관리" value="프로 · 연간"/>
            <Hr/>
            <SetRow2 label="개인정보처리방침"/>
            <Hr/>
            <SetRow2 label="이용약관"/>
          </div>
          <div className="card pad col">
            <SetRow2 label="로그아웃"/>
            <Hr/>
            <SetRow2 label="회원 탈퇴" danger/>
          </div>
        </div>
      </Body>
      <TabBar active="cog"/>
    </Phone>
  );
}

Object.assign(window, {
  Onb1, Onb2, Onb3, Login, Permission,
  DepartPush, ChecklistA, ChecklistB, ArriveBuy,
  PaywallA, PaywallB, PlanSelect, Settings,
});
