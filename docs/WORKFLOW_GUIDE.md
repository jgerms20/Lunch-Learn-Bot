# Lunch & Learn System - Workflow Guide

**Purpose:** Step-by-step guide for using the system from ideation to post-event follow-up.

---

## Quick Start

**New to the system?** Follow these steps:

1. **Open the dashboard** - Run local server and view at `http://localhost:8000/dashboard/`
2. **Review current partners** - See who's in the database, what's in progress
3. **Run suggestion engine** - Get ideas for next L&L: `python3 suggest-partners.py`
4. **Pick a partner and start outreach** - Follow workflows below

---

## Complete L&L Workflow

### Phase 1: Ideation & Partner Selection

**Goal:** Decide who to bring in and why

#### Option A: Use Suggestion Engine

```bash
cd /path/to/Lunch-Learn-Bot
python3 suggest-partners.py
```

This will show:
- Urgent opportunities
- Vertical balance recommendations
- Current distribution
- Status overview

#### Option B: Team Brainstorm

1. Schedule team discussion
2. Use Claude skill: "Suggest partners for [vertical/topic]"
3. Consider:
   - Current client needs
   - Team skill gaps
   - Vertical balance
   - Director priorities
   - Recent industry news

#### Option C: Respond to Opportunity

If you see relevant industry news:
1. Add partner to database immediately
2. Tag as "Current Priority"
3. Note the trend/announcement in notes
4. Move to research phase

**Outcome:** Selected partner + clear reasoning why

---

### Phase 2: Contact Research

**Goal:** Find the right person to reach out to

#### Step 1: Check Internal Connections
Ask team: "Does anyone know someone at [COMPANY]?"
- Check email for past interactions
- Review client work overlap
- Ask around the agency

#### Step 2: Use Claude Research Skill
Trigger: "Research contact at [COMPANY]"

Provide:
- Company name
- Vertical
- What you want them to present on

Claude will:
- Suggest target roles
- Provide LinkedIn search strategy
- Guide company website research
- Suggest email patterns
- Output structured findings

#### Step 3: Document in Database

Update `data/partner-database.json`:
```json
{
  "contact": {
    "name": "Sarah Chen",
    "title": "Head of Advertising Partnerships",
    "email": "sarah.chen@company.com",
    "phone": "",
    "linkedinUrl": "linkedin.com/in/sarahchen",
    "geography": "San Francisco",
    "source": "LinkedIn research"
  },
  "status": "Researching" → "Contacted",
  "lastContactDate": "2026-02-03",
  "nextAction": "Send first outreach email"
}
```

#### Step 4: Update Outreach Tracker

Add entry to `data/outreach-tracker.json`:
```json
{
  "id": "O004",
  "partnerId": "001",
  "company": "OpenAI",
  "stage": "Researching",
  "sender": "Joshua German",
  "targetContact": {
    "name": "Sarah Chen",
    "title": "Head of Advertising Partnerships",
    "email": "sarah.chen@openai.com",
    "found": true
  },
  "nextStep": "Draft and send outreach email",
  "priority": "High",
  "dateStarted": "2026-02-03"
}
```

**Outcome:** Contact identified, documented, ready for outreach

---

### Phase 3: First Outreach

**Goal:** Send compelling initial email

#### Step 1: Draft Email Using Claude

Trigger: "Draft outreach email for [COMPANY] about [TOPIC]"

Provide:
- Company name
- Contact name
- Topic/focus
- Your name (sender)
- Specific interest (recent launch, feature, etc.)
- Relevant TBWA clients (optional)

Claude will:
- Use first outreach template
- Customize for this partner
- Include all required elements
- Output ready-to-send email

#### Step 2: Review & Personalize

Checklist:
- [ ] Contact name spelled correctly
- [ ] Company name accurate
- [ ] Specific interest is compelling
- [ ] Tone feels right (professional but warm)
- [ ] No typos
- [ ] Call to action clear
- [ ] Sender info correct

Add personal touch:
- Mention mutual connection if applicable
- Reference specific recent work of theirs
- Show genuine interest

#### Step 3: Send Email

1. Send from appropriate sender (Joshua/Elliot/John)
2. BCC yourself for records
3. Set calendar reminder to follow up in 7-10 days

#### Step 4: Update Tracker

Update `data/outreach-tracker.json`:
```json
{
  "stage": "Researching" → "Contacted",
  "emailSequence": [
    {
      "type": "First Outreach",
      "date": "2026-02-03",
      "sent": true
    }
  ],
  "nextStep": "Follow up if no response by Feb 13",
  "lastActivity": "2026-02-03"
}
```

