// Mechanics. Each one builds into play.stage for a single item and calls play.resolve(ok, info) exactly once.
// Nothing here reveals the answer before she commits.
import { W, C, CARD_COLORS, txt, fit, pill, button, shuffle, shake, popIn } from '../core/ui.js';
import { sfx } from '../core/sfx.js';

export const PLACES=['ones','tens','hundreds','thousands','ten thousands','hundred thousands','millions','ten millions','hundred millions'];
export const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function ringMark(s,c,w,h,ok,r){ const g=pill(s,w+14,h+14,0,0,r,ok?C.green:C.red,10); c.addAt(g,0); s.tweens.add({targets:c,scale:ok?1.06:1,duration:160,yoyo:true}); }

/* ---------- choice: tap one floating card ---------- */
function choice(p,it){
  const opts=it.noShuffle?it.opts.slice():shuffle(it.opts), n=opts.length, isImg=typeof opts[0]==='object';
  const maxLen=isImg?0:Math.max(...opts.map(o=>String(o).length));
  let cols,w,h;
  if(isImg){ cols=n===4?2:n; w=n===2?400:n===3?310:340; h=w; }
  else if(it.big){ cols=n; w=Math.min(300,(960-(n-1)*30)/n); h=260; }
  else if(n===4&&maxLen<=22){ cols=2; w=465; h=240; }
  else { cols=1; w=960; h=n<=2?200:n===3?175:150; }
  const gap=30, rows=Math.ceil(n/cols), totalH=rows*h+(rows-1)*gap, y0=430+(850-totalH)/2+h/2; let done=false; const cards=[];
  opts.forEach((o,i)=>{ const r=Math.floor(i/cols), k=i%cols, inRow=Math.min(cols,n-r*cols), rowW=inRow*w+(inRow-1)*gap;
    const c=p.add.container(W/2-rowW/2+w/2+k*(w+gap), y0+r*(h+gap)); const rad=isImg?48:Math.min(56,h/2);
    const sh=pill(p,w,h,0,.3,rad); sh.y=10; c.add(sh);
    if(isImg){ c.add(pill(p,w,h,0xffffff,.1,rad,0xffffff,3)); c.add(p.add.image(0,0,o.img).setDisplaySize(w-50,w-50)); c.val=o.img; c.cap=o.cap; }
    else { c.add(pill(p,w,h,CARD_COLORS[i%4],1,rad)); const hi=pill(p,w-24,h*.36,0xffffff,.14,rad); hi.y=-h*.24; c.add(hi);
      c.add(fit(txt(p,0,0,String(o),it.big?110:(maxLen<14?60:46),'#fff',{wrap:w-50}),w-40,h-20)); c.val=o; c.cap=String(o); }
    c.w=w; c.h=h; c.rad=rad; c.setSize(w,h).setInteractive({useHandCursor:true}); p.stage.add(c); cards.push(c);
    p.tweens.add({targets:c,y:c.y-10,duration:1300+i*170,yoyo:true,repeat:-1,ease:'Sine.inOut'});
    c.on('pointerdown',()=>{ if(done) return; done=true; const ok=c.val===it.a, right=cards.find(x=>x.val===it.a);
      cards.forEach(x=>{ x.disableInteractive(); if(x!==right&&x!==c) p.tweens.add({targets:x,alpha:.22,duration:200}); });
      ringMark(p,right,w,h,true,rad); if(!ok){ ringMark(p,c,w,h,false,rad); shake(p,c); }
      if(isImg) cards.forEach(x=>{ if(x.alpha>.5||x===right) x.add(fit(txt(p,0,h/2-34,x.cap,30),w-20,60,18)); });
      p.resolve(ok,{x:right.x,y:right.y,answer:right.cap}); });
  });
  popIn(p,cards,60,60);
}

