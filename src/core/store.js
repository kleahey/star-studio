// Progress lives in this browser's localStorage only. Nothing leaves the device.
const KEY = 'star-studio.v1';
const fresh = () => ({ v:1, dust:0, levels:{}, stats:{}, days:[], today:{d:'',n:0}, stickers:[], muted:false, unlockAll:false,
  first:null, last:null, answered:0, correct:0, bestCombo:0 });
function load(){ try{ const raw=localStorage.getItem(KEY); if(raw){ const s=JSON.parse(raw); if(s&&typeof s==='object') return Object.assign(fresh(), s); } }catch(e){} return fresh(); }
export const dayKey = (d=new Date()) => d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
export const RANKS = [[0,'Warm-up'],[300,'Rehearsal'],[800,'Backstage'],[1600,'Spotlight'],[2800,'Center Stage'],[4200,'Headliner'],[6000,'Superstar'],[8500,'Legend']];
export const Store = {
  s: load(),
  save(){ try{ localStorage.setItem(KEY, JSON.stringify(this.s)); }catch(e){} },
  stars(id){ return (this.s.levels[id]||{}).stars||0; },
  finish(id, stars, dust){
    const L=this.s.levels[id]||(this.s.levels[id]={stars:0,plays:0}); const firstThree = stars===3 && L.stars<3;
    L.plays++; L.stars=Math.max(L.stars,stars); L.last=new Date().toISOString();
    const k=dayKey(); if(this.s.today.d!==k) this.s.today={d:k,n:0}; this.s.today.n++;
    this.save(); return firstThree;
  },
  bump(key, ok, combo){
    const st=this.s.stats[key]||(this.s.stats[key]={seen:0,ok:0,miss:0}); st.seen++; ok?st.ok++:st.miss++;
    this.s.answered++; if(ok) this.s.correct++; this.s.bestCombo=Math.max(this.s.bestCombo,combo||0);
    const k=dayKey(); if(!this.s.days.includes(k)) this.s.days.push(k);
    const now=new Date().toISOString(); if(!this.s.first) this.s.first=now; this.s.last=now; this.save();
  },
  addDust(n){ this.s.dust+=n; this.save(); },
  roundsToday(){ return this.s.today.d===dayKey() ? this.s.today.n : 0; },
  streak(){ const set=new Set(this.s.days); let n=0; const d=new Date(); if(!set.has(dayKey(d))) d.setDate(d.getDate()-1); while(set.has(dayKey(d))){ n++; d.setDate(d.getDate()-1); } return n; },
  rank(){ let i=0; RANKS.forEach((r,k)=>{ if(this.s.dust>=r[0]) i=k; }); return {n:i+1, name:RANKS[i][1], next:RANKS[i+1]?RANKS[i+1][0]:null, base:RANKS[i][0]}; },
  sticker(e){ if(!this.s.stickers.includes(e)){ this.s.stickers.push(e); this.save(); return true; } return false; },
};
