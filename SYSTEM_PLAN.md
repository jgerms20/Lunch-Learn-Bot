# TBWA\Chiat\Day Lunch & Learn System - Master Plan

**Owner**: Joshua German (Connections Strategist)
**Team**: Elliot Klein (Account), John Simmons (Brand Strategist)
**Purpose**: Automate and streamline the Lunch & Learn program + build a media partner relationship hub
**Last Updated**: 2026-02-03

---

## System Vision

A lightweight, intelligent system that transforms L&L planning from tedious manual work into a strategic, repeatable process. The system should handle the heavy lifting (research, drafting, tracking) so the team can focus on relationships and strategy.

---

## Core Workflow

```
IDEATION → CONTACT RESEARCH → OUTREACH → SCHEDULING → CONFIRMATION → INTERNAL PROMO → EVENT → FOLLOW-UP
```

### Current Pain Points
1. Finding the right contact is time-consuming
2. Scheduling coordination takes multiple back-and-forths
3. Internal promotion is inconsistent
4. No central hub for partner relationships
5. Repeating the same research/drafting work

---

## System Architecture

### 1. Partner/Contact CRM Hub
**Purpose**: Single source of truth for all media partner relationships

**Data Structure**:
```
- Company Name
- Vertical/Category (Social Media, Streaming, OOH, Podcast, AI/Emerging Tech, Cultural)
- Contact Name
- Title/Role
- Email
- Phone Number
- LinkedIn URL
- Geography (LA preferred, but flexible)
- Source (Internal connection, LinkedIn, Google)
- Status (Researching, Contacted, In Conversation, Scheduled, Completed, Declined, Follow-Up Needed)
- Last Contact Date
- Next Action
- Notes (Why they're the right person, what they could present, relationship history)
- Tags (Current client relevant, Emerging tech, Cultural trend, etc.)
- L&L History (Dates they've presented, topics covered)
```

**Storage**: OneDrive > `Lunch-Learn-System/data/partner-database.json`

**Features**:
- Filter by vertical
- Balance tracker (show distribution across categories)
- Search by company, contact, or tag
- Flag urgent opportunities (trending news, new launches)

---

### 2. Email Drafting System

**Templates Needed**:

#### A. First Outreach
```
Subject: [Strategic/Contextual]
Body:
- Hi [Name], I'm Joshua German, Connections Strategist at TBWA\Chiat\Day LA
- Brief agency context (brands we work with relevant to their vertical)
- Specific interest in their work/platform
- Lunch & Learn invitation (win-win, educational, no sales pitch implied)
- Proposed scheduling approach
- Signature
```

**Tone**: Professional but warm
**Sender**: Varies based on who has best connection/relevance

#### B. Follow-Up (No Response)
- Gentle nudge
- Restates value
- New scheduling options

#### C. Scheduling Coordination
- Propose specific times
- Include format (virtual/in-person, duration, expected audience)
- Logistics details

#### D. Confirmation Email
- Confirms date/time
- Next steps (deck review, logistics)
- What they need from us

#### E. Thank You + Recap
- Gratitude
- Key takeaways
- Keeps relationship warm for future

**Storage**: OneDrive > `Lunch-Learn-System/templates/emails/`

---

### 3. Internal Communications System

**Templates Needed**:

#### A. Email Announcements
**Audiences**:
- All-agency blast
- Department-specific (Media, Strategy, Creative, etc.)
- VIP list

**Format**:
```
Subject: Lunch & Learn: [Company] on [Topic] - [Date]

Body:
- WHO: [Speaker name, title, company]
- WHAT: [Topic/focus area]
- WHEN: [Date, time]
- WHERE: [Location]
- WHY IT MATTERS: [Relevance to our work, clients, industry trends]
- FOOD: [What's being served - people care!]
- RSVP: [If needed]
```

**Reminder Sequence**:
- 1 week out: Full announcement
- Day before: "Tomorrow!" reminder
- Day of: "Today at [time]" reminder

#### B. Teams Messages
**Tone**: Informal, hype-building

```
Hey team! 🎯
[Company] is coming in [when] to talk about [what]
[Why you should care in 1 sentence]
Food: [What's being served]
See you there!
```

