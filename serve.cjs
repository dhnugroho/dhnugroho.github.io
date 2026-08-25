// Simple static file server — run with: node serve.cjs
const http = require('http');
const fs   = require('fs');
const path = require('path');

let port = parseInt(process.env.PORT || process.argv[2] || '3000', 10);
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

const server = http.createServer(function (req, res) {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);
  const ext      = path.extname(filePath).toLowerCase();
  const mime     = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + urlPath);
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

function startServer(currentPort) {
  server.listen(currentPort, function () {
    console.log('');
    console.log('  ✅  Local server running at:');
    console.log('  👉  http://localhost:' + currentPort);
    console.log('');
    console.log('  Press Ctrl+C to stop.');
    console.log('');
  });
}

server.on('error', function (err) {
  if (err.code === 'EADDRINUSE') {
    console.log(`  ⚠️  Port ${port} is currently in use. Trying port ${port + 1}...`);
    port += 1;
    startServer(port);
  } else {
    console.error('Server error:', err);
  }
});

startServer(port);
