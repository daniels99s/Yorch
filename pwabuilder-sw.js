// This is the "Offline page" service worker

importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
  );
  
  
  
  // TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
  const offlineFallbackPage = "offline.html";
  
  
  const CACHE = "pwabuilder-page";
  
  var CACHENAME = "cachestore";
  var FILES = [
    "login.html",
    "index.html",
    "offline.html",
    "pwabuilder-sw.js",
    "manifest.webmanifest"
    
  ];
  
  self.addEventListener("install", function (event) {
    event.waitUntil(
      caches.open(CACHENAME).then(function (cache) {
        return cache.addAll(FILES);
      })
    );
  });
  
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });
  
  self.addEventListener("install", async (event) => {
    event.waitUntil(
      caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage))
    );
  });
  
  self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
      event.respondWith(
        (async () => {
          try {
            const preloadResp = await event.preloadResponse;
  
            if (preloadResp) {
              return preloadResp;
            }
  
            const networkResp = await fetch(event.request);
            return networkResp;
          } catch (error) {
            const cache = await caches.open(CACHE);
            const cachedResp = await cache.match(offlineFallbackPage);
            return cachedResp;
          }
        })()
      );
    }
  });
  