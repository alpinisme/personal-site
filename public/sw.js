// The old Gatsby site registered an offline service worker at this path.
// Returning visitors fetch this file, clear the old caches, and stop using a worker.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(keys.map((key) => caches.delete(key)));
            await self.registration.unregister();
            const clients = await self.clients.matchAll({ type: 'window' });
            clients.forEach((client) => client.navigate(client.url));
        })(),
    );
});
