// Tiny synthesized sound kit: no audio files to download or cache.
import { Store } from './store.js';
let ctx=null;
function ac(){ if(!ctx){ const A=window.AudioContext||window.webkitAudioContext; if(A) ctx=new A(); } if(ctx&&ctx.state==='suspended') ctx.resume(); return ctx; }
addEventListener('pointerdown', ()=>ac(), {passive:true});
function tone(f, dur=.12, type='sine', vol=.18, when=0, slide=0){
  if(Store.s.muted) return; const c=ac(); if(!c) return; const t=c.currentTime+when;
  const o=c.createOscillator(), g=c.createGain(); o.type=type; o.frequency.setValueAtTime(f,t); if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+dur);
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.012); g.gain.exponentialRampToValueAtTime(.0008,t+dur);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t+dur+.03);
}
const N={C5:523,D5:587,E5:659,G5:784,A5:880,C6:1047,E6:1319,G6:1568};
export const sfx = {
  tap(){ tone(420,.06,'triangle',.12); },
  pick(){ tone(520,.07,'sine',.12,0,180); },
  drop(){ tone(300,.09,'triangle',.14,0,-120); },
  good(combo=1){ const up=Math.min(combo-1,6)*40; tone(N.E5+up,.1,'triangle',.18); tone(N.G5+up,.1,'triangle',.18,.08); tone(N.C6+up,.2,'triangle',.2,.16); },
  bad(){ tone(190,.22,'sawtooth',.1,0,-70); tone(150,.26,'sawtooth',.08,.1,-50); },
  star(i=0){ tone([N.C6,N.E6,N.G6][i]||N.G6,.3,'sine',.2); },
  win(){ [N.C5,N.E5,N.G5,N.C6,N.E6].forEach((f,i)=>tone(f,.22,'triangle',.18,i*.1)); },
  whoosh(){ tone(240,.25,'sine',.08,0,600); },
  roll(){ tone(180,.5,'sine',.1,0,240); },
};
