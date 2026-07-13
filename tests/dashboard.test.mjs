import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('dashboard exposes the complete programming workflow', async () => {
  const [html, app] = await Promise.all([
    readFile(new URL('../dashboard/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dashboard/app.js', import.meta.url), 'utf8')
  ]);
  for (const label of ['Today','Pipeline','Partners','Calendar','Templates','Archive','Plan a session']) assert.match(html, new RegExp(label));
  for (const behavior of ['data-advance','data-check','data-template','saveSession','safeWrite']) assert.match(app, new RegExp(behavior));
  assert.doesNotMatch(html, /pricing|sign up|marketing platform/i);
});

test('source data retains partner, outreach, event, and suggestion records', async () => {
  const [partners, outreach, events, suggestions] = await Promise.all(['partner-database','outreach-tracker','events-log','suggestions-log'].map((name)=>readFile(new URL(`../data/${name}.json`,import.meta.url),'utf8').then(JSON.parse)));
  assert.ok(partners.partners.length >= 20);
  assert.ok(outreach.outreach.length >= 3);
  assert.ok(events.events.length >= 10);
  assert.ok(suggestions.suggestions.length >= 2);
  assert.ok(partners.partners.every((partner)=>partner.company && partner.vertical));
});

test('Vercel serves the dashboard at the project root', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.deepEqual(config.rewrites[0], { source: '/', destination: '/dashboard/index.html' });
  assert.equal(config.outputDirectory, '.');
});
