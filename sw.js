const CACHE='twittey-menu-v5';
const FILES=['./','./index.html','./styles.css','./app.js','./manifest.json'];
// Cache files one-by-one so a single missing file never blocks the update
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(FILES.map(f=>c.add(f)))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  // Pages & code: network-first so updates always arrive, cache as offline fallback
  if(req.destination===''||req.destination==='document'||req.destination==='script'||req.destination==='style'){
    e.respondWith(fetch(req).then(res=>{if(res.ok){const cl=res.clone();caches.open(CACHE).then(c=>c.put(req,cl))}return res}).catch(()=>caches.match(req)));
    return;
  }
  // Images & everything else: cache-first with runtime caching
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{if(res.ok){const cl=res.clone();caches.open(CACHE).then(c=>c.put(req,cl))}return res})));
});
