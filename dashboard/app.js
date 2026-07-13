const STORAGE_KEY = 'lunch-learn:workspace:v2';
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
  local: safeRead(STORAGE_KEY, { stages: {}, sessions: [], checklist: {} }),
  view: 'today', query: '', vertical: 'all'
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  bindShell();
  try {
    const [partners, events, outreach, suggestions] = await Promise.all([
      fetch('/data/partner-database.json').then(okJson), fetch('/data/events-log.json').then(okJson),
      fetch('/data/outreach-tracker.json').then(okJson), fetch('/data/suggestions-log.json').then(okJson)
    ]);
    state.data = { partners: partners.partners || [], events: events.events || [], outreach: outreach.outreach || [], suggestions: suggestions.suggestions || [] };
    populateVerticals(); render(); setStatus(`${state.data.partners.length} partners and ${state.data.events.length} past sessions loaded.`);
  } catch (error) { setStatus('Program files could not be loaded.'); document.querySelector('[data-main-view]').innerHTML = `<div class="loading">${escapeHtml(error.message)}</div>`; }
  refreshIcons();
}

function bindShell() {
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => { state.view = button.dataset.view; document.querySelectorAll('[data-view]').forEach((item) => item.classList.toggle('active', item === button)); render(); }));
  document.querySelector('[data-search]').addEventListener('input', (event) => { state.query = event.target.value.toLowerCase(); render(); });
  document.querySelector('[data-vertical-filter]').addEventListener('change', (event) => { state.vertical = event.target.value; render(); });
  document.querySelectorAll('[data-open-planner]').forEach((button) => button.addEventListener('click', () => document.querySelector('[data-planner-dialog]').showModal()));
  document.querySelector('[data-planner-form]').addEventListener('submit', saveSession);
  document.querySelector('[data-close-template]').addEventListener('click', () => document.querySelector('[data-template-dialog]').close());
  document.querySelector('[data-copy-template]').addEventListener('click', copyTemplate);
}

function render() {
  const main = document.querySelector('[data-main-view]');
  if (state.view === 'today') main.innerHTML = renderToday();
  if (state.view === 'pipeline') main.innerHTML = `${heading('Outreach pipeline', 'Move each partner toward a useful, confirmed session.')} ${renderPipeline()}`;
  if (state.view === 'partners') main.innerHTML = `${heading('Partner directory', 'The working relationship list, searchable by vertical and next action.')} ${renderPartners()}`;
  if (state.view === 'calendar') main.innerHTML = `${heading('Program calendar', 'Upcoming plans and the learning archive in one chronology.')} ${renderCalendar()}`;
  if (state.view === 'templates') main.innerHTML = `${heading('Working templates', 'Open, adapt, and copy the communication you need next.')} ${renderTemplates(true)}`;
  if (state.view === 'archive') main.innerHTML = `${heading('Session archive', 'Past Lunch & Learns and the learnings worth carrying forward.')} ${renderArchive()}`;
  document.querySelector('[data-insight-rail]').innerHTML = renderInsights();
  bindDynamic(); refreshIcons();
}

function renderToday() {
  return `${heading('Programming desk', 'The next session, outreach pipeline, and program balance.')} ${renderNext()} <div class="section-heading"><div><h2>Outreach pipeline</h2><p>Advance a partner when the next action is done.</p></div><button class="text-button" data-switch-pipeline>View full pipeline →</button></div>${renderPipeline()}`;
}

function renderNext() {
  const sessions = [...state.local.sessions].sort((a, b) => a.date.localeCompare(b.date));
  const next = sessions.find((session) => session.date >= new Date().toISOString().slice(0, 10));
  if (!next) return `<div class="no-next"><i data-lucide="calendar-plus"></i><h2>No next session scheduled</h2><p>The pipeline is active. Lock the next date when a partner is ready.</p><button class="primary" data-open-planner>Plan a session</button></div>`;
  const date = new Date(`${next.date}T12:00:00`);
  const checks = ['Confirm speaker', 'Confirm logistics', 'Promote internally', 'Send invites', 'Prepare run of show'];
  return `<article class="next-up"><div class="next-main"><div class="date-block"><span>${date.toLocaleString('en-US',{month:'short'})}</span><strong>${date.getDate()}</strong><span>${date.toLocaleString('en-US',{weekday:'short'})}</span></div><div class="next-cell"><span>Partner / topic</span><strong>${escapeHtml(next.company)}</strong><small>${escapeHtml(next.topic)}</small></div><div class="next-cell"><span>Audience</span><strong>${escapeHtml(next.audience || 'All agency')}</strong><small>${escapeHtml(next.format)}</small></div><div class="next-cell"><span>Where</span><strong>${escapeHtml(next.location || 'TBD')}</strong><small>${escapeHtml(next.time || '12:00')}</small></div></div><div class="checklist">${checks.map((label, index) => `<label><input type="checkbox" data-check="${next.id}:${index}" ${state.local.checklist[`${next.id}:${index}`] ? 'checked' : ''}/>${label}</label>`).join('')}</div></article>`;
}

