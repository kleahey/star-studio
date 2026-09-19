// All art is generated here as SVG strings and loaded as textures at boot. No image files.
const svg = (w,h,body,vb) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb||`0 0 ${w} ${h}`}">${body}</svg>`;

function ball(id, light, base, dark, r, extra='', back='', front=''){
  return svg(256,256,`<defs><radialGradient id="g${id}" cx=".34" cy=".3" r=".95"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${base}"/><stop offset="1" stop-color="${dark}"/></radialGradient>
    <clipPath id="c${id}"><circle cx="128" cy="128" r="${r}"/></clipPath><clipPath id="f${id}"><rect x="0" y="128" width="256" height="128"/></clipPath></defs>
    ${back}<circle cx="128" cy="128" r="${r}" fill="url(#g${id})"/><g clip-path="url(#c${id})">${extra}</g>${front}`);
}
const ring = (clip) => `<g transform="rotate(-16 128 128)" ${clip?`clip-path="url(#fsaturn)"`:''}><ellipse cx="128" cy="128" rx="120" ry="30" fill="none" stroke="#d8bd6a" stroke-width="13" opacity=".95"/><ellipse cx="128" cy="128" rx="100" ry="23" fill="none" stroke="#a58a45" stroke-width="5" opacity=".9"/></g>`;
export const PLANET_ART = {
  mercury: ball('mercury','#e5e7eb','#9ca3af','#4b5563',112,'<circle cx="90" cy="100" r="16" fill="#6b7280" opacity=".5"/><circle cx="160" cy="150" r="22" fill="#6b7280" opacity=".45"/><circle cx="120" cy="190" r="10" fill="#6b7280" opacity=".5"/>'),
  venus:   ball('venus','#fde9b8','#e0b26a','#8a5a1c',112,'<path d="M0,95 q64,-24 128,0 t128,0 v22 q-64,22 -128,0 t-128,0z" fill="#f6d28f" opacity=".5"/><path d="M0,160 q64,-20 128,0 t128,0 v18 q-64,20 -128,0 t-128,0z" fill="#c98f3d" opacity=".4"/>'),
  earth:   ball('earth','#93c5fd','#3b82f6','#1e3a8a',112,'<path d="M50,70 q40,-40 85,-18 q20,34 -14,52 q-28,34 -60,8 q-24,-18 -11,-42z" fill="#4ade80"/><path d="M150,150 q40,-10 50,26 q-24,38 -52,10 q-8,-20 2,-36z" fill="#4ade80"/><path d="M60,190 q20,-10 34,6 q-10,20 -30,12z" fill="#4ade80"/><ellipse cx="128" cy="24" rx="50" ry="12" fill="#fff" opacity=".8"/>'),
  mars:    ball('mars','#fca58a','#dc5a3c','#7f2412',112,'<circle cx="95" cy="110" r="20" fill="#a33a20" opacity=".5"/><circle cx="170" cy="160" r="14" fill="#a33a20" opacity=".5"/><ellipse cx="128" cy="22" rx="36" ry="10" fill="#fff" opacity=".75"/>'),
  jupiter: ball('jupiter','#fbe3c0','#d9a066','#7a4a1e',116,'<rect x="0" y="60" width="256" height="18" fill="#b07a45" opacity=".75"/><rect x="0" y="98" width="256" height="26" fill="#f3d2a2" opacity=".6"/><rect x="0" y="140" width="256" height="20" fill="#b07a45" opacity=".75"/><rect x="0" y="182" width="256" height="14" fill="#9a6232" opacity=".7"/><ellipse cx="168" cy="152" rx="26" ry="15" fill="#c2553a"/>'),
  saturn:  ball('saturn','#fdf0c0','#e7c873','#8a6d25',78,'<rect x="0" y="104" width="256" height="12" fill="#c9a94f" opacity=".6"/><rect x="0" y="140" width="256" height="10" fill="#c9a94f" opacity=".5"/>', ring(false), ring(true)),
  uranus:  ball('uranus','#d5fbff','#7fdbe6','#2b8793',112,'<rect x="0" y="118" width="256" height="14" fill="#b8f3f9" opacity=".5"/>'),
  neptune: ball('neptune','#93a9ff','#3b5bdb','#172a80',112,'<rect x="0" y="92" width="256" height="12" fill="#6f8cf5" opacity=".6"/><ellipse cx="150" cy="150" rx="22" ry="12" fill="#1e3a8a" opacity=".7"/>'),
  pluto:   ball('pluto','#f1e4d3','#c7b299','#6f5e4a',70,'<path d="M110,130 q18,-26 40,-4 q4,26 -20,40 q-24,-12 -20,-36z" fill="#f7efe4" opacity=".8"/>'),
};
export const SUN_ART = svg(256,256,`<defs><radialGradient id="sg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff7c2"/><stop offset=".55" stop-color="#fbbf24"/><stop offset=".8" stop-color="#f59e0b"/><stop offset="1" stop-color="#f59e0b" stop-opacity="0"/></radialGradient></defs><circle cx="128" cy="128" r="126" fill="url(#sg)"/>`);
export const MOONROCK_ART = ball('moonrock','#f8fafc','#cbd5e1','#64748b',112,'<circle cx="92" cy="98" r="24" fill="#94a3b8" opacity=".7"/><circle cx="160" cy="146" r="30" fill="#94a3b8" opacity=".7"/><circle cx="150" cy="72" r="12" fill="#94a3b8" opacity=".7"/><circle cx="84" cy="176" r="14" fill="#94a3b8" opacity=".7"/>');

