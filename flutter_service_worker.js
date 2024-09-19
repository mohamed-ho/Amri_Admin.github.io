'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "45c13f08c23a7f5b1b397be4c22e85e5",
"assets/AssetManifest.bin.json": "13d9c882e8999be06e0c969926e5dbb9",
"assets/AssetManifest.json": "87d8bb5d382aeaac14d2d7aa457bf6bd",
"assets/assets/icons/camera.png": "d13861352e1a6fd7ec64e47b4f41a545",
"assets/assets/icons/correct.png": "bd86d48b277d3512d4cf04bc2845931a",
"assets/assets/icons/description.png": "eaf345256b728aa3706e5ea6686770fb",
"assets/assets/icons/error.png": "120cc167873e0b66cfa56c1d7d5431d6",
"assets/assets/icons/gallery.png": "d83d13064da1c6a6b673e1c8e510ef8e",
"assets/assets/icons/item.png": "e5fe42aa420eda910bc32702be671777",
"assets/assets/icons/measure.png": "c6e76b919d529d5f95021c2edbe548eb",
"assets/assets/icons/name.png": "c410583ccd2b5ec3a8b134d1bc7eee21",
"assets/assets/icons/number_of_jar.png": "aaeef0ec63fe62f91ed9c7f35990a226",
"assets/assets/icons/offer.png": "8cbc5739c817142d9827113390d9da95",
"assets/assets/icons/orders.png": "b195e32e9d98f8a9783b5dc4da1f8f8d",
"assets/assets/icons/price.png": "edc914abe07a19ff25cd362c57202c24",
"assets/assets/icons/save.png": "1a1c52f2d709f200bf20f6504ad69c82",
"assets/assets/icons/type.png": "1e025e6feb52fe9a81837d1de3395950",
"assets/assets/icons/upload.png": "1ee5a402179176c5f6b971a7bda03d81",
"assets/assets/icons/weight.png": "779236014bf61e9476c487af3d77747a",
"assets/assets/images/logo.png": "6b338a6fd4486331a1406492c9b5efda",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "589fe249ddfbf023a5d0f0b220243744",
"assets/lang/ar.json": "e79bb7ad4b4043badb1b81b11f25bbd7",
"assets/lang/en.json": "40f3ec5da3e2841ca0350739c0c3b90a",
"assets/lang%255Car.json": "e79bb7ad4b4043badb1b81b11f25bbd7",
"assets/lang%255Cen.json": "40f3ec5da3e2841ca0350739c0c3b90a",
"assets/NOTICES": "604db80d7e93c0d8164e819a8da81765",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "69221d072a8cf0795ebcbc4fc7eb7b2b",
"icons/android-chrome-192x192.png": "56a7dcbb7bfed61722e36530ef0297aa",
"icons/android-chrome-512x512.png": "f7585e7dfd7da6e080add1fdc03a8234",
"icons/apple-touch-icon.png": "2448861f2ff152493bff2874c36c6681",
"index.html": "5b82596473e1778886b7805b12d1d0ce",
"/": "5b82596473e1778886b7805b12d1d0ce",
"logo.png": "56a7dcbb7bfed61722e36530ef0297aa",
"main.dart.js": "8429fd8a2ae8fab073f3cb66b3166ab1",
"manifest.json": "c8f17a0b5bf4b12fae924f5a2ba4d28e",
"version.json": "deaf739732ab3eb5c868fb9722b2c342"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
