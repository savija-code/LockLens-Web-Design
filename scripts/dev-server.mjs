import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

const root = resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json' };
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const securityHeaders = Object.fromEntries(config.headers[0].headers.map(header => [header.key, header.value]));

createServer(async (request, response) => {
  try {
    const path = resolve(root, '.' + decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname));
    if (path !== root && !path.startsWith(root + sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const target = (await stat(path).catch(() => null))?.isDirectory() ? resolve(path, 'index.html') : path;
    const data = await readFile(target);
    response.writeHead(200, { ...securityHeaders, 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(data);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(5173, '127.0.0.1', () => {
  process.stdout.write('LockLens preview: http://localhost:5173\n');
});