**Storage**: OneDrive > `Lunch-Learn-System/templates/internal-comms/`

---

### 4. Partner Suggestion Engine

**Inputs**:
- Vertical/category filter
- Current distribution (avoid too many of one type)
- Industry trends/news
- Current client portfolio
- Active pitches
- Team skill gaps

**Outputs**:
- Suggested partners ranked by relevance
- Reasoning for each suggestion
- Timing considerations
- Potential contacts to reach out to

**Example Use Cases**:
- "Suggest streaming partners for Q2"
- "We just got a gaming client - who should we bring in?"
- "OpenAI announced ads - surface that as urgent opportunity"

**Storage**: OneDrive > `Lunch-Learn-System/data/suggestions-log.json`

---

### 5. Contact Research Helper

**Process**:
1. Check internal sources first (who knows someone at X company?)
2. LinkedIn search (title keywords: partnerships, marketing, sales, brand)
3. Google search (company website, press releases, LinkedIn)
4. Document findings in CRM

**Output**:
- Best contact found
- Title/role
- Email (if found)
- Phone (if found)
- LinkedIn profile
- Confidence level (High: direct contact found, Medium: educated guess, Low: needs verification)
- Source trail (where info came from)

**Storage**: Research notes stored in partner CRM entry

---

### 6. Audio Interpretation System

**Purpose**: Turn voice notes and messy conversations into usable content

**Inputs**:
- Audio recordings
- Voice notes
- Meeting transcripts

**Outputs**:
- Clean summary
- Action items
- Decisions made
- Open questions
- Next steps

**Use Cases**:
- Post-L&L debrief
- Team brainstorming sessions
- Partner phone calls

**Storage**: OneDrive > `Lunch-Learn-System/transcripts/`

---

### 7. Lightweight Dashboard Interface

**Tech Stack**: HTML + CSS + JavaScript (no frameworks for simplicity)

**Pages/Views**:

#### Home Dashboard
- Quick stats (Partners contacted this month, L&Ls scheduled, L&Ls completed)
- Upcoming events (next 30 days)
- Action items (follow-ups needed, confirmations pending)
- Quick actions (Draft outreach, Add partner, Research contact, Suggest partners)

#### Partner Database View
- Searchable/filterable table
- Click to see full details
- Quick edit inline
- Export to Excel

#### Outreach Tracker
- Kanban-style board: Researching → Contacted → In Conversation → Scheduled → Completed
- Drag and drop to update status
- Click to draft next email in sequence

#### Template Library
- Browse all email and internal comm templates
- One-click copy
- Fill-in-the-blank prompts

#### Calendar View
- Visual timeline of past and upcoming L&Ls
- Color-coded by vertical
- Click to see details

**Storage**: OneDrive > `Lunch-Learn-System/dashboard/` (HTML/CSS/JS files)
**Data Source**: Reads from JSON files in OneDrive

---

## Folder Structure (OneDrive)

```
Lunch-Learn-System/
├── dashboard/
│   ├── index.html (main dashboard)
│   ├── styles.css
│   ├── app.js
│   └── assets/
│       └── logo.png
├── data/
│   ├── partner-database.json (main CRM)
│   ├── events-log.json (past and scheduled L&Ls)
│   ├── suggestions-log.json (partner suggestions history)
│   └── outreach-tracker.json (email sequences and status)
├── templates/
│   ├── emails/
│   │   ├── first-outreach.md
│   │   ├── follow-up.md
│   │   ├── scheduling.md
│   │   ├── confirmation.md
│   │   └── thank-you.md
│   └── internal-comms/
│       ├── email-announcement.md
│       ├── email-reminder-week.md
│       ├── email-reminder-tomorrow.md
│       ├── email-reminder-today.md
│       └── teams-message.md
├── transcripts/
│   └── [date]-[topic].md
├── skills/
│   ├── draft-outreach-email.md
│   ├── generate-internal-invite.md
│   ├── research-contact.md
│   ├── suggest-partners.md
│   └── summarize-audio.md
├── docs/
│   ├── SYSTEM_PLAN.md (this file)
│   ├── PROJECT_LOG.md (living daily log)
│   ├── TROUBLESHOOTING.md (errors and fixes)
│   └── WORKFLOW_GUIDE.md (how to use the system)
└── archive/
    └── [year]/
        └── [completed L&Ls]
```

