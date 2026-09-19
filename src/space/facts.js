// Fact bank transcribed from caroline-study/artifacts/2026-09-29-science-solar-system.md. Do not re-derive.
const SUN_ORDER = ['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune'];
const SIZE_ORDER = ['Jupiter','Saturn','Uranus','Neptune','Earth','Venus','Mars','Mercury'];
const SUN_WHY = 'From the sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. "My Very Excellent Mom Just Served Us Nachos."';
const SIZE_WHY = 'Biggest to smallest: Jupiter, Saturn, Uranus, Neptune, Earth, Venus, Mars, Mercury. "Just Stand Up Now, Everyone: Very Marvelous Move!" MArs before MErcury.';
const PHASES = ['New moon','First quarter','Full moon','Last quarter'];

const DECKS = {
  spin:    {label:'Spin & Orbit', emoji:'🌀', badge:'Spin Master'},
  trio:    {label:'Earth Moon Sun', emoji:'🌍', badge:'Trio Expert'},
  seasons: {label:'Seasons', emoji:'🍂', badge:'Season Sage'},
  moon:    {label:'Phases & Tides', emoji:'🌙', badge:'Moon Boss'},
  planets: {label:'Planets', emoji:'🪐', badge:'Planet Pro'},
};
const TRAPS = {1:'Rotate vs. revolve', 2:'Two planet orders: by size and from the sun', 3:'Seasons come from TILT, not distance', 4:'Tides: line = high (full + new), right angle = low (quarters)', 5:'The two hemispheres have opposite seasons'};

const PLANETS = [
  {id:'mercury', n:'Mercury', x:85,  r:6,    fill:'#9ca3af'},
  {id:'venus',   n:'Venus',   x:140, r:11.5, fill:'#e0b26a'},
  {id:'earth',   n:'Earth',   x:198, r:12,   fill:'#3b82f6'},
  {id:'mars',    n:'Mars',    x:254, r:8,    fill:'#dc5a3c'},
  {id:'jupiter', n:'Jupiter', x:335, r:38,   fill:'#d9a066'},
  {id:'saturn',  n:'Saturn',  x:445, r:31,   fill:'#e7c873'},
  {id:'uranus',  n:'Uranus',  x:548, r:22,   fill:'#7fdbe6'},
  {id:'neptune', n:'Neptune', x:630, r:21,   fill:'#3b5bdb'},
];
const TAP_NAMES = Object.assign(Object.fromEntries(PLANETS.map(p=>[p.id,p.n])),
  {new:'New moon', first:'First quarter', full:'Full moon', last:'Last (third) quarter',
   nsummer:'where the north half leans TOWARD the sun', nwinter:'where the north half leans AWAY from the sun', mild1:'a spot where neither half gets direct rays', mild2:'a spot where neither half gets direct rays'});
const ROCKY = ['mercury','venus','earth','mars'], GAS = ['jupiter','saturn','uranus','neptune'];
const SIZE_IDS = ['jupiter','saturn','uranus','neptune','earth','venus','mars','mercury'];

