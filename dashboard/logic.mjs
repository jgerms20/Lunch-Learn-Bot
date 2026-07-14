export const DEFAULT_LOCAL_STATE = {
  stages: {},
  sessions: [],
  checklist: {},
  suggestionSet: [],
  suggestionExclusions: [],
  suggestionRefreshCount: 0
};

const stagePriority = {
  Researching: 4,
  Contacted: 3,
  Scheduling: 2,
  Confirmed: 1,
  Completed: 0
};

export function resolveTheme(local = {}) {
  return local?.theme === 'light' ? 'light' : 'dark';
}

export function partnerSearchText(partner, outreach) {
  const contact = partner.contact || {};
  const target = outreach?.targetContact || {};
  return [
    partner.company,
    partner.vertical,
    partner.nextAction,
    partner.notes,
    contact.name,
    contact.title,
    contact.email,
    contact.phone,
    contact.geography,
    contact.source,
    target.name,
    target.title,
    target.email,
    outreach?.nextStep
  ].filter(Boolean).join(' ');
}

export function stageForPartner(partner, localStages = {}) {
  return localStages[partner.id] || (partner.status === 'Completed' ? 'Completed' : 'Researching');
}

export function isSuggestionEligible(partner, local = {}) {
  const exclusions = new Set(local.suggestionExclusions || []);
  const stage = stageForPartner(partner, local.stages || {});
  return !exclusions.has(partner.id) && partner.status !== 'Completed' && stage !== 'Completed' && stage !== 'Confirmed';
}

export function createDiscoveryLinks(partner, outreach) {
  const contact = partner.contact || {};
  const target = outreach?.targetContact || {};
  const roleHint = cleanHint(contact.title || target.title || 'partnerships marketing speaker');
  const geography = cleanHint(contact.geography || '');
  const identity = uniqueParts([contact.name, roleHint, partner.company, geography]).join(' ');
  const linkedinQuery = encodeURIComponent(identity || `${partner.company} ${roleHint}`);
  const webQuery = encodeURIComponent(uniqueParts([
    partner.company,
    roleHint,
    geography,
    'email',
    'LinkedIn'
  ]).join(' '));
  const perplexityQuery = encodeURIComponent(uniqueParts([
    partner.company,
    roleHint,
    geography,
    'best contact for lunch and learn'
  ]).join(' '));

  return {
    linkedin: {
      label: 'LinkedIn people search',
      href: `https://www.linkedin.com/search/results/people/?keywords=${linkedinQuery}`
    },
    web: {
      label: 'Focused web search',
      href: `https://www.google.com/search?q=${webQuery}`
    },
    perplexity: {
      label: 'Perplexity search',
      href: `https://www.perplexity.ai/search?q=${perplexityQuery}`
    }
  };
}

