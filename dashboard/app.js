import {
  DEFAULT_LOCAL_STATE,
  buildSuggestionSet,
  createDiscoveryLinks,
  isSuggestionEligible,
  partnerSearchText,
  resolveTheme,
  stageForPartner
} from './logic.mjs';

const STORAGE_KEY = 'lunch-learn:workspace:v3';
const LEGACY_STORAGE_KEY = 'lunch-learn:workspace:v2';
const stages = ['Researching', 'Contacted', 'Scheduling', 'Confirmed'];
const templateFiles = [
  ['First outreach', '/templates/emails/first-outreach.md'],
  ['Follow-up', '/templates/emails/follow-up.md'],
  ['Confirmation', '/templates/emails/confirmation.md'],
  ['Internal announcement', '/templates/internal-comms/email-announcement.md'],
  ['Tomorrow reminder', '/templates/internal-comms/email-reminder-tomorrow.md'],
  ['Thank-you', '/templates/emails/thank-you.md']
];

const state = {
  data: { partners: [], events: [], outreach: [], suggestions: [] },
  local: normalizeLocalState(safeRead(STORAGE_KEY, safeRead(LEGACY_STORAGE_KEY, {}))),
  view: 'today',
  query: '',
  vertical: 'all',
  currentSuggestions: []
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  bindShell();
  applyTheme();
  try {
    const [partners, events, outreach, suggestions] = await Promise.all([
      fetch('/data/partner-database.json').then(okJson),
      fetch('/data/events-log.json').then(okJson),
      fetch('/data/outreach-tracker.json').then(okJson),
      fetch('/data/suggestions-log.json').then(okJson)
    ]);
    state.data = {
      partners: partners.partners || [],
      events: events.events || [],
      outreach: outreach.outreach || [],
      suggestions: suggestions.suggestions || []
    };
    populateVerticals();
    ensureSuggestionSet();
    render();
    setStatus(`${state.data.partners.length} partners and ${state.data.events.length} past sessions loaded.`);
  } catch (error) {
    setStatus('Program files could not be loaded.');
    document.querySelector('[data-main-view]').innerHTML = `<div class="loading">${escapeHtml(error.message)}</div>`;
  }
  refreshIcons();
}

function bindShell() {
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      state.view = button.dataset.view;
      render();
    });
  });
  document.querySelector('[data-search]').addEventListener('input', (event) => {
    state.query = event.target.value.toLowerCase();
    render();
  });
  document.querySelector('[data-vertical-filter]').addEventListener('change', (event) => {
    state.vertical = event.target.value;
    render();
  });
  document.querySelectorAll('[data-open-planner]').forEach((button) => {
    button.addEventListener('click', () => document.querySelector('[data-planner-dialog]').showModal());
  });
  document.querySelector('[data-planner-form]').addEventListener('submit', saveSession);
  document.querySelector('[data-close-template]').addEventListener('click', () => document.querySelector('[data-template-dialog]').close());
  document.querySelector('[data-copy-template]').addEventListener('click', copyTemplate);
  document.querySelector('[data-theme-toggle]').addEventListener('click', toggleTheme);
}

function render() {
  const main = document.querySelector('[data-main-view]');
  const views = {
    today: renderToday(),
    pipeline: `${heading('Outreach pipeline', 'Move each partner toward a useful, confirmed session.')} ${renderPipeline()}`,
    partners: `${heading('Partner directory', 'The working relationship list, searchable by vertical and next action.')} ${renderPartners()}`,
    contacts: `${heading('Contacts', 'Search every partner, review saved details, and launch discovery actions when contact data is still missing.')} ${renderContacts()}`,
    calendar: `${heading('Program calendar', 'Upcoming plans and the learning archive in one chronology.')} ${renderCalendar()}`,
    templates: `${heading('Working templates', 'Open, adapt, and copy the communication you need next.')} ${renderTemplates(true)}`,
    archive: `${heading('Session archive', 'Past Lunch & Learns and the learnings worth carrying forward.')} ${renderArchive()}`
  };
  main.innerHTML = views[state.view] || views.today;
  document.querySelector('[data-insight-rail]').innerHTML = renderInsights();
  syncActiveNav();
  bindDynamic();
  refreshIcons();
}