---

## Reusable Skills Library

These skills should be accessible cross-device (desktop, mobile, voice):

### 1. Draft Partner Outreach Email
**Trigger**: "Draft outreach for [Company] about [Topic]"
**Inputs**: Company name, topic/focus, sender name (Josh/Elliot/John), any special context
**Output**: Complete email ready to send

### 2. Generate Internal Event Invite
**Trigger**: "Create invite for [Company] L&L on [Date]"
**Inputs**: Speaker, company, topic, date, time, location, food
**Output**: Email announcement + Teams message + calendar invite description

### 3. Research Contact at Company
**Trigger**: "Find contact at [Company]"
**Inputs**: Company name, vertical/focus area
**Output**: Best contact found, title, LinkedIn, email (if found), research notes

### 4. Suggest Partners for Vertical
**Trigger**: "Suggest partners for [Vertical/Topic]"
**Inputs**: Vertical, timing, current priorities
**Output**: Ranked list of suggestions with reasoning

### 5. Summarize Audio/Conversation
**Trigger**: "Summarize this conversation"
**Inputs**: Audio file or transcript
**Output**: Summary, action items, decisions, open questions

---

## Daily Rhythm

### Start of Day (Morning)
**Update PROJECT_LOG.md**:
- Today's plan
- Top priorities
- Expected completions

### End of Day (Evening)
**Update PROJECT_LOG.md**:
- What was accomplished
- Current status of in-progress items
- Blockers and why
- Next steps for tomorrow

**Purpose**: Never lose momentum, pick up instantly next day without reconstructing context

---

## Preferences & Style Guide

### Writing Style
- Professional but warm
- Clear headers and sections
- Structured and scannable
- Turn messy thoughts into clean bullets
- Preserve context (don't make user restate background)

### Organization
- Keep information easy to scan
- Track things for quick re-entry
- Document fixes to prevent repeat mistakes
- Maintain single source of truth

### Communication
- No emojis unless explicitly requested
- Short and concise
- Github-flavored markdown
- Direct, objective, factual

---

## Phase 1 vs Phase 2 Features

### Phase 1 (MVP - Build Now)
✅ Partner/Contact CRM
✅ Email drafting system (all templates)
✅ Internal communications templates
✅ Contact research helper (manual research support)
✅ Partner suggestion engine
✅ Lightweight HTML dashboard
✅ Reusable skills library
✅ Living MD documentation system
✅ Audio summarization capability

### Phase 2 (Future Enhancements)
⏳ LinkedIn Sales Navigator integration
⏳ Apollo.io or contact API integration
⏳ Calendly-style scheduling tool integration
⏳ Automated trend monitoring/alerts
⏳ AI-powered partner matching
⏳ Slack/Teams bot interface
⏳ Mobile app

---

## Success Metrics

### Efficiency Gains
- Time to draft outreach email: 20 min → 2 min
- Time to find contact: 30 min → 5 min
- Time to create internal promo: 15 min → 2 min

### Relationship Quality
- Consistent follow-up (no dropped contacts)
- Balanced programming across verticals
- Strong partner database for future opportunities

### Team Enablement
- All 3 team members can run L&Ls independently
- Vertical ownership is clear
- No repeated research or lost work

---

## Next Steps

1. Build folder structure
2. Create data schemas (JSON structures)
3. Build templates (email + internal comms)
4. Create HTML dashboard (v1 - static, reads from JSON)
5. Build reusable skills
6. Set up living documentation (PROJECT_LOG.md, TROUBLESHOOTING.md)
7. Test full workflow end-to-end
8. Iterate based on real-world use

---

## Questions for Future Discussion

- Should we integrate with TBWA's existing CRM or keep this separate?
- Do we want to track budget/costs per L&L?
- Should we capture post-event feedback/ratings?
- Do we want to share this system with other departments?

---

**End of System Plan**