export function buildSuggestionSet({ partners = [], events = [], local = {}, limit = 3 }) {
  const normalized = {
    ...DEFAULT_LOCAL_STATE,
    ...local,
    stages: local.stages || {},
    sessions: Array.isArray(local.sessions) ? local.sessions : [],
    suggestionExclusions: Array.isArray(local.suggestionExclusions) ? local.suggestionExclusions : [],
    suggestionRefreshCount: Number.isFinite(local.suggestionRefreshCount) ? local.suggestionRefreshCount : 0
  };
  const eligible = partners.filter((partner) => isSuggestionEligible(partner, normalized));
  if (!eligible.length) return [];

  const partnerById = new Map(partners.map((partner) => [partner.id, partner]));
  const partnerByCompany = new Map(partners.map((partner) => [partner.company.toLowerCase(), partner]));
  const verticalCounts = {};

  for (const event of events) {
    const partner = partnerById.get(event.partnerId) || partnerByCompany.get(String(event.company || '').toLowerCase());
    const vertical = partner?.vertical || 'Other';
    verticalCounts[vertical] = (verticalCounts[vertical] || 0) + 1;
  }

  for (const session of normalized.sessions) {
    const partner = partnerByCompany.get(String(session.company || '').toLowerCase());
    if (!partner) continue;
    verticalCounts[partner.vertical] = (verticalCounts[partner.vertical] || 0) + 1;
  }

  const scored = eligible
    .map((partner) => {
      const stage = stageForPartner(partner, normalized.stages);
      const coverage = verticalCounts[partner.vertical] || 0;
      const notes = `${partner.nextAction || ''} ${partner.notes || ''}`.toLowerCase();
      const priorityBoost = /\burgent|priority|essential|director|high priority\b/.test(notes) ? 1.25 : 0;
      const geographyBoost = partner.contact?.geography ? 0.2 : 0;
      const score = (6 - Math.min(coverage, 5)) + stagePriority[stage] + priorityBoost + geographyBoost;
      return { partner, stage, coverage, score };
    })
    .sort((left, right) => right.score - left.score || left.partner.company.localeCompare(right.partner.company));

  const grouped = new Map();
  for (const item of scored) {
    const vertical = item.partner.vertical || 'Other';
    const list = grouped.get(vertical) || [];
    list.push(item);
    grouped.set(vertical, list);
  }

  const verticalOrder = [...grouped.keys()].sort((left, right) => {
    const coverageDelta = (verticalCounts[left] || 0) - (verticalCounts[right] || 0);
    return coverageDelta || left.localeCompare(right);
  });
  const seed = verticalOrder.length ? normalized.suggestionRefreshCount % verticalOrder.length : 0;
  const rotatedVerticals = rotate(verticalOrder, seed);
  const rotatedGroups = new Map(
    [...grouped.entries()].map(([vertical, items]) => [vertical, rotate(items, normalized.suggestionRefreshCount % items.length)])
  );

  const selected = [];
  const seen = new Set();

  while (selected.length < limit) {
    let picked = false;
    for (const vertical of rotatedVerticals) {
      const queue = rotatedGroups.get(vertical) || [];
      while (queue.length && seen.has(queue[0].partner.id)) queue.shift();
      const next = queue.shift();
      if (!next) continue;
      selected.push(toSuggestion(next.partner, next.stage, next.coverage));
      seen.add(next.partner.id);
      picked = true;
      if (selected.length === limit) break;
    }
    if (!picked) break;
  }

  return selected;
}

function toSuggestion(partner, stage, coverage) {
  const reasons = [];
  if (coverage === 0) reasons.push(`No recent ${partner.vertical.toLowerCase()} sessions are logged yet.`);
  else if (coverage === 1) reasons.push(`${partner.vertical} is still lightly represented in the archive.`);
  if (/\burgent|priority|essential|director|high priority\b/i.test(`${partner.nextAction || ''} ${partner.notes || ''}`)) {
    reasons.push('Current notes mark this partner as a priority.');
  }
  if (partner.contact?.geography) reasons.push(`${partner.contact.geography} is the saved geography.`);
  if (!reasons.length) reasons.push('Active in the pipeline and still worth a fresh pass.');

  return {
    id: partner.id,
    company: partner.company,
    vertical: partner.vertical,
    stage,
    nextAction: partner.nextAction || defaultNextAction(stage),
    reasoning: reasons.join(' '),
    knownContact: Boolean(partner.contact?.name || partner.contact?.email || partner.contact?.phone || partner.contact?.linkedinUrl),
    geography: partner.contact?.geography || ''
  };
}

function defaultNextAction(stage) {
  return {
    Researching: 'Identify the right speaker',
    Contacted: 'Follow up on the invitation',
    Scheduling: 'Confirm date and format',
    Confirmed: 'Prepare the run of show'
  }[stage] || 'Reconnect when useful';
}

function rotate(items, offset) {
  if (!items.length) return [];
  const safeOffset = offset % items.length;
  return [...items.slice(safeOffset), ...items.slice(0, safeOffset)];
}

function cleanHint(value) {
  return String(value || '').replace(/\bTBD\b\s*[-:]?\s*/gi, '').replace(/\s+/g, ' ').trim();
}

function uniqueParts(parts) {
  const seen = new Set();
  return parts.filter(Boolean).filter((part) => {
    const key = part.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
