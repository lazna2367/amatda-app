// screens-core.jsx — 홈(3 변형) + 세트(목록/상세/생성 2 변형/라이브러리)
// depends on window primitives from wireframe-ui.jsx

// ---- small local helpers ----
function LivePill({ children = '감지 중' }) {
  return <span className="pill live"><span className="dot"></span>{children}</span>;
}
function NotiRow({ time, title, sub }) {
  return (
    <div className="row" style={{ padding: '9px 0', alignItems: 'flex-start' }}>
      <div className="iconbtn" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}><Ic.bell/></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, lineHeight: 1.2 }}>{title}</div>
        <div className="tiny" style={{ marginTop: 2 }}>{sub}</div>
      </div>
      <div className="tiny">{time}</div>
    </div>
  );
}

/* ===================== HOME — variant A: 활성 트리거 카드 ===================== */
function HomeA() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="아맞다" sub="빠뜨린 거 없죠?" />
      <Body>
        <div className="pad col" style={{ gap: 13, flex: 1 }}>
          <div>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 7 }}>
              <span className="tiny">지금 감지 중</span><LivePill/>
            </div>
            <div className="card pad">
              <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 9 }}>출근 가방</div>
              <div className="row" style={{ gap: 7, flexWrap: 'wrap' }}>
                <Sticker label="휴대폰" rot={-2}/><Sticker label="지갑" rot={1}/>
                <Sticker label="차 키" rot={-1} peel/><Sticker label="사원증" rot={2}/>
              </div>
              <Hr style={{ margin: '11px 0' }}/>
              <div className="row tiny" style={{ gap: 6 }}><Ic.pin/> 집에서 <b style={{ color: 'var(--accent)' }}>200m</b> 멀어지면 알림</div>
            </div>
          </div>

          <div>
            <div className="tiny" style={{ marginBottom: 7 }}>빠른 실행</div>
            <Btn pri full>＋ 가방 켜기</Btn>
            <Note>탭하면 바텀시트로 가방 목록 → 선택해서 활성화</Note>
          </div>

          <div style={{ flex: 1 }}>
            <div className="tiny" style={{ marginBottom: 2 }}>최근 알림</div>
            <NotiRow time="08:12" title="출근 가방 챙기셨나요?" sub="출발 감지 · 챙길 것 4개"/>
            <Hr/>
            <NotiRow time="어제" title="마트 도착 — 살 것 3개" sub="도착 구매 · 이마트 성수"/>
          </div>
        </div>
      </Body>
      <TabBar active="home"/>
    </Phone>
  );
}

/* ===================== HOME — variant B: 큰 상태 히어로 ===================== */
function HomeB() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="아맞다" sub="빠뜨린 거 없죠?" />
      <Body>
        <div className="pad col" style={{ gap: 14, flex: 1 }}>
          <div className="card pad center col" style={{ gap: 8, padding: '22px 16px', background: 'var(--accent-soft)', borderColor: 'var(--accent)' }}>
            <span className="pill on"><span className="dot"></span>실시간 감지</span>
            <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1 }}>1</div>
            <div className="muted" style={{ fontSize: 14 }}>개의 가방을 지켜보는 중</div>
            <div className="row tiny" style={{ gap: 6, marginTop: 2 }}><Ic.pin/> 출근 가방 · 집 기준 200m</div>
          </div>
          <Note>감지 중인 가방이 없으면 "지금은 쉬는 중" 빈 상태로 표시</Note>

          <div className="row" style={{ gap: 10 }}>
            <div className="card pad center col" style={{ flex: 1, gap: 5, padding: '13px 8px' }}>
              <Ic.plus/><span style={{ fontSize: 14 }}>가방 켜기</span>
            </div>
            <div className="card pad center col" style={{ flex: 1, gap: 5, padding: '13px 8px' }}>
              <Ic.cart/><span style={{ fontSize: 14 }}>살 것 추가</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="tiny" style={{ marginBottom: 2 }}>최근 알림</div>
            <NotiRow time="08:12" title="출근 가방 챙기셨나요?" sub="출발 감지 · 챙길 것 4개"/>
            <Hr/>
            <NotiRow time="어제" title="마트 도착 — 살 것 3개" sub="도착 구매"/>
          </div>
        </div>
      </Body>
      <TabBar active="home"/>
    </Phone>
  );
}

