// Service Worker Push & Local Notification Handler for Ravi’s Assistant

self.addEventListener('push', (event) => {
  let payload = {
    title: 'Ravi’s Assistant',
    body: 'You have an upcoming reminder in Ravi’s Assistant.',
    icon: '/logo.png',
    badge: '/pwa-192x192.png',
    tag: 'ravi-assistant-push',
    data: { tab: 'home', url: '/' },
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    } catch {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon || '/logo.png',
    badge: payload.badge || '/pwa-192x192.png',
    tag: payload.tag || `ravi-notif-${Date.now()}`,
    vibrate: [200, 100, 200],
    requireInteraction: Boolean(payload.requireInteraction),
    data: payload.data || { tab: 'home', url: '/' },
    actions: payload.actions || [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'SHOW_NOTIFICATION') return;

  const { title, options } = event.data.payload || {};
  if (!title) return;

  event.waitUntil(
    self.registration.showNotification(title, {
      icon: '/logo.png',
      badge: '/pwa-192x192.png',
      vibrate: [200, 100, 200],
      ...options,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetData = event.notification.data || {};
  const targetTab = targetData.tab || 'home';
  const targetUrl = targetData.url || `/?tab=${targetTab}`;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            tab: targetTab,
          });
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
