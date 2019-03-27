// service worker 逻辑

// 首次打开页面 -> 注册service worker -> 获取当地位置 -> 将卡片信息存入indexedDB -> 追加新信息 -> 将卡片信息存入indexedDB -> 
// 再次打开页面 -> fetch请求 -> 获取App Shell
//                           -> 检查网络情况 -> 离线：展示indexDB中的卡片信息
//                                           -> 在线：先展示indexDB，再更新

const CACHENAME = 'weather-' + 'v2';
const fileToCache = [
    '/',
    '/index.html',
    '/main.js',
    '/reset.css',
    '/style.css',
    '/images/icons/delete.svg',
    '/images/icons/plus.svg',
    '/images/partly-cloudy.png',
    '/images/wind.png'
];

self.addEventListener('install', e => {
    console.log('Service Worker Install');
    e.waitUntil(
        caches.open(CACHENAME).then(function (cache) {
            self.skipWaiting();
            console.log('Service Worker Caching');
            return cache.addAll(fileToCache);
        })
    )
})

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(function (res) {
            // console.log(e.request, res);
            if (res) {
                if (e.request.url.indexOf(self.location.host) !== -1) {
                    // 同源
                    return res;
                } else {
                    console.log(res);
                    return res;
                }
            }
            if (e.request.url.indexOf('https://pv.sohu.com/cityjson?ie=utf-8') !== -1) {
                return fetch(e.request);
            }
            return fetch(e.request).then((response) => {
                let responeClone = response.clone();
                console.log(response);
                let responeClone_2 = response.clone();
                responeClone_2.json().then(data => {
                    console.log(data);
                    caches.open(CACHENAME).then(cache => {
                        cache.put(e.request, responeClone);
                    })
                }).catch(e => {
                    console.log(e);
                })
                return response;
            }).catch(e => {
                console.log(e);
            })
        })
    )
})

self.addEventListener('activate', function (event) {

    var cacheWhitelist = ['weather-v1'];

    event.waitUntil(
        // 遍历 caches 里所有缓存的 keys 值
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.includes(cacheName)) {
                        // 删除 v1 版本缓存的文件
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});