const CACHE='twittey-menu-v3';
const FILES=['./','./index.html','./styles.css','./app.js','./manifest.json','./assets/icons/icon-192.png','./assets/icons/icon-512.png',
'./assets/heroes/signature.jpg','./assets/heroes/hot-coffee.jpg','./assets/heroes/iced-coffee.jpg','./assets/heroes/frappuccino.jpg','./assets/heroes/milkshake.jpg','./assets/heroes/matcha.jpg','./assets/heroes/slush.jpg','./assets/heroes/signature-iced.jpg','./assets/heroes/mojito.jpg','./assets/heroes/fresh-juice.jpg','./assets/heroes/dessert.jpg','./assets/heroes/extras.jpg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  // Product images: cache-first with runtime caching (cached automatically the first time they load)
  if(url.pathname.includes('/assets/products/')){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const clone=res.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));return res}).catch(()=>caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
