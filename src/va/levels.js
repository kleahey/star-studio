// Virginia Studies Unit 2: Virginia's Indigenous People. Transcribed from the teachers' one-page study guide
// (caroline-study/artifacts/undated-virginia-studies-indigenous-people.md). Do not re-derive.
import { VA_SPOTS } from '../core/art.js';
import { Store } from '../core/store.js';
import { shuffle } from '../core/ui.js';

const GROUP_WHY='1 Algonquian: Coastal Plain (Powhatan, Pamunkey). 2 Siouan: Piedmont and Blue Ridge (Monacan). 3 Iroquoian: Southwestern Virginia (Nottoway, Meherrin). A is for Atlantic. M is for Mountains. Iroquoian: "I Need More."';
const miss=k=>((Store.s.stats[k]||{}).miss||0)-((Store.s.stats[k]||{}).ok||0)*.5;
const take=(items,n)=>shuffle(shuffle(items).sort((a,b)=>miss(b.key)-miss(a.key)+(Math.random()-.5)*1.5).slice(0,n));
const sorts=(prefix,q,bins,cards)=>cards.map(c=>({type:'sort', key:`va-${prefix}-${c.k}`, q, bins, card:{t:c.t}, a:c.a, why:c.why}));
const ch=(k,q,opts,a,why,extra)=>Object.assign({type:'choice', key:'va-'+k, q, opts, a, why},extra||{});

/* Level 1: archaeology vs. artifact */
const DIG=[{id:'study',label:'ARCHAEOLOGY',emoji:'🔍',color:0x0ea5e9},{id:'object',label:'ARTIFACT',emoji:'🏺',color:0xd97706}];
const DW='Archaeology is the STUDY of past cultures through the things they left behind. An artifact is a man-made OBJECT that tells about the people who made it.';
const digItems=()=>sorts('dig','The study, or the object?',DIG,[
  {k:'study',t:'the STUDY of past cultures',a:'study'},{k:'object',t:'a man-made OBJECT',a:'object'},{k:'pot',t:'🏺 a clay pot',a:'object'},{k:'tool',t:'🪓 a stone tool',a:'object'},
  {k:'does',t:'what an archaeologist does',a:'study'},{k:'tells',t:'tells about the people who made it',a:'object'},{k:'left',t:'learning from things people left behind',a:'study'},{k:'found',t:'something dug up at Werowocomoco',a:'object'},
].map(c=>({...c,why:DW}))).concat([
  ch('dig-shell','Is a seashell an artifact?',['No','Yes'],'No','No. An artifact has to be MAN-MADE, like tools or pottery.',{big:true,noShuffle:true}),
  ch('dig-examples','Which two are examples of artifacts?',['Tools and pottery','Rivers and mountains','Corn and beans','Clouds and rain'],'Tools and pottery','Artifacts are man-made objects, like tools and pottery.'),
]);

/* Level 2: the numbered map */
const spot=(k,q,a,why)=>({type:'hotspot', key:'va-map-'+k, q, a:[a], answer:{alg:'1: Algonquian, on the Coastal Plain',sio:'2: Siouan, in the Piedmont and Blue Ridge',iro:'3: Iroquoian, in Southwestern Virginia'}[a], why:why||GROUP_WHY,
  tex:'vamap-0', texLabeled:'vamap-1', texW:1460, texH:720, zones:Object.entries(VA_SPOTS).map(([id,[x,y,r]])=>({id,x:x*2,y:y*2,r:r*2})) });
const mapItems=()=>[
  spot('alg','Tap where the ALGONQUIAN speakers lived.','alg'), spot('sio','Tap where the SIOUAN speakers lived.','sio'), spot('iro','Tap where the IROQUOIAN speakers lived.','iro'),
  spot('monacan','Tap where the MONACAN lived.','sio'), spot('powhatan','Tap where the POWHATAN lived.','alg'), spot('nottoway','Tap where the NOTTOWAY lived.','iro'),
  spot('pamunkey','Tap where the PAMUNKEY lived.','alg'), spot('meherrin','Tap where the MEHERRIN lived.','iro'), spot('largest','Tap the land of the LARGEST language group.','alg'),
  spot('wero','Tap the region where Werowocomoco was.','alg','Werowocomoco was on the York River, in the Coastal Plain: Algonquian land.'),
  ch('map-num2','On the map, number 2 is…',['Siouan','Algonquian','Iroquoian'],'Siouan',GROUP_WHY), ch('map-num3','On the map, number 3 is…',['Iroquoian','Algonquian','Siouan'],'Iroquoian',GROUP_WHY), ch('map-num1','On the map, number 1 is…',['Algonquian','Siouan','Iroquoian'],'Algonquian',GROUP_WHY),
];

