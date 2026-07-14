import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  buildSuggestionSet,
  createDiscoveryLinks,
  resolveTheme
} from '../dashboard/logic.mjs';

test('dashboard exposes the complete programming workflow', async () => {
  const [html, app] = await Promise.all([
    readFile(new URL('../dashboard/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../dashboard/app.js', import.meta.url), 'utf8')
  ]);
  for (const label of ['Today','Pipeline','Partners','Contacts','Calendar','Templates','Archive','Plan a session']) assert.match(html, new RegExp(label));
  for (const behavior of ['data-advance','data-check','data-template','data-theme-toggle','data-refresh-suggestions','renderContacts','refreshSuggestions','applyTheme','safeWrite']) assert.match(app, new RegExp(behavior));
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

test('discovery links are URL encoded and framed as searches', () => {
  const links = createDiscoveryLinks({
    company: 'OpenAI',
    contact: { name: 'Jane Doe', title: 'Agency Partnerships', geography: 'San Francisco' }
  });

  assert.equal(links.linkedin.label, 'LinkedIn people search');
  assert.equal(links.web.label, 'Focused web search');
  assert.equal(links.perplexity.label, 'Perplexity search');
  assert.match(links.linkedin.href, /linkedin\.com\/search\/results\/people/);
  assert.match(links.web.href, /google\.com\/search/);
  assert.match(links.perplexity.href, /perplexity\.ai\/search/);
  assert.ok(links.linkedin.href.includes('Jane%20Doe'));
  assert.ok(links.web.href.includes('Agency%20Partnerships'));
  assert.ok(!links.perplexity.href.includes(' '));
});

test('suggestion rotation prefers active partners, balances verticals, and respects exclusions', () => {
  const partners = [
    { id: 'a', company: 'Alpha', vertical: 'AI', status: 'Researching', nextAction: 'Find host', notes: '', contact: {} },
    { id: 'b', company: 'Beta', vertical: 'Streaming', status: 'Researching', nextAction: 'Find host', notes: '', contact: {} },
    { id: 'c', company: 'Gamma', vertical: 'Social', status: 'Researching', nextAction: 'Find host', notes: '', contact: {} },
    { id: 'd', company: 'Delta', vertical: 'Social', status: 'Completed', nextAction: '', notes: '', contact: {} },
    { id: 'e', company: 'Epsilon', vertical: 'Retail', status: 'Researching', nextAction: 'Invite speaker', notes: '', contact: {} }
  ];
  const events = [
    { partnerId: 'c', company: 'Gamma', date: '2026-01-10' },
    { partnerId: 'c', company: 'Gamma', date: '2026-02-10' },
    { partnerId: 'b', company: 'Beta', date: '2026-03-10' }
  ];

  const first = buildSuggestionSet({
    partners,
    events,
    local: { stages: { e: 'Confirmed' }, suggestionExclusions: ['c'], suggestionRefreshCount: 0 }
  });
  const second = buildSuggestionSet({
    partners,
    events,
    local: { stages: {}, suggestionExclusions: ['c'], suggestionRefreshCount: 1 }
  });

  assert.deepEqual(first.map((item) => item.company), ['Alpha', 'Beta']);
  assert.ok(!first.some((item) => item.company === 'Gamma'));
  assert.ok(!first.some((item) => item.company === 'Delta'));
  assert.ok(!first.some((item) => item.company === 'Epsilon'));
  assert.notDeepEqual(first.map((item) => item.company), second.map((item) => item.company));
});

test('theme resolution defaults to dark and preserves explicit preference', () => {
  assert.equal(resolveTheme({}), 'dark');
  assert.equal(resolveTheme({ theme: 'light' }), 'light');
  assert.equal(resolveTheme({ theme: 'dark' }), 'dark');
});