function renderPipeline() {
  const partners = filteredPartners().filter((partner) => stageFor(partner) !== 'Completed');
  return `<div class="pipeline">${stages.map((stage, index) => { const rows = partners.filter((partner) => stageFor(partner) === stage); return `<section class="stage"><header><strong>${stage}</strong><span>${rows.length}</span></header>${rows.length ? rows.map((partner) => `<article class="partner-row"><strong>${escapeHtml(partner.company)}</strong><span>${escapeHtml(partner.vertical)}</span><small>Next: ${escapeHtml(partner.nextAction || nextForStage(stage))}</small>${index < stages.length - 1 ? `<button title="Move to ${stages[index+1]}" aria-label="Move ${escapeHtml(partner.company)} to ${stages[index+1]}" data-advance="${partner.id}"><i data-lucide="arrow-right"></i></button>` : ''}</article>`).join('') : `<div class="partner-row"><small>No partners here yet.</small></div>`}</section>`; }).join('')}</div>`;
}

function renderPartners() {
  const rows = filteredPartners();
  return `<table class="directory"><thead><tr><th>Partner</th><th>Vertical</th><th>Status</th><th>Next action</th><th>Geography</th></tr></thead><tbody>${rows.map((partner) => `<tr><td><strong>${escapeHtml(partner.company)}</strong></td><td>${escapeHtml(partner.vertical)}</td><td><span class="status-tag">${escapeHtml(stageFor(partner))}</span></td><td>${escapeHtml(partner.nextAction || 'Reconnect when useful')}</td><td>${escapeHtml(partner.contact?.geography || '—')}</td></tr>`).join('')}</tbody></table>`;
}

function renderCalendar() {
  const upcoming = state.local.sessions.map((session) => ({...session, upcoming:true}));
  const past = state.data.events.map((event) => ({...event, topic:event.topic || event.description, upcoming:false}));
  return `<div class="calendar-grid">${[...upcoming,...past].sort((a,b)=>b.date.localeCompare(a.date)).map((event) => `<article class="calendar-card"><span class="status-tag">${event.upcoming ? 'Planned' : 'Completed'}</span><h3>${escapeHtml(event.company)}</h3><p><strong>${formatDate(event.date)}</strong><br>${escapeHtml(event.topic || '')}<br>${escapeHtml(event.format || '')}</p></article>`).join('')}</div>`;
}

function renderArchive() {
  return `<div class="archive-grid">${state.data.events.filter((event) => matches(`${event.company} ${event.topic}`)).map((event) => `<article class="archive-card"><h3>${escapeHtml(event.company)}</h3><p><strong>${formatDate(event.date)}</strong><br>${escapeHtml(event.topic)}<br>${event.actualAttendees || event.estimatedAttendees || '—'} attendees · ${event.feedback?.rating || '—'} rating</p>${event.feedback?.keyTakeaways?.length ? `<p>${event.feedback.keyTakeaways.map(escapeHtml).join(' · ')}</p>` : ''}</article>`).join('')}</div>`;
}

function renderTemplates(full = false) {
  return `<div class="template-grid ${full ? 'full' : ''}">${templateFiles.map(([label,path]) => `<button data-template="${path}" data-template-label="${label}">${escapeHtml(label)}</button>`).join('')}</div>`;
}

