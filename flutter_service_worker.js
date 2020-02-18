'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "/assets\AssetManifest.json": "c0def54c56689e27c5ffe2f6bd47637d",
"/assets\assets\icon-jeeva-black.png": "c56dd4be3891052681c6bdf3e2efb663",
"/assets\assets\icon-null-image.png": "7c841a86b6aef15a58a65274ea9f7178",
"/assets\assets\test.html": "d41d8cd98f00b204e9800998ecf8427e",
"/assets\assets\wifirssigood.png": "3522a421930bf8be46cfca041d67a91d",
"/assets\assets\wifirssigreat.png": "ede632f942c0c3554400f4c4b549164c",
"/assets\assets\wifirssiokay.png": "839b8c47c316ff82de664e8e2e37c0c3",
"/assets\assets\wifirssipoor.png": "6d810e038853c718d1ba491714d8e949",
"/assets\FontManifest.json": "18eda8e36dfa64f14878d07846d6e17f",
"/assets\fonts\MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"/assets\LICENSE": "f373f6f16c73999cc74c8e0f7c411c30",
"/assets\packages\cupertino_icons\assets\CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"/assets\packages\font_awesome_flutter\lib\fonts\fa-brands-400.ttf": "3ca122272cfac33efb09d0717efde2fa",
"/assets\packages\font_awesome_flutter\lib\fonts\fa-regular-400.ttf": "bdd8d75eb9e6832ccd3117e06c51f0d3",
"/assets\packages\font_awesome_flutter\lib\fonts\fa-solid-900.ttf": "d21f791b837673851dd14f7c132ef32e",
"/helper.js": "9b3e366e0b9c8a639c0926558069e5b9",
"/index.html": "0020a978f4cbca7638adca33a324f62d",
"/main.dart.js": "8d8c38c44dc269f15d0de76ced29ebaa",
"/main.dart.js.deps": "af8a0d9838f74fbf9b9a486ee2385809"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request, {
          credentials: 'include'
        });
      })
  );
});
