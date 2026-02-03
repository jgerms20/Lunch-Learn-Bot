# TBWA\Chiat\Day - Lunch & Learn Management System

**A comprehensive system for planning, executing, and tracking Lunch & Learn sessions with media partners and industry leaders.**

Built for the Connections Strategy team at TBWA\Chiat\Day LA.

---

## What This System Does

This system automates the heavy lifting of running a professional Lunch & Learn program:

✅ **Partner Relationship Management** - Track all media partners, contacts, and relationship history
✅ **Smart Outreach** - Templates and AI assistance for all email communications
✅ **Contact Research** - Systematic approach to finding the right people
✅ **Strategic Planning** - Intelligent partner suggestions based on trends, gaps, and priorities
✅ **Internal Promotion** - Templates for announcing events to the agency
✅ **Dashboard** - Visual interface for tracking everything
✅ **Cross-Device Skills** - Reusable prompts that work anywhere Claude is available

---

## Quick Start

### 1. View the Dashboard

```bash
# Navigate to project directory
cd /path/to/Lunch-Learn-Bot

# Start local server
python3 -m http.server 8000

# Open in browser
# http://localhost:8000/dashboard/
```

### 2. Get Partner Suggestions

```bash
python3 suggest-partners.py
```

### 3. Use Claude Skills

Skills are located in `skills/` folder. Reference them when using Claude:

- **Draft Outreach Email**: `skills/draft-outreach-email.md`
- **Generate Internal Invite**: `skills/generate-internal-invite.md`
- **Research Contact**: `skills/research-contact.md`
- **Suggest Partners**: `skills/suggest-partners.md`
- **Summarize Audio**: `skills/summarize-audio.md`

### 4. Follow the Workflow

See `docs/WORKFLOW_GUIDE.md` for complete step-by-step process from ideation to post-event.

---

## System Components

### 📊 Dashboard (`dashboard/`)
Lightweight HTML/CSS/JS interface for:
- Viewing partner database
- Tracking outreach status
- Managing events
- Accessing templates

### 📁 Data (`data/`)
JSON files storing:
- `partner-database.json` - All partner/contact information
- `events-log.json` - Past and upcoming L&L events
- `outreach-tracker.json` - Email sequences and status
- `suggestions-log.json` - Historical partner suggestions

### 📧 Templates (`templates/`)
Ready-to-use templates for:
- **Email outreach** (first contact, follow-up, scheduling, confirmation, thank you)
- **Internal communications** (announcements, reminders, Teams messages)

### 🤖 Skills (`skills/`)
Reusable AI prompts for:
- Drafting emails
- Generating invites
- Researching contacts
- Suggesting partners
- Summarizing audio

### 📖 Documentation (`docs/`)
- `SYSTEM_PLAN.md` - Complete architecture and design
- `WORKFLOW_GUIDE.md` - How to use the system
- `TROUBLESHOOTING.md` - Common issues and solutions
- `PROJECT_LOG.md` - Daily progress tracking

### 🐍 Suggestion Engine (`suggest-partners.py`)
Python script that analyzes data and provides intelligent partner suggestions.

---

## File Structure

```
Lunch-Learn-Bot/
├── README.md                          # This file
├── SYSTEM_PLAN.md                     # Master architecture document
├── suggest-partners.py                # Partner suggestion engine
│
├── dashboard/                         # Web interface
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── README.md
│
├── data/                              # JSON databases
│   ├── partner-database.json
│   ├── events-log.json
│   ├── outreach-tracker.json
│   └── suggestions-log.json
│
├── templates/                         # Email & communication templates
│   ├── emails/
│   │   ├── first-outreach.md
│   │   ├── follow-up.md
│   │   ├── scheduling.md
│   │   ├── confirmation.md
│   │   └── thank-you.md
│   └── internal-comms/
│       ├── email-announcement.md
│       ├── email-reminder-tomorrow.md
│       ├── email-reminder-today.md
│       └── teams-message.md
│
├── skills/                            # Reusable Claude prompts
│   ├── draft-outreach-email.md
│   ├── generate-internal-invite.md
│   ├── research-contact.md
│   ├── suggest-partners.md
│   └── summarize-audio.md
│
├── docs/                              # Documentation
│   ├── WORKFLOW_GUIDE.md
│   ├── TROUBLESHOOTING.md
│   └── PROJECT_LOG.md
│
├── transcripts/                       # Audio summaries and meeting notes
│
└── archive/                           # Completed L&L materials
    └── 2026/
```

