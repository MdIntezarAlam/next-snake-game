module.exports = {
    globDirectory: 'out/',
    globPatterns: [
      '**/*.{html,js,css,png,jpg,jpeg,svg,woff,woff2,ttf,eot}'
    ],
    swDest: 'public/sw.js',
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: ({request}) => request.destination === 'image',
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 7 * 24 * 60 * 60 // 1 week
          }
        }
      },
      {
        urlPattern: ({request}) => request.destination === 'document',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages',
          expiration: {
            maxEntries: 20
          }
        }
      }
    ]
  };
  