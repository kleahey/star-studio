// Solar System world. Items come from the verified fact bank (facts.js) plus hand-built sorting decks.
import { FACTS, ICONS, TAP_NAMES, SUN_WHY, SIZE_WHY } from './facts.js';
import { seasonsArt } from '../core/art.js';
import { Store } from '../core/store.js';
import { shuffle } from '../core/ui.js';

const IMG={ spin:'ic-spin', orbit:'ic-orbit', earthI:'pl-earth', moonI:'moonrock', sunI:'sun', pNew:'ph-new', pFirst:'ph-first', pFull:'ph-full', pLast:'ph-last', inline:'ic-inline', rightangle:'ic-rightangle' };
const PH={ 'New moon':'new', 'First quarter':'first', 'Full moon':'full', 'Last quarter':'last' };
const PLANET_IDS=['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];
const cap = s => s[0].toUpperCase()+s.slice(1);
const tok = name => PH[name] ? {id:PH[name], t:name, img:'ph-'+PH[name]} : {id:name.toLowerCase(), t:name, img:'pl-'+name.toLowerCase()};
const tokId = id => PLANET_IDS.includes(id) ? {id, t:cap(id), img:'pl-'+id} : {id, t:TAP_NAMES[id], img:'ph-'+id};
const ROW=[['mercury',95,38],['venus',190,60],['earth',290,62],['mars',385,46],['jupiter',515,150],['saturn',700,170],['uranus',850,95],['neptune',975,92]];

function planetRow(v,base){
  return {...base, type:'hotspot', q:v.q, a:[].concat(v.a), answer:'From the sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.', hint:'☀️ The sun is on the left.',
    sprites:[{tex:'sun',x:-70,y:800,size:420}].concat(ROW.map(([id,x,size])=>({tex:'pl-'+id,x,y:800,size}))),
    zones:ROW.map(([id,x,size])=>({id,x,y:800,r:Math.max(size/2+6,48),label:cap(id)})) };
}
function seasons(v,base){ const f=Math.random()<.5, art=seasonsArt(f,false);
  return {...base, type:'hotspot', q:v.q, hint:v.hint||'', a:[].concat(v.a), answer:v.why, why:'', tex:`seasons-${+f}-0`, texLabeled:`seasons-${+f}-1`, texW:art.W, texH:art.H,
    zones:Object.entries(art.spots).map(([id,[x,y]])=>({id,x,y,r:105})) }; }

function conv(f,v){ const base={key:f.id, why:v.why};
  switch(v.t){
    case 'mc': case 'binary': return {...base, type:'choice', q:v.q, opts:v.o, a:v.a, big:v.o.every(o=>String(o).length<=5)};
    case 'pic': return {...base, type:'choice', q:v.q, opts:v.o.map(k=>({img:IMG[k],cap:ICONS[k].cap})), a:IMG[v.a]};
    case 'gap': return {...base, type:'choice', q:'Which one is missing?\n'+v.seq.map(x=>x===null?'❓':x).join(' · '), hint:v.dir, opts:v.o, a:v.a};
    case 'seq': return {...base, type:'order', q:v.q, dir:v.dir, tokens:v.a.map(tok), a:v.a.map(n=>tok(n).id)};
    case 'tap-order': return {...base, type:'order', q:v.q, dir:v.dir, tokens:v.a.map(tokId), a:v.a.slice()};
    case 'tap': return v.scene==='planets' ? planetRow(v,base) : seasons(v,base);
  }
  return null;
}
const usable = f => f.v.map(v=>conv(f,v)).filter(Boolean);
const byId = Object.fromEntries(FACTS.map(f=>[f.id,f]));
// One item per fact, a random phrasing each time, facts she has missed come first.
function fromFacts(ids,n,filter){ const miss=id=>((Store.s.stats[id]||{}).miss||0)-((Store.s.stats[id]||{}).ok||0)*.5;
  const pool=shuffle(ids).sort((a,b)=>miss(b)-miss(a)+(Math.random()-.5)*1.5).map(id=>{ const c=usable(byId[id]).filter(filter||(()=>true)); return c.length?c[Math.floor(Math.random()*c.length)]:null; }).filter(Boolean);
  return shuffle(pool.slice(0,n)); }
const deck = d => FACTS.filter(f=>f.deck===d).map(f=>f.id);

const sortItems=(prefix,q,bins,cards,n)=>shuffle(cards).slice(0,n).map((c,i)=>({type:'sort', key:`${prefix}-${c.k}`, q, bins, card:{t:c.t,img:c.img}, a:c.a, why:c.why}));
const ROT=[{id:'rot',label:'ROTATE',emoji:'🩰',color:0x7c3aed},{id:'rev',label:'REVOLVE',emoji:'💃',color:0xec4899}];
const ROT_CARDS=[
  {k:'spin',t:'spinning in place',a:'rot',why:'Rotate = spin on its axis, like a pirouette.'},
  {k:'around',t:'traveling around the sun',a:'rev',why:'Revolve = travel around something else.'},
  {k:'24',t:'takes 24 hours',a:'rot',why:'Earth rotates once every 24 hours.'},
  {k:'365',t:'takes 365¼ days',a:'rev',why:'Earth revolves around the sun once every 365¼ days.'},
  {k:'daynight',t:'gives us day and night',a:'rot',why:'Rotation (spinning) gives us day and night.'},
  {k:'year',t:'one trip = one year',a:'rev',why:'One revolution around the sun is one year.'},
  {k:'moon28',t:'the moon going around Earth in 28 days',a:'rev',why:'The moon revolves around Earth about once a month.'},
  {k:'pirouette',t:'a pirouette',a:'rot',why:'A pirouette is a rotation: spinning in place.'},
  {k:'partner',t:'dancing a circle around your partner',a:'rev',why:'Circling around someone is revolving.'},
  {k:'axis',t:'turning on an axis',a:'rot',why:'Earth rotates on its imaginary axis.'},
];
const TRIO=[{id:'earth',label:'EARTH',emoji:'🌍',color:0x3b82f6},{id:'moon',label:'MOON',emoji:'🌙',color:0x64748b},{id:'sun',label:'SUN',emoji:'☀️',color:0xf59e0b}];
const TRIO_CARDS=[
  {k:'star',t:'average-sized yellow star',a:'sun'},{k:'110',t:'110 times as wide as Earth',a:'sun'},{k:'age',t:'about 4.6 billion years old',a:'sun'},{k:'center',t:'center of our solar system',a:'sun'},
  {k:'sat',t:'small rocky satellite',a:'moon'},{k:'noair',t:'no atmosphere and no life',a:'moon'},{k:'temp',t:'temperature extremes',a:'moon'},{k:'80',t:'one-eightieth of Earth\'s mass',a:'moon'},{k:'28',t:'goes around Earth every 28 days',a:'moon'},{k:'nowater',t:'very little water',a:'moon'},
  {k:'water',t:'large amounts of water',a:'earth'},{k:'org',t:'diversity of organisms',a:'earth'},{k:'oxy',t:'oxygen-rich atmosphere',a:'earth'},{k:'block',t:'atmosphere blocks most of the sun\'s rays',a:'earth'},{k:'early',t:'early astronomers thought it was the center',a:'earth'},
].map(c=>({...c,why:'Earth: water, life, oxygen-rich air. Moon: small, rocky, no air, no life, extreme temperatures. Sun: average yellow star, 110 Earths wide, 4.6 billion years old.'}));
const KIND=[{id:'rock',label:'TERRESTRIAL',emoji:'🪨',color:0xea580c},{id:'gas',label:'GAS GIANT',emoji:'💨',color:0x0ea5e9},{id:'no',label:'NOT A PLANET',emoji:'🚫',color:0x64748b}];
const KIND_CARDS=PLANET_IDS.map((id,i)=>({k:id,t:cap(id),img:'pl-'+id,a:i<4?'rock':'gas',why:i<4?'The first four (Mercury, Venus, Earth, Mars) are terrestrial: rocky planets.':'The last four (Jupiter, Saturn, Uranus, Neptune) are gas giants: mostly gases, and the four largest.'}))
  .concat([{k:'pluto',t:'Pluto',img:'pl-pluto',a:'no',why:'Pluto is NOT a planet. It is too small and has an irregular orbit.'}]);
const TIDE=[{id:'high',label:'HIGH TIDES',emoji:'🌊',color:0x2563eb},{id:'low',label:'LOW TIDES',emoji:'🏖️',color:0xd97706}];
const TW='High tides = full and new moons = Earth, moon and sun in a LINE. Low tides = first and last quarter = a right angle. An L shape is Low.';
const TIDE_CARDS=[{k:'full',t:'Full moon',img:'ph-full',a:'high'},{k:'new',t:'New moon',img:'ph-new',a:'high'},{k:'first',t:'First quarter',img:'ph-first',a:'low'},{k:'last',t:'Last quarter',img:'ph-last',a:'low'},
  {k:'line',t:'in a line',img:'ic-inline',a:'high'},{k:'angle',t:'at right angles',img:'ic-rightangle',a:'low'}].map(c=>({...c,why:TW}));
const bigger=()=>shuffle([['uranus','neptune'],['venus','mars'],['earth','venus'],['mars','mercury'],['saturn','uranus'],['neptune','earth']]).slice(0,3)
  .map(([a,b])=>({type:'choice', key:'p-bigger', q:'Which is BIGGER?', opts:[{img:'pl-'+a,cap:cap(a)},{img:'pl-'+b,cap:cap(b)}], a:'pl-'+a, why:SIZE_WHY}));
const one=(id,t)=>usable(byId[id]).filter(x=>!t||x.type===t);
const pick1=a=>a[Math.floor(Math.random()*a.length)];

export const SPACE_LEVELS=[
  {id:'space-1', name:'Spin or Orbit?', emoji:'🌀', skill:'rotate vs. revolve', sticker:'🩰', make:()=>sortItems('rot','Rotate or revolve?',ROT,ROT_CARDS,7)},
  {id:'space-2', name:'Sky Numbers', emoji:'🔢', skill:'24 · 28 · 365¼ · 110 · 4.6 billion', sticker:'⏰', make:()=>fromFacts(['s-24','s-year','s-moon28','t-110','t-age','t-four','t-80','s-center','s-early','s-daynight'],7,x=>x.type==='choice')},
  {id:'space-3', name:'Who Am I?', emoji:'🌍', skill:'Earth, moon or sun', sticker:'☀️', make:()=>sortItems('trio','Who does this describe?',TRIO,TRIO_CARDS,8)},
  {id:'space-4', name:'Planet Parade', emoji:'🚀', skill:'order from the sun', sticker:'🚀', make:()=>shuffle([...shuffle(one('p-find')).slice(0,3),...one('p-sun-order','choice')]).concat(one('p-sun-order','order'))},
  {id:'space-5', name:'Size \'Em Up', emoji:'🐘', skill:'biggest to smallest', sticker:'🪐', make:()=>[pick1(one('p-size-tail','order')),...shuffle([...bigger(),...shuffle(one('p-two-orders')).slice(0,2),...one('p-size-tail','choice').slice(0,1)]),pick1(one('p-size-order','order'))]},
  {id:'space-6', name:'Rocky or Gas?', emoji:'🪨', skill:'terrestrial · gas giant · Pluto', sticker:'☄️', make:()=>{ const c=sortItems('kind','What kind is it?',KIND,KIND_CARDS.filter(x=>x.k!=='pluto'),6); c.splice(2+Math.floor(Math.random()*3),0,...sortItems('kind','What kind is it?',KIND,KIND_CARDS.filter(x=>x.k==='pluto'),1)); return c.concat(fromFacts(['p-rocky','p-gas','p-pluto'],2,x=>x.type==='choice')); }},
  {id:'space-7', name:'Season Spinner', emoji:'🍂', skill:'tilt, not distance', sticker:'🌞', make:()=>fromFacts(deck('seasons'),6).concat(fromFacts(['z-opposite','z-tilt'],1))},
  {id:'space-8', name:'Moon Walk', emoji:'🌙', skill:'the phases, in order', sticker:'🌕', make:()=>[...fromFacts(['m-names','m-third','m-after-full','m-before-full','m-reflect','m-names'],5),pick1(one('m-order'))]},
  {id:'space-9', name:'Tide Pull', emoji:'🌊', skill:'line = high · L = low', sticker:'🌊', make:()=>shuffle([...sortItems('tide','High tides or low tides?',TIDE,TIDE_CARDS,6),...fromFacts(['d-range','d-high-shape','d-low-shape'],2,x=>x.type==='choice')])},
  {id:'space-10', name:'Mission Control', emoji:'👩‍🚀', skill:'BOSS: everything, traps first', sticker:'👩‍🚀', make:()=>{ const traps=FACTS.filter(f=>f.trap).map(f=>f.id); return shuffle([...fromFacts(traps,5),...fromFacts(FACTS.filter(f=>!f.trap).map(f=>f.id),3),...sortItems('kind','What kind is it?',KIND,KIND_CARDS,1)]); }},
];
