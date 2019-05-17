// 注册service worker
window.addEventListener('load', function () {
  navigator.serviceWorker.register('/sw.js', {scope: '/'})
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
const dom1 = document.getElementById('change');


// axios.get('/nochange').then(result => {
//   console.log('post', result);
// });

function cacheFirst() {
  axios.get('/data').then(response => {
    dom1.innerText = response.data
  });
}

const dom2 = document.getElementById('nochange');

function networkOnly() {
  axios.get('/nochange').then(response => {
    dom2.innerText = response.data
  });
}

