// Math Unit 1 problem generators (SOL 4.NS.1, 4.NS.2, 4.CE.1). Every answer is computed, never typed in by hand.
// Fresh numbers every time: nothing here can be memorised or copied from the study guide.
import { PLACES, fmt } from '../mech/index.js';
import { shuffle } from '../core/ui.js';

export const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
export const pick=a=>a[ri(0,a.length-1)];
const ONES=['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function w3(n){ const s=[]; if(n>=100){ s.push(ONES[Math.floor(n/100)]+' hundred'); n%=100; } if(n>=20) s.push(TENS[Math.floor(n/10)]+(n%10?'-'+ONES[n%10]:'')); else if(n>0) s.push(ONES[n]); return s.join(' '); }
export function words(n){ const m=Math.floor(n/1e6), t=Math.floor(n/1e3)%1000, o=n%1000; return [m&&w3(m)+' million', t&&w3(t)+' thousand', o&&w3(o)].filter(Boolean).join(', '); }
export const roundTo=(n,p)=>{ const u=10**p, lo=Math.floor(n/u)*u; return (n-lo)*2>=u ? lo+u : lo; };
const frontEnd=n=>{ const u=10**(String(n).length-1); return Math.floor(n/u)*u; };
const UNIT=['one','ten','hundred','thousand','ten thousand','hundred thousand'];
const uniq=a=>[...new Set(a)];
// Wrap a generator so a missed item comes back as a NEW problem of the same skill.
const G=(key,fn)=>function make(){ const it=fn(); it.key=it.key||key; it.regen=make; return it; };

function distinctNumber(len){ const d=shuffle([1,2,3,4,5,6,7,8,9]).slice(0,len); if(len>=6&&Math.random()<.6) d[ri(1,len-1)]=0; return Number(d.join('')); }

export const gPlace=G('pv-place',()=>{ const n=distinctNumber(ri(7,9)), s=String(n); let p=ri(0,s.length-1); const d=Number(s[s.length-1-p]);
  const byValue=d!==0&&Math.random()<.4;
  return {type:'digit', number:n, a:p, q:byValue?`Tap the digit worth ${fmt(d*10**p)}.`:`Tap the digit in the ${PLACES[p].toUpperCase()} place.`,
    why:'Every comma has a last name: millions, thousands. Say the period name every time. Ten thousands and ten millions are different places.'}; });

export const gValue=G('pv-value',()=>{ const n=distinctNumber(ri(7,9)), s=String(n); let p; do{ p=ri(0,s.length-1); }while(s[s.length-1-p]==='0'); const d=Number(s[s.length-1-p]);
  if(Math.random()<.5){ const cand=shuffle(uniq([p+3,p-3,p+1,p-1,p+2].filter(x=>x>=0&&x<=8&&x!==p))).slice(0,3);
    return {type:'choice', key:'pv-placename', q:`Which PLACE is the ${d} in?\n${fmt(n)}`, opts:[p,...cand].map(x=>PLACES[x]), a:PLACES[p], why:'Count the places from the right, and say the period name: ones, thousands, millions.'}; }
  const cand=shuffle(uniq([p+3,p-3,p+1,p-1].filter(x=>x>=0&&x<=8))).slice(0,3).map(x=>fmt(d*10**x));
  return {type:'choice', q:`What is the VALUE of the ${d} in\n${fmt(n)}?`, opts:[fmt(d*10**p),...cand], a:fmt(d*10**p), why:`Place is where the digit sits. Value is what it is worth there: the ${d} is in the ${PLACES[p]} place, so it is worth ${fmt(d*10**p)}.`}; });

function zeroNumber(){ const part=()=>pick([0,ri(1,9),ri(1,9)*10,ri(10,99),ri(1,9)*100,ri(100,999)]); let m,t,o,n;
  do{ m=Math.random()<.7?part():0; t=part(); o=part(); n=m*1e6+t*1e3+o; }while(n<10000||(m===0&&t<10)||String(n).replace(/0/g,'').length<2); return n; }
export const gWritten=G('pv-written',()=>{ const n=zeroNumber();
  return {type:'keypad', q:`Type this number:\n${words(n)}`, a:String(n), why:'Every comma has a last name. Each period needs THREE digits, so empty places get zeros.'}; });

const expanded=n=>{ const s=String(n); return [...s].map((c,i)=>Number(c)*10**(s.length-1-i)).filter(Boolean); };
export const gExpanded=G('pv-expanded',()=>{ const n=zeroNumber(), terms=expanded(n), str=t=>t.map(fmt).join(' + ');
  if(Math.random()<.55) return {type:'keypad', q:`Type it in standard form:\n${str(terms)}`, a:String(n), why:'Line the parts up by place. A place with no part gets a zero.'};
  const wrong=new Set(); let guard=0; while(wrong.size<3&&guard++<40){ const t=terms.slice(), i=ri(0,t.length-1); t[i]=Math.random()<.5?t[i]*10:(t[i]%10===0?t[i]/10:t[i]*100); const s=str(t); if(s!==str(terms)&&new Set(t).size===t.length) wrong.add(s); }
  return {type:'choice', q:`Which is the expanded form of\n${fmt(n)}?`, opts:[str(terms),...wrong], a:str(terms), why:'Each digit times its place. A zero digit is simply skipped.'}; });

export const gCompare=G('cmp-symbol',()=>{ let a,b; const r=Math.random();
  if(r<.15){ a=b=ri(100000,9999999); }
  else if(r<.3){ const k=ri(4,6); a=10**k-ri(1,99); b=10**k+ri(0,99); if(Math.random()<.5)[a,b]=[b,a]; }
  else { a=ri(10000,9999999); const s=[...String(a)]; let i,tries=0; do{ i=ri(0,s.length-2); }while((s[i]===s[i+1]||(i===0&&s[1]==='0'))&&tries++<20); [s[i],s[i+1]]=[s[i+1],s[i]]; b=Number(s.join('')); if(a===b) b=a+ri(1,9)*10**ri(0,3); }
  const sym=a>b?'>':a<b?'<':'=';
  return {type:'choice', big:true, noShuffle:true, q:`${fmt(a)}  ◯  ${fmt(b)}`, hint:'Which symbol goes in the circle?', opts:['>','<','='], a:sym, why:'Line them up. Walk left to right. The first place where the digits differ decides it. More digits beats fewer.'}; });

export const gOrder=G('cmp-order',()=>{ const base=[...String(ri(100000,9999999))], set=new Set([Number(base.join(''))]); let guard=0;
  while(set.size<4&&guard++<60){ const s=base.slice(), i=ri(1,s.length-2); [s[i],s[i+1]]=[s[i+1],s[i]]; if(Math.random()<.4){ const j=ri(1,s.length-1); s[j]=String(ri(0,9)); } set.add(Number(s.join(''))); }
  const nums=[...set].slice(0,ri(3,4)), up=Math.random()<.6, sorted=nums.slice().sort((x,y)=>up?x-y:y-x);
  return {type:'order', q:up?'Put them in order, least to greatest.':'Put them in order, greatest to least.', dir:up?'LEAST → GREATEST':'GREATEST → LEAST', tokens:nums.map(x=>({id:String(x),t:fmt(x)})), a:sorted.map(String),
    why:'Line them up by place. Compare from the left. The first place that differs decides.'}; });

export const gRound=G('round',()=>{ const p=ri(1,4), u=10**p; let n; const r=Math.random();
  if(r<.3&&p>=2) n=ri(1,99)*u+4*u/10+(u/10-1);                                   // 25,499: the 4 decides, the 99 does not matter
  else if(r<.5) n=(ri(0,9)*10+9)*u+ri(5,9)*u/10+ri(0,u/10-1);                     // 3,962: the 9 rolls over
  else n=ri(1,Math.random()<.5?9:99)*u+ri(1,u-1);
  if(n%u===0) n+=ri(1,u-1); const lo=Math.floor(n/u)*u;
  return {type:'hill', n, place:p, lo, hi:lo+u, a:roundTo(n,p), q:`Round ${fmt(n)} to the nearest ${UNIT[p].toUpperCase()}.`,
    why:'Find the place. Look next door. 5, 6, 7, 8 (and 9) means step UP. 0 to 4, stay put. Ignore the rest of the street.'}; });

export const gEstimate=G('estimate',()=>{ const kind=pick(['round3','front','name','name','reason','sub']); let o;
  const four=()=>ri(1,8)*1000+ri(100,999);
  for(let guard=0;guard<50;guard++){
    if(kind==='round3'){ const x=[ri(12,89),ri(12,89),ri(12,89)], r=x.reduce((s,v)=>s+roundTo(v,1),0), f=x.reduce((s,v)=>s+frontEnd(v),0), e=x.reduce((s,v)=>s+v,0); const opts=uniq([r,f,e,r+10]);
      if(opts.length===4){ o={q:`Estimate by ROUNDING to the nearest ten:\n${x.join(' + ')}`, opts:opts.map(fmt), a:fmt(r), why:`Round each one first: ${x.map(v=>roundTo(v,1)).join(' + ')} = ${r}.`}; break; } }
    else if(kind==='front'){ const x=four(), y=four(), f=frontEnd(x)+frontEnd(y), r=roundTo(x,3)+roundTo(y,3), e=x+y; const opts=uniq([f,r,e,f+2000]);
      if(opts.length===4&&f!==r){ o={q:`FRONT-END estimate:\n${fmt(x)} + ${fmt(y)}`, opts:opts.map(fmt), a:fmt(f), why:`Front-end = front door only. Keep the first digit: ${fmt(frontEnd(x))} + ${fmt(frontEnd(y))} = ${fmt(f)}.`}; break; } }
    else if(kind==='name'){ const which=pick(['Rounding','Front-end','Compatible numbers']); let shown;
      if(which==='Compatible numbers'){ const b=shuffle([25,50,75,125,150]).slice(0,3), x=b.map(v=>v+pick([-2,-1,1,2])); shown=`${x.join(' + ')}\n→  ${b.join(' + ')}`; }
      else { const x=four(), y=four(); if(roundTo(x,3)===frontEnd(x)&&roundTo(y,3)===frontEnd(y)) continue; const fn=which==='Rounding'?v=>roundTo(v,3):frontEnd; shown=`${fmt(x)} + ${fmt(y)}\n→  ${fmt(fn(x))} + ${fmt(fn(y))}`; }
      o={q:`Which strategy is this?\n${shown}`, opts:['Rounding','Front-end','Compatible numbers'], a:which, why:'Rounding: round each number to a place. Front-end: keep only the first digit. Compatible numbers: swap in friendly numbers that are easy in your head.'}; break; }
    else if(kind==='reason'){ const x=ri(5,9)*1000+ri(100,999), y=ri(1,3)*1000+ri(100,999), est=roundTo(x,3)-roundTo(y,3), good=Math.random()<.5, claim=good?est:roundTo(x,3)+roundTo(y,3);
      o={big:true, noShuffle:true, q:`Someone says ${fmt(x)} − ${fmt(y)}\nis about ${fmt(claim)}. Reasonable?`, opts:['Yes','No'], a:good?'Yes':'No', why:`Estimate it: ${fmt(roundTo(x,3))} − ${fmt(roundTo(y,3))} = ${fmt(est)}.${good?'':' They added instead of subtracting.'}`}; break; }
    else { const x=ri(4,9)*100+ri(10,99), y=ri(1,3)*100+ri(10,99), r=roundTo(x,2)-roundTo(y,2), f=frontEnd(x)-frontEnd(y), e=x-y; const opts=uniq([r,f,e,r+100]);
      if(opts.length===4){ o={q:`Estimate by ROUNDING to the nearest hundred:\n${x} − ${y}`, opts:opts.map(fmt), a:fmt(r), why:`Round each one first: ${roundTo(x,2)} − ${roundTo(y,2)} = ${r}.`}; break; } }
  }
  return Object.assign({type:'choice'}, o||{q:'When you ADD, a front-end estimate is always too…', opts:['Low','High'], a:'Low', big:true, why:'Front-end throws away everything after the first digit, so the estimate is too low.'}); });

export const gColumn=G('compute',()=>{ if(Math.random()<.65){ let top,bottom,guard=0; const tops=[()=>ri(2,9)*1000,()=>ri(2,9)*1000+ri(1,9)*100+ri(1,8),()=>10000+ri(1,8),()=>ri(2,9)*10000+ri(1,9)*100,()=>ri(3,9)*1000+ri(0,9)*10];
    do{ top=pick(tops)(); bottom=ri(Math.floor(top*.15),Math.floor(top*.8)); }while((bottom%10<=top%10||bottom%100===0)&&guard++<40);
    return {type:'keypad', key:'subtract-zeros', layout:'column', top, bottom, op:'−', a:String(top-bottom), q:'Subtract. Use your scratch paper!', why:`Check it by adding back: ${fmt(top-bottom)} + ${fmt(bottom)} = ${fmt(top)}.`}; }
  const x=ri(20000,300000), y=ri(10000,99999);
  return {type:'keypad', key:'add-carry', layout:'column', top:x, bottom:y, op:'+', a:String(x+y), q:'Add. Use your scratch paper!', why:'Line up the places. Start at the ones and carry when a column makes 10 or more.'}; });

const STORIES=[
  ()=>{ const A=ri(2,9)*1000+ri(100,999), B=ri(150,950); return {t:`A library has ${fmt(A)} books. ${B} are checked out. How many are on the shelves?`, a:A-B, steps:1, how:`${fmt(A)} − ${B} = ${fmt(A-B)}`}; },
  ()=>{ const a=ri(800,1600), b=ri(800,1300), G=3000; return {t:`A school collected ${fmt(a)} cans in week one and ${fmt(b)} in week two. The goal is ${fmt(G)}. How many more do they need?`, a:G-a-b, steps:2, how:`${fmt(a)} + ${fmt(b)} = ${fmt(a+b)}, then ${fmt(G)} − ${fmt(a+b)} = ${fmt(G-a-b)}`}; },
  ()=>{ const f=ri(250,480), s=ri(300,520), no=ri(40,120); return {t:`A dance studio sold ${f} tickets for Friday and ${s} for Saturday. ${no} ticket holders never showed up. How many people came?`, a:f+s-no, steps:2, how:`${f} + ${s} = ${f+s}, then ${f+s} − ${no} = ${f+s-no}`}; },
  ()=>{ const a=ri(12,28)*1000+ri(100,899), b=ri(12,28)*1000+ri(100,899), e=roundTo(a,3)+roundTo(b,3); return {t:`A stadium had ${fmt(a)} fans Saturday and ${fmt(b)} fans Sunday. ABOUT how many in all? Round each to the nearest thousand first.`, a:e, steps:2, how:`${fmt(roundTo(a,3))} + ${fmt(roundTo(b,3))} = ${fmt(e)}`}; },
  ()=>{ const a=ri(1200,4800), b=ri(1200,4800); return {t:`The dance studio sold ${fmt(a)} tickets in the fall and ${fmt(b)} in the spring. How many tickets in all?`, a:a+b, steps:1, how:`${fmt(a)} + ${fmt(b)} = ${fmt(a+b)}`}; },
  ()=>{ const A=ri(300,900), B=ri(40,190), Cc=ri(15,95); return {t:`Mia had ${A} stickers. She gave away ${B}. Then she bought ${Cc} more. How many does she have now?`, a:A-B+Cc, steps:2, how:`${A} − ${B} = ${A-B}, then ${A-B} + ${Cc} = ${A-B+Cc}`}; },
  ()=>{ const x=ri(4000,6600), y=ri(1500,3900); return {t:`One mountain is ${fmt(x)} feet tall. Another is ${fmt(y)} feet tall. How much taller is the first one?`, a:x-y, steps:1, how:`${fmt(x)} − ${fmt(y)} = ${fmt(x-y)}`}; },
  ()=>{ const A=ri(600,950), b=ri(90,160), c=ri(90,160); return {t:`A school has ${A} students. ${b} fourth graders and ${c} fifth graders went on a trip. How many students stayed at school?`, a:A-b-c, steps:2, how:`${b} + ${c} = ${b+c}, then ${A} − ${b+c} = ${A-b-c}`}; },
];
export const gStory=G('story',()=>{ const s=pick(STORIES)();
  if(Math.random()<.3) return {type:'choice', key:'story-steps', noShuffle:true, q:s.t, hint:'Don\'t solve it yet. How many steps?', opts:['One step','More than one step'], a:s.steps===1?'One step':'More than one step', why:`${s.steps===1?'One operation does it':'It takes more than one operation'}: ${s.how}.`};
  return {type:'keypad', key:s.steps===1?'story-single':'story-multi', q:s.t, a:String(s.a), why:`${s.how}. ${s.steps===2?'Multistep: don\'t stop after the first step!':'Draw a bar diagram: the whole on top, the parts underneath.'}`}; });

export const times=(n,g)=>Array.from({length:n},()=>g());
