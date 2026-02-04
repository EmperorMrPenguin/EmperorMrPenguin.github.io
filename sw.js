self.addEventListener('install', event => {
  console.log('Service Worker installed');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated');
});

self.addEventListener('fetch', event => {
  // zatím nic – jen nutné minimum
});

// Vůbec nemám tušení co tohle dělá