const dark = '<circle cx="128" cy="128" r="112" fill="#2b2f3a" stroke="#7b8496" stroke-width="4"/>', lit='#f6ecc8';
const craters = '<circle cx="96" cy="100" r="18" fill="#e2d5a8"/><circle cx="160" cy="150" r="24" fill="#e2d5a8"/>';
export const PHASE_ART = {
  new:   svg(256,256,dark),
  first: svg(256,256,`${dark}<path d="M128,16 A112,112 0 0 1 128,240 Z" fill="${lit}"/>`),
  full:  svg(256,256,`<circle cx="128" cy="128" r="112" fill="${lit}"/>${craters}`),
  last:  svg(256,256,`${dark}<path d="M128,16 A112,112 0 0 0 128,240 Z" fill="${lit}"/>`),
};
const SKY='<rect width="256" height="256" rx="40" fill="#0b1026"/>';
export const ICON_ART = {
  spin: svg(256,256,`${SKY}<circle cx="128" cy="136" r="52" fill="#3b82f6"/><path d="M100,120 q24,-24 48,0 q-12,28 -40,24z" fill="#4ade80"/><path d="M128,60 V212" stroke="#fff" stroke-width="5" stroke-dasharray="10 10"/><path d="M48,160 A88,88 0 1 1 200,184" fill="none" stroke="#fde68a" stroke-width="13" stroke-linecap="round"/><path d="M200,184 l-36,-4 l24,-32z" fill="#fde68a"/>`),
  orbit: svg(256,256,`${SKY}<ellipse cx="128" cy="128" rx="104" ry="60" fill="none" stroke="#fde68a" stroke-width="9" stroke-dasharray="16 14"/><circle cx="128" cy="128" r="32" fill="#fbbf24"/><circle cx="224" cy="104" r="22" fill="#3b82f6"/><path d="M200,176 l36,-8 l-16,32z" fill="#fde68a"/>`),
  inline: svg(256,256,`${SKY}<path d="M16,128 H240" stroke="#fde68a" stroke-width="7" stroke-dasharray="12 10"/><circle cx="48" cy="128" r="40" fill="#fbbf24"/><circle cx="156" cy="128" r="28" fill="#3b82f6"/><circle cx="220" cy="128" r="16" fill="#e5e7eb"/>`),
  rightangle: svg(256,256,`${SKY}<path d="M48,176 H160 V56" fill="none" stroke="#fde68a" stroke-width="7" stroke-dasharray="12 10"/><circle cx="48" cy="176" r="40" fill="#fbbf24"/><circle cx="160" cy="176" r="28" fill="#3b82f6"/><circle cx="160" cy="56" r="16" fill="#e5e7eb"/>`),
};
export const RUBY_ART = svg(300,300,`<path d="M28,70 Q12,88 30,86 L38,74 Z" fill="#9b1c1c"/><ellipse cx="50" cy="63" rx="26" ry="21" fill="#e03131"/><ellipse cx="40" cy="64" rx="15" ry="9" fill="#b71c1c" transform="rotate(-25 40 64)"/>
  <circle cx="60" cy="38" r="17" fill="#e03131"/><path d="M52,25 L58,6 L67,24 Z" fill="#e03131"/><path d="M68,36 Q79,40 77,50 Q66,53 58,46 Q60,38 68,36 Z" fill="#1b1b1b"/><path d="M75,38 L91,43 L75,49 Z" fill="#f4a261"/>
  <circle cx="64" cy="33" r="4.2" fill="#fff"/><circle cx="65.2" cy="33" r="2.3" fill="#111"/><circle cx="66" cy="32" r=".9" fill="#fff"/><path d="M44,84 L42,95 M54,84 L54,95" stroke="#f4a261" stroke-width="3" stroke-linecap="round"/>`,'0 0 100 100');

