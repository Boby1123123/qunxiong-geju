/* 艾尔达大陆·群雄割据 Service Worker（v99-CHUNKMANIFEST 版）
   仅 http(s) 生效；file:// 下浏览器不会注册 SW，属预期。
   修复背景（2026-09-13 玩家反馈"捏完人点开始游戏没反应"）：
     旧版策略 = cache-first + 缓存名固定（elda-v42-v1）+ chunk 文件名不带版本号，
     导致发版后浏览器仍命中旧缓存 chunk，与新 index.html 混版运行，建号流程异常。
   修复双保险（v98 起）：
     ① sw.js = network-first（联网一律取最新并回写缓存，断网/离线回退缓存）；
     ② chunks/ 下 story_*.js / v62_origin.*.js 文件名改为内容哈希版
        （elda chunks 自动生成 <基名>.<sha1前8>.js），内容变则文件名变，
        旧缓存天然永不命中 —— 即使将来 SW 策略被改回 cache-first 也不会混版。
   v99 预缓存升级（2026-09-13 性能优化）：
     新增 chunks.json 清单（tools\\gen_chunk_manifest.py 生成，随构建更新），
     install 阶段把全部 23 个分片一次性预缓存，二次进入接近秒开；
     预缓存失败逐片 catch 不阻塞安装，断网仍可玩已缓存分片。
   v100 性能批（2026-09-13 perf3-6）：
     writePar 单次 innerHTML（省 2 次 DOM 写）· v93 aside/guide/foot 内容指纹去重（5s 轮询幂等跳过 DOM 写）
     · 收容循环自停（3s 兜底 30s 停）——引擎内联已更新，bump 缓存名强制刷新。
   CACHE 名 = 'elda-qxg-v100-h1'：每次发版如需强制清缓存，手动 bump 此名即可。 */
const CACHE = 'elda-qxg-v100-h1';
const CORE = [
  './index.html',
  './game.html',
  './game_chunked.html',
  './manifest.webmanifest',
  './chunks.json'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return c.addAll(CORE).catch(function(){});
    }).then(function(){
      // 预缓存 chunks.json 清单中的全部分片（哈希名，版本变化自动换新）
      return fetch('chunks.json').then(function(r){ return r.json(); }).then(function(m){
        var files = (m && Array.isArray(m.files)) ? m.files : [];
        if(!files.length) return;
        return caches.open(CACHE).then(function(c){
          return Promise.all(files.map(function(f){
            return c.add('./' + f).catch(function(){});
          }));
        });
      }).catch(function(){});
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
