// Offline shell: precache everything, serve from cache, refresh in the background. Bump VERSION on every deploy.
const VERSION='star-studio-v2';
const SHELL=['./','index.html','grownups.html','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','vendor/phaser.min.js',
  'src/main.js','src/worlds.js','src/core/ui.js','src/core/store.js','src/core/sfx.js','src/core/art.js','src/mech/index.js','src/space/facts.js','src/space/levels.js','src/math/gen.js','src/math/levels.js','src/va/levels.js'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin) return;
  e.respondWith(caches.open(VERSION).then(async c=>{ const hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{ if(r.ok) c.put(e.request,r.clone()); return r; }).catch(()=>hit);
    return hit||net; })); });