function renderInsights() {
  const counts = state.data.events.reduce((map,event)=>{ const partner=state.data.partners.find((item)=>item.id===event.partnerId); const vertical=partner?.vertical || 'Other'; map[vertical]=(map[vertical]||0)+1; return map; },{});
  const max = Math.max(1,...Object.values(counts));
  const suggestions = state.data.suggestions.flatMap((item)=>item.suggestions || []).filter((item)=>!item.acted).slice(0,3);
  return `<section class="insight-card"><h2>Program balance</h2><div class="balance">${Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,7).map(([label,count])=>`<div class="balance-row"><span>${escapeHtml(label)}</span><div class="bar"><i style="width:${(count/max)*100}%"></i></div><strong>${count}</strong></div>`).join('')}</div></section><section class="insight-card"><h2>Suggested next partners</h2>${suggestions.map((item)=>`<article class="suggestion"><strong>${escapeHtml(item.company)}</strong><p>${escapeHtml(item.reasoning)}</p></article>`).join('') || '<p>No new suggestions logged.</p>'}</section><section class="insight-card"><h2>Quick templates</h2>${renderTemplates()}</section>`;
}

function bindDynamic() {
  document.querySelectorAll('[data-advance]').forEach((button)=>button.addEventListener('click',()=>advancePartner(button.dataset.advance)));
  document.querySelectorAll('[data-check]').forEach((box)=>box.addEventListener('change',()=>{state.local.checklist[box.dataset.check]=box.checked;persist();}));
  document.querySelectorAll('[data-template]').forEach((button)=>button.addEventListener('click',()=>openTemplate(button.dataset.template,button.dataset.templateLabel)));
  document.querySelectorAll('[data-open-planner]').forEach((button)=>button.addEventListener('click',()=>document.querySelector('[data-planner-dialog]').showModal()));
  document.querySelector('[data-switch-pipeline]')?.addEventListener('click',()=>document.querySelector('[data-view="pipeline"]').click());
}

function advancePartner(id) { const partner=state.data.partners.find((item)=>item.id===id); const current=stageFor(partner); const next=stages[Math.min(stages.length-1,stages.indexOf(current)+1)]; state.local.stages[id]=next; persist(); setStatus(`${partner.company} moved to ${next}.`); render(); }
function saveSession(event) { const submitter=event.submitter; if(submitter?.value==='cancel') return; event.preventDefault(); const data=Object.fromEntries(new FormData(event.currentTarget)); const session={id:`local-${Date.now()}`,...data}; state.local.sessions.push(session); persist(); event.currentTarget.reset(); document.querySelector('[data-planner-dialog]').close(); setStatus(`${session.company} session saved.`); state.view='today'; render(); }
async function openTemplate(path,label){try{const response=await fetch(path);if(!response.ok)throw new Error('Template unavailable');document.querySelector('[data-template-title]').textContent=label;document.querySelector('[data-template-content]').textContent=await response.text();document.querySelector('[data-template-dialog]').showModal();}catch(error){setStatus(error.message)}}
async function copyTemplate(){try{await navigator.clipboard.writeText(document.querySelector('[data-template-content]').textContent);setStatus('Template copied.');}catch{setStatus('Copy is unavailable in this browser.')}}
function filteredPartners(){return state.data.partners.filter((partner)=>(state.vertical==='all'||partner.vertical===state.vertical)&&matches(`${partner.company} ${partner.vertical} ${partner.nextAction} ${partner.notes}`));}
function stageFor(partner){return state.local.stages[partner.id] || (partner.status==='Completed'?'Completed':'Researching');}
function matches(text){return !state.query||text.toLowerCase().includes(state.query)}
function populateVerticals(){const select=document.querySelector('[data-vertical-filter]');[...new Set(state.data.partners.map((partner)=>partner.vertical))].sort().forEach((vertical)=>select.insertAdjacentHTML('beforeend',`<option>${escapeHtml(vertical)}</option>`));}
function heading(title,copy){return `<div class="section-heading"><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(copy)}</p></div></div>`}
function nextForStage(stage){return {Researching:'Identify the right speaker',Contacted:'Follow up on the invitation',Scheduling:'Confirm date and format',Confirmed:'Prepare the run of show'}[stage]}
function formatDate(value){return new Date(`${value}T12:00:00`).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
function persist(){safeWrite(STORAGE_KEY,state.local)}
function setStatus(message){document.querySelector('[data-status]').textContent=message}
function safeRead(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}}
function safeWrite(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function okJson(response){if(!response.ok)throw new Error(`Data request failed (${response.status})`);return response.json()}
function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function refreshIcons(){if(window.lucide) window.lucide.createIcons()}
