/* 艾尔达大陆·群雄割据 Service Worker（v98 SW 修复版）
   仅 http(s) 生效；file:// 下浏览器不会注册 SW，属预期。
   修复背景（2026-09-13 v98 上线后玩家反馈"捏完人点开始游戏没反应"）：
     旧版策略 = cache-first + 缓存名固定（elda-v42-v1）+ chunk 文件名不带版本号，
     导致发版后浏览器仍命中旧缓存 chunk，与新 index.html 混版运行，建号流程异常。
   新策略 = network-first + 缓存名升版（activate 清理旧缓存）：
     联网一律取最新并回写缓存（每次发版自动生效），断网/离线回退缓存。
   CACHE 名 = 'elda-qxg-v98-v1'：每次发版如需强制清缓存，手动 bump 此名即可。 */
const CACHE = 'elda-qxg-v98-v1';
const CORE = [
  './index.html',
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
  './chunks/story_misc.js',
  './chunks/v62_origin.js'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return c.addAll(CORE).catch(function(){});
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
    fetch(e.request).then(function(res){
      if(res && res.ok){
        const clone = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
      }
      return res;
    }).catch(function(){
      return caches.match(e.request).then(function(hit){
        if(hit) return hit;
        return new Response('离线且未缓存：' + url.pathname, {status: 503});
      });
    })
  );
});
