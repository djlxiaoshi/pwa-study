const CACHE_NAME = 'cache_v' + 1.0;
const CACHE_LIST = [
  '/',
  '/index.html',
  '/main.css',
  '/app.js',
  '/icon.png',
  '/manifest.json',
  '/favicon.ico',
  '/axios.min.js'
];

function preCache() {
  // 安装成功后操作 CacheStorage 缓存，使用之前需要先通过 caches.open() 打开对应缓存空间。
  return caches.open(CACHE_NAME).then(cache => {
    // 通过 cache 缓存对象的 addAll 方法添加 precache 缓存
    return cache.addAll(CACHE_LIST);
  })
}

// 安装
self.addEventListener('install', function (event) {
  // 表示 只有waitUntil里面的promise都执行完毕后才会，安装成功
  event.waitUntil(
    // 如果上一个serviceWorker不销毁 需要手动skipWaiting()
    Promise.all([
      preCache(),
      self.skipWaiting()
    ])

  );
});

// 删除过期缓存
function clearCache() {
  return caches.keys().then(keys => {
    return Promise.all(keys.map(key => {
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }
    }))
  })
}

// 激活
self.addEventListener('activate', function (e) {
  e.waitUntil(
    Promise.all([
      clearCache(),
      self.clients.claim()
    ])
  );
});


self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(function (response) {

        // network only
        if (/\/networkOnly\/|\/networkOnly\b/.test(event.request.url)) {
          return fetch(event.request).then(function(response) {
            console.log('From Network', event.request.url, response);
            return response;
          });
        }

        // cache first
        // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
        if (response) {
          console.log('From Service Worker', event.request.url, response);
          return response;
        } else {
          return fetch(event.request).then(function(response) {
            console.log('From Network', event.request.url, response);
            // 由于响应是一个JavaScript或者HTML，会认为这个响应为一个流，而流是只能被消费一次的，所以只能被读一次
            // 第二次就会报错 参考文章https://jakearchibald.com/2014/reading-responses/
            cache.put(event.request, response.clone());
            return response;
          }).catch(function(error) {
            console.error('请求失败', error);
            throw error;
          });
        }
      });
    })
  );
});

self.addEventListener('message', function(event) {
  console.log('这是来自页面的message消息', event.data);

  sendNotify(event.data.title, {
    body: event.data.msg
  }, event);

  postMessage({
    type: '',
    msg: '我是Service Worker'
  })
});

function postMessage(data) {
  self.clients.matchAll().then(clientList => {
    clientList.forEach(client => {
      // 当前激活的窗口发送消息
      if (client.visibilityState === 'visible') {
        client.postMessage(data);
      }
    })
  })
}

// 发送 Notification 通知
function sendNotify(title, options={}, event) {

  if (Notification.permission !== 'granted') {
    console.log('Not granted Notification permission.');

    postMessage({
      type: 'applyNotify'
    })
  } else {

    // 在Service Worker 中 触发一条通知
    self.registration.showNotification(title || 'Hi：', Object.assign({
      body: '这是一个通知示例',
      icon: '/icon.png',
      requireInteraction: true
    }, options));
  }

}