function renderToday() {
  return `${heading('Programming desk', 'The next session, outreach pipeline, and program balance.')} ${renderNext()} <div class="section-heading"><div><h2>Outreach pipeline</h2><p>Advance a partner when the next action is done.</p></div><button class="text-button" data-switch-pipeline>View full pipeline</button></div>${renderPipeline()}`;
}

function renderNext() {
  const sessions = [...state.local.sessions].sort((left, right) => left.date.localeCompare(right.date));
  const next = sessions.find((session) => session.date >= new Date().toISOString().slice(0, 10));
  if (!next) {
    return `<div class="no-next"><i data-lucide="calendar-plus"></i><h2>No next session scheduled</h2><p>The pipeline is active. Lock the next date when a partner is ready.</p><button class="primary" data-open-planner>Plan a session</button></div>`;
  }
  const date = new Date(`${next.date}T12:00:00`);
  const checks = ['Confirm speaker', 'Confirm logistics', 'Promote internally', 'Send invites', 'Prepare run of show'];
  return `<article class="next-up"><div class="next-main"><div class="date-block"><span>${date.toLocaleString('en-US', { month: 'short' })}</span><strong>${date.getDate()}</strong><span>${date.toLocaleString('en-US', { weekday: 'short' })}</span></div><div class="next-cell"><span>Partner / topic</span><strong>${escapeHtml(next.company)}</strong><small>${escapeHtml(next.topic)}</small></div><div class="next-cell"><span>Audience</span><strong>${escapeHtml(next.audience || 'All agency')}</strong><small>${escapeHtml(next.format)}</small></div><div class="next-cell"><span>Where</span><strong>${escapeHtml(next.location || 'TBD')}</strong><small>${escapeHtml(next.time || '12:00')}</small></div></div><div class="checklist">${checks.map((label, index) => `<label><input type="checkbox" data-check="${next.id}:${index}" ${state.local.checklist[`${next.id}:${index}`] ? 'checked' : ''}/>${label}</label>`).join('')}</div></article>`;
}

function renderPipeline() {
  const partners = filteredPartners().filter((partner) => stageFor(partner) !== 'Completed');
  return `<div class="pipeline">${stages.map((stage, index) => {
    const rows = partners.filter((partner) => stageFor(partner) === stage);
    return `<section class="stage"><header><strong>${stage}</strong><span>${rows.length}</span></header>${rows.length ? rows.map((partner) => `<article class="partner-row"><strong>${escapeHtml(partner.company)}</strong><span>${escapeHtml(partner.vertical)}</span><small>Next: ${escapeHtml(partner.nextAction || nextForStage(stage))}</small>${index < stages.length - 1 ? `<button title="Move to ${stages[index + 1]}" aria-label="Move ${escapeHtml(partner.company)} to ${stages[index + 1]}" data-advance="${partner.id}"><i data-lucide="arrow-right"></i></button>` : ''}</article>`).join('') : `<div class="partner-row"><small>No partners here yet.</small></div>`}</section>`;
  }).join('')}</div>`;
}

function renderPartners() {
  const rows = filteredPartners();
  return `<div class="table-wrap"><table class="directory"><thead><tr><th>Partner</th><th>Vertical</th><th>Status</th><th>Next action</th><th>Geography</th></tr></thead><tbody>${rows.map((partner) => `<tr><td><strong>${escapeHtml(partner.company)}</strong></td><td>${escapeHtml(partner.vertical)}</td><td><span class="status-tag">${escapeHtml(stageFor(partner))}</span></td><td>${escapeHtml(partner.nextAction || 'Reconnect when useful')}</td><td>${escapeHtml(partner.contact?.geography || '—')}</td></tr>`).join('')}</tbody></table></div>`;
}

function renderContacts() {
  const rows = filteredPartners();
  if (!rows.length) return `<div class="empty-state"><h2>No contacts match this search</h2><p>Try a different partner, vertical, geography, or target role.</p></div>`;
  return `<div class="contacts-grid">${rows.map((partner) => renderContactCard(partner)).join('')}</div>`;
}

