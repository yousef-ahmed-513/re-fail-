const CACHE='twittey-menu-v2';
const FILES=['./','./index.html','./styles.css','./app.js','./manifest.json','./assets/icons/icon-192.png','./assets/icons/icon-512.png',
'./assets/heroes/signature.jpg','./assets/heroes/hot-coffee.jpg','./assets/heroes/iced-coffee.jpg','./assets/heroes/frappuccino.jpg','./assets/heroes/milkshake.jpg','./assets/heroes/matcha.jpg','./assets/heroes/slush.jpg','./assets/heroes/signature-iced.jpg','./assets/heroes/mojito.jpg','./assets/heroes/fresh-juice.jpg','./assets/heroes/dessert.jpg','./assets/heroes/extras.jpg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));