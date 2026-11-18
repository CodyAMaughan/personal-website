// claude-runner service worker scaffold.
//
// Phase 2 minimal version: install + activate cleanly so the PWA can be
// installed to the Android home screen. No offline caching, no Web Push
// yet — those land in Phase 4 polish.

const CACHE_NAME = 'claude-runner-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Pass-through fetch handler — required for the page to be installable
// even though we don't cache anything yet.
self.addEventListener('fetch', () => {
  // intentionally empty — let the network handle it
});

// Web Push handler stub — Phase 4 will plug into the backend's
// `subscribe_push` message and fire notifications when long agent
// tasks complete in the background.
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const payload = (() => {
    try {
      return event.data.json();
    } catch {
      return { title: 'claude-runner', body: event.data.text() };
    }
  })();
  event.waitUntil(
    self.registration.showNotification(payload.title || 'claude-runner', {
      body: payload.body || '',
      icon: '/favicon.svg',
      tag: 'claude-runner-task',
    }),
  );
});