/* Level 3: tribes and regions into language groups */
const LANG=[{id:'alg',label:'ALGONQUIAN',emoji:'🌊',color:0x0891b2},{id:'sio',label:'SIOUAN',emoji:'⛰️',color:0xdb2777},{id:'iro',label:'IROQUOIAN',emoji:'🌲',color:0x16a34a}];
const langItems=()=>sorts('lang','Which language group?',LANG,[
  {k:'powhatan',t:'Powhatan',a:'alg'},{k:'pamunkey',t:'Pamunkey',a:'alg'},{k:'monacan',t:'Monacan',a:'sio'},{k:'nottoway',t:'Nottoway',a:'iro'},{k:'meherrin',t:'Meherrin',a:'iro'},
  {k:'coastal',t:'Coastal Plain',a:'alg'},{k:'piedmont',t:'Piedmont',a:'sio'},{k:'blueridge',t:'Blue Ridge Mountains',a:'sio'},{k:'southwest',t:'Southwestern Virginia',a:'iro'},
  {k:'largest',t:'the largest language group',a:'alg'},{k:'confed',t:'formed a confederacy',a:'alg'},{k:'chief',t:'Chief Powhatan\'s people',a:'alg'},{k:'tworegions',t:'lived in TWO regions',a:'sio'},
].map(c=>({...c,why:GROUP_WHY})));

/* Level 4: Werowocomoco and the confederacy */
const weroItems=()=>[
  ch('wero-river','Which river was Werowocomoco on?',['York River','James River','Potomac River','Rappahannock River'],'York River','Werowocomoco was located along the York River.'),
  ch('wero-hq','Werowocomoco was the headquarters of…',['Chief Powhatan','The Monacan tribe','English settlers','The Nottoway tribe'],'Chief Powhatan','It was the headquarters of Chief Powhatan, leader of the Algonquian-speaking tribes.'),
  ch('wero-lang','Chief Powhatan led tribes that spoke…',['Algonquian','Siouan','Iroquoian'],'Algonquian','Chief Powhatan was the leader of the Algonquian-speaking tribes.'),
  ch('wero-artifacts','Artifacts found at Werowocomoco teach us…',['How tribes lived and met English settlers','How to grow corn today','Where the Blue Ridge Mountains are','How many tribes are recognized'],'How tribes lived and met English settlers','Artifacts found there help us learn how early Indigenous tribes lived and how they interacted with English settlers.'),
  ch('wero-confed','What did the confederacy do?',['Traded goods and protected one another','Built Jamestown','Moved to the mountains','Spoke three languages'],'Traded goods and protected one another','Most Algonquian tribes formed a confederacy that traded goods and helped protect one another.'),
  ch('wero-who','Which group formed the confederacy?',['Algonquian','Siouan','Iroquoian'],'Algonquian','Most tribes in the Algonquian group formed a confederacy.'),
  ch('wero-what','Werowocomoco was…',['An early Indigenous town','A river','A language','A kind of pottery'],'An early Indigenous town','Werowocomoco was Chief Powhatan\'s headquarters, along the York River.'),
];

