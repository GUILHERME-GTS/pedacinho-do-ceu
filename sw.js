// ============================================================
//  sw.js — Service Worker (PWA)
//  Pedacinho do Céu
// ============================================================
//
//  Estratégia: Cache First para assets estáticos (CSS, JS, fontes)
//              Network First para dados do Firebase (automático via SDK)

const CACHE_NAME = 'pedacinho-v1';

const ASSETS_ESTATICOS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/pages/inicio.js',
  '/pages/tarefas.js',
  '/pages/mercado.js',
  '/pages/mais.js',
  '/firebase.js',
  '/manifest.json',
];

// Instalação: faz cache dos assets principais
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_ESTATICOS))
  );
  self.skipWaiting();
});

// Ativação: remove caches antigos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Cache First para assets, pass-through para Firebase
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Deixa o Firebase SDK lidar com suas próprias requisições
  if (url.hostname.includes('firebase') || url.hostname.includes('google')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
});

// Push Notifications (FCM via Firebase)
self.addEventListener('push', (e) => {
  const data = e.data?.json() ?? {};
  const titulo = data.title || 'Pedacinho do Céu';
  const opcoes = {
    body: data.body || 'Nova atualização na família!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'pedacinho-notif',
    renotify: true,
    data: { url: data.url || '/' },
  };
  e.waitUntil(self.registration.showNotification(titulo, opcoes));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(clients.openWindow(url));
});
