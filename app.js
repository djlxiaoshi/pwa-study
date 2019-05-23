// 注册service worker
window.addEventListener('load', function () {
  navigator.serviceWorker.register('workbox.sw.js', {scope: '/'})
    .then(function (registration) {

      // 注册成功
      console.log('ServiceWorker 注册成功', registration.scope);
    })
    .catch(function (err) {

      // 注册失败:(
      console.log('ServiceWorker 注册失败', err);
    });
});


// 获取数据
const dom1 = document.getElementById('cacheFirst');

function cacheFirst() {
  axios.get('/cacheFirst').then(response => {
    dom1.innerText = response.data
  });
}

const dom2 = document.getElementById('networkOnly');

function networkOnly() {
  axios.get('/networkOnly').then(response => {
    dom2.innerText = response.data
  });
}