// Earth at four spots around the sun, axis always leaning the same way. flip mirrors it so summer is not always on one side.
export function seasonsArt(flip, labels){
  const W=1000,H=600, X=x=>flip?W-x:x, tilt=flip?-23:23;
  const spots={ nsummer:[X(140),300], nwinter:[X(860),300], mild1:[500,100], mild2:[500,500] };
  const T=(x,y,t,size,fill,anchor)=>`<text x="${x}" y="${y}" font-family="Arial Rounded MT Bold, Helvetica, Arial, sans-serif" font-weight="bold" font-size="${size}" fill="${fill}" text-anchor="${anchor||'middle'}">${t}</text>`;
  let s=`<ellipse cx="500" cy="300" rx="360" ry="200" fill="none" stroke="#64748b" stroke-width="4" stroke-dasharray="12 12"/>
    <defs><radialGradient id="ssg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff7c2"/><stop offset=".6" stop-color="#fbbf24"/><stop offset="1" stop-color="#f59e0b" stop-opacity="0"/></radialGradient></defs><circle cx="500" cy="300" r="90" fill="url(#ssg)"/>${T(500,310,'SUN',26,'#7c2d12')}`;
  for(const [x,y] of Object.values(spots)){
    s+=`<g transform="translate(${x} ${y}) rotate(${tilt}) scale(1.9)"><path d="M0,-46 V46" stroke="#e5e7eb" stroke-width="3"/><circle r="30" fill="#3b82f6"/><path d="M-30,0 H30" stroke="#bfdbfe" stroke-width="1.5" stroke-dasharray="4 3"/>
      <path d="M-16,-20 q8,-8 18,-3 q3,8 -6,12 q-8,2 -12,-9 z" fill="#4ade80"/><path d="M4,10 q10,-3 12,6 q-5,8 -12,2 z" fill="#4ade80"/>
      <circle cx="-4" cy="-13" r="5" fill="#ef4444" stroke="#fff" stroke-width="1.6"/><circle cx="10" cy="15" r="5" fill="#fb923c" stroke="#fff" stroke-width="1.6"/>${T(0,-50,'N',11,'#e5e7eb')}</g>`;
  }
  if(labels){
    const L=(x,y,a,b,anchor)=>T(x,y,a,24,'#fff',anchor)+T(x,y+28,b,21,'#a5b4cf',anchor);
    s+=L(spots.nsummer[0],420,'Virginia: SUMMER','Australia: winter')+L(spots.nwinter[0],420,'Virginia: WINTER','Australia: summer');
    s+=L(590,96,'spring or autumn','mild for everyone','start')+L(590,506,'spring or autumn','mild for everyone','start');
  }
  s+=`<circle cx="24" cy="${H-52}" r="9" fill="#ef4444" stroke="#fff" stroke-width="2"/>${T(42,H-45,'Virginia (north half)',20,'#cbd5e1','start')}<circle cx="24" cy="${H-22}" r="9" fill="#fb923c" stroke="#fff" stroke-width="2"/>${T(42,H-15,'Australia (south half)',20,'#cbd5e1','start')}`;
  return { svg: svg(W,H,s), spots, W, H };
}

export function allArt(){
  const out=[]; const add=(k,s,w,h)=>out.push({key:k, svg:s, w, h});
  for(const [k,s] of Object.entries(PLANET_ART)) add('pl-'+k,s,256,256);
  for(const [k,s] of Object.entries(PHASE_ART)) add('ph-'+k,s,256,256);
  for(const [k,s] of Object.entries(ICON_ART)) add('ic-'+k,s,256,256);
  add('sun',SUN_ART,256,256); add('moonrock',MOONROCK_ART,256,256); add('ruby',RUBY_ART,300,300);
  for(const f of [0,1]) for(const l of [0,1]) add(`seasons-${f}-${l}`, seasonsArt(!!f,!!l).svg, 1000, 600);
  return out;
}
