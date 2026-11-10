import { cpSync, mkdirSync } from 'node:fs';
mkdirSync('dist/assets/styles', { recursive: true });
cpSync('index.html', 'dist/index.html');
cpSync('LICENSE', 'dist/LICENSE');
cpSync('src/styles', 'dist/assets/styles', { recursive: true });
cpSync('public', 'dist', { recursive: true });