---

## Typical Workflow

1. **Ideation** → Run suggestion engine or brainstorm with team
2. **Research** → Find contact using research skill
3. **Outreach** → Draft email using outreach skill
4. **Follow-up** → Send reminder after 7-10 days if no response
5. **Schedule** → Coordinate logistics and lock in date
6. **Promote** → Generate internal invites using invite skill
7. **Execute** → Run the event
8. **Follow-up** → Thank speaker, capture learnings

All tracked in dashboard, all data in JSON files, all communications from templates.

---

## Key Features

### 🎯 Smart Partner Suggestions
- Analyzes vertical distribution
- Identifies urgent opportunities
- Balances programming mix
- Considers client relevance
- Flags industry trends

### ✉️ Professional Templates
- Consistent TBWA voice
- Professional but warm tone
- Proven successful with past partners (Genius, Pinterest, Outfront)
- Easy to customize

### 📱 Cross-Device Skills
- Work on desktop, laptop, mobile
- Voice-compatible prompts
- Consistent output regardless of interface
- Reference anywhere Claude is available

### 📈 Visual Dashboard
- See all partners at a glance
- Filter by vertical, status
- Search across all fields
- Kanban-style outreach tracker
- Event timeline

### 🔄 Living Documentation
- Updated in real-time
- Troubleshooting guide grows with use
- Daily project log maintains context
- Workflow guide evolves

---

## Team

**Lead:** Joshua German - Connections Strategist
**Team:** Elliot Klein (Account), John Simmons (Brand Strategist)

### Vertical Ownership (Suggested)
- **Joshua**: AI/Emerging Tech, Social Media
- **Elliot**: Streaming, Retail Media
- **John**: OOH, Cultural/Trend, Podcast

---

## OneDrive Setup

To sync across devices:

1. Copy entire `Lunch-Learn-Bot` folder to OneDrive
2. Wait for initial sync to complete
3. Access on any device with OneDrive
4. Edit JSON files or use dashboard
5. Changes sync automatically

**Note:** Dashboard requires local server - can't run directly from OneDrive web interface.

---

## Requirements

### Software
- **Python 3.6+** (for suggestion engine)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **OneDrive** (for cross-device sync)

### Optional
- **Node.js** (alternative for running dashboard server)
- **VS Code** or text editor (for editing JSON/templates)

---

## Documentation

### For Day-to-Day Use:
📘 **[WORKFLOW_GUIDE.md](docs/WORKFLOW_GUIDE.md)** - Step-by-step processes

### When Things Break:
🔧 **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common issues and fixes

### For Understanding the System:
🏗️ **[SYSTEM_PLAN.md](SYSTEM_PLAN.md)** - Complete architecture

### For Tracking Progress:
📝 **[PROJECT_LOG.md](docs/PROJECT_LOG.md)** - Daily updates

---

## Getting Help

### Dashboard Issues
See `dashboard/README.md` for setup and troubleshooting

### Data Issues
See `docs/TROUBLESHOOTING.md` for common JSON problems

### Workflow Questions
See `docs/WORKFLOW_GUIDE.md` for step-by-step guidance

### System Design Questions
See `SYSTEM_PLAN.md` for architecture details

---

## Best Practices

### Daily:
- Update outreach tracker after every interaction
- Check dashboard for status
- Use skills when drafting communications

### Weekly:
- Review active outreach pipeline
- Send follow-ups (7-10 day rule)
- Update partner statuses
- Plan next L&L

### Monthly:
- Run suggestion engine
- Analyze vertical balance
- Review past L&L performance
- Plan next quarter

---

## Version History

**v1.0** - 2026-02-03
- Initial build
- Complete system architecture
- Dashboard, templates, skills, documentation
- Partner database with 8 initial partners
- Events log with 3 completed L&Ls
- Suggestion engine
- Living documentation

---

## Future Enhancements (Phase 2)

- LinkedIn Sales Navigator integration
- Automated email sending
- Calendar integration
- Slack/Teams bot
- Mobile app
- Automated trend monitoring
- AI-powered partner matching

---

## License & Usage

Built for internal use at TBWA\Chiat\Day LA.

For questions or issues, contact Joshua German, Connections Strategy.

---

**Last Updated:** 2026-02-03
**Status:** Active Development
**Next Review:** After first month of real-world use
