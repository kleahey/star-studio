import { W, H, C, txt, fit, pill, glass, button, backdrop, burst, confetti, floatText, popIn, go, fadeIn, ruby, bubble } from './core/ui.js';
import { Store } from './core/store.js';
import { sfx } from './core/sfx.js';
import { allArt } from './core/art.js';
import { MECH } from './mech/index.js';
import { WORLDS } from './worlds.js';

const worldStars = w => w.levels.reduce((a,l)=>a+Store.stars(l.id),0);
const unlocked = (w,i) => Store.s.unlockAll || i===0 || Store.stars(w.levels[i-1].id)>0;

class Boot extends Phaser.Scene{
  constructor(){ super('Boot'); }
  preload(){ for(const a of allArt()) this.load.svg(a.key,'data:image/svg+xml;charset=utf-8;base64,'+btoa(unescape(encodeURIComponent(a.svg))),{width:a.w,height:a.h}); }
  create(){
    const g=this.make.graphics({add:false});
    g.fillStyle(0xffffff,1); g.fillCircle(16,16,16); g.generateTexture('dot',32,32); g.clear();
    const pts=[]; for(let i=0;i<10;i++){ const r=i%2?42:98, a=-Math.PI/2+i*Math.PI/5; pts.push({x:100+r*Math.cos(a),y:104+r*Math.sin(a)}); }
    g.fillStyle(0xffffff,1); g.fillPoints(pts,true); g.generateTexture('star',200,200); g.clear();
    g.fillStyle(0xffffff,1); g.fillRoundedRect(0,0,18,28,4); g.generateTexture('conf',18,28); g.destroy();
    this.scene.start('Hub');
  }
}

