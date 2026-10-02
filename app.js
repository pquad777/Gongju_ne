(function(){
/* ---------- helpers ---------- */
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parse=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const diff=(a,b)=>Math.round((Date.UTC(b.getFullYear(),b.getMonth(),b.getDate())-Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()))/864e5);
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return ymd(d)};
const NOW=new Date(), T=ymd(NOW), TD=parse(T);
const uid=()=>Math.random().toString(36).slice(2,10);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const WD=['일','월','화','수','목','금','토'];
const fmt=s=>{const d=parse(s);return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} (${WD[d.getDay()]})`};
const fmtShort=s=>{const d=parse(s);return `${d.getMonth()+1}월 ${d.getDate()}일 ${WD[d.getDay()]}요일`};
const ddLabel=n=>n===0?'D-DAY':(n>0?`D-${n}`:`D+${-n}`);

const USERS={hj:{name:'혁주',tint:'var(--me)'},gy:{name:'가영',tint:'var(--her)'}};
const other=id=>id==='hj'?'gy':'hj';

function mascot(tint,size){return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">
<path d="M22 25 L19.5 13 L27 18.5 L32 10 L37 18.5 L44.5 13 L42 25 Z" fill="var(--gold)" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/>
<ellipse cx="32" cy="41" rx="22" ry="18" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
<circle cx="24" cy="39" r="2.5" fill="var(--ink)"/><circle cx="40" cy="39" r="2.5" fill="var(--ink)"/>
<ellipse cx="18.5" cy="45" rx="3.8" ry="2.3" fill="${tint}" opacity=".75"/><ellipse cx="45.5" cy="45" rx="3.8" ry="2.3" fill="${tint}" opacity=".75"/>
<path d="M29 45 q3 3 6 0" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-linecap="round"/></svg>`}

const IC={
 cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="4"/><path d="M8 3v4M16 3v4M3.5 10h17"/><circle cx="8.5" cy="14.5" r="1" fill="currentColor"/><circle cx="12" cy="14.5" r="1" fill="currentColor"/></svg>',
 bucket:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6.5l1.6 1.6L8.5 5M4 13.5l1.6 1.6 2.9-3.1"/><path d="M11.5 7h8.5M11.5 14h8.5M4.5 19.5h15.5"/></svg>',
 dday:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/></svg>',
 plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M12 8.5v7M8.5 12h7"/></svg>',
 x:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 check:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 left:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
 right:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
 cake:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16v-6.5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"/><path d="M4 16c2 1.4 4 1.4 6 0s4-1.4 6 0 3 1 4 0M12 11.5V8M12 5.5v.01"/></svg>',
 crown:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3.5 18.5L2.5 7l5.2 4.2L12 4l4.3 7.2L21.5 7l-1 11.5z"/></svg>',
 dice:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
 spoon:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="7.5" rx="4" ry="5"/><path d="M12 12.5V21"/></svg>',
 soon:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 7v10M7 12h10"/></svg>'
};

/* ---------- state ---------- */
const KEY='gongju-preview-v1';
function seed(){
  const e=(o,date,time,title)=>({id:uid(),owner:o,date,time,title});
  const b=(o,text,done)=>({id:uid(),owner:o,text,done:!!done});
  return {
    me:null, startDate:addDays(T,-473),
    events:[
      e('hj',T,'19:00','성수에서 저녁 데이트'), e('gy',T,'11:00','팀플 회의'),
      e('hj',addDays(T,1),'14:00','알고리즘 스터디'), e('gy',addDays(T,2),'','친구 생일 파티'),
      e('gy',addDays(T,5),'10:30','필라테스'), e('hj',addDays(T,5),'18:30','같이 영화 보기'),
      e('hj',addDays(T,-3),'','중간고사 마지막 날'), e('gy',addDays(T,9),'15:00','전시회 예약')
    ],
    bucket:[
      b('gy','제주도 한 달 살기'), b('hj','커플 사진 스튜디오 가기'), b('gy','첫눈 오는 날 같이 산책'),
      b('hj','같이 요리 클래스 듣기'), b('gy','한강에서 자전거 타기',true), b('hj','놀이공원 야간 개장 가기',true)
    ],
    anniv:[
      {id:uid(),title:'가영 생일',date:addDays(T,50),repeat:true},
      {id:uid(),title:'혁주 생일',date:addDays(T,190),repeat:true}
    ],
    menus:['돈까스','마라탕','쌀국수','치킨','김치찌개'].map(n=>({id:uid(),owner:'hj',name:n}))
      .concat(['떡볶이','초밥','파스타','샐러드볼','곱창'].map(n=>({id:uid(),owner:'gy',name:n})))
  };
}
/* Two modes: with Supabase settings in config.js the data is shared between the two phones;
   without them the app runs as a local preview with example data. */
const CFG=window.GONGJU_CONFIG||{};
const REMOTE=!!(CFG.supabaseUrl&&CFG.supabaseAnonKey&&window.supabase);
const sb=REMOTE?window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey):null;
const EMAILS=CFG.emails||{};
const ownerOf=email=>Object.keys(EMAILS).find(k=>(EMAILS[k]||'').toLowerCase()===(email||'').toLowerCase())||null;
const newId=()=>(window.crypto&&crypto.randomUUID)?crypto.randomUUID():uid()+uid()+uid();