**Outcome:** Professional outreach sent, tracked, follow-up scheduled

---

### Phase 4: Follow-Up (If Needed)

**Goal:** Gentle nudge if no response after 7-10 days

#### When to Follow Up
- 7-10 days after first email
- No response received
- Still interested in partner

#### Step 1: Draft Follow-Up Using Claude

Trigger: "Draft follow-up email for [COMPANY]"

Provide:
- Original email context
- Any new relevant info (recent launch, news)
- Updated timing

#### Step 2: Send Follow-Up

1. Reply to original email (keeps thread)
2. Keep it brief and friendly
3. Offer new timing options
4. Suggest quick call if easier

#### Step 3: Update Tracker

```json
{
  "emailSequence": [
    {
      "type": "First Outreach",
      "date": "2026-02-03",
      "sent": true
    },
    {
      "type": "Follow-Up",
      "date": "2026-02-13",
      "sent": true
    }
  ],
  "nextStep": "If no response by Feb 23, mark as No Response and move on"
}
```

**Outcome:** Follow-up sent without being pushy

---

### Phase 5: Scheduling

**Goal:** Lock in date, time, and logistics

#### Step 1: Draft Scheduling Email Using Claude

Trigger: "Draft scheduling email for [COMPANY]"

Provide:
- 3 date/time options
- Format preference (in-person/virtual)
- Expected duration (45-60 min)
- Location details
- Audience size

#### Step 2: Coordinate Logistics

- Check room availability
- Confirm food budget
- Verify technical setup (if virtual)
- Get calendar cleared

#### Step 3: Confirm Date

Once they choose:
1. Send confirmation email
2. Create calendar invite
3. Request their deck/materials (2-3 days before)
4. Update tracker and database

#### Step 4: Update All Records

`data/outreach-tracker.json`:
```json
{
  "stage": "Contacted" → "Scheduled"
}
```

`data/partner-database.json`:
```json
{
  "status": "Contacted" → "Scheduled"
}
```

`data/events-log.json` - Add to upcoming:
```json
{
  "id": "E004",
  "partnerId": "001",
  "company": "OpenAI",
  "date": "2026-03-05",
  "time": "12:00 PM - 1:00 PM",
  "status": "Scheduled",
  "internalPromoSent": false
}
```

**Outcome:** Event scheduled, logistics confirmed, records updated

---

### Phase 6: Internal Promotion

**Goal:** Get agency excited and ensure good attendance

#### Step 1: Generate All Communications Using Claude

Trigger: "Generate internal invite for [COMPANY] Lunch & Learn on [DATE]"

Provide:
- Company, speaker name/title
- Topic
- Date, time, location
- Food
- Why it matters

Claude will generate:
- Initial announcement email (1 week out)
- Day-before reminder
- Day-of reminder
- Teams messages (all 3 variations)

#### Step 2: Schedule Communications

**1 Week Before:**
- Send announcement email (all-agency or targeted)
- Post in Teams
- Send calendar invites
- Update event status: `internalPromoSent: true`

**Day Before:**
- Send reminder email
- Post in Teams

**Day Of (Morning):**
- Send final reminder email
- Post in Teams

#### Step 3: Coordinate Final Details

- Confirm food order
- Test AV setup
- Print any materials needed
- Prep intro remarks
- Brief team on speaker

**Outcome:** Team knows about event, excited to attend, logistics ready

---

### Phase 7: Event Day

**Goal:** Smooth execution, great experience

#### Before Event

- [ ] Set up room 30 min early
- [ ] Test AV/tech
- [ ] Set out food
- [ ] Greet speaker when they arrive
- [ ] Brief speaker on timing, format, audience

#### During Event