class Hub extends Phaser.Scene{
  constructor(){ super('Hub'); }
  create(){
    fadeIn(this); backdrop(this,'hub'); const S=Store.s, rk=Store.rank(), today=Store.roundsToday(), streak=Store.streak();
    txt(this,W/2,80,'⭐ STAR STUDIO ⭐',58,'#fde68a');
    const r=ruby(this,160,250,210); popIn(this,r);
    const line = S.answered===0 ? 'Hi Caroline! I\'m Ruby. Pick a world and let\'s go!' : today===0 ? 'Welcome back, Caroline! Ready for today\'s first level?' : today>=3 ? `${today} levels today. Superstar! 🌟` : 'Nice work! One more level?';
    bubble(this,650,245,700,line,38);
    // stat pills
    const stat=(x,label,val,w=300)=>{ const c=this.add.container(x,420); c.add(pill(this,w,96,0xffffff,.12,48,0xffffff,2)); c.add(txt(this,0,-2,`${label} ${val}`,40)); return c; };
    stat(210,'✨',S.dust.toLocaleString()); stat(540,'🔥',`${streak} day${streak===1?'':'s'}`); stat(870,'🎯',`${Math.min(today,3)}/3 today`);
    // rank bar
    const pct = rk.next ? (S.dust-rk.base)/(rk.next-rk.base) : 1; txt(this,60,505,`Rank ${rk.n} · ${rk.name}`,32,'#c7d2fe',{ox:0});
    if(rk.next) txt(this,W-60,505,`${(rk.next-S.dust).toLocaleString()} ✨ to next`,28,'#a5b4fc',{ox:1});
    const bar=this.add.graphics(); bar.fillStyle(0xffffff,.15); bar.fillRoundedRect(60,532,960,22,11); bar.fillStyle(C.gold,1); bar.fillRoundedRect(60,532,Math.max(22,960*pct),22,11);
    // world cards
    const CH=WORLDS.length>2?220:280, y0=WORLDS.length>2?700:820, step=CH+28;
    WORLDS.forEach((w,i)=>{ const y=y0+i*step, c=this.add.container(W/2,y); const sh=pill(this,960,CH,0,.35,52); sh.y=12;
      const body=pill(this,960,CH,w.color,1,52), hi=pill(this,930,CH*.34,0xffffff,.13,46); hi.y=-CH*.28;
      const max=w.levels.length*3, got=worldStars(w);
      c.add([sh,body,hi,txt(this,-370,-4,w.emoji,CH*.5,'#fff',{shadow:false}),txt(this,-260,-CH*.24,w.name,52,'#fff',{ox:0}),txt(this,-260,CH*.02,w.sub,29,'#fef3c7',{ox:0})]);
      const pb=this.add.graphics(); pb.fillStyle(0x000000,.28); pb.fillRoundedRect(-260,CH*.2,560,24,12); pb.fillStyle(0xfde68a,1); pb.fillRoundedRect(-260,CH*.2,Math.max(24,560*got/max),24,12); c.add(pb);
      c.add(txt(this,320,CH*.2+12,`${got}/${max} ⭐`,30,'#fff',{ox:0})); c.add(txt(this,415,-CH*.18,'›',96,'#fff'));
      c.setSize(960,CH).setInteractive({useHandCursor:true}); c.on('pointerdown',()=>{ sfx.tap(); this.tweens.add({targets:c,scale:.96,duration:80,yoyo:true,onComplete:()=>go(this,'Map',{world:w})}); });
      popIn(this,c,150+i*120); });
    // footer: stickers, sound, grown-ups (press and hold)
    button(this,250,1375,380,96,`🏆 Stickers ${S.stickers.length}`,0x4338ca,()=>this.stickers(),{size:38});
    const snd=button(this,560,1375,160,96,S.muted?'🔇':'🔊',0x334155,()=>{ S.muted=!S.muted; Store.save(); snd.label.setText(S.muted?'🔇':'🔊'); },{size:44});
    const gu=this.add.container(850,1375); gu.add([pill(this,340,100,0xffffff,.1,50,0xffffff,2),txt(this,0,-2,'👀 Grown-ups',36,'#e0e7ff')]); gu.setSize(340,100).setInteractive();
    let timer=null; const fill=this.add.graphics(); gu.addAt(fill,1);
    gu.on('pointerdown',()=>{ const st={p:0}; timer=this.tweens.add({targets:st,p:1,duration:1100,onUpdate:()=>{ fill.clear(); fill.fillStyle(0xa78bfa,.5); fill.fillRoundedRect(-170,-50,340*st.p,100,50); },onComplete:()=>{ location.href='grownups.html'; }}); });
    const cancel=()=>{ if(timer&&timer.isPlaying()){ timer.stop(); fill.clear(); this.toast('Grown-ups: press and hold'); } timer=null; }; gu.on('pointerup',cancel); gu.on('pointerout',cancel);
  }
  toast(msg){ const t=this.add.container(W/2,1290).setDepth(90); t.add([pill(this,600,80,0x000000,.75,40),txt(this,0,-2,msg,32)]); this.tweens.add({targets:t,alpha:0,delay:1200,duration:400,onComplete:()=>t.destroy()}); }
  stickers(){ const c=this.add.container(0,0).setDepth(100); const dim=this.add.rectangle(W/2,H/2,W,H,0x000000,.7).setInteractive(); const all=WORLDS.flatMap(w=>w.levels.map(l=>l.sticker));
    c.add([dim,pill(this,960,1120,0x1e1b4b,1,60,0xa78bfa,5).setPosition(W/2,H/2),txt(this,W/2,250,'🏆 Sticker Shelf',60,'#fde68a'),txt(this,W/2,322,'Get 3 stars on a level to win its sticker',30,'#c7d2fe')]);
    all.forEach((e,i)=>{ const x=W/2-362+(i%6)*145, y=440+Math.floor(i/6)*145, has=Store.s.stickers.includes(e); c.add(pill(this,126,126,0xffffff,has?.16:.06,32).setPosition(x,y)); c.add(txt(this,x,y,has?e:'❔',has?74:52,'#fff',{shadow:false}).setAlpha(has?1:.35)); });
    const b=button(this,W/2,1200,340,96,'Close',C.purple,()=>c.destroy()); c.add(b); }
}

class MapScene extends Phaser.Scene{
  constructor(){ super('Map'); }
  init(d){ this.world=d.world; }
  create(){
    fadeIn(this); const w=this.world; backdrop(this,w.theme);
    button(this,90,90,110,110,'‹',0x334155,()=>go(this,'Hub'),{size:70}); txt(this,W/2,80,`${w.emoji} ${w.name}`,60); txt(this,W/2,150,`${worldStars(w)} / ${w.levels.length*3} ⭐`,36,'#fde68a');
    const n=w.levels.length, pos=w.levels.map((_,i)=>({x:W/2+Math.sin(i*1.05+.4)*270, y:1330-i*(1080/(n-1))}));
    const path=this.add.graphics(); for(let i=0;i<n-1;i++){ const a=pos[i],b=pos[i+1]; for(let k=1;k<9;k++){ const t=k/9; path.fillStyle(0xffffff,unlocked(w,i+1)?.55:.18); path.fillCircle(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,6); } }
    const cur=w.levels.findIndex((l,i)=>unlocked(w,i)&&Store.stars(l.id)===0);
    w.levels.forEach((l,i)=>{ const p=pos[i], open=unlocked(w,i), st=Store.stars(l.id), c=this.add.container(p.x,p.y);
      const sh=this.add.circle(0,8,62,0x000000,.35), body=this.add.circle(0,0,62,open?w.color:0x334155).setStrokeStyle(7,st===3?C.gold:0xffffff,open?1:.3);
      c.add([sh,body,txt(this,0,-2,open?l.emoji:'🔒',62,'#fff',{shadow:false}).setAlpha(open?1:.6)]);
      if(st||open) c.add(txt(this,0,84,[1,2,3].map(k=>k<=st?'⭐':'·').join(' '),st?26:30,'#fde68a'));
      const left=p.x>W/2, lx=left?-90:90; c.add(txt(this,lx,-16,`${i+1}. ${l.name}`,36,open?'#fff':'#94a3b8',{ox:left?1:0})); c.add(txt(this,lx,28,l.skill,25,open?'#c7d2fe':'#64748b',{ox:left?1:0}));
      c.setSize(150,150).setInteractive({useHandCursor:open}); c.on('pointerdown',()=>{ if(!open){ sfx.bad(); this.tweens.add({targets:c,angle:6,duration:60,yoyo:true,repeat:3}); return; } sfx.tap(); go(this,'Play',{world:w,index:i}); });
      popIn(this,c,i*45);
      if(i===cur){ this.tweens.add({targets:body,scale:1.12,duration:650,yoyo:true,repeat:-1,ease:'Sine.inOut'}); const rb=ruby(this,p.x+(left?95:-95),p.y-70,120); rb.img.setFlipX(!left); } });
  }
}

