// Service Worker implementation for caching static data
// of type *.htm, *.js', *.css', *.ico'
// bot not *.json or other services

const cacheName = 'pwa-v2';

const cacheFileTypes = new Set([
  'htm', 'js', 'css', 'ico', 'pdf', 'jpg'
]);

const cachePreloadFiles = [
  'advent2022.css',
  'advent2022.js'
];


self.addEventListener('install', (evt) => {
  console.log('sw:install...');
  evt.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log('sw:delete...');
        cache.delete('/favicon.ico');
        return (cache);
      })
      .then(cache => {
        console.log('sw:add...');
        return (cache.addAll(cachePreloadFiles));
      })
  );
});


self.addEventListener('activate', (_evt) => {
  console.log('sw:activated.');
  self.clients.claim();
});


// Try for a cached ressource and add response to the Cache.
async function tryAddCache(req) {
  console.log('try:', req.url);
  let response = await caches.match(req);

  if (response) {
    console.log('sw:fromCache', req.url);
  } else {
    console.log('sw:fetch', req.url);
    response = await fetch(req);
    const cl = response.clone();
    caches.open(cacheName)
      .then(cache => {
        console.log('sw:toCache', req.url);
        cache.put(req, cl);
      });
  }
  return response;
};


self.addEventListener('fetch', (evt) => {
  const req = evt.request;
  const url = new URL(evt.request.url);
  const path = url.pathname;
  console.log('sw:request', req.mode, path);

  const pos = path.lastIndexOf('.');

  // if (path.includes('22serviceworker')) { return; }

  // caching allowed ?
  if ((pos >= 0) && (cacheFileTypes.has(path.substring(pos + 1).toLowerCase()))) {
    const res = tryAddCache(req);
    console.log('sw:response', res);
    evt.respondWith(res);

  } else {
    // default fetch procedure...
  }
});

// End.