/* ---------- sort: drag (or tap) one card into a bin ---------- */
function sort(p,it){
  const n=it.bins.length, bw=(960-(n-1)*24)/n, bh=300, by=1130; let done=false; const bins=[];
  it.bins.forEach((b,i)=>{ const c=p.add.container(60+bw/2+i*(bw+24),by); const col=b.color??CARD_COLORS[i%4];
    c.add(pill(p,bw,bh,col,.22,44,col,6)); c.add(txt(p,0,-58,b.emoji||'',88,'#fff',{shadow:false})); c.add(fit(txt(p,0,70,b.label,44,'#fff',{wrap:b.label.includes(' ')&&n<3?bw-30:undefined}),bw-24,120,20));
    c.bin=b; c.col=col; c.setSize(bw,bh).setInteractive({useHandCursor:true}); c.on('pointerdown',()=>choose(c)); p.stage.add(c); bins.push(c); });
  const cw=it.card.img?380:760, ch=it.card.img?400:250, home={x:W/2,y:660};
  const card=p.add.container(home.x,home.y); const sh=pill(p,cw,ch,0,.3,48); sh.y=12; card.add(sh); card.add(pill(p,cw,ch,0xffffff,1,48));
  if(it.card.img){ card.add(p.add.image(0,-36,it.card.img).setDisplaySize(270,270)); card.add(fit(txt(p,0,152,it.card.t,50,'#1f2433',{shadow:false}),cw-30,80)); }
  else card.add(fit(txt(p,0,0,it.card.t,56,'#1f2433',{wrap:cw-60,shadow:false}),cw-50,ch-30));
  card.setSize(cw,ch).setInteractive({draggable:true,useHandCursor:true}); p.stage.add(card); popIn(p,card);
  const hint=txt(p,W/2,900,'👇 drag it to the right bin',34,'#c7d2fe'); p.stage.add(hint); p.tweens.add({targets:hint,y:912,duration:600,yoyo:true,repeat:-1});
  const over=()=>bins.find(b=>Math.abs(card.x-b.x)<bw/2+20&&Math.abs(card.y-b.y)<bh/2+60);
  card.on('dragstart',()=>{ sfx.pick(); p.stage.bringToTop(card); p.tweens.add({targets:card,scale:.8,duration:120}); });
  card.on('drag',(ptr,x,y)=>{ if(done) return; card.x=x; card.y=y; const o=over(); bins.forEach(b=>b.setScale(b===o?1.06:1)); });
  card.on('dragend',()=>{ if(done) return; const o=over(); bins.forEach(b=>b.setScale(1)); if(o) choose(o); else p.tweens.add({targets:card,x:home.x,y:home.y,scale:1,duration:250,ease:'Back.out'}); });
  function choose(b){ if(done) return; done=true; card.disableInteractive(); bins.forEach(x=>x.disableInteractive()); hint.destroy();
    const ok=b.bin.id===it.a, right=bins.find(x=>x.bin.id===it.a); sfx.drop();
    if(!ok){ ringMark(p,b,bw,bh,false,44); shake(p,b); }
    p.tweens.add({targets:card,x:right.x,y:right.y-10,scale:.32,duration:ok?260:520,delay:ok?0:350,ease:'Cubic.inOut',onComplete:()=>{ ringMark(p,right,bw,bh,true,44); }});
    p.time.delayedCall(ok?240:800,()=>p.resolve(ok,{x:right.x,y:right.y-60,answer:right.bin.label})); }
}

