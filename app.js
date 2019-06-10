// 注册service worker
window.addEventListener('load', function () {
  navigator.serviceWorker.register('sw.js', {scope: '/'})
    .then(function (registration) {
      // 注册成功
      console.log('ServiceWorker 注册成功', registration.scope);
    })
    .catch(function (err) {

      // 注册失败:(
      console.error('ServiceWorker 注册失败', err);
    });

  // 断网处理
  window.addEventListener('offline', offlineEvent);

  // 网络恢复
  window.addEventListener('online', onlineEvent);

  navigator.serviceWorker.addEventListener('message', event => {
    console.log('这是来自Service Worker的message', event.data);
    messageFromServiceWorker(event.data)
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


// 消息通知
function notifyMe(title, desc) {
  // 先检查浏览器是否支持
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // 检查用户是否同意接受通知
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    new Notification(title, {
      body: desc,
      icon: 'http://blog.gdfengshuo.com/images/avatar.jpg',
      requireInteraction: true
    });
  }

  // 否则我们需要向用户获取权限
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // 如果用户同意，就可以向他们发送通知
      if (permission === "granted") {
        new Notification(title, {
          body: desc,
          icon: 'http://blog.gdfengshuo.com/images/avatar.jpg',
          requireInteraction: true
        });
      } else {
        console.warn('用户拒绝通知');
      }
    });
  }
}

// postMessage 页面发送给Service Worker
function postMessage(config) {
  const controller = navigator.serviceWorker.controller;

  if (!controller) {
    return;
  }

  controller.postMessage(config, []);
}


// 离线事件处理
function offlineEvent() {
  // 页面notification 提示
  notifyMe('掉线通知', '您现在已处于离线状态');

  // 页面向Service Worker post掉线message
  postMessage({
    type: 'offline',
    msg: '您掉线啦'
  })
}

// 上线事件处理
function onlineEvent() {
// 页面notification 提示
  notifyMe('网络恢复', '您的网络恢复啦');

  // 页面向Service Worker post掉线message
  postMessage({
    type: 'online',
    msg: '您的网络恢复啦'
  })
}

// 集中处理来自Service Worker的消息
function messageFromServiceWorker(message) {
  if (message.type === 'applyNotify') {
    Notification.requestPermission(function (permission) {
      // 如果用户同意，就可以向他们发送通知
      if (permission === "granted") {
        console.log('用户同意通知');
      } else {
        console.warn('用户拒绝通知');
      }
    });
  }
}