- [ ] Introduce speaker (who they are, why we're excited)
- [ ] Let them present (30-40 min)
- [ ] Moderate Q&A (15-20 min)
- [ ] Thank speaker publicly
- [ ] Get group photo if appropriate

#### Capture Key Info

- Attendance count
- Key takeaways (take notes or record)
- Questions asked
- Team reactions
- Speaker feedback

**Outcome:** Successful event, good experience for all

---

### Phase 8: Post-Event Follow-Up

**Goal:** Thank speaker, capture learnings, keep relationship warm

#### Step 1: Send Thank You Email (Within 24-48 Hours)

Trigger Claude: "Draft thank you email for [COMPANY] L&L"

Provide:
- Event date
- 3-5 key takeaways
- Specific highlight (great question, insight, etc.)
- Future collaboration interest

#### Step 2: Update Database

`data/events-log.json`:
```json
{
  "status": "Scheduled" → "Completed",
  "actualAttendees": 45,
  "feedback": {
    "rating": 4.5,
    "keyTakeaways": [...],
    "notes": "Highly successful, lots of questions about..."
  }
}
```

`data/partner-database.json`:
```json
{
  "status": "Scheduled" → "Completed",
  "lunchLearnHistory": [
    {
      "date": "2026-03-05",
      "topic": "AI-Powered Advertising",
      "attendees": 45,
      "feedback": "Highly successful"
    }
  ]
}
```

#### Step 3: Internal Debrief (Optional)

If you recorded or took notes:
- Use Claude: "Summarize this L&L recording"
- Share key takeaways with team
- Post in Teams or email
- Archive for future reference

#### Step 4: Archive Materials

Move to `archive/2026/`:
- Speaker's deck
- Recording (if applicable)
- Notes/transcript
- Photos

**Outcome:** Speaker thanked, learnings captured, materials archived

---

## Quick Reference: File Updates

### Adding a New Partner

**File:** `data/partner-database.json`

```json
{
  "id": "009",
  "company": "New Company",
  "vertical": "Social Media",
  "contact": {
    "name": "",
    "title": "",
    "email": "",
    "phone": "",
    "linkedinUrl": "",
    "geography": "",
    "source": ""
  },
  "status": "Researching",
  "lastContactDate": "",
  "nextAction": "Research contact",
  "notes": "",
  "tags": [],
  "lunchLearnHistory": [],
  "dateAdded": "2026-02-03"
}
```

Don't forget to update metadata:
```json
{
  "metadata": {
    "lastUpdated": "2026-02-03",
    "totalPartners": 9
  }
}
```

---

### Starting Outreach

**File:** `data/outreach-tracker.json`

Add new entry:
```json
{
  "id": "O005",
  "partnerId": "009",
  "company": "New Company",
  "stage": "Researching",
  "sender": "Joshua German",
  "targetContact": {...},
  "emailSequence": [],
  "nextStep": "",
  "priority": "Medium",
  "reason": "",
  "dateStarted": "2026-02-03",
  "lastActivity": "2026-02-03"
}
```

---

### Scheduling Event

**File:** `data/events-log.json`

Add to `upcoming`:
```json
{
  "id": "E005",
  "partnerId": "009",
  "company": "New Company",
  "date": "2026-04-15",
  "time": "12:00 PM - 1:00 PM",
  "location": "Main Conference Room",
  "format": "In-Person",
  "speaker": {...},
  "topic": "",
  "description": "",
  "targetAudience": "All Agency",
  "estimatedAttendees": 50,
  "food": "TBD",
  "status": "Scheduled",
  "internalPromoSent": false,
  "deckReceived": false
}
```

---

## Tips for Success

### Do:
- **Update records in real-time** - Don't let it pile up
- **Use the dashboard daily** - Keep on top of status
- **Run suggestions monthly** - Stay strategic
- **Follow templates** - They work
- **Document learnings** - Build institutional knowledge

### Don't:
- Let outreach tracker get stale
- Skip follow-ups (7-10 day rule)
- Forget internal promotion (people forget!)
- Ignore vertical balance (mix it up)
- Lose momentum (keep pipeline full)

### Weekly Rhythm:
- **Monday**: Review dashboard, plan week
- **Wednesday**: Check outreach status, send follow-ups
- **Friday**: Update records, plan next week
- **Monthly**: Run suggestion engine, plan next quarter

---

## Getting Help

### Use Claude Skills:
Located in `skills/` folder:
- `draft-outreach-email.md`
- `generate-internal-invite.md`
- `research-contact.md`
- `suggest-partners.md`
- `summarize-audio.md`

### Check Documentation:
- `SYSTEM_PLAN.md` - Overall architecture
- `TROUBLESHOOTING.md` - Common issues
- `PROJECT_LOG.md` - Daily progress
- `dashboard/README.md` - Dashboard setup

### Team Collaboration:
- Weekly sync on active outreach
- Share templates that worked well
- Divide vertical ownership
- Celebrate successes together

---

**Last Updated:** 2026-02-03
**Version:** 1.0
**Next Review:** After first month of use
