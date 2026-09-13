/* Service worker del Planificador SST.
   Guarda la app para que funcione sin conexión. Los datos del usuario NO pasan por aquí:
   viven en localStorage, en el dispositivo. */
var CACHE = "planificador-sst-v1";
var ASSETS = ["./", "./index.html"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Red primero: si hay internet se toma la versión más reciente (así ves las mejoras
   al instante) y se guarda una copia; sin internet se sirve la copia guardada. */
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;

  /* Sólo se toca lo que sirve este mismo sitio. Antes se guardaba en caché la respuesta de
     cualquier GET, incluida la de la base de datos: aunque va cifrada, no tiene por qué
     quedar copiada en el disco del dispositivo. Las peticiones a la nube pasan de largo. */
  var url;
  try { url = new URL(e.request.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); }).catch(function () {});
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (hit) {
        return hit || caches.match("./index.html");
      });
    })
  );
});