class Play extends Phaser.Scene{
  constructor(){ super('Play'); }
  init(d){ this.world=d.world; this.index=d.index; this.lv=d.world.levels[d.index]; }
  create(){
    fadeIn(this); backdrop(this,this.world.theme);
    this.queue=this.lv.make(); this.i=-1; this.results=[]; this.combo=0; this.earned=0; this.locked=false;
    button(this,80,80,100,100,'✕',0x334155,()=>go(this,'Map',{world:this.world}),{size:50});
    this.pips=this.add.container(0,0); this.dustT=txt(this,W-40,80,'',40,'#fde68a',{ox:1}); this.comboT=txt(this,W-40,135,'',32,'#fb923c',{ox:1});
    this.ruby=ruby(this,120,290,190); glass(this,625,285,850,270,50,.12);
    this.promptT=txt(this,625,270,'',56,'#fff',{wrap:790}); this.hintT=txt(this,625,392,'',30,'#fde68a');
    this.stage=this.add.container(0,0); this.next();
  }
  setHint(s){ this.hintT.setText(s||''); }
  drawPips(){ this.pips.removeAll(true); const n=this.queue.length, gap=Math.min(56,620/n), x0=W/2-(n-1)*gap/2;
    this.queue.forEach((q,k)=>{ const r=this.results[k]; const col=k<this.i?(r&&r.ok?C.green:C.red):k===this.i?C.gold:0xffffff; const c=this.add.circle(x0+k*gap,80,k===this.i?17:12,col,k<=this.i?1:.25); this.pips.add(c); });
    this.dustT.setText(`✨ ${Store.s.dust.toLocaleString()}`); this.comboT.setText(this.combo>=2?`🔥 ${this.combo} combo`:''); }
  next(){
    this.stage.list.forEach(o=>this.tweens.killTweensOf(o)); this.stage.removeAll(true); if(this.card){ this.card.destroy(); this.card=null; }
    this.i++; if(this.i>=this.queue.length) return this.finish();
    const it=this.cur=this.queue[this.i]; this.locked=false; this.drawPips();
    this.promptT.setFontSize(it.q.length>70?44:it.q.length>34?50:60).setText(it.q); fit(this.promptT,790,it.hint?190:230,26); this.promptT.y=it.hint?258:285; this.setHint(it.hint||(it.retry?'↻ This one came back around. You\'ve got it!':''));
    MECH[it.type](this,it);
  }
  resolve(ok,info={}){
    if(this.locked) return; this.locked=true; const it=this.cur; this.results[this.i]={ok,retry:!!it.retry,key:it.key};
    if(ok){ this.combo++; const gain=10+Math.min(20,(this.combo-1)*5); this.earned+=gain; Store.addDust(gain); Store.bump(it.key,true,this.combo);
      sfx.good(this.combo); burst(this,info.x??W/2,info.y??700); floatText(this,info.x??W/2,(info.y??700)-40,`+${gain} ✨`); this.ruby.hop();
      this.setHint(['Nailed it!','Stuck the landing!','Perfect step!','Clean. Next!','You\'ve got this move!'][Math.floor(Math.random()*5)]+(this.combo>=3?`  🔥 ${this.combo} in a row`:'')); this.drawPips();
      this.time.delayedCall(1150,()=>this.next()); }
    else { this.combo=0; Store.bump(it.key,false,0); sfx.bad(); this.cameras.main.shake(220,.007); this.ruby.oops(); this.drawPips();
      if(!it.retry && this.queue.length<12){ const again=it.regen?it.regen():Object.assign({},it); again.retry=true; again.regen=null; this.queue.splice(Math.min(this.i+3,this.queue.length),0,again); }
      this.time.delayedCall(950,()=>this.explain(it,info)); }
  }
  explain(it,info){ const c=this.card=this.add.container(W/2,H+260).setDepth(40); const body=[info.answer,it.why].filter(Boolean);
    const a=txt(this,0,0,info.answer||'',40,'#fde68a',{wrap:900}), wy=txt(this,0,0,it.why||'',32,'#e2e8f0',{wrap:900}); const h=150+a.height+wy.height+140;
    c.add([pill(this,1010,h,0x2a1230,.98,50,C.red,5),txt(this,0,-h/2+52,'Not quite. Here\'s the step:',38,'#fca5a5'),a.setY(-h/2+100+a.height/2),wy.setY(-h/2+110+a.height+wy.height/2)]);
    c.add(button(this,0,h/2-72,460,100,'Got it →',C.pink,()=>this.next())); this.tweens.add({targets:c,y:H-h/2-24,duration:380,ease:'Back.out'}); }
  finish(){ const first=this.results.filter(r=>!r.retry), right=first.filter(r=>r.ok).length, acc=right/first.length, stars=acc>=.9?3:acc>=.65?2:1;
    const bonus=stars===3?50:stars===2?20:0; Store.addDust(bonus); const newSticker=Store.finish(this.lv.id,stars) && Store.sticker(this.lv.sticker);
    go(this,'Result',{world:this.world,index:this.index,stars,right,total:first.length,earned:this.earned+bonus,newSticker}); }
}

