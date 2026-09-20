import { sfx } from './sfx.js';
export const W=1080, H=1440;
export const FONT='ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Nunito", system-ui, sans-serif';
export const C={ navy:0x0b1026, purple:0x7c3aed, violet:0xa78bfa, pink:0xec4899, teal:0x14b8a6, gold:0xfbbf24, green:0x22c55e, red:0xef4444, blue:0x3b82f6, orange:0xf97316, slate:0x1e293b, white:0xffffff };
export const CARD_COLORS=[C.purple, C.pink, C.teal, C.orange];
export const hex = n => '#'+n.toString(16).padStart(6,'0');
export const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

export function txt(s,x,y,str,size=48,color='#ffffff',o={}){
  const t=s.add.text(x,y,str,{ fontFamily:FONT, fontSize:size+'px', fontStyle:'bold', color, align:o.align||'center', lineSpacing:o.ls??6,
    wordWrap:o.wrap?{width:o.wrap,useAdvancedWrap:true}:undefined, padding:{x:6,y:10} }).setOrigin(o.ox??.5,o.oy??.5);
  if(o.shadow!==false) t.setShadow(0,4,'rgba(0,0,0,.35)',8,false,true);
  return t;
}
// Shrinks text until it fits a box. Keeps prompts big when short and legible when long.
export function fit(t,maxW,maxH,min=26){ let size=parseInt(t.style.fontSize); while((t.width>maxW||t.height>maxH)&&size>min){ size-=2; t.setFontSize(size); } return t; }

export function pill(s,w,h,color,alpha=1,r,stroke,sw=5){
  const g=s.add.graphics(); r=Math.min(r??h/2,w/2,h/2);
  g.fillStyle(color,alpha); g.fillRoundedRect(-w/2,-h/2,w,h,r);
  if(stroke!==undefined){ g.lineStyle(sw,stroke,1); g.strokeRoundedRect(-w/2,-h/2,w,h,r); }
  return g;
}
export function glass(s,x,y,w,h,r=40,alpha=.1){ const g=pill(s,w,h,0xffffff,alpha,r,0xffffff,2); g.setPosition(x,y); g.setAlpha(1); return g; }

export function button(s,x,y,w,h,label,color,cb,o={}){
  const c=s.add.container(x,y), r=o.r??h/2;
  const sh=pill(s,w,h,0x000000,.3,r); sh.y=9;
  const g=pill(s,w,h,color,1,r); const hi=pill(s,w-20,h*.4,0xffffff,.16,r); hi.y=-h*.22;
  const t=txt(s,0,-2,label,o.size||Math.round(h*.42)); fit(t,w-30,h-10,20);
  c.add([sh,g,hi,t]); c.setSize(w,h+10).setInteractive({useHandCursor:true}); c.label=t; c.disabled=false;
  c.on('pointerdown',()=>{ if(c.disabled) return; sfx.tap(); s.tweens.add({targets:c,scale:.93,duration:70,yoyo:true,onComplete:()=>{ if(!c.disabled && c.active) cb(); }}); });
  c.setEnabled=v=>{ c.disabled=!v; c.setAlpha(v?1:.35); return c; };
  return c;
}

export function backdrop(s,theme='hub'){
  const stops={ hub:['#0f172a','#312e81','#7c3aed'], space:['#050816','#1e1b4b','#581c87'], math:['#0c1445','#4c1d95','#be185d'], va:['#052e16','#14532d','#0f766e'] }[theme];
  const key='bg-'+theme;
  if(!s.textures.exists(key)){ const t=s.textures.createCanvas(key,W,H), ctx=t.getContext(); const g=ctx.createLinearGradient(0,0,W*.35,H);
    stops.forEach((c,i)=>g.addColorStop(i/(stops.length-1),c)); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); t.refresh(); }
  s.add.image(W/2,H/2,key);
  for(let i=0;i<55;i++){ const d=s.add.image(Math.random()*W,Math.random()*H,'dot').setScale(.1+Math.random()*.25).setAlpha(.15+Math.random()*.5);
    s.tweens.add({targets:d,alpha:.05,duration:900+Math.random()*2200,yoyo:true,repeat:-1,delay:Math.random()*2000}); }
  const deco={ hub:['✨','⭐','🪐','➕'], space:['🪐','☄️','🌙','✨'], math:['➕','➖','🔢','✨','＝'], va:['🌽','🍂','🗺️','✨','🫐'] }[theme];
  for(let i=0;i<6;i++){ const e=txt(s,Math.random()*W,Math.random()*H,deco[i%deco.length],60+Math.random()*60,'#fff',{shadow:false}).setAlpha(.1).setAngle(Math.random()*40-20);
    s.tweens.add({targets:e,y:e.y-60-Math.random()*80,x:e.x+Math.random()*80-40,angle:e.angle+20,duration:7000+Math.random()*6000,yoyo:true,repeat:-1,ease:'Sine.inOut'}); }
}

