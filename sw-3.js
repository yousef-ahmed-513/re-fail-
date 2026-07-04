const CACHE='twittey-menu-v7';
const FILES=['./','./index.html','./styles.css','./app.js','./manifest.json','./icon-192.png','./icon-512.png',
'./signature.jpg','./hot-coffee.jpg','./iced-coffee.jpg','./frappuccino.jpg','./milkshake.jpg','./matcha.jpg','./slush.jpg','./signature-iced.jpg','./mojito.jpg','./fresh-juice.jpg','./dessert.jpg','./extras.jpg'];

// Install: pre-cache core files and activate immediately
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});

// Activate: take control now and delete old caches
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  await self.clients.claim();
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
})()));

// Fetch: network-first (always fresh when online), fall back to cache when offline
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith((async()=>{
    try{
      const fresh=await fetch(e.request);
      const cache=await caches.open(CACHE);
      cache.put(e.request,fresh.clone());
      return fresh;
    }catch(err){
      const cached=await caches.match(e.request);
      return cached||caches.match('./index.html');
    }
  })());
});
