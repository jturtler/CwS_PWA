var dataCacheName = 'cws-pwa-data-v1.002';
var cacheName = 'cws-pwa-v1.023';
var filesToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",

  "./images/icons/icon-128x128.png",
  "./images/icons/icon-144x144.png",
  "./images/icons/icon-152x152.png",
  "./images/icons/icon-192x192.png",
  "./images/icons/icon-256x256.png",
  "./images/searchByWalkIn.jpg",
  "./images/searchByVoucher.jpg",
  "./images/searchByPhone.jpg",
  "./images/listInQueue.jpg",
  "./images/loader-bar.gif",
  "./images/loader-bigCircle.gif",
  "./images/loading_big_black.gif",
  "./images/reload.png",

  "./styles/materialize.css",
  "./styles/style.css",

  "./scripts/jquery-3.3.1.js",
  "./scripts/materialize.js",  
  "./scripts/util.js",
  "./scripts/app.js",
  "./scripts/cwsRender.js",
  "./scripts/testSection.js",
  "./scripts/dataManager.js",
  "./scripts/formUtil.js",

  "./data/dcNew1.json",
  "./data/dsConfig.json",
  "./data/dsConfig2.json" 
 ];

 var _serverUrl = location.protocol + '//' + location.host;

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});


self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);

  // A. If FETCH url is part of the web service ones, cache it...
  var wsUrl = _serverUrl + '/eRefWSTest/api';
  if (e.request.url.indexOf(wsUrl) > -1) 
  {
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) 
      {
        //console.log( '-- fetching for network: ' + e.request.url );        
        return fetch(e.request)
        //.then( handleErrors )
        .then( function( response ) 
        {
          //console.log( '-- network got and cached' );
          cache.put(e.request.url, response.clone());
          return response;
        }).catch( function( error ) {
          console.log( '- - - - Catched.. Error case? ' );
          console.log( error );
        });   // end of fetch

      })  // end of 'caches.open'
    );  // end of e.respondWith

  } 
  else 
  {
    // B. Normal Resource related Fetches...
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
  // TODO: on 'fetch(e.request)' right above, add loading message progress show...
});


function handleErrors(response) {
  if (!response.ok) {

      console.log( '-- Failed On Response Result ' );

      throw Error(response.statusText);
  }
  return response;
}