export function burst(s,x,y,n=26,tints=[0xfbbf24,0xec4899,0xa78bfa,0x22c55e,0x38bdf8]){
  const e=s.add.particles(x,y,'star',{ speed:{min:180,max:620}, angle:{min:0,max:360}, scale:{start:.22,end:0}, rotate:{min:0,max:360}, lifespan:{min:500,max:900}, gravityY:700, tint:tints, emitting:false });
  e.setDepth(50); e.explode(n); s.time.delayedCall(1300,()=>e.destroy());
}
export function confetti(s,ms=1800){
  const e=s.add.particles(0,0,'conf',{ x:{min:0,max:W}, y:-30, speedY:{min:350,max:800}, speedX:{min:-120,max:120}, rotate:{min:0,max:360}, scale:{min:.5,max:1.3}, lifespan:3200, quantity:5, frequency:28,
    tint:[0xfbbf24,0xec4899,0xa78bfa,0x22c55e,0x38bdf8,0xf97316] });
  e.setDepth(60); s.time.delayedCall(ms,()=>e.stop()); s.time.delayedCall(ms+3400,()=>e.destroy());
}
export function floatText(s,x,y,str,color='#fde68a',size=56){ const t=txt(s,x,y,str,size,color).setDepth(55); s.tweens.add({targets:t,y:y-130,alpha:0,duration:1000,ease:'Cubic.out',onComplete:()=>t.destroy()}); }
export function popIn(s,targets,delay=0,stagger=50){ [].concat(targets).forEach((t,i)=>{ const sc=t.scale||1; t.setScale(0); s.tweens.add({targets:t,scale:sc,duration:380,ease:'Back.out',delay:delay+i*stagger}); }); }
export function shake(s,target){ const x=target.x; s.tweens.add({targets:target,x:x+16,duration:50,yoyo:true,repeat:4,onComplete:()=>target.x=x}); }
export function go(s,key,data){ sfx.whoosh(); s.cameras.main.fadeOut(160,5,8,22); s.cameras.main.once('camerafadeoutcomplete',()=>s.scene.start(key,data)); }
export function fadeIn(s){ s.cameras.main.fadeIn(200,5,8,22); }

// Ruby the cardinal, with a speech bubble.
export function ruby(s,x,y,size=200){
  const c=s.add.container(x,y); const img=s.add.image(0,0,'ruby').setDisplaySize(size,size); c.add(img); c.img=img;
  s.tweens.add({targets:img,y:-8,duration:900,yoyo:true,repeat:-1,ease:'Sine.inOut'});
  c.hop=()=>s.tweens.add({targets:c,y:y-60,duration:180,yoyo:true,ease:'Quad.out',repeat:1});
  c.oops=()=>s.tweens.add({targets:img,angle:-14,duration:120,yoyo:true,repeat:2});
  return c;
}
export function bubble(s,x,y,w,str,size=38){
  const c=s.add.container(x,y); const t=txt(s,0,0,str,size,'#1f2433',{wrap:w-50,shadow:false}); const h=Math.max(90,t.height+30);
  const g=pill(s,w,h,0xffffff,1,36); const tail=s.add.triangle(-w/2-4,8,0,0,34,-18,34,18,0xffffff); c.add([g,tail,t]); c.text=t; return c;
}
