'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "/assets/AssetManifest.json": "a2addee4f1584a4591ba171a1a9a6e95",
"/assets/assets/icon-jeeva-black.png": "c56dd4be3891052681c6bdf3e2efb663",
"/assets/assets/icon-null-image.png": "7c841a86b6aef15a58a65274ea9f7178",
"/assets/assets/pertutorial1.png": "562b160879e88a92555e537ce19e05a4",
"/assets/assets/pertutorial2.png": "043ec074ad1df695c0109d3af3f1ed95",
"/assets/assets/pertutorial3.png": "fbabb285a501bd932f556406daedbe81",
"/assets/assets/test.html": "d41d8cd98f00b204e9800998ecf8427e",
"/assets/assets/wifirssigood.png": "3522a421930bf8be46cfca041d67a91d",
"/assets/assets/wifirssigreat.png": "ede632f942c0c3554400f4c4b549164c",
"/assets/assets/wifirssiokay.png": "839b8c47c316ff82de664e8e2e37c0c3",
"/assets/assets/wifirssipoor.png": "6d810e038853c718d1ba491714d8e949",
"/assets/FontManifest.json": "18eda8e36dfa64f14878d07846d6e17f",
"/assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"/assets/LICENSE": "90837a660dafbd4c669ad5b381f0651e",
"/assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"/assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "3ca122272cfac33efb09d0717efde2fa",
"/assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "bdd8d75eb9e6832ccd3117e06c51f0d3",
"/assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "d21f791b837673851dd14f7c132ef32e",
"/helper.js": "f6e71b9c323568c5929f652acf5a6948",
"/index.html": "0020a978f4cbca7638adca33a324f62d",
"/main.dart.js": "149bfb270d6bbf9aaa3f64dcd766ab4f",
"/main.dart.js.deps": "3eb1e45bb9d9e87006d54b03ea856af7"
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
        return fetch(event.request);
      })
  );
});