/* Picture-choice icons (64×64). */
const SKY = '<rect width="64" height="64" fill="#0b1026"/>';
const ICONS = {
  spin:{cap:'Rotate = spin in place', svg:SKY+'<circle cx="32" cy="34" r="13" fill="#3b82f6"/><path d="M25,30 q6,-6 12,0 q-3,7 -10,6 z" fill="#4ade80"/><path d="M32,15 V53" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3"/><path d="M12,40 A22,22 0 1 1 50,46" fill="none" stroke="#fde68a" stroke-width="3.5" stroke-linecap="round"/><path d="M50,46 l-9,-1 l6,-8 z" fill="#fde68a"/>'},
  orbit:{cap:'Revolve = travel around something', svg:SKY+'<ellipse cx="32" cy="32" rx="26" ry="15" fill="none" stroke="#fde68a" stroke-width="2.5" stroke-dasharray="4 4"/><circle cx="32" cy="32" r="8" fill="#fbbf24"/><circle cx="56" cy="26" r="5.5" fill="#3b82f6"/><path d="M50,44 l9,-2 l-4,8 z" fill="#fde68a"/>'},
  earthI:{cap:'Earth', svg:SKY+'<circle cx="32" cy="32" r="22" fill="#3b82f6"/><path d="M18,26 q8,-12 18,-6 q4,8 -4,12 q-6,8 -12,2 z" fill="#4ade80"/><path d="M38,40 q8,-2 8,6 q-6,6 -10,0 z" fill="#4ade80"/>'},
  moonI:{cap:'The moon', svg:SKY+'<circle cx="32" cy="32" r="20" fill="#cbd5e1"/><circle cx="25" cy="26" r="5" fill="#94a3b8"/><circle cx="39" cy="37" r="6" fill="#94a3b8"/><circle cx="37" cy="21" r="3" fill="#94a3b8"/><circle cx="24" cy="42" r="3" fill="#94a3b8"/>'},
  sunI:{cap:'The sun', svg:SKY+'<g stroke="#fbbf24" stroke-width="4" stroke-linecap="round"><path d="M32,4 V12 M32,52 V60 M4,32 H12 M52,32 H60 M12,12 L18,18 M46,46 L52,52 M52,12 L46,18 M12,52 L18,46"/></g><circle cx="32" cy="32" r="16" fill="#fbbf24"/>'},
  pNew:{cap:'New moon', svg:SKY+'<circle cx="32" cy="32" r="22" fill="#2b2f3a" stroke="#6b7280" stroke-width="1.5"/>'},
  pFirst:{cap:'First quarter', svg:SKY+'<circle cx="32" cy="32" r="22" fill="#2b2f3a" stroke="#6b7280" stroke-width="1.5"/><path d="M32,10 A22,22 0 0 1 32,54 Z" fill="#f3e9c6"/>'},
  pFull:{cap:'Full moon', svg:SKY+'<circle cx="32" cy="32" r="22" fill="#f3e9c6"/>'},
  pLast:{cap:'Last (third) quarter', svg:SKY+'<circle cx="32" cy="32" r="22" fill="#2b2f3a" stroke="#6b7280" stroke-width="1.5"/><path d="M32,10 A22,22 0 0 0 32,54 Z" fill="#f3e9c6"/>'},
  inline:{cap:'In a line = HIGH tides', svg:SKY+'<path d="M4,32 H60" stroke="#fde68a" stroke-width="2" stroke-dasharray="3 3"/><circle cx="12" cy="32" r="10" fill="#fbbf24"/><circle cx="39" cy="32" r="7" fill="#3b82f6"/><circle cx="55" cy="32" r="4" fill="#e5e7eb"/>'},
  rightangle:{cap:'Right angle = LOW tides', svg:SKY+'<path d="M12,44 H40 V14" fill="none" stroke="#fde68a" stroke-width="2" stroke-dasharray="3 3"/><circle cx="12" cy="44" r="10" fill="#fbbf24"/><circle cx="40" cy="44" r="7" fill="#3b82f6"/><circle cx="40" cy="14" r="4" fill="#e5e7eb"/>'},
};
const PHASE_ICON = {new:'pNew', first:'pFirst', full:'pFull', last:'pLast'};
const TRIO = ['earthI','moonI','sunI'];