function renderContactCard(partner) {
  const outreach = outreachForPartner(partner);
  const contact = partner.contact || {};
  const links = createDiscoveryLinks(partner, outreach);
  const knownDetails = [
    detailRow('Known name', contact.name),
    detailRow('Known title', contact.title),
    detailRow('Email', contact.email, contact.email ? `mailto:${contact.email}` : ''),
    detailRow('Phone', contact.phone, contact.phone ? `tel:${contact.phone}` : ''),
    detailRow('Geography', contact.geography),
    detailRow('Source', contact.source),
    detailRow('Known LinkedIn', contact.linkedinUrl, contact.linkedinUrl)
  ].filter(Boolean).join('');
  const targetRole = outreach?.targetContact?.title || partner.nextAction || 'Find the right speaker or partnership lead';
  return `<article class="contact-card"><div class="contact-header"><div><p class="eyebrow">${escapeHtml(partner.vertical)}</p><h3>${escapeHtml(partner.company)}</h3><p class="contact-subtitle">${escapeHtml(targetRole)}</p></div><span class="status-tag">${escapeHtml(stageFor(partner))}</span></div><section class="contact-section"><div class="section-kicker">Known contact details</div>${knownDetails ? `<dl class="contact-details">${knownDetails}</dl>` : `<p class="detail-empty">No confirmed contact details are saved yet.</p>`}</section><section class="contact-section"><div class="section-kicker">Discovery actions</div><p class="contact-note">These searches help find or verify the right contact from the existing partner list; they do not mean a contact is already confirmed here.</p><div class="discovery-actions">${Object.values(links).map((link) => `<a class="secondary-button" href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer noopener">${escapeHtml(link.label)}</a>`).join('')}</div></section></article>`;
}

function renderCalendar() {
  const upcoming = state.local.sessions.map((session) => ({ ...session, upcoming: true }));
  const past = state.data.events.map((event) => ({ ...event, topic: event.topic || event.description, upcoming: false }));
  return `<div class="calendar-grid">${[...upcoming, ...past].sort((left, right) => right.date.localeCompare(left.date)).map((event) => `<article class="calendar-card"><span class="status-tag">${event.upcoming ? 'Planned' : 'Completed'}</span><h3>${escapeHtml(event.company)}</h3><p><strong>${formatDate(event.date)}</strong><br>${escapeHtml(event.topic || '')}<br>${escapeHtml(event.format || '')}</p></article>`).join('')}</div>`;
}

function renderArchive() {
  return `<div class="archive-grid">${state.data.events.filter((event) => matches(`${event.company} ${event.topic}`)).map((event) => `<article class="archive-card"><h3>${escapeHtml(event.company)}</h3><p><strong>${formatDate(event.date)}</strong><br>${escapeHtml(event.topic)}<br>${event.actualAttendees || event.estimatedAttendees || '—'} attendees · ${event.feedback?.rating || '—'} rating</p>${event.feedback?.keyTakeaways?.length ? `<p>${event.feedback.keyTakeaways.map(escapeHtml).join(' · ')}</p>` : ''}</article>`).join('')}</div>`;
}

function renderTemplates(full = false) {
  return `<div class="template-grid ${full ? 'full' : ''}">${templateFiles.map(([label, path]) => `<button data-template="${path}" data-template-label="${label}">${escapeHtml(label)}</button>`).join('')}</div>`;
}