/* Level 5: needs by season */
const SEAS=[{id:'winter',label:'WINTER',emoji:'❄️',color:0x38bdf8},{id:'spring',label:'SPRING',emoji:'🌸',color:0xec4899},{id:'summer',label:'SUMMER',emoji:'☀️',color:0xf59e0b},{id:'fall',label:'FALL',emoji:'🍂',color:0xea580c}];
const SW='Winter: hunted, lived on stored food. Spring: hunted, fished, picked berries. Summer: grew corn, beans and squash. Fall: harvested, preserved food for winter, hunted.';
const seasonItems=()=>sorts('season','Which season?',SEAS,[
  {k:'stored',t:'🧺 lived on stored food',a:'winter'},{k:'fish',t:'🎣 fished',a:'spring'},{k:'berries',t:'🫐 picked berries',a:'spring'},{k:'grow',t:'🌱 grew crops',a:'summer'},
  {k:'three',t:'🌽 corn, beans and squash growing',a:'summer'},{k:'harvest',t:'🌾 harvested crops',a:'fall'},{k:'preserve',t:'🫙 preserved food for the winter',a:'fall'},
].map(c=>({...c,why:SW}))).concat([
  ch('season-nohunt','Which season has NO hunting on the guide?',['Summer','Winter','Spring','Fall'],'Summer',SW,{big:false}),
  ch('season-crops','Which three crops did they grow?',['Corn, beans and squash','Wheat, rice and oats','Apples, pears and plums','Potatoes, carrots and peas'],'Corn, beans and squash','In summer they grew crops like corn, beans and squash.'),
  ch('season-why','Why did their activities change through the year?',['They used what each season offered','They moved to a new state','The chief told them to','They ran out of tools'],'They used what each season offered','Tribes met their needs by using natural resources and changing their activities with the seasons.'),
]);

/* Level 6: culture today and recognition */
const todayItems=()=>[
  {type:'keypad', key:'va-rec-state', q:'How many STATE-recognized tribes does Virginia have?', a:'11', why:'As of 2025: 11 state-recognized tribes and 7 federally recognized. Think 7-Eleven: the bigger number goes with the nearer government.'},
  {type:'keypad', key:'va-rec-federal', q:'How many FEDERALLY recognized tribes does Virginia have?', a:'7', why:'As of 2025: 11 state-recognized tribes and 7 federally recognized. Think 7-Eleven.'},
  ch('rec-who','Who can formally recognize a tribe?',['The state and federal governments','Only archaeologists','The English settlers','Only the largest tribe'],'The state and federal governments','The state and federal governments can formally recognize the existence of an Indigenous tribe.'),
  ch('rec-bigger','Which number is bigger?',['State-recognized (11)','Federally recognized (7)'],'State-recognized (11)','11 state-recognized, 7 federally recognized.',{noShuffle:true}),
  ch('cult-powwow','What happens at a powwow?',['Traditional music and dance','Growing corn','Digging for artifacts','Trading with settlers'],'Traditional music and dance','Tribes hold powwows with traditional music and dance.'),
  ch('cult-not','Which is NOT a way tribes keep their culture alive?',['Moving away from Virginia','Holding powwows','Maintaining tribal museums','Sharing stories, art and history'],'Moving away from Virginia','They honor their heritage with powwows, tribal museums, and sharing stories, art and history.'),
  ch('cult-museum','Tribes keep their history on display in…',['Tribal museums','The York River','Confederacies','Stored food'],'Tribal museums','Maintaining tribal museums is one way tribes honor their heritage.'),
];

export const VA_LEVELS=[
  {id:'va-1', name:'Dig It!', emoji:'🔍', skill:'archaeology vs. artifact', sticker:'🏺', make:()=>take(digItems(),7)},
  {id:'va-2', name:'Map the Groups', emoji:'🗺️', skill:'1 · 2 · 3 on the map', sticker:'🗺️', make:()=>take(mapItems(),8)},
  {id:'va-3', name:'Tribe Sort', emoji:'🧭', skill:'tribes and regions → language group', sticker:'🧭', make:()=>take(langItems(),8)},
  {id:'va-4', name:'Werowocomoco', emoji:'🛶', skill:'York River · Chief Powhatan', sticker:'🛶', make:()=>take(weroItems(),6)},
  {id:'va-5', name:'Four Seasons', emoji:'🌽', skill:'meeting needs by season', sticker:'🌽', make:()=>take(seasonItems(),8)},
  {id:'va-6', name:'Still Here Today', emoji:'🪘', skill:'culture · 11 state, 7 federal', sticker:'🪘', make:()=>take(todayItems(),6)},
  {id:'va-7', name:'Virginia Boss', emoji:'👑', skill:'BOSS: the whole study guide', sticker:'🦅', make:()=>take([...mapItems(),...langItems(),...seasonItems(),...weroItems(),...todayItems(),...digItems()],10)},
];