let S;
if(REMOTE){ S={me:null,startDate:null,events:[],bucket:[],anniv:[],menus:[]}; }
else{
  try{S=JSON.parse(localStorage.getItem(KEY))}catch(_){S=null}
  if(!S||!S.events) S=seed();
}
const save=()=>{ if(REMOTE) return; try{localStorage.setItem(KEY,JSON.stringify(S))}catch(_){} };

/* per-phone preferences (bite timer) */
let P={biteSec:20,biteCustom:[]};
try{Object.assign(P,JSON.parse(localStorage.getItem('gongju-prefs'))||{})}catch(_){}
if(S.biteSec){P.biteSec=S.biteSec;P.biteCustom=S.biteCustom||[];delete S.biteSec;delete S.biteCustom;}
const savePrefs=()=>{try{localStorage.setItem('gongju-prefs',JSON.stringify(P))}catch(_){}};

/* table mapping between app objects and database rows */
const TB={
  events:{t:'events',
    to:x=>({id:x.id,owner:x.owner,date:x.date,at_time:x.time||null,title:x.title}),
    from:r=>({id:r.id,owner:r.owner,date:r.date,time:r.at_time||'',title:r.title})},
  bucket:{t:'bucket_items',
    to:x=>({id:x.id,owner:x.owner,body:x.text,done:x.done}),
    from:r=>({id:r.id,owner:r.owner,text:r.body,done:r.done})},
  anniv:{t:'anniversaries',
    to:x=>({id:x.id,title:x.title,date:x.date,repeat_yearly:x.repeat}),
    from:r=>({id:r.id,title:r.title,date:r.date,repeat:r.repeat_yearly})},
  menus:{t:'menus',
    to:x=>({id:x.id,owner:x.owner,name:x.name}),
    from:r=>({id:r.id,owner:r.owner,name:r.name})}
};
function dbFail(error){
  console.error(error);
  toast('저장하지 못했어요. 인터넷 연결을 확인해 주세요');
  reload();
}
async function dbPut(k,x){ save(); if(!REMOTE) return; const {error}=await sb.from(TB[k].t).upsert(TB[k].to(x)); if(error) dbFail(error); }
async function dbDel(k,id){ save(); if(!REMOTE) return; const {error}=await sb.from(TB[k].t).delete().eq('id',id); if(error) dbFail(error); }
async function dbStart(date){ save(); if(!REMOTE) return; const {error}=await sb.from('couple_settings').upsert({id:1,start_date:date}); if(error) dbFail(error); }
async function loadAll(){
  const q=t=>sb.from(t).select('*').order('created_at',{ascending:true});
  const [e,b,a,m,s]=await Promise.all([q('events'),q('bucket_items'),q('anniversaries'),q('menus'),sb.from('couple_settings').select('*').eq('id',1).maybeSingle()]);
  const err=[e,b,a,m,s].find(r=>r.error); if(err) throw err.error;
  S.events=e.data.map(TB.events.from);
  S.bucket=b.data.map(TB.bucket.from).reverse();
  S.anniv=a.data.map(TB.anniv.from);
  S.menus=m.data.map(TB.menus.from);
  S.startDate=s.data?s.data.start_date:null;
}
let reloadTimer=null, pendingRender=false;
function reload(){
  if(!REMOTE||!S.me) return;
  clearTimeout(reloadTimer);
  reloadTimer=setTimeout(()=>loadAll().then(softRender).catch(e=>console.error(e)),350);
}
/* re-render without interrupting typing, an open sheet, or a spinning slot */
function softRender(){
  const ae=document.activeElement;
  if(spinning||document.querySelector('.sheet')||(ae&&ae.tagName==='INPUT'&&ae.closest('#view'))){pendingRender=true;return}
  pendingRender=false; render();
}
document.addEventListener('focusout',()=>setTimeout(()=>{if(pendingRender)softRender()},0));
let channel=null;
function subscribe(){
  if(!REMOTE||channel) return;
  channel=sb.channel('gongju-all').on('postgres_changes',{event:'*',schema:'public'},reload).subscribe();
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible') reload()});

let tab='cal', sub=null;
const cal={y:NOW.getFullYear(),m:NOW.getMonth(),sel:T,filter:'all'};
let bucketView='todo', loginPick='hj', slotPool='all', spinning=false, lastPick=null;

/* ---------- views ---------- */
function viewCal(){
  const first=new Date(cal.y,cal.m,1), startW=first.getDay(), days=new Date(cal.y,cal.m+1,0).getDate();
  const evs=S.events.filter(e=>cal.filter==='all'||e.owner===cal.filter);
  const by={}; evs.forEach(e=>(by[e.date]=by[e.date]||[]).push(e));
  let cells=WD.map(w=>`<div class="wk">${w}</div>`).join('');
  for(let i=0;i<startW;i++) cells+='<div></div>';
  for(let d=1;d<=days;d++){
    const ds=`${cal.y}-${pad(cal.m+1)}-${pad(d)}`, w=(startW+d-1)%7;
    const list=(by[ds]||[]).slice(0,3);
    const cls=['day',w===0?'sun':'',w===6?'sat':'',ds===T?'today':'',ds===cal.sel?'sel':''].join(' ');
    cells+=`<button class="${cls}" data-act="sel" data-d="${ds}" aria-label="${d}일, 일정 ${(by[ds]||[]).length}개"><span class="n">${d}</span><span class="dots">${list.map(e=>`<i class="dot d-${e.owner}"></i>`).join('')}</span></button>`;
  }
  const dayEv=(by[cal.sel]||[]).slice().sort((a,b)=>(a.time||'99').localeCompare(b.time||'99'));
  const chip=(v,l)=>`<button class="chip" data-act="calf" data-v="${v}" aria-pressed="${cal.filter===v}">${l}</button>`;
  return `
  <div class="cal-head">
    <button class="icon-btn" data-act="mon" data-v="-1" aria-label="이전 달">${IC.left}</button>
    <h2 class="disp">${cal.y}년 ${cal.m+1}월</h2>
    <button class="icon-btn" data-act="mon" data-v="1" aria-label="다음 달">${IC.right}</button>
  </div>
  <div class="chips" style="margin-bottom:12px">${chip('all','함께 보기')}${chip('hj','<i class="dot d-hj"></i> 혁주')}${chip('gy','<i class="dot d-gy"></i> 가영')}</div>
  <div class="card" style="padding:12px 8px"><div class="grid7">${cells}</div></div>
  <div class="section-title"><h2 class="disp">${fmtShort(cal.sel)}</h2><span>${cal.sel===T?'오늘':''}</span></div>
  <div class="ev-list">${dayEv.length?dayEv.map(e=>`
    <div class="ev"><span class="tm">${e.time||'하루'}</span><span class="tt">${esc(e.title)}</span>
    <span class="tag t-${e.owner}">${USERS[e.owner].name}</span>
    ${e.owner===S.me?`<button class="icon-btn" data-act="delev" data-id="${e.id}" aria-label="일정 삭제">${IC.x}</button>`:''}</div>`).join('')
    :'<div class="empty">이날은 아직 일정이 없어요</div>'}</div>
  <button class="btn block" style="margin-top:14px" data-act="newev">일정 추가</button>`;
}

function viewBucket(){
  const todo=S.bucket.filter(b=>!b.done), done=S.bucket.filter(b=>b.done);
  const list=bucketView==='todo'?todo:done;
  return `
  <div class="section-title" style="margin-top:8px"><h2 class="disp">우리의 버킷리스트</h2><span>${done.length} / ${S.bucket.length} 이룸</span></div>
  <form class="add-row" data-form="bucket"><input id="bkIn" name="t" placeholder="같이 하고 싶은 것" maxlength="60" autocomplete="off"><button class="btn" type="submit">추가</button></form>
  <div class="seg"><button data-act="bview" data-v="todo" aria-pressed="${bucketView==='todo'}">하고 싶은 것 ${todo.length}</button><button data-act="bview" data-v="done" aria-pressed="${bucketView==='done'}">이룬 것 ${done.length}</button></div>
  ${list.length?list.map(b=>`
    <div class="bk ${b.done?'done':''}">
      <button class="chk" data-act="btoggle" data-id="${b.id}" aria-label="${b.done?'완료 취소':'완료로 표시'}">${IC.check}</button>
      <span class="tx">${esc(b.text)}<span class="meta">${USERS[b.owner].name}의 소원</span></span>
      <button class="icon-btn" data-act="bdel" data-id="${b.id}" aria-label="삭제">${IC.x}</button>
    </div>`).join('')
  :`<div class="empty">${bucketView==='todo'?'하고 싶은 걸 하나 적어 볼까요?':'아직 이룬 게 없어요. 곧 생길 거예요'}</div>`}`;
}

function nextYearly(dateStr){
  const d=parse(dateStr); let c=new Date(TD.getFullYear(),d.getMonth(),d.getDate());
  if(diff(TD,c)<0) c=new Date(TD.getFullYear()+1,d.getMonth(),d.getDate());
  return ymd(c);
}
function viewDday(){
  if(!S.startDate) return `
  <div class="card hero" style="margin-top:8px">
    <div class="pair">${mascot('var(--me)',46)}<span style="color:var(--her)">${IC.dday.replace('<svg','<svg width="22" height="22"')}</span>${mascot('var(--her)',46)}</div>
    <div class="lbl" style="margin:6px 0 14px">사귀기 시작한 날을 정하면 D-day가 계산돼요</div>
    <button class="btn" data-act="editstart">처음 만난 날 정하기</button>
  </div>`;
  const start=parse(S.startDate), n=diff(start,TD)+1;
  const ms=[];
  for(let k=100;k<=5000;k+=100) ms.push({title:`${k}일`,date:addDays(S.startDate,k-1),kind:'ms'});
  for(let y=1;y<=15;y++){const d=new Date(start.getFullYear()+y,start.getMonth(),start.getDate());ms.push({title:`${y}주년`,date:ymd(d),kind:'ms'});}
  ms.sort((a,b)=>a.date.localeCompare(b.date));
  const next=ms.find(m=>diff(TD,parse(m.date))>=0);
  const prevArr=ms.filter(m=>diff(TD,parse(m.date))<0); const prev=prevArr.length?prevArr[prevArr.length-1].date:S.startDate;
  const span=diff(parse(prev),parse(next.date))||1, gone=diff(parse(prev),TD);
  const pct=Math.max(0,Math.min(100,Math.round(gone/span*100)));
  const up=ms.filter(m=>diff(TD,parse(m.date))>=0).slice(0,4)
    .concat(S.anniv.map(a=>({title:a.title,date:a.repeat?nextYearly(a.date):a.date,kind:'cu',id:a.id,repeat:a.repeat})).filter(a=>diff(TD,parse(a.date))>=0))
    .sort((a,b)=>a.date.localeCompare(b.date));
  return `
  <div class="card hero" style="margin-top:8px">
    <div class="pair">${mascot('var(--me)',46)}<span style="color:var(--her)">${IC.dday.replace('<svg','<svg width="22" height="22"')}</span>${mascot('var(--her)',46)}</div>
    <div class="lbl">혁주 ♡ 가영 함께한 지</div>
    <div class="big disp"><em>${n.toLocaleString()}</em>일째</div>
    <div class="since">${fmt(S.startDate)}부터 <button style="color:var(--accent);text-decoration:underline;font-size:13px" data-act="editstart">날짜 바꾸기</button></div>
    <div class="prog"><div class="row"><span>${esc(next.title)}까지</span><b class="disp" style="font-weight:400;color:var(--accent)">${ddLabel(diff(TD,parse(next.date)))}</b></div><div class="bar"><i style="width:${pct}%"></i></div></div>
  </div>
  <div class="section-title"><h2 class="disp">다가오는 날</h2><button class="chip" data-act="newan">기념일 추가</button></div>
  ${up.map(a=>{const dd=diff(TD,parse(a.date));return `
    <div class="an"><span class="ic ${a.kind==='cu'?'cu':''}">${a.kind==='cu'?IC.cake:IC.crown}</span>
    <span class="b"><b>${esc(a.title)}</b><span>${fmt(a.date)}${a.repeat?' · 매년':''}</span></span>
    <span class="dd ${dd===0?'zero':''}">${ddLabel(dd)}</span>
    ${a.kind==='cu'?`<button class="icon-btn" data-act="delan" data-id="${a.id}" aria-label="기념일 삭제">${IC.x}</button>`:''}</div>`}).join('')}`;
}

function viewPlus(){
  if(sub==='menu') return viewMenu();
  if(sub==='slow') return viewSlow();
  return `
  <div class="section-title" style="margin-top:8px"><h2 class="disp">더보기</h2><span>소소한 기능 모음</span></div>
  <div class="apps">
    <button class="app" data-act="open" data-v="menu"><span class="ai">${IC.dice}</span>랜덤 메뉴</button>
    <button class="app" data-act="open" data-v="slow"><span class="ai" style="background:var(--her-soft);color:var(--her)">${IC.spoon}</span>한 숟갈 타이머</button>
    <div class="app soon"><span class="ai">${IC.soon}</span>새 기능 자리</div>
  </div>`;
}

function poolList(){return S.menus.filter(m=>slotPool==='all'||m.owner===slotPool)}
function viewMenu(){
  const chip=(v,l)=>`<button class="chip" data-act="pool" data-v="${v}" aria-pressed="${slotPool===v}">${l}</button>`;
  let lights=''; const N=16;
  for(let i=0;i<N;i++){const t=i/N*2*Math.PI;lights+=`<i style="left:calc(50% + ${(Math.sin(t)*48).toFixed(1)}% - 3.5px);top:calc(50% - ${(Math.cos(t)*47).toFixed(1)}% - 3.5px)"></i>`;}
  const mine=S.menus.filter(m=>m.owner===S.me), theirs=S.menus.filter(m=>m.owner!==S.me);
  const pill=m=>`<span class="m t-${m.owner}">${esc(m.name)}${m.owner===S.me?`<button data-act="delmenu" data-id="${m.id}" aria-label="${esc(m.name)} 삭제">${IC.x.replace('16','12').replace('16','12')}</button>`:''}</span>`;
  return `
  <button class="back" data-act="close">${IC.left} 더보기</button>
  <div class="section-title" style="margin-top:0"><h2 class="disp">오늘 뭐 먹지?</h2><span>${poolList().length}개 메뉴</span></div>
  <div class="chips" style="justify-content:center;margin:4px 0 26px">${chip('all','둘 다')}${chip('hj','혁주 메뉴')}${chip('gy','가영 메뉴')}</div>
  <div class="machine" id="machine">
    <span class="crown">${mascot('var(--gold)',52)}</span>
    <div class="lights">${lights}</div>
    <div class="marquee">공주 식당 룰렛</div>
    <div class="window"><div class="strip" id="strip"><div>${lastPick?esc(lastPick):'?'}</div></div></div>
    <button class="lever" id="lever" data-act="spin">레버 당기기</button>
  </div>
  <div class="result" id="result">${lastPick?`오늘은 <b>${esc(lastPick)}</b> 어때요?`:'레버를 당기면 메뉴가 나와요'}</div>
  <div class="section-title"><h2 class="disp">내 메뉴</h2><span>${USERS[S.me].name}가 넣은 것</span></div>
  <form class="add-row" data-form="menu" style="margin-bottom:10px"><input id="mnIn" name="t" placeholder="메뉴 이름" maxlength="14" autocomplete="off"><button class="btn" type="submit">넣기</button></form>
  <div class="mn">${mine.map(pill).join('')||'<span class="empty" style="padding:6px 0">아직 없어요</span>'}</div>
  <div class="section-title"><h2 class="disp">${USERS[other(S.me)].name}의 메뉴</h2></div>
  <div class="mn">${theirs.map(pill).join('')||'<span class="empty" style="padding:6px 0">아직 없어요</span>'}</div>`;
}

/* ---------- slow eating timer ---------- */
const slow={on:false,bites:0,start:0,biteStart:0,biteEnd:0,ready:true,sound:true,summary:null,ctx:null,lock:null};
const RC=2*Math.PI*88;
const mmss=ms=>{const s=Math.floor(ms/1000);return `${Math.floor(s/60)}:${pad(s%60)}`};
function viewSlow(){
  const sec=P.biteSec||20;
  const custom=[...new Set((P.biteCustom||[]).concat(sec))].filter(v=>![15,20,30].includes(v)).sort((a,b)=>a-b);
  const chip=v=>`<button class="chip" data-act="slowsec" data-v="${v}" aria-pressed="${sec===v}">${v}초</button>`;
  const cchip=v=>`<span class="chip cu" aria-pressed="${sec===v}" style="padding-block:0"><button data-act="slowsec" data-v="${v}" style="padding:6px 0">${v}초</button><button class="cx" data-act="slowdelsec" data-v="${v}" aria-label="${v}초 지우기">${IC.x.replace('16','11').replace('16','11')}</button></span>`;
  return `
  <button class="back" data-act="close">${IC.left} 더보기</button>
  <div class="section-title" style="margin-top:0"><h2 class="disp">천천히 꼭꼭</h2><span>한 입마다 ${sec}초 쉬어 가기</span></div>
  <div class="chips" style="justify-content:center;margin-bottom:14px">${[15,20,30].map(chip).join('')}${custom.map(cchip).join('')}<button class="chip add" data-act="slowaddsec" aria-label="시간 직접 추가">+</button></div>
  <div class="card slow" id="slowCard">
    <div class="ring">
      <svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="88" class="rbg"/><circle cx="100" cy="100" r="88" class="rfg" id="ringFg" stroke-dasharray="${RC.toFixed(1)}" stroke-dashoffset="0"/></svg>
      <div class="rin">${mascot('var(--her)',58)}<div class="big disp" id="slowBig"></div><div class="sub" id="slowSub"></div></div>
    </div>
    <button class="btn block bite" id="biteBtn" data-act="slowbite"></button>
    <div class="stats"><div><span>먹은 입</span><b class="disp" id="stBites">0</b></div><div><span>식사 시간</span><b class="disp" id="stTime">0:00</b></div></div>
  </div>
  <div class="chips" style="justify-content:center;margin-top:14px">
    <button class="chip" data-act="slowsound" aria-pressed="${slow.sound}">${slow.sound?'알림 소리 켜짐':'알림 소리 꺼짐'}</button>
    ${slow.on?'<button class="chip" data-act="slowend">식사 끝내기</button>':''}
  </div>
  ${slow.summary?`<div class="card" style="margin-top:14px;text-align:center"><b class="disp" style="font-weight:400;font-size:17px">잘 먹었어요!</b><p style="margin:6px 0 0;color:var(--muted);font-size:14px">${slow.summary.bites}입을 ${mmss(slow.summary.ms)} 동안 천천히 먹었어요${slow.summary.bites>1?` · 한 입에 평균 ${Math.round(slow.summary.ms/slow.summary.bites/1000)}초`:''}</p></div>`:''}
  <p style="text-align:center;color:var(--muted);font-size:13px;margin:16px 8px 0">숟가락을 들기 전에 버튼을 누르고, 링이 다 찰 때까지 숟가락을 내려놓고 꼭꼭 씹어요.</p>`;
}
function updateSlow(){
  const big=document.getElementById('slowBig'); if(!big) return;
  const now=Date.now(), fg=document.getElementById('ringFg'), btn=document.getElementById('biteBtn'), sub=document.getElementById('slowSub'), card=document.getElementById('slowCard');
  card.classList.toggle('ready',slow.ready);
  if(slow.ready){
    fg.style.strokeDashoffset='0';
    big.textContent=slow.on?'한 입 OK':'준비';
    sub.textContent=slow.on?'이제 다음 한 입 먹어도 돼요':'첫 숟가락 뜨기 전에 눌러요';
    btn.disabled=false; btn.textContent=slow.on?'한 입 먹을게':'식사 시작하고 한 입';
  }else{
    const frac=Math.min(1,(now-slow.biteStart)/(slow.biteEnd-slow.biteStart));
    fg.style.strokeDashoffset=(RC*(1-frac)).toFixed(1);
    big.textContent=Math.ceil((slow.biteEnd-now)/1000);
    sub.textContent='숟가락 내려놓고 꼭꼭';
    btn.disabled=true; btn.textContent='씹는 중…';
  }
  document.getElementById('stBites').textContent=slow.bites;
  document.getElementById('stTime').textContent=slow.on?mmss(now-slow.start):(slow.summary?mmss(slow.summary.ms):'0:00');
}
function chime(){
  try{navigator.vibrate&&navigator.vibrate([120,80,120])}catch(_){}
  if(!slow.sound||!slow.ctx) return;
  try{
    const c=slow.ctx, t0=c.currentTime;
    [[784,0],[1175,.16]].forEach(([f,d])=>{
      const o=c.createOscillator(), g=c.createGain(); o.type='sine'; o.frequency.value=f;
      g.gain.setValueAtTime(0,t0+d); g.gain.linearRampToValueAtTime(.25,t0+d+.02); g.gain.exponentialRampToValueAtTime(.001,t0+d+.5);
      o.connect(g).connect(c.destination); o.start(t0+d); o.stop(t0+d+.55);
    });
  }catch(_){}
}
function slowBite(){
  if(!slow.ready) return;
  try{ if(!slow.ctx){const A=window.AudioContext||window.webkitAudioContext; if(A) slow.ctx=new A();} slow.ctx&&slow.ctx.resume&&slow.ctx.resume(); }catch(_){}
  const now=Date.now();
  if(!slow.on){
    slow.on=true; slow.start=now; slow.bites=0; slow.summary=null;
    try{navigator.wakeLock&&navigator.wakeLock.request('screen').then(l=>slow.lock=l).catch(()=>{})}catch(_){}
    render();
  }
  slow.bites++; slow.biteStart=now; slow.biteEnd=now+(P.biteSec||20)*1000; slow.ready=false;
  updateSlow();
}
function slowEnd(){
  slow.summary={bites:slow.bites,ms:Date.now()-slow.start};
  slow.on=false; slow.ready=true;
  try{slow.lock&&slow.lock.release()}catch(_){} slow.lock=null;
  render();
}
setInterval(()=>{
  if(slow.on&&!slow.ready&&Date.now()>=slow.biteEnd){slow.ready=true;chime();}
  if(tab==='plus'&&sub==='slow') updateSlow();
},200);

/* ---------- render ---------- */
const TABS=[['cal','캘린더'],['bucket','버킷리스트'],['dday','D-day'],['plus','더보기']];
function render(){
  if(!S.me){renderLogin();return}
  document.getElementById('whoBtn').innerHTML=`${mascot(USERS[S.me].tint,26)}<span>${USERS[S.me].name}</span>`;
  document.getElementById('tabs').innerHTML=TABS.map(([k,l])=>`<button class="tab" data-act="tab" data-v="${k}" ${tab===k?'aria-current="page"':''}><span class="ic">${IC[k]}</span>${l}</button>`).join('');
  const v=document.getElementById('view');
  v.innerHTML=({cal:viewCal,bucket:viewBucket,dday:viewDday,plus:viewPlus})[tab]();
  if(tab==='plus'&&sub==='slow') updateSlow();
}
function renderLogin(){
  layer(`<section class="login" aria-label="로그인"><div class="login-in">
    ${mascot('var(--her)',92)}
    <h1 class="disp">공주네</h1>
    <p>혁주랑 가영이만 들어올 수 있어요</p>
    <div class="pick">
      ${['hj','gy'].map(id=>`<button data-act="pick" data-v="${id}" aria-pressed="${loginPick===id}">${mascot(USERS[id].tint,58)}${USERS[id].name}</button>`).join('')}
    </div>
    <form data-form="login"><label class="field" for="pw">우리 비밀번호<input id="pw" name="pw" type="password" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="••••"></label>
      <div class="err" id="err"></div><button class="btn block" type="submit">들어가기</button></form>
  </div></section>`);
}
function layer(html){document.getElementById('layer').innerHTML=html}
function closeSheet(){layer(''); if(pendingRender) softRender();}
function sheet(title,body){
  layer(`<div class="sheet" data-act="sheetbg"><div class="panel" role="dialog" aria-label="${title}"><div class="grab"></div><h3 class="disp">${title}</h3>${body}</div></div>`);
  const f=document.querySelector('.panel input'); if(f) setTimeout(()=>f.focus(),50);
}
let toastTimer;
function toast(msg,undo){
  clearTimeout(toastTimer);
  const el=document.createElement('div'); el.className='toast'; el.innerHTML=`<span>${msg}</span>${undo?'<button>되돌리기</button>':''}`;
  document.querySelectorAll('.toast').forEach(t=>t.remove()); document.body.appendChild(el);
  if(undo) el.querySelector('button').onclick=()=>{undo();el.remove()};
  toastTimer=setTimeout(()=>el.remove(),3200);
}

/* ---------- actions ---------- */
document.addEventListener('click',ev=>{
  const t=ev.target.closest('[data-act]'); if(!t) return;
  const a=t.dataset.act, v=t.dataset.v, id=t.dataset.id;
  if(a==='sheetbg'&&ev.target!==t) return;
  switch(a){
    case 'tab': tab=v; if(v!=='plus') sub=null; else if(tab==='plus'&&t.getAttribute('aria-current')) sub=null; render(); document.getElementById('view').scrollTop=0; break;
    case 'sel': cal.sel=t.dataset.d; render(); break;
    case 'mon': cal.m+=+v; if(cal.m<0){cal.m=11;cal.y--} if(cal.m>11){cal.m=0;cal.y++} render(); break;
    case 'calf': cal.filter=v; render(); break;
    case 'newev': sheet('일정 추가',`<form data-form="ev">
        <label class="field" for="evT">무슨 일정이에요?<input id="evT" name="t" required maxlength="40" placeholder="예: 저녁 약속"></label>
        <div class="two"><label class="field" for="evD">날짜<input id="evD" name="d" type="date" required value="${cal.sel}"></label>
        <label class="field" for="evH">시간 (선택)<input id="evH" name="h" type="time"></label></div>
        <button class="btn block" type="submit">${USERS[S.me].name} 일정으로 추가</button></form>`); break;
    case 'delev': { const i=S.events.findIndex(e=>e.id===id); if(i<0) break; const [x]=S.events.splice(i,1); render(); dbDel('events',x.id); toast('일정을 지웠어요',()=>{S.events.push(x);render();dbPut('events',x)}); break; }
    case 'bview': bucketView=v; render(); break;
    case 'btoggle': { const b=S.bucket.find(b=>b.id===id); if(!b) break; b.done=!b.done; render(); dbPut('bucket',b); if(b.done) toast('하나 이뤘어요!'); break; }
    case 'bdel': { const i=S.bucket.findIndex(b=>b.id===id); if(i<0) break; const [x]=S.bucket.splice(i,1); render(); dbDel('bucket',x.id); toast('버킷리스트에서 지웠어요',()=>{S.bucket.splice(i,0,x);render();dbPut('bucket',x)}); break; }
    case 'editstart': sheet('처음 만난 날',`<form data-form="start"><label class="field" for="stD">사귀기 시작한 날 (1일)<input id="stD" name="d" type="date" required value="${S.startDate||T}" max="${T}"></label><button class="btn block" type="submit">저장</button></form>`); break;
    case 'newan': sheet('기념일 추가',`<form data-form="an">
        <label class="field" for="anT">이름<input id="anT" name="t" required maxlength="20" placeholder="예: 가영 생일"></label>
        <label class="field" for="anD">날짜<input id="anD" name="d" type="date" required value="${T}"></label>
        <label style="display:flex;align-items:center;gap:8px;font-size:14px"><input id="anR" name="r" type="checkbox" checked> 매년 반복</label>
        <button class="btn block" type="submit">추가</button></form>`); break;
    case 'delan': { const i=S.anniv.findIndex(x=>x.id===id); if(i<0) break; const [x]=S.anniv.splice(i,1); render(); dbDel('anniv',x.id); toast('기념일을 지웠어요',()=>{S.anniv.push(x);render();dbPut('anniv',x)}); break; }
    case 'open': sub=v; render(); break;
    case 'close': sub=null; render(); break;
    case 'pool': if(!spinning){slotPool=v; render();} break;
    case 'spin': spin(); break;
    case 'slowbite': slowBite(); break;
    case 'slowend': slowEnd(); break;
    case 'slowsec': P.biteSec=+v; savePrefs(); render(); break;
    case 'slowaddsec': sheet('한 입 간격 정하기',`<form data-form="bitesec">
        <div class="stepper"><button type="button" data-act="bsstep" data-v="-5" aria-label="5초 줄이기">−5</button>
        <input id="bsIn" name="s" type="number" inputmode="numeric" min="5" max="180" step="1" value="${P.biteSec||20}" aria-label="초"><button type="button" data-act="bsstep" data-v="5" aria-label="5초 늘리기">+5</button></div>
        <p style="margin:0;text-align:center;font-size:13px;color:var(--muted)">5초에서 180초 사이로 정할 수 있어요</p>
        <button class="btn block" type="submit">이 시간으로 쓰기</button></form>`); break;
    case 'bsstep': { const i=document.getElementById('bsIn'); i.value=Math.max(5,Math.min(180,(+i.value||20)+(+v))); break; }
    case 'slowdelsec': { const n=+v; P.biteCustom=(P.biteCustom||[]).filter(x=>x!==n); if(P.biteSec===n) P.biteSec=20; savePrefs(); render(); break; }
    case 'slowsound': slow.sound=!slow.sound; render(); break;
    case 'delmenu': { const i=S.menus.findIndex(m=>m.id===id); if(i<0) break; const [x]=S.menus.splice(i,1); render(); dbDel('menus',x.id); toast(`${esc(x.name)} 뺐어요`,()=>{S.menus.splice(i,0,x);render();dbPut('menus',x)}); break; }
    case 'pick': loginPick=v; renderLogin(); break;
    case 'sheetbg': closeSheet(); break;
  }
});
document.getElementById('whoBtn').addEventListener('click',async()=>{
  if(REMOTE){ try{await sb.auth.signOut()}catch(_){} S={me:null,startDate:null,events:[],bucket:[],anniv:[],menus:[]}; }
  else{ S.me=null; save(); }
  renderLogin();
});

document.addEventListener('submit',ev=>{
  const f=ev.target; ev.preventDefault();
  const fd=new FormData(f), t=(fd.get('t')||'').toString().trim();
  switch(f.dataset.form){
    case 'login':
      login((fd.get('pw')||'').toString());
      break;
    case 'ev': { if(!t) return; const x={id:newId(),owner:S.me,date:fd.get('d'),time:fd.get('h')||'',title:t}; S.events.push(x); dbPut('events',x); }
      cal.sel=fd.get('d'); {const d=parse(cal.sel);cal.y=d.getFullYear();cal.m=d.getMonth();}
      closeSheet(); render(); toast('일정을 추가했어요'); break;
    case 'bucket': { if(!t) return; const x={id:newId(),owner:S.me,text:t,done:false}; S.bucket.unshift(x); dbPut('bucket',x); } bucketView='todo'; render(); document.getElementById('bkIn').focus(); break;
    case 'start': S.startDate=fd.get('d'); dbStart(S.startDate); closeSheet(); render(); break;
    case 'an': { if(!t) return; const x={id:newId(),title:t,date:fd.get('d'),repeat:fd.get('r')==='on'}; S.anniv.push(x); dbPut('anniv',x); closeSheet(); render(); toast('기념일을 추가했어요'); break; }
    case 'bitesec': { const n=Math.round(+fd.get('s'));
      if(!(n>=5&&n<=180)){toast('5초에서 180초 사이로 넣어 주세요');return}
      P.biteCustom=P.biteCustom||[]; if(![15,20,30].includes(n)&&!P.biteCustom.includes(n)) P.biteCustom.push(n);
      P.biteCustom.sort((a,b)=>a-b); P.biteSec=n; savePrefs(); closeSheet(); render(); break; }
    case 'menu': { if(!t) return; const x={id:newId(),owner:S.me,name:t}; S.menus.push(x); dbPut('menus',x); } render(); document.getElementById('mnIn').focus(); break;
  }
});

/* ---------- slot machine ---------- */
function spin(){
  if(spinning) return;
  const pool=poolList();
  if(pool.length<2){toast('메뉴를 2개 이상 넣어 주세요');return}
  spinning=true;
  const pick=pool[Math.floor(Math.random()*pool.length)].name;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items=[]; const count=reduce?1:34;
  items.push(lastPick||'?');
  for(let i=0;i<count;i++) items.push(pool[Math.floor(Math.random()*pool.length)].name);
  items.push(pick);
  const strip=document.getElementById('strip'), m=document.getElementById('machine'), lever=document.getElementById('lever'), res=document.getElementById('result');
  strip.innerHTML=items.map(n=>`<div>${esc(n)}</div>`).join('');
  strip.style.transition='none'; strip.style.transform='translateY(0)'; void strip.offsetHeight;
  const dur=reduce?0.2:3.1;
  strip.style.transition=`transform ${dur}s cubic-bezier(.12,.72,.16,1)`;
  strip.style.transform=`translateY(-${(items.length-1)*72}px)`;
  m.classList.remove('win'); m.classList.add('spinning'); lever.disabled=true; lever.textContent='돌아가는 중…';
  res.textContent='두근두근';
  setTimeout(()=>{
    spinning=false; lastPick=pick; if(pendingRender) setTimeout(softRender,1200);
    m.classList.remove('spinning'); m.classList.add('win'); lever.disabled=false; lever.textContent='한 번 더';
    res.innerHTML=`오늘은 <b>${esc(pick)}</b> 어때요?`;
  },dur*1000+60);
}

/* ---------- auth & boot ---------- */
async function login(pin){
  const err=document.getElementById('err'), btn=document.querySelector('.login .btn');
  if(!REMOTE){
    if(pin===(CFG.localPin||'0402')){S.me=loginPick;save();layer('');render();}
    else err.textContent='비밀번호가 달라요. 다시 입력해 주세요';
    return;
  }
  if(!EMAILS[loginPick]){err.textContent='config.js에 이 사람의 이메일이 비어 있어요';return}
  btn.disabled=true; btn.textContent='확인하는 중…'; err.textContent='';
  const {data,error}=await sb.auth.signInWithPassword({email:EMAILS[loginPick],password:(CFG.passwordPrefix||'')+pin});
  if(error){
    btn.disabled=false; btn.textContent='들어가기';
    err.textContent=/rate|many/i.test(error.message||'')?'너무 많이 시도했어요. 잠시 뒤에 다시 해 주세요':'비밀번호가 달라요. 다시 입력해 주세요';
    return;
  }
  await enter(data.user);
}
async function enter(user){
  S.me=ownerOf(user&&user.email);
  if(!S.me){ try{await sb.auth.signOut()}catch(_){} renderLogin(); toast('등록된 계정이 아니에요'); return; }
  try{ await loadAll(); }catch(e){ console.error(e); toast('데이터를 불러오지 못했어요. 새로고침해 주세요'); }
  subscribe(); layer(''); render();
}
async function boot(){
  document.getElementById('modeNote').textContent=REMOTE?'혁주 ♡ 가영':'미리보기 · 예시 데이터';
  if(REMOTE){
    try{
      const {data}=await sb.auth.getSession();
      if(data&&data.session&&data.session.user){ await enter(data.session.user); return; }
    }catch(e){ console.error(e); }
    renderLogin(); return;
  }
  if(S.me) layer('');
  render();
}
boot();
if('serviceWorker' in navigator && location.protocol==='https:'){
  try{ navigator.serviceWorker.register('sw.js').catch(()=>{}); }catch(_){}
}
})();
