const CACHE_NAME = 'coffee-traceability-v2';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

// インストール時にキャッシュを作成
self.addEventListener('install', (event) => {
  // 新しいSWを即時有効化
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ時にキャッシュを使用
self.addEventListener('fetch', (event) => {
  // SPAのナビゲーションはネットワーク優先（更新反映のため）
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', responseToCache));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがあればそれを返す
        if (response) {
          return response;
        }
        // なければネットワークから取得
        return fetch(event.request)
          .then((response) => {
            // 有効なレスポンスでなければそのまま返す
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // レスポンスをクローンしてキャッシュに保存
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
      .catch(() => {
        // オフライン時のフォールバック
        return caches.match('/');
      })
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    self.clients.claim().then(() =>
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }))
  );
});