function renderInsights() {
  const counts = state.data.events.reduce((map, event) => {
    const partner = state.data.partners.find((item) => item.id === event.partnerId);
    const vertical = partner?.vertical || 'Other';
    map[vertical] = (map[vertical] || 0) + 1;
    return map;
  }, {});
  const max = Math.max(1, ...Object.values(counts));
  const suggestionMarkup = state.currentSuggestions.length
    ? state.currentSuggestions.map((item) => `<article class="suggestion"><div><strong>${escapeHtml(item.company)}</strong><p class="suggestion-meta">${escapeHtml(item.vertical)} · ${escapeHtml(item.stage)}${item.geography ? ` · ${escapeHtml(item.geography)}` : ''}</p><p>${escapeHtml(item.reasoning)}</p><small>Next: ${escapeHtml(item.nextAction)}</small></div><div class="suggestion-actions"><button class="text-button small" data-exclude-suggestion="${item.id}">Exclude</button></div></article>`).join('')
    : `<p class="contact-note">No new suggestions are available beyond completed, confirmed, or excluded partners in the current local data.</p>`;
  return `<section class="insight-card"><h2>Program balance</h2><div class="balance">${Object.entries(counts).sort((left, right) => right[1] - left[1]).slice(0, 7).map(([label, count]) => `<div class="balance-row"><span>${escapeHtml(label)}</span><div class="bar"><i style="width:${(count / max) * 100}%"></i></div><strong>${count}</strong></div>`).join('')}</div></section><section class="insight-card"><div class="insight-card-header"><div><h2>Suggested next partners</h2><p>Rotated locally from the current partner database. Refresh updates this list in the browser and does not write back to the source files.</p></div><button class="secondary-button compact" type="button" data-refresh-suggestions><i data-lucide="refresh-cw"></i>Refresh suggested partners</button></div>${suggestionMarkup}</section><section class="insight-card"><h2>Quick templates</h2>${renderTemplates()}</section>`;
}

function bindDynamic() {
  document.querySelectorAll('[data-advance]').forEach((button) => button.addEventListener('click', () => advancePartner(button.dataset.advance)));
  document.querySelectorAll('[data-check]').forEach((box) => box.addEventListener('change', () => {
    state.local.checklist[box.dataset.check] = box.checked;
    persist();
  }));
  document.querySelectorAll('[data-template]').forEach((button) => button.addEventListener('click', () => openTemplate(button.dataset.template, button.dataset.templateLabel)));
  document.querySelectorAll('[data-open-planner]').forEach((button) => button.addEventListener('click', () => document.querySelector('[data-planner-dialog]').showModal()));
  document.querySelector('[data-switch-pipeline]')?.addEventListener('click', () => {
    state.view = 'pipeline';
    render();
  });
  document.querySelector('[data-refresh-suggestions]')?.addEventListener('click', refreshSuggestions);
  document.querySelectorAll('[data-exclude-suggestion]').forEach((button) => button.addEventListener('click', () => excludeSuggestion(button.dataset.excludeSuggestion)));
}

function advancePartner(id) {
  const partner = state.data.partners.find((item) => item.id === id);
  const current = stageFor(partner);
  const next = stages[Math.min(stages.length - 1, stages.indexOf(current) + 1)];
  state.local.stages[id] = next;
  persist();
  ensureSuggestionSet(true);
  setStatus(`${partner.company} moved to ${next}.`);
  render();
}

function saveSession(event) {
  const submitter = event.submitter;
  if (submitter?.value === 'cancel') return;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const session = { id: `local-${Date.now()}`, ...data };
  state.local.sessions.push(session);
  persist();
  ensureSuggestionSet(true);
  event.currentTarget.reset();
  document.querySelector('[data-planner-dialog]').close();
  setStatus(`${session.company} session saved.`);
  state.view = 'today';
  render();
}

async function openTemplate(path, label) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error('Template unavailable');
    document.querySelector('[data-template-title]').textContent = label;
    document.querySelector('[data-template-content]').textContent = await response.text();
    document.querySelector('[data-template-dialog]').showModal();
  } catch (error) {
    setStatus(error.message);
  }
}

async function copyTemplate() {
  try {
    await navigator.clipboard.writeText(document.querySelector('[data-template-content]').textContent);
    setStatus('Template copied.');
  } catch {
    setStatus('Copy is unavailable in this browser.');
  }
}

function filteredPartners() {
  return state.data.partners.filter((partner) => (state.vertical === 'all' || partner.vertical === state.vertical) && matches(partnerSearchText(partner, outreachForPartner(partner))));
}

function refreshSuggestions() {
  state.local.suggestionRefreshCount += 1;
  state.currentSuggestions = buildSuggestionSet({
    partners: state.data.partners,
    events: state.data.events,
    local: state.local
  });
  state.local.suggestionSet = state.currentSuggestions;
  persist();
  setStatus(state.currentSuggestions.length ? 'Suggested partners refreshed from the existing database.' : 'No new suggestions are available in the current database.');
  render();
}