/* ===================== HOME — variant C: 세트 카드 그리드 ===================== */
function SetMiniCard({ name, count, live }) {
  return (
    <div className="card pad col" style={{ gap: 8 }}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 6 }}>
        <span style={{ fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap' }}>{name}</span>
        {live && <span className="dot" style={{ width: 9, height: 9, background: 'var(--good)', flex: 'none' }}></span>}
      </div>
      <div className="row" style={{ gap: 5, flexWrap: 'wrap' }}>
        <Sticker label="휴대폰" rot={-2} style={{ fontSize: 12, padding: '4px 7px 4px 5px' }}/>
        <Sticker label="지갑" rot={1} style={{ fontSize: 12, padding: '4px 7px 4px 5px' }}/>
      </div>
      <div className="tiny" style={{ whiteSpace: 'nowrap' }}>{count}개 · 나올 때</div>
    </div>
  );
}
function HomeC() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="아맞다" sub="빠뜨린 거 없죠?" />
      <Body>
        <div className="pad col" style={{ gap: 12, flex: 1 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="tiny">내 가방</span><span className="pill on"><span className="dot"></span>1개 감지 중</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <SetMiniCard name="출근 가방" count={4} live/>
            <SetMiniCard name="헬스장" count={3}/>
            <SetMiniCard name="등산 가방" count={5}/>
            <div className="card center col" style={{ gap: 6, color: 'var(--ink-soft)', borderStyle: 'dashed' }}>
              <Ic.plus/><span style={{ fontSize: 13 }}>추가</span>
            </div>
          </div>
          <Note>카드 탭 = 켜기/끄기 토글. 길게 누르면 상세로 이동</Note>
          <div style={{ flex: 1 }}></div>
          <Btn pri full>＋ 빠른 실행</Btn>
        </div>
      </Body>
      <TabBar active="home"/>
    </Phone>
  );
}

/* ===================== SET — 목록 ===================== */
function SetRow({ name, count, depart, arrive, live }) {
  return (
    <div className="card pad row" style={{ justifyContent: 'space-between', gap: 8 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row" style={{ gap: 7 }}>
          <span style={{ fontSize: 17, fontWeight: 700, whiteSpace: 'nowrap' }}>{name}</span>
          {live && <LivePill children="ON"/>}
        </div>
        <div className="row tiny" style={{ gap: 6, marginTop: 5, flexWrap: 'nowrap' }}>
          <span style={{ whiteSpace: 'nowrap' }}>챙길 것 {count}개</span>
          {depart && <span className="pill" style={{ whiteSpace: 'nowrap' }}><Ic.pin/>나올 때</span>}
          {arrive && <span className="pill" style={{ whiteSpace: 'nowrap' }}><Ic.cart/>들어갈 때</span>}
        </div>
      </div>
      <span style={{ flex: 'none' }}><Ic.chev/></span>
    </div>
  );
}
function SetList() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="가방" sub="2 / 2 사용 중" action={<div className="iconbtn"><Ic.plus/></div>}/>
      <Body>
        <div className="pad col" style={{ gap: 11, flex: 1 }}>
          <SetRow name="출근 가방" count={4} depart live/>
          <SetRow name="헬스장" count={3} depart/>
          <div className="card pad row center" style={{ gap: 8, borderStyle: 'dashed', color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
            <Ic.plus/> 가방 추가 <span className="tiny">(3개째부터 프로)</span>
          </div>
          <Note>무료 2개 한도 도달 → 3번째 생성 시 페이월</Note>
        </div>
      </Body>
      <TabBar active="set"/>
    </Phone>
  );
}

/* ===================== SET — 상세 ===================== */
function SetDetail() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="출근 가방" back action={<div className="iconbtn" style={{ fontSize: 13, width: 'auto', padding: '0 10px' }}>편집</div>}/>
      <Body>
        <div className="pad col" style={{ gap: 14, flex: 1 }}>
          <div>
            <div className="tiny" style={{ marginBottom: 8 }}>챙길 것 4개</div>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              <Sticker label="휴대폰" rot={-2} peel/><Sticker label="지갑" rot={1}/>
              <Sticker label="차 키" rot={-1}/><Sticker label="사원증" rot={2} peel/>
            </div>
          </div>
          <div className="card pad col" style={{ gap: 11 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="row" style={{ gap: 6, whiteSpace: 'nowrap' }}><Ic.pin/> 나올 때 알림</span><Toggle on/>
            </div>
            <Hr/>
            <div className="tiny">기준 위치 · 우리집 / 감지 반경 <b style={{ color: 'var(--accent)' }}>200m</b></div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="row muted" style={{ gap: 6, whiteSpace: 'nowrap' }}><Ic.cart/> 들어갈 때 알림</span><Toggle/>
            </div>
          </div>
          <div style={{ flex: 1 }}></div>
          <Btn pri full>지금 감지 시작</Btn>
        </div>
      </Body>
      <TabBar active="set"/>
    </Phone>
  );
}

/* ===================== SET — 생성: 변형 A (스텝) ===================== */
function Stepper({ step = 1, total = 3 }) {
  return (
    <div className="row" style={{ gap: 6, padding: '0 16px 8px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 5, borderRadius: 4, border: '1.5px solid var(--ink)',
          background: i < step ? 'var(--accent)' : '#fff' }}></div>
      ))}
    </div>
  );
}
function SetCreateA() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="새 가방" sub="STEP 2 / 3 · 챙길 것 담기" back/>
      <Stepper step={2}/>
      <Body>
        <div className="pad col" style={{ gap: 13, flex: 1 }}>
          <Field label="가방 이름" value="출근 가방"/>
          <div>
            <div className="lbl">담은 챙길 것</div>
            <div className="row" style={{ gap: 7, flexWrap: 'wrap' }}>
              <Sticker label="휴대폰" rot={-2}/><Sticker label="지갑" rot={1}/>
              <span className="stk" style={{ borderStyle: 'dashed', color: 'var(--ink-soft)' }}><Ic.plus/> 추가</span>
            </div>
          </div>
          <div>
            <div className="lbl">라이브러리에서 빠르게</div>
            <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
              {['차 키', '카드', '이어폰', '우산', '노트북'].map((l, i) => (
                <Sticker key={l} label={l} rot={i % 2 ? 1 : -1} style={{ opacity: .65 }}/>
              ))}
            </div>
          </div>
          <Note>스텝식 = 처음 쓰는 사람도 막힘 없이. 한 화면 = 한 결정</Note>
          <div style={{ flex: 1 }}></div>
          <Btn pri full>다음 — 알림 설정</Btn>
        </div>
      </Body>
    </Phone>
  );
}