class Result extends Phaser.Scene{
  constructor(){ super('Result'); }
  init(d){ this.d=d; }
  create(){ fadeIn(this); const d=this.d, w=d.world, lv=w.levels[d.index]; backdrop(this,w.theme);
    txt(this,W/2,170,d.stars===3?'Flawless!':d.stars===2?'Strong level!':'Level complete!',84,'#fde68a'); txt(this,W/2,260,`${lv.emoji} ${lv.name}`,44,'#e0e7ff');
    [0,1,2].forEach(i=>{ const on=i<d.stars, s=this.add.image(W/2+(i-1)*250,480+(i===1?-40:0),'star').setTint(on?0xfbbf24:0x475569).setScale(0).setAngle(-30);
      this.tweens.add({targets:s,scale:on?1.05:.8,angle:0,duration:450,ease:'Back.out',delay:350+i*320,onStart:()=>{ if(on){ sfx.star(i); } },onComplete:()=>{ if(on) burst(this,s.x,s.y,14,[0xfbbf24,0xfde68a]); }}); });
    txt(this,W/2,700,`${d.right} / ${d.total} on the first try`,50); txt(this,W/2,780,`+${d.earned} ✨ stardust`,44,'#fde68a');
    if(d.stars<3) txt(this,W/2,850,'Misses are how it sticks. 3 stars wins the sticker!',30,'#c7d2fe');
    if(d.newSticker){ const c=this.add.container(W/2,960); c.add([pill(this,720,170,0xffffff,.14,60,C.gold,5),txt(this,-240,0,lv.sticker,110,'#fff',{shadow:false}),txt(this,70,-2,'New sticker!',52,'#fde68a')]); popIn(this,c,1500); }
    const r=ruby(this,160,1120,220); this.time.delayedCall(600,()=>r.hop()); if(d.stars===3){ this.time.delayedCall(1300,()=>{ confetti(this); sfx.win(); }); }
    const hasNext=d.index+1<w.levels.length;
    if(hasNext) button(this,W/2+120,1130,620,130,'Next level →',C.green,()=>go(this,'Play',{world:w,index:d.index+1}));
    button(this,W/2-170,1300,420,110,'↻ Play again',C.purple,()=>go(this,'Play',{world:w,index:d.index}),{size:40}); button(this,W/2+270,1300,380,110,'🗺 Map',0x334155,()=>go(this,'Map',{world:w}),{size:40});
  }
}

window.__worlds = WORLDS;
window.__game = new Phaser.Game({ type:Phaser.AUTO, parent:'game', backgroundColor:'#0b1026', scale:{ mode:Phaser.Scale.FIT, autoCenter:Phaser.Scale.CENTER_BOTH, width:W, height:H },
  render:{ antialias:true, roundPixels:false }, input:{ activePointers:2 }, scene:[Boot,Hub,MapScene,Play,Result] });