function excludeSuggestion(id) {
  if (!state.local.suggestionExclusions.includes(id)) state.local.suggestionExclusions.push(id);
  ensureSuggestionSet(true);
  const partner = state.data.partners.find((item) => item.id === id);
  setStatus(`${partner?.company || 'Partner'} excluded from local suggestions.`);
  render();
}

function ensureSuggestionSet(forceRefresh = false) {
  const persisted = Array.isArray(state.local.suggestionSet) ? state.local.suggestionSet.filter((item) => {
    const partner = state.data.partners.find((candidate) => candidate.id === item.id);
    return partner && isSuggestionEligible(partner, state.local);
  }) : [];
  if (!forceRefresh && persisted.length) {
    state.currentSuggestions = persisted;
    return;
  }
  state.currentSuggestions = buildSuggestionSet({
    partners: state.data.partners,
    events: state.data.events,
    local: state.local
  });
  state.local.suggestionSet = state.currentSuggestions;
  persist();
}

function toggleTheme() {
  state.local.theme = resolveTheme(state.local) === 'dark' ? 'light' : 'dark';
  persist();
  applyTheme();
  setStatus(`${resolveTheme(state.local) === 'dark' ? 'Dark' : 'Light'} theme enabled.`);
}

function applyTheme() {
  const theme = resolveTheme(state.local);
  document.documentElement.dataset.theme = theme;
  document.querySelector('[data-theme-label]').textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#10131a' : '#f4f1eb');
}

function syncActiveNav() {
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === state.view);
  });
}

function outreachForPartner(partner) {
  return state.data.outreach.find((item) => item.partnerId === partner.id);
}

function detailRow(label, value, href = '') {
  if (!value) return '';
  const body = href ? `<a href="${escapeHtml(href)}" target="${href.startsWith('mailto:') || href.startsWith('tel:') ? '_self' : '_blank'}" ${href.startsWith('mailto:') || href.startsWith('tel:') ? '' : 'rel="noreferrer noopener"'}>${escapeHtml(value)}</a>` : escapeHtml(value);
  return `<div class="detail-row"><dt>${escapeHtml(label)}</dt><dd>${body}</dd></div>`;
}

function normalizeLocalState(local) {
  return {
    ...DEFAULT_LOCAL_STATE,
    ...local,
    stages: local?.stages || {},
    sessions: Array.isArray(local?.sessions) ? local.sessions : [],
    checklist: local?.checklist || {},
    suggestionSet: Array.isArray(local?.suggestionSet) ? local.suggestionSet : [],
    suggestionExclusions: Array.isArray(local?.suggestionExclusions) ? local.suggestionExclusions : [],
    suggestionRefreshCount: Number.isFinite(local?.suggestionRefreshCount) ? local.suggestionRefreshCount : 0
  };
}

function stageFor(partner) {
  return stageForPartner(partner, state.local.stages);
}

function matches(text) {
  return !state.query || text.toLowerCase().includes(state.query);
}

function populateVerticals() {
  const select = document.querySelector('[data-vertical-filter]');
  select.innerHTML = '<option value="all">All verticals</option>';
  [...new Set(state.data.partners.map((partner) => partner.vertical))].sort().forEach((vertical) => {
    select.insertAdjacentHTML('beforeend', `<option>${escapeHtml(vertical)}</option>`);
  });
}

function heading(title, copy) {
  return `<div class="section-heading"><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(copy)}</p></div></div>`;
}

function nextForStage(stage) {
  return {
    Researching: 'Identify the right speaker',
    Contacted: 'Follow up on the invitation',
    Scheduling: 'Confirm date and format',
    Confirmed: 'Prepare the run of show'
  }[stage];
}

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function persist() {
  safeWrite(STORAGE_KEY, state.local);
}

function setStatus(message) {
  document.querySelector('[data-status]').textContent = message;
}

function safeRead(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function okJson(response) {
  if (!response.ok) throw new Error(`Data request failed (${response.status})`);
  return response.json();
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}