/* ===================== SET — 생성: 변형 B (단일 스크롤) ===================== */
function SetCreateB() {
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="새 가방" back action={<div className="iconbtn" style={{ fontSize: 13, width: 'auto', padding: '0 9px' }}>저장</div>}/>
      <Body>
        <div className="pad col" style={{ gap: 13, flex: 1 }}>
          <Field label="가방 이름" value="출근 가방"/>
          <div>
            <div className="lbl">챙길 것</div>
            <div className="row" style={{ gap: 7, flexWrap: 'wrap' }}>
              <Sticker label="휴대폰" rot={-2}/><Sticker label="지갑" rot={1}/><Sticker label="차 키" rot={-1}/>
              <span className="stk" style={{ borderStyle: 'dashed', color: 'var(--ink-soft)' }}><Ic.plus/></span>
            </div>
          </div>
          <div className="card pad row" style={{ justifyContent: 'space-between' }}>
            <span className="row" style={{ gap: 6, whiteSpace: 'nowrap' }}><Ic.pin/> 나올 때 알림</span><Toggle on/>
          </div>
          <div className="row" style={{ gap: 9 }}>
            <Field label="기준 위치" value="우리집" style={{ flex: 1 }}/>
            <Field label="반경" value="200m" style={{ width: 78 }}/>
          </div>
          <div className="card pad row" style={{ justifyContent: 'space-between' }}>
            <span className="row muted" style={{ gap: 6, whiteSpace: 'nowrap' }}><Ic.cart/> 들어갈 때 알림</span><Toggle/>
          </div>
          <Note>한눈에 전체가 보이는 단일 폼 = 편집·재설정이 빠름</Note>
        </div>
      </Body>
    </Phone>
  );
}

/* ===================== SET — 아이템 라이브러리 ===================== */
function ItemLibrary() {
  const items = ['휴대폰', '지갑', '차 키', '카드', '이어폰', '우산', '노트북', '충전기', '텀블러', '마스크', '약', '여권'];
  return (
    <Phone>
      <StatusBar/>
      <AppBar title="챙길 것 고르기" sub="기본 템플릿 + 직접 추가" back/>
      <Body>
        <div className="pad col" style={{ gap: 12, flex: 1 }}>
          <div className="fld ph row" style={{ gap: 7 }}><Ic.plus/> 직접 입력해서 새 스티커 만들기</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {items.map((l, i) => <Sticker key={l} label={l} rot={i % 3 - 1} peel={i % 4 === 0}/>)}
          </div>
          <Note>탭하면 가방에 담김. 고른 건 코랄로 표시</Note>
        </div>
      </Body>
    </Phone>
  );
}

Object.assign(window, { HomeA, HomeB, HomeC, SetList, SetDetail, SetCreateA, SetCreateB, ItemLibrary, LivePill });