const FACTS = [
  /* ---------------- SPIN & ORBIT ---------------- */
  {id:'s-rotate', deck:'spin', trap:1, name:'Rotate = spin', v:[
    {t:'pic', q:'Tap ROTATE.', o:['spin','orbit'], a:'spin', why:'Rotate = spin in place, like a pirouette.'},
    {t:'mc', q:'What does ROTATE mean?', o:['Spin on its axis','Travel around something else','Tilt to one side','Reflect sunlight'], a:'Spin on its axis', why:'Rotate = spin. A pirouette is a rotation.'},
    {t:'binary', q:'Earth spinning on its axis is…', o:['Rotating','Revolving'], a:'Rotating', why:'Spinning in place = rotating. Going around the sun = revolving.'},
  ]},
  {id:'s-revolve', deck:'spin', trap:1, name:'Revolve = travel around', v:[
    {t:'pic', q:'Tap REVOLVE.', o:['spin','orbit'], a:'orbit', why:'Revolve = travel around something else, like dancing a circle around a partner.'},
    {t:'mc', q:'What does REVOLVE mean?', o:['Travel around something else','Spin on its axis','Tilt to one side','Block the sun'], a:'Travel around something else', why:'Revolve = go around. Earth revolves around the sun.'},
    {t:'binary', q:'Earth traveling around the sun is…', o:['Revolving','Rotating'], a:'Revolving', why:'Going around = revolving. Spinning in place = rotating.'},
  ]},
  {id:'s-daynight', deck:'spin', trap:1, name:'Rotation gives day and night', v:[
    {t:'mc', q:'What gives us day and night?', o:['Earth rotating (spinning)','Earth revolving around the sun','The moon blocking the sun','Earth being tilted'], a:'Earth rotating (spinning)', why:'Earth spins once every 24 hours. Your side faces the sun (day), then faces away (night).'},
    {t:'binary', q:'Day and night come from Earth…', o:['Rotating','Revolving'], a:'Rotating', why:'One spin = one day and night.'},
    {t:'pic', q:'Which one makes day and night?', o:['spin','orbit'], a:'spin', why:'Spinning (rotating) gives day and night.'},
  ]},
  {id:'s-24', deck:'spin', trap:1, name:'One rotation = 24 hours', v:[
    {t:'mc', q:'How long is one spin of Earth?', o:['24 hours','28 days','365¼ days','12 hours'], a:'24 hours', why:'Earth rotates once every 24 hours.', grid:true},
    {t:'binary', q:'24 hours is one…', o:['Rotation','Revolution'], a:'Rotation', why:'24 hours = one rotation = one day.'},
  ]},
  {id:'s-year', deck:'spin', trap:1, name:'One revolution = 365¼ days = one year', v:[
    {t:'mc', q:'How long does Earth take to go around the sun?', o:['365¼ days','24 hours','28 days','110 days'], a:'365¼ days', why:'One trip around the sun = 365¼ days = one year.', grid:true},
    {t:'mc', q:'One trip around the sun is one…', o:['Year','Day','Month','Season'], a:'Year', why:'One revolution around the sun = one year.', grid:true},
    {t:'binary', q:'365¼ days is one…', o:['Revolution','Rotation'], a:'Revolution', why:'365¼ days = one revolution = one year.'},
  ]},
  {id:'s-moon28', deck:'spin', name:'The moon revolves around Earth every 28 days', v:[
    {t:'mc', q:'How long does the moon take to go around Earth?', o:['28 days','24 hours','365¼ days','4 days'], a:'28 days', why:'The moon revolves around Earth once every 28 days, about one month.', grid:true},
    {t:'mc', q:'What does the moon revolve around?', o:['Earth','The sun','Mars','Nothing'], a:'Earth', why:'The moon revolves around Earth. Earth revolves around the sun.', grid:true},
    {t:'mc', q:'28 days is about one…', o:['Month','Week','Year','Day'], a:'Month', why:'The moon goes around Earth in about a month.', grid:true},
  ]},
  {id:'s-center', deck:'spin', name:'The sun is the center of our solar system', v:[
    {t:'pic', q:'Tap the center of our solar system.', o:TRIO, a:'sunI', why:'The sun is the center. Earth and the other planets revolve around it.'},
    {t:'binary', q:'What do the planets revolve around?', o:['The sun','Earth'], a:'The sun', why:'The planets revolve around the sun.'},
  ]},
  {id:'s-early', deck:'spin', name:'Early astronomers thought Earth was the center', v:[
    {t:'mc', q:'Long ago, astronomers thought the center was…', o:['Earth','The sun','The moon','Jupiter'], a:'Earth', why:'Early astronomers believed everything orbited Earth. Now we know the sun is the center.', grid:true},
    {t:'pic', q:'Long ago, people WRONGLY thought this was the center.', o:TRIO, a:'earthI', why:'They thought Earth was the center. It is really the sun.'},
  ]},

  /* ---------------- EARTH MOON SUN ---------------- */
  {id:'t-star', deck:'trio', name:'The sun is an average-sized yellow star', v:[
    {t:'pic', q:'Tap the average-sized yellow star.', o:TRIO, a:'sunI', why:'The sun is an average-sized yellow star.'},
    {t:'mc', q:'What kind of star is the sun?', o:['Average-sized and yellow','Giant and red','Tiny and blue','It is not a star'], a:'Average-sized and yellow', why:'The sun is an average-sized yellow star.'},
  ]},
  {id:'t-110', deck:'trio', name:'The sun is 110 Earths wide', v:[
    {t:'mc', q:'The sun is how many Earths wide?', o:['110','4','80','28'], a:'110', why:'The sun is 110 times the diameter of Earth.', grid:true},
    {t:'mc', q:'What is 110 times as wide as Earth?', o:['The sun','The moon','Jupiter','Pluto'], a:'The sun', why:'The sun is 110 times the diameter of Earth.', grid:true},
  ]},
  {id:'t-age', deck:'trio', name:'The sun is about 4.6 billion years old', v:[
    {t:'mc', q:'How old is the sun?', o:['About 4.6 billion years','About 4.6 million years','About 365 years','About 110 years'], a:'About 4.6 billion years', why:'The sun is about 4.6 BILLION years old.'},
  ]},
  {id:'t-moon-air', deck:'trio', name:'The moon has no atmosphere and no life', v:[
    {t:'pic', q:'Tap the one with NO atmosphere and NO life.', o:TRIO, a:'moonI', why:'The moon has no atmosphere and no life.'},
    {t:'mc', q:'Which is true about the moon?', o:['No atmosphere and no life','Large amounts of water','Oxygen-rich air','It is a star'], a:'No atmosphere and no life', why:'The moon has no atmosphere, no life, and very little water.'},
  ]},
  {id:'t-moon-rocky', deck:'trio', name:'The moon is a small rocky satellite', v:[
    {t:'pic', q:'Tap the small rocky satellite.', o:TRIO, a:'moonI', why:'The moon is a small rocky satellite of Earth.'},
    {t:'mc', q:'The moon is a small rocky…', o:['Satellite','Star','Planet','Gas giant'], a:'Satellite', why:'A satellite goes around a planet. The moon is Earth\'s.', grid:true},
  ]},
  {id:'t-moon-temp', deck:'trio', name:'The moon has temperature extremes', v:[
    {t:'mc', q:'Temperatures on the moon are…', o:['Extreme: very hot and very cold','Always mild','Always warm','Just like Earth'], a:'Extreme: very hot and very cold', why:'With no atmosphere, the moon has temperature extremes.'},
    {t:'pic', q:'Tap the one with temperature extremes.', o:TRIO, a:'moonI', why:'The moon: temperature extremes, no atmosphere, very little water.'},
  ]},
  {id:'t-four', deck:'trio', name:'About four moons fit across Earth', v:[
    {t:'mc', q:'How many moons fit across Earth?', o:['About 4','About 110','About 80','About 28'], a:'About 4', why:'About four moons could fit across the diameter of Earth.', grid:true},
  ]},
  {id:'t-80', deck:'trio', name:'The moon has one-eightieth the mass of Earth', v:[
    {t:'mc', q:'The moon has what part of Earth\'s mass?', o:['One-eightieth','One-half','One-fourth','110 times'], a:'One-eightieth', why:'The moon has one-eightieth (1/80) the mass of Earth.', grid:true},
  ]},
  {id:'t-earth-life', deck:'trio', name:'Earth has water, oxygen-rich air and many organisms', v:[
    {t:'pic', q:'Tap the one with a diversity of organisms.', o:TRIO, a:'earthI', why:'Earth has a diversity of organisms: lots of different living things.'},
    {t:'multi', q:'Tap TWO things Earth has.', n:2, o:['Large amounts of water','Oxygen-rich atmosphere','No atmosphere','Temperature extremes'], a:['Large amounts of water','Oxygen-rich atmosphere'], why:'Earth: lots of water, oxygen-rich atmosphere, diversity of organisms. The other two describe the moon.'},
    {t:'pic', q:'Tap the one with an oxygen-rich atmosphere.', o:TRIO, a:'earthI', why:'Earth\'s atmosphere is rich in oxygen.'},
  ]},
  {id:'t-earth-block', deck:'trio', name:'Earth\'s atmosphere blocks most of the sun\'s rays', v:[
    {t:'mc', q:'What does Earth\'s atmosphere do to the sun\'s rays?', o:['Blocks most of them','Lets all of them in','Makes them stronger','Turns them into water'], a:'Blocks most of them', why:'Earth\'s atmosphere blocks out most of the sun\'s rays.'},
  ]},

  /* ---------------- SEASONS ---------------- */
  {id:'z-tilt', deck:'seasons', trap:3, name:'Axial tilt is the reason for the seasons', v:[
    {t:'mc', q:'What causes the seasons?', o:['Earth\'s axial tilt','Earth getting closer to the sun','The moon\'s phases','Earth spinning faster'], a:'Earth\'s axial tilt', why:'Earth is tilted on its axis. That tilt is the reason for the seasons, not distance.'},
    {t:'binary', q:'"It\'s summer because Earth is closer to the sun."', o:['False','True'], a:'False', why:'FALSE. Seasons come from the TILT, not from how close we are.'},
    {t:'mc', q:'Earth\'s lean is called…', o:['Axial tilt','Rotation','Tidal range','Orbit'], a:'Axial tilt', why:'Axial tilt: Earth is tilted on its axis.', grid:true},
  ]},
  {id:'z-axis', deck:'seasons', name:'Earth\'s axis is imaginary', v:[
    {t:'binary', q:'Earth\'s axis is…', o:['Imaginary','A real pole'], a:'Imaginary', why:'The axis is an imaginary line Earth spins around.'},
  ]},
  {id:'z-summer', deck:'seasons', trap:3, name:'Direct rays = summer', v:[
    {t:'tap', scene:'seasons', q:'Tap where VIRGINIA has SUMMER.', hint:'Red dot = Virginia.', a:'nsummer', why:'Summer is where our half of Earth leans TOWARD the sun and gets the most direct rays.'},
    {t:'mc', q:'The sun\'s rays hit our half of Earth most directly. It is…', o:['Summer','Winter','Spring','Autumn'], a:'Summer', why:'Most direct rays = summer.', grid:true},
  ]},
  {id:'z-winter', deck:'seasons', trap:3, name:'Tilted away = winter', v:[
    {t:'tap', scene:'seasons', q:'Tap where VIRGINIA has WINTER.', hint:'Red dot = Virginia.', a:'nwinter', why:'Winter is where our half of Earth leans AWAY from the sun.'},
    {t:'mc', q:'The half of Earth tilted AWAY from the sun has…', o:['Winter','Summer','Spring','Autumn'], a:'Winter', why:'Tilted away = less direct rays = winter.', grid:true},
  ]},
  {id:'z-opposite', deck:'seasons', trap:5, name:'Hemispheres have opposite seasons', v:[
    {t:'mc', q:'It is summer in Virginia. In Australia it is…', o:['Winter','Summer','Spring','Autumn'], a:'Winter', why:'The two halves are opposite. Australia has winter when we have summer!', grid:true},
    {t:'tap', scene:'seasons', q:'Tap where AUSTRALIA has SUMMER.', hint:'Orange dot = Australia.', a:'nwinter', why:'Australia is in the south half. Its summer is OUR winter.'},
    {t:'binary', q:'Northern summer means southern…', o:['Winter','Summer'], a:'Winter', why:'The hemispheres always have opposite seasons.'},
  ]},
  {id:'z-mild', deck:'seasons', name:'Spring and autumn are mild: no direct rays on either half', v:[
    {t:'mc', q:'Why are spring and autumn mild?', o:['The sun\'s rays aren\'t hitting either half directly','Earth is farther from the sun','The moon blocks the sun','Earth stops tilting'], a:'The sun\'s rays aren\'t hitting either half directly', why:'In spring and autumn neither hemisphere gets the direct rays, so it is milder.'},
    {t:'tap', scene:'seasons', q:'Tap a spot where it is spring or autumn.', a:['mild1','mild2'], why:'In these two spots neither half leans toward the sun, so temperatures are mild.'},
  ]},

  /* ---------------- PHASES & TIDES ---------------- */
  {id:'m-reflect', deck:'moon', name:'We see the moon because sunlight reflects off it', v:[
    {t:'mc', q:'Why can we see the moon?', o:['Sunlight reflects off it','It makes its own light','Earth shines on it','It is on fire'], a:'Sunlight reflects off it', why:'The moon does not make light. Sunlight reflects off it.'},
  ]},
  {id:'m-names', deck:'moon', name:'Know each phase by sight', v:[
    {t:'pic', q:'Tap the FIRST QUARTER moon.', o:['pNew','pFirst','pFull','pLast'], a:'pFirst', why:'First quarter: the RIGHT half is lit. The R in fiRst.'},
    {t:'pic', q:'Tap the LAST QUARTER moon.', o:['pNew','pFirst','pFull','pLast'], a:'pLast', why:'Last quarter: the LEFT half is lit. L for Last, L for Left.'},
    {t:'pic', q:'Tap the NEW moon.', o:['pNew','pFirst','pFull','pLast'], a:'pNew', why:'New moon: all dark.'},
    {t:'pic', q:'Tap the FULL moon.', o:['pNew','pFirst','pFull','pLast'], a:'pFull', why:'Full moon: all lit.'},
  ]},
  {id:'m-third', deck:'moon', name:'Last quarter is also called third quarter', v:[
    {t:'pic', q:'Tap the THIRD quarter moon.', o:['pNew','pFirst','pFull','pLast'], a:'pLast', why:'Third quarter is another name for last quarter. Left half lit.'},
    {t:'mc', q:'Another name for last quarter?', o:['Third quarter','Second quarter','Half moon','New quarter'], a:'Third quarter', why:'Last quarter = third quarter.', grid:true},
  ]},
  {id:'m-order', deck:'moon', seqmode:true, name:'Phases in order: new, first quarter, full, last quarter', v:[
    {t:'tap-order', scene:'phases', q:'Tap the phases in order.', dir:'START WITH NEW', o:['new','first','full','last'], a:['new','first','full','last'], why:'New → first quarter → full → last quarter → back to new.'},
    {t:'seq', q:'Put the phases in order.', dir:'START WITH NEW →', a:PHASES, why:'New → first quarter → full → last quarter → back to new.'},
  ]},
  {id:'m-after-full', deck:'moon', seqmode:true, name:'After full comes last quarter', v:[
    {t:'mc', q:'What comes right AFTER a full moon?', o:['Last quarter','First quarter','New moon','Another full moon'], a:'Last quarter', why:'New → first quarter → FULL → LAST quarter → new.'},
    {t:'pic', q:'Tap what comes right AFTER a full moon.', o:['pNew','pFirst','pLast'], a:'pLast', why:'After full comes last quarter: left half lit.'},
  ]},
  {id:'m-before-full', deck:'moon', seqmode:true, name:'Before full comes first quarter', v:[
    {t:'mc', q:'What comes right BEFORE a full moon?', o:['First quarter','Last quarter','New moon','Third quarter'], a:'First quarter', why:'New → FIRST quarter → FULL → last quarter → new.'},
    {t:'pic', q:'Tap what comes right BEFORE a full moon.', o:['pNew','pFirst','pLast'], a:'pFirst', why:'Before full comes first quarter: right half lit.'},
  ]},
  {id:'d-range', deck:'moon', name:'Moon phases change the tidal range', v:[
    {t:'mc', q:'What is responsible for changes in tidal range?', o:['The phases of the moon','The seasons','Earth\'s axial tilt','The gas giants'], a:'The phases of the moon', why:'The phases of the moon are responsible for the changes in tidal range.'},
  ]},
  {id:'d-high-phase', deck:'moon', trap:4, name:'High tides = full and new moons', v:[
    {t:'multi', q:'Tap the TWO phases with HIGH tides.', n:2, o:PHASES, a:['New moon','Full moon'], why:'High tides = full and new moons, when Earth, moon and sun are in a line.'},
    {t:'binary', q:'A NEW moon means…', o:['High tides','Low tides'], a:'High tides', why:'A new moon is dark, but Earth, moon and sun are in a line, so tides are HIGH.'},
    {t:'binary', q:'A FULL moon means…', o:['High tides','Low tides'], a:'High tides', why:'Full and new moons = in a line = HIGH tides.'},
  ]},
  {id:'d-low-phase', deck:'moon', trap:4, name:'Low tides = first and last quarter', v:[
    {t:'multi', q:'Tap the TWO phases with LOW tides.', n:2, o:PHASES, a:['First quarter','Last quarter'], why:'Low tides = first and last quarter, when Earth, sun and moon are at right angles.'},
    {t:'binary', q:'A FIRST QUARTER moon means…', o:['Low tides','High tides'], a:'Low tides', why:'Quarter moons = right angle = LOW. An L shape is Low.'},
    {t:'binary', q:'A LAST QUARTER moon means…', o:['Low tides','High tides'], a:'Low tides', why:'Quarter moons = right angle = LOW. An L shape is Low.'},
  ]},
  {id:'d-high-shape', deck:'moon', trap:4, name:'In a line = high tides', v:[
    {t:'pic', q:'Tap the HIGH tide line-up.', o:['inline','rightangle'], a:'inline', why:'Earth, moon and sun in a LINE pull together: HIGH tides.'},
    {t:'binary', q:'At HIGH tides, Earth, moon and sun are…', o:['In a line','At right angles'], a:'In a line', why:'A straight line pulls HIGH.'},
  ]},
  {id:'d-low-shape', deck:'moon', trap:4, name:'Right angles = low tides', v:[
    {t:'pic', q:'Tap the LOW tide line-up.', o:['inline','rightangle'], a:'rightangle', why:'A right angle makes an L. L is for LOW tides.'},
    {t:'binary', q:'At LOW tides, Earth, sun and moon are…', o:['At right angles','In a line'], a:'At right angles', why:'Right angle = L shape = LOW.'},
  ]},

  /* ---------------- PLANETS ---------------- */
  {id:'p-find', deck:'planets', seqmode:true, name:'Find a planet by its place from the sun', v:[
    {t:'tap', scene:'planets', q:'Tap EARTH.', a:'earth', why:SUN_WHY},
    {t:'tap', scene:'planets', q:'Tap MARS.', a:'mars', why:SUN_WHY},
    {t:'tap', scene:'planets', q:'Tap VENUS.', a:'venus', why:SUN_WHY},
    {t:'tap', scene:'planets', q:'Tap URANUS.', a:'uranus', why:SUN_WHY},
    {t:'tap', scene:'planets', q:'Tap NEPTUNE.', a:'neptune', why:SUN_WHY},
    {t:'tap', scene:'planets', q:'Tap MERCURY.', a:'mercury', why:SUN_WHY},
  ]},
  {id:'p-sun-order', deck:'planets', seqmode:true, name:'The planets in order from the sun', v:[
    {t:'seq', q:'Put the planets in order from the sun.', dir:'CLOSEST TO THE SUN → FARTHEST', a:SUN_ORDER, why:SUN_WHY},
    {t:'gap', q:'Which planet is missing?', dir:'CLOSEST TO THE SUN → FARTHEST', seq:['Mercury','Venus','Earth','Mars',null,'Saturn','Uranus','Neptune'], o:['Jupiter','Pluto','Earth','The moon'], a:'Jupiter', why:SUN_WHY},
    {t:'gap', q:'Which planet is missing?', dir:'CLOSEST TO THE SUN → FARTHEST', seq:['Mercury',null,'Earth','Mars','Jupiter','Saturn','Uranus','Neptune'], o:['Venus','Pluto','Mars','The sun'], a:'Venus', why:SUN_WHY},
  ]},
  {id:'p-size-order', deck:'planets', trap:2, seqmode:true, name:'The planets from biggest to smallest', v:[
    {t:'tap-order', scene:'planets', labels:true, q:'Tap the planets from BIGGEST to SMALLEST.', dir:'BIGGEST → SMALLEST', a:SIZE_IDS, why:SIZE_WHY},
    {t:'seq', q:'Put the planets in order by size.', dir:'BIGGEST → SMALLEST', a:SIZE_ORDER, why:SIZE_WHY},
  ]},
  {id:'p-size-tail', deck:'planets', trap:2, seqmode:true, name:'The size-order tail: Earth, Venus, Mars, Mercury', v:[
    {t:'gap', q:'Which planet is missing?', dir:'BIGGEST → SMALLEST', seq:['Jupiter','Saturn','Uranus','Neptune','Earth',null,'Mars','Mercury'], o:['Venus','Pluto','Jupiter','The moon'], a:'Venus', why:SIZE_WHY},
    {t:'gap', q:'Which planet is missing?', dir:'BIGGEST → SMALLEST', seq:['Jupiter','Saturn',null,'Neptune','Earth','Venus','Mars','Mercury'], o:['Uranus','Pluto','Mars','The sun'], a:'Uranus', why:SIZE_WHY},
    {t:'seq', q:'Put the four rocky planets in order by size.', dir:'BIGGEST → SMALLEST', a:['Earth','Venus','Mars','Mercury'], why:SIZE_WHY},
  ]},
  {id:'p-bigger', deck:'planets', trap:2, name:'Which planet is bigger?', v:[
    {t:'binary', q:'Which is BIGGER?', o:['Uranus','Neptune'], a:'Uranus', why:SIZE_WHY},
    {t:'binary', q:'Which is BIGGER?', o:['Venus','Mars'], a:'Venus', why:SIZE_WHY},
    {t:'binary', q:'Which is BIGGER?', o:['Earth','Venus'], a:'Earth', why:SIZE_WHY},
    {t:'binary', q:'Which is BIGGER?', o:['Mars','Mercury'], a:'Mars', why:'MArs before MErcury: A comes before E. '+SIZE_WHY},
  ]},
  {id:'p-biggest', deck:'planets', name:'Jupiter is the biggest planet', v:[
    {t:'tap', scene:'planets', q:'Tap the BIGGEST planet.', a:'jupiter', why:'Jupiter is the biggest planet.'},
    {t:'mc', q:'Which planet is the biggest?', o:['Jupiter','Saturn','Earth','Neptune'], a:'Jupiter', why:'Jupiter is the biggest planet. Saturn is second.', grid:true},
  ]},
  {id:'p-smallest', deck:'planets', name:'Mercury is the smallest planet', v:[
    {t:'tap', scene:'planets', q:'Tap the SMALLEST planet.', a:'mercury', why:'Mercury is the smallest planet, and the closest to the sun.'},
    {t:'mc', q:'Which planet is the smallest?', o:['Mercury','Mars','Venus','Pluto'], a:'Mercury', why:'Mercury is the smallest planet. Pluto is not a planet.', grid:true},
  ]},
  {id:'p-two-orders', deck:'planets', trap:2, name:'Third biggest is Uranus; third from the sun is Earth', v:[
    {t:'mc', q:'Which is the THIRD BIGGEST planet?', o:['Uranus','Earth','Neptune','Saturn'], a:'Uranus', why:SIZE_WHY, grid:true},
    {t:'mc', q:'Which is THIRD FROM THE SUN?', o:['Earth','Uranus','Mars','Venus'], a:'Earth', why:SUN_WHY, grid:true},
    {t:'mc', q:'Mercury is first from the sun. In SIZE it is…', o:['Last (the smallest)','First (the biggest)','Third','Fifth'], a:'Last (the smallest)', why:'Mercury is closest to the sun AND the smallest planet.'},
  ]},
  {id:'p-rocky', deck:'planets', name:'Terrestrial planets: Mercury, Venus, Earth, Mars (rocky)', v:[
    {t:'tap-set', scene:'planets', q:'Tap the FOUR terrestrial planets.', a:ROCKY, why:'The first four (Mercury, Venus, Earth, Mars) are terrestrial planets because they are rocky.'},
    {t:'mc', q:'Why are they called TERRESTRIAL planets?', o:['They are rocky','They are made of gas','They are the biggest','They have rings'], a:'They are rocky', why:'Terrestrial = rocky. "Terra" means ground: you could stand on them.', grid:true},
  ]},
  {id:'p-gas', deck:'planets', name:'Gas giants: Jupiter, Saturn, Uranus, Neptune', v:[
    {t:'tap-set', scene:'planets', q:'Tap the FOUR gas giants.', a:GAS, why:'The last four (Jupiter, Saturn, Uranus, Neptune) are gas giants, made mostly of gases.'},
    {t:'mc', q:'Why are they called GAS GIANTS?', o:['They are made mostly of gases','They are rocky','They are close to the sun','They are small'], a:'They are made mostly of gases', why:'Gas giants are made mostly of gases. They are also the four largest planets.'},
    {t:'binary', q:'The four LARGEST planets are the…', o:['Gas giants','Terrestrial planets'], a:'Gas giants', why:'The gas giants are also the four largest planets.'},
  ]},
  {id:'p-type', deck:'planets', name:'Sort a planet: terrestrial or gas giant', v:[
    {t:'binary', q:'Mars is a…', o:['Terrestrial planet','Gas giant'], a:'Terrestrial planet', why:'First four from the sun = terrestrial (rocky).'},
    {t:'binary', q:'Neptune is a…', o:['Gas giant','Terrestrial planet'], a:'Gas giant', why:'Last four from the sun = gas giants.'},
    {t:'binary', q:'Venus is a…', o:['Terrestrial planet','Gas giant'], a:'Terrestrial planet', why:'First four from the sun = terrestrial (rocky).'},
    {t:'binary', q:'Uranus is a…', o:['Gas giant','Terrestrial planet'], a:'Gas giant', why:'Last four from the sun = gas giants.'},
  ]},
  {id:'p-pluto', deck:'planets', name:'Pluto is not a planet: too small, irregular orbit', v:[
    {t:'binary', q:'Is Pluto a planet?', o:['No','Yes'], a:'No', why:'NO. Pluto is too small and has an irregular orbit.'},
    {t:'multi', q:'Tap the TWO reasons Pluto is not a planet.', n:2, o:['It is too small','It has an irregular orbit','It is too cold','It is made of gas'], a:['It is too small','It has an irregular orbit'], why:'Pluto is too small and has an irregular orbit.'},
  ]},
];
export { FACTS, ICONS, TAP_NAMES, SUN_ORDER, SIZE_ORDER, SUN_WHY, SIZE_WHY };
