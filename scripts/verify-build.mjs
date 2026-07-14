import { access, readFile } from 'node:fs/promises';

await Promise.all([
  access(new URL('../dashboard/index.html', import.meta.url)),
  access(new URL('../dashboard/styles.css', import.meta.url)),
  access(new URL('../dashboard/app.js', import.meta.url)),
  access(new URL('../dashboard/logic.mjs', import.meta.url)),
  access(new URL('../dashboard/assets/lunch-learn-session.png', import.meta.url))
]);
JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
console.log('Static Lunch & Learn build is ready.');
