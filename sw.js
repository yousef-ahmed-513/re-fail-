const CACHE='twittey-menu-v3';
const FILES=['./','./index.html','./styles.css','./app.js','./manifest.json','./icon-192.png','./icon-512.png',
'./signature.jpg','./hot-coffee.jpg','./iced-coffee.jpg','./frappuccino.jpg','./milkshake.jpg','./matcha.jpg','./slush.jpg','./signature-iced.jpg','./mojito.jpg','./fresh-juice.jpg','./dessert.jpg','./extras.jpg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));