/* 艾尔达大陆·群雄割据 v42 Service Worker
   仅 http(s) 生效；file:// 下浏览器不会注册 SW，属预期。
   缓存策略：install 预缓存核心+分片（静态列表），fetch 命中缓存即返回。 */
const CACHE = 'elda-v42-v1';
const ASSETS = [
  './game.html',
  './game_chunked.html',
  './manifest.webmanifest',
  './chunks/NODE_MAP.js',
  './chunks/story_core.js',
  './chunks/story_origin.js',
  './chunks/story_academy.js',
  './chunks/story_mainland.js',
  './chunks/story_travel.js',
  './chunks/story_seal.js',
  './chunks/story_system.js',
  './chunks/story_misc.js'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return c.addAll(ASSETS).catch(function(){});
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  const url = new URL(e.request.url);
  if(url.origin !== location.origin) return;
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      if(hit) return hit;
      return fetch(e.request).then(function(res){
        if(res && res.ok && url.pathname.indexOf('chunks/') !== -1){
          const clone = res.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        }
        return res;
      }).catch(function(){ return new Response('离线且未缓存：' + url.pathname, {status: 503}); });
    })
  );
});