/* ---------- order: drag tokens into numbered slots, then Check ---------- */
function order(p,it){
  const n=it.a.length, sw=Math.min(240,1000/n), sy=640, isImg=!!it.tokens[0].img, th=isImg?sw+34:110; let done=false;
  p.stage.add(pillAt(p,W/2,455,Math.min(960,it.dir.length*24+90),70,0xffffff,.14)); p.stage.add(txt(p,W/2,455,it.dir,34,'#fde68a'));
  const slots=it.a.map((_,i)=>{ const x=W/2-(n*sw)/2+sw/2+i*sw; const g=pillAt(p,x,sy,sw-12,th+16,0xffffff,.08,28,0xa5b4fc,3); p.stage.add(g);
    p.stage.add(txt(p,x,sy-th/2-38,String(i+1),32,'#a5b4fc')); return {x,y:sy,tok:null,g}; });
  const perRow=n<=4?n:Math.ceil(n/2), toks=shuffle(it.tokens).map((t,i)=>{ const r=Math.floor(i/perRow), inRow=Math.min(perRow,n-r*perRow), gapX=Math.min(250,1000/inRow);
    const c=p.add.container(W/2-(inRow*gapX)/2+gapX/2+(i%perRow)*gapX, 960+r*(th+40));
    if(isImg){ c.add(p.add.image(0,-14,t.img).setDisplaySize(sw-26,sw-26)); c.add(fit(txt(p,0,sw/2-4,t.t,26),sw-8,40,16)); }
    else { c.add(pill(p,sw-22,100,C.purple,1,30)); c.add(fit(txt(p,0,0,t.t,40),sw-40,90,20)); }
    c.id=t.id; c.home={x:c.x,y:c.y}; c.slot=-1; c.setSize(sw-16,th).setInteractive({draggable:true,useHandCursor:true}); p.stage.add(c); return c; });
  const check=button(p,W/2,1340,420,110,'Check ✓',C.green,()=>grade()); check.setEnabled(false); p.stage.add(check);
  const big=isImg&&n>5?1.35:1; toks.forEach(c=>c.setScale(big));
  const moveTo=(c,x,y,sc=1)=>p.tweens.add({targets:c,x,y,scale:sc,duration:220,ease:'Back.out'});
  popIn(p,toks,80,40);
  const free=c=>{ if(c.slot>=0){ slots[c.slot].tok=null; c.slot=-1; } };
  function place(c,i){ const other=slots[i].tok, from=c.slot; free(c);
    if(other&&other!==c){ slots[i].tok=null; other.slot=-1; if(from>=0){ slots[from].tok=other; other.slot=from; moveTo(other,slots[from].x,slots[from].y); } else moveTo(other,other.home.x,other.home.y,big); }
    slots[i].tok=c; c.slot=i; moveTo(c,slots[i].x,slots[i].y); sfx.drop(); check.setEnabled(slots.every(s=>s.tok)); }
  const sendHome=c=>{ free(c); moveTo(c,c.home.x,c.home.y,big); check.setEnabled(false); };
  toks.forEach(c=>{ let moved=0,sx=0,sy0=0;
    c.on('dragstart',(ptr)=>{ moved=0; sx=ptr.x; sy0=ptr.y; sfx.pick(); p.stage.bringToTop(c); });
    c.on('drag',(ptr,x,y)=>{ if(done) return; c.x=x; c.y=y; moved=Math.max(moved,Math.hypot(ptr.x-sx,ptr.y-sy0)); });
    c.on('dragend',()=>{ if(done) return;
      if(moved<14){ if(c.slot>=0) sendHome(c); else { const i=slots.findIndex(s=>!s.tok); if(i>=0) place(c,i); } return; }
      let best=-1,bd=1e9; slots.forEach((s,i)=>{ const d=Math.hypot(c.x-s.x,c.y-s.y); if(d<bd){bd=d;best=i;} });
      if(bd<Math.max(150,sw)) place(c,best); else sendHome(c); }); });
  function grade(){ if(done) return; done=true; check.setEnabled(false); toks.forEach(c=>c.disableInteractive());
    const ok=slots.every((s,i)=>s.tok.id===it.a[i]);
    slots.forEach((s,i)=>{ const good=s.tok.id===it.a[i]; const g=pillAt(p,s.x,s.y,sw-12,th+16,0,0,28,good?C.green:C.red,8); p.stage.add(g); if(!good) shake(p,s.tok); });
    const names=it.a.map(id=>it.tokens.find(t=>t.id===id).t).join(' → ');
    if(ok) return p.resolve(true,{x:W/2,y:sy,answer:names});
    p.time.delayedCall(900,()=>{ it.a.forEach((id,i)=>moveTo(toks.find(c=>c.id===id),slots[i].x,slots[i].y)); p.resolve(false,{answer:names}); }); }
}
function pillAt(p,x,y,w,h,color,alpha,r,stroke,sw){ const g=pill(p,w,h,color,alpha,r,stroke,sw); g.setPosition(x,y); return g; }

/* ---------- digit tiles: tap the digit in a named place ---------- */
function digitRow(p,number,y,onTap){
  const str=fmt(number), digits=String(number).length; const dw=96, cw=34, gap=8;
  const total=[...str].reduce((a,ch)=>a+(ch===','?cw:dw)+gap,-gap), scale=Math.min(1,1000/total); let x=W/2-total*scale/2, place=digits; const tiles=[];
  [...str].forEach(ch=>{ const w=(ch===','?cw:dw)*scale;
    if(ch===','){ p.stage.add(txt(p,x+w/2,y+46*scale,',',90*scale,'#c7d2fe')); }
    else { place--; const c=p.add.container(x+w/2,y); const sh=pill(p,w,150*scale,0,.3,22); sh.y=8; c.add([sh,pill(p,w,150*scale,0x312e81,1,22,0x818cf8,3),txt(p,0,0,ch,92*scale)]);
      c.place=place; c.digit=ch; c.w=w; c.h=150*scale; c.setSize(w,150*scale).setInteractive({useHandCursor:true}); c.on('pointerdown',()=>onTap(c,tiles)); p.stage.add(c); tiles.push(c); }
    x+=w+gap*scale; });
  popIn(p,tiles,40,35); return tiles;
}
function digit(p,it){ let done=false;
  digitRow(p,it.number,720,(c,tiles)=>{ if(done) return; done=true; tiles.forEach(t=>t.disableInteractive()); const right=tiles.find(t=>t.place===it.a), ok=c===right;
    ringMark(p,right,right.w,right.h,true,22); if(!ok){ ringMark(p,c,c.w,c.h,false,22); shake(p,c); }
    p.stage.add(txt(p,right.x,right.y-130,PLACES[it.a].toUpperCase(),34,'#86efac'));
    p.resolve(ok,{x:right.x,y:right.y,answer:`The ${right.digit} is in the ${PLACES[it.a]} place. Its value is ${fmt(Number(right.digit)*10**it.a)}.`}); });
}

/* ---------- keypad: type the answer. No options to recognise. ---------- */
function keypad(p,it){
  const col=it.layout==='column', ans=String(it.a); let entry='', done=false; const live=[];
  const clear=()=>{ live.forEach(o=>o.destroy()); live.length=0; };
  const row=(str,y,color,size=92)=>{ let x=860; [...str].reverse().forEach(ch=>{ const w=ch===','?30:84; const t=txt(p,x-w/2,y+(ch===','?16:0),ch,size,color); p.stage.add(t); live.push(t); x-=w; }); };
  if(col){ p.stage.add(pillAt(p,W/2,650,760,420,0xffffff,.08,44,0xffffff,2));
    const stat=(str,y)=>{ let x=860; [...str].reverse().forEach(ch=>{ const w=ch===','?30:84; p.stage.add(txt(p,x-w/2,y+(ch===','?16:0),ch,92,'#fff')); x-=w; }); };
    stat(fmt(it.top),520); stat(fmt(it.bottom),630); p.stage.add(txt(p,250,630,it.op,92,'#fde68a')); const ln=p.add.rectangle(W/2,700,680,8,0xffffff); p.stage.add(ln);
    p.stage.add(txt(p,W/2,890,'fills in from the ONES place, like on paper',30,'#c7d2fe')); }
  else { p.stage.add(pillAt(p,W/2,600,900,170,0xffffff,.1,50,0xa5b4fc,4)); }
  const draw=()=>{ clear(); const shown=entry===''?'?':fmt(entry); if(col) row(shown,785,entry?'#fde68a':'#64748b'); else { const t=fit(txt(p,W/2,600,shown,100,entry?'#fde68a':'#64748b'),860,150); p.stage.add(t); live.push(t); } ok.setEnabled(entry!==''); };
  const keys=['1','2','3','4','5','6','7','8','9','⌫','0','✓'], kw=230, kh=112, g=16, y0=col?975:850; let ok;
  keys.forEach((k,i)=>{ const b=button(p,W/2+(i%3-1)*(kw+g),y0+Math.floor(i/3)*(kh+g),kw,kh,k,k==='✓'?C.green:k==='⌫'?C.slate:0x4338ca,()=>press(k),{r:30,size:60}); p.stage.add(b); if(k==='✓') ok=b; });
  function press(k){ if(done) return;
    if(k==='⌫'){ entry=col?entry.slice(1):entry.slice(0,-1); }
    else if(k==='✓'){ if(entry==='') return; done=true; const good=Number(entry)===Number(ans);
      if(!good&&!col){ const t=txt(p,W/2,740,'✓ '+fmt(ans),64,'#86efac'); p.stage.add(t); }
      return p.resolve(good,{x:W/2,y:col?785:600,answer:fmt(ans)}); }
    else if(entry.length<ans.length+1){ if(entry==='0') entry=''; entry=col?k+entry:entry+k; }
    draw(); }
  draw();
}

/* ---------- hill: find the place, then roll to the nearer number ---------- */
function hill(p,it){
  let phase=1, done=false; p.setHint(`Step 1: tap the digit in the ${PLACES[it.place].toUpperCase()} place.`);
  const tiles=digitRow(p,it.n,520,(c,all)=>{ if(phase!==1||done) return; const right=all.find(t=>t.place===it.place);
    all.forEach(t=>t.disableInteractive());
    if(c!==right){ done=true; ringMark(p,right,right.w,right.h,true,22); ringMark(p,c,c.w,c.h,false,22); shake(p,c);
      return p.resolve(false,{answer:`Find the place first: the ${right.digit} is in the ${PLACES[it.place]} place. ${fmt(it.n)} rounds to ${fmt(it.a)}.`}); }
    sfx.good(1); const g=pill(p,right.w+14,right.h+14,0,0,22,C.gold,10); right.addAt(g,0);
    const nb=all.find(t=>t.place===it.place-1); if(nb){ const look=txt(p,nb.x,nb.y+120,'👀 look next door',30,'#fde68a'); p.stage.add(look); const g2=pill(p,nb.w+10,nb.h+10,0,0,22,0xfde68a,5); nb.addAt(g2,0); }
    phase=2; p.setHint('Step 2: which way does it roll?'); buildHill(); });
  function buildHill(){ const x0=150,x1=930,base=1180,ht=300, pt=f=>({x:x0+(x1-x0)*f,y:base-ht*Math.sin(Math.PI*f)});
    const g=p.add.graphics(); g.fillStyle(0x14b8a6,.85); g.beginPath(); g.moveTo(x0-60,base+30); for(let i=0;i<=40;i++){ const q=pt(i/40); g.lineTo(q.x,q.y); } g.lineTo(x1+60,base+30); g.closePath(); g.fillPath();
    g.lineStyle(8,0x5eead4,1); g.beginPath(); for(let i=0;i<=40;i++){ const q=pt(i/40); i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y); } g.strokePath(); p.stage.add(g);
    const mid=(it.lo+it.hi)/2; p.stage.add(txt(p,W/2,base-ht-14+80,'halfway: '+fmt(mid),30,'#042f2e',{shadow:false}));
    let f=(it.n-it.lo)/(it.hi-it.lo); f=Math.min(.93,Math.max(.07,f)); const st={f};
    const ball=p.add.image(0,0,'ruby').setDisplaySize(130,130); const tag=txt(p,0,0,fmt(it.n),40,'#fde68a'); p.stage.add([ball,tag]);
    const put=()=>{ const q=pt(st.f); ball.setPosition(q.x,q.y-58); tag.setPosition(q.x,q.y-150); }; put();
    p.tweens.add({targets:ball,angle:{from:-6,to:6},duration:500,yoyo:true,repeat:-1});
    const mk=(x,val,side)=>{ const b=button(p,x,1330,400,120,fmt(val),side==='lo'?C.blue:C.pink,()=>pickSide(val,b),{r:36,size:54}); p.stage.add(b); return b; };
    const bl=mk(270,it.lo,'lo'), bh=mk(810,it.hi,'hi'); popIn(p,[bl,bh]);
    function pickSide(val,b){ if(done) return; done=true; bl.disabled=bh.disabled=true; const ok=val===it.a; if(!ok) shake(p,b); sfx.roll();
      p.tweens.add({targets:st,f:it.a===it.hi?1:0,duration:900,ease:'Quad.in',onUpdate:put,onComplete:()=>{ const q=pt(st.f);
        const ns=String(it.n), digit=ns[ns.length-it.place];
        p.resolve(ok,{x:q.x,y:q.y-60,answer:`${fmt(it.n)} rounds to ${fmt(it.a)}. The digit next door is ${digit}: ${Number(digit)>=5?'5 or more, step UP':'4 or less, stay put'}.`}); }}); } }
}

