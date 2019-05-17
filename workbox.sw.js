importScripts('./workbox.js');

const CACHE_LIST = [
  '/',
  '/index.html',
  '/main.css',
  '/app.js',
  '/icon.png',
  '/manifest.json',
  '/favicon.ico'
];

if (workbox) {
  console.log(`Yay! workbox is loaded 🎉`);
}
else {
  console.log(`Boo! workbox didn't load 😬`);
}

workbox.precaching.precacheAndRoute(CACHE_LIST);

workbox.routing.registerRoute(
  /data/, // 匹配的路由
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  /nochange/, // 匹配的路由
  workbox.strategies.networkOnly()
);