/* ---------- hotspot: tap a place in a picture ---------- */
function hotspot(p,it){
  let done=false; const zones=[]; let img=null, sc=1, left=0, top=0;
  if(it.tex){ img=p.add.image(W/2,800,it.tex); sc=1000/it.texW; img.setScale(sc); left=W/2-500; top=800-it.texH*sc/2; p.stage.add(pillAt(p,W/2,800,1030,it.texH*sc+30,0x0b1026,.75,40,0x6366f1,3)); p.stage.add(img); }
  (it.sprites||[]).forEach(sp=>{ const im=p.add.image(sp.x,sp.y,sp.tex).setDisplaySize(sp.size,sp.size); p.stage.add(im); sp.im=im; });
  it.zones.forEach(z=>{ const x=left+z.x*sc, y=top+z.y*sc, r=z.r*sc; const ring=p.add.circle(x,y,r).setStrokeStyle(4,0xffffff,.35); const hit=p.add.circle(x,y,r,0xffffff,.001).setInteractive({useHandCursor:true});
    p.tweens.add({targets:ring,scale:1.08,alpha:.5,duration:900,yoyo:true,repeat:-1}); p.stage.add([ring,hit]); zones.push({z,x,y,r,ring,hit}); hit.on('pointerdown',()=>tap(z.id)); });
  function tap(id){ if(done) return; done=true; const ok=it.a.includes(id); zones.forEach(o=>{ o.hit.disableInteractive(); p.tweens.killTweensOf(o.ring); o.ring.setScale(1);
      if(it.a.includes(o.z.id)) o.ring.setStrokeStyle(10,C.green,1).setAlpha(1); else if(o.z.id===id) o.ring.setStrokeStyle(10,C.red,1).setAlpha(1); else o.ring.setAlpha(0);
      if(o.z.label) p.stage.add(txt(p,o.x,o.y+o.r+26,o.z.label,26)); });
    if(it.texLabeled) img.setTexture(it.texLabeled); const r0=zones.find(o=>o.z.id===it.a[0]);
    p.resolve(ok,{x:r0.x,y:r0.y,answer:it.answer}); }
}

export const MECH={ choice, sort, order, digit, keypad, hill, hotspot };
