# Skill: Generate Internal Event Invite

## Purpose
Create all internal communications needed to promote a confirmed Lunch & Learn to the TBWA team, including email announcements, reminders, and Teams messages.

## How to Use This Skill

### Trigger Phrase
"Generate internal invite for [COMPANY] Lunch & Learn on [DATE]"

### Required Information
Provide Claude with:
1. **Company Name** - Partner presenting
2. **Speaker Name & Title** - Who is presenting
3. **Topic** - Main focus area
4. **Date & Time** - When it's happening
5. **Location** - Where (room name or virtual link)
6. **Food** - What food is being provided (people care!)
7. **Why It Matters** - 2-3 sentences on relevance to our work

### Optional Information
- **Target Audience** - All-agency vs. specific departments
- **RSVP Required** - Yes/No
- **Special Notes** - Anything unique about this session

### Example Usage

**User:**
"Generate internal invite for OpenAI Lunch & Learn on March 5th at 12 PM. Speaker is Sarah Chen, Head of Advertising Partnerships. Topic is AI-Powered Advertising. Location is Main Conference Room. Food is Chipotle. Why it matters: First look at their new ad platform, helps us understand AI applications for client work, relevant for media and strategy teams thinking about the future of advertising."

**Claude Will:**
1. Generate initial email announcement (1 week out)
2. Generate day-before reminder email
3. Generate day-of reminder email
4. Generate Teams message variations (initial + reminders)
5. Provide all in ready-to-send format

## Template References
Uses templates from:
- `templates/internal-comms/email-announcement.md`
- `templates/internal-comms/email-reminder-tomorrow.md`
- `templates/internal-comms/email-reminder-today.md`
- `templates/internal-comms/teams-message.md`

## Communication Sequence

### 1. Initial Announcement (1 Week Out)
**Format:** Full email
**Audience:** All-agency or department-specific
**Content:**
- WHO (speaker, title, company)
- WHAT (topic)
- WHEN (date, time)
- WHERE (location)
- WHY IT MATTERS (relevance to our work)
- FOOD (what's being served)
- RSVP if needed

**Tone:** Energetic, informative, professional

### 2. Day Before Reminder
**Format:** Brief email
**Content:**
- Quick reminder with essential details
- Topic, time, location, food
- Keep it concise

**Tone:** Friendly reminder

### 3. Day Of Reminder
**Format:** Ultra-brief email
**Content:**
- "Happening in a few hours!"
- Time, location, food
- No extra context needed

**Tone:** Urgent but friendly

### 4. Teams Messages
**Format:** Informal posts
**Content:**
- Initial announcement (casual version of email)
- Day before reminder (very brief)
- Day of reminder (one-liner)

**Tone:** Casual, hype-building, no emojis

## Output Format
Return a complete communication package:

```
=== EMAIL #1: INITIAL ANNOUNCEMENT (Send 1 week before) ===
Subject: ...
Body: ...

=== EMAIL #2: DAY BEFORE REMINDER ===
Subject: ...
Body: ...

=== EMAIL #3: DAY OF REMINDER ===
Subject: ...
Body: ...

=== TEAMS MESSAGE #1: INITIAL ===
...

=== TEAMS MESSAGE #2: DAY BEFORE ===
...

=== TEAMS MESSAGE #3: DAY OF ===
...
```

## Tone Guidelines
- **Email**: Professional but energetic, make people excited
- **Teams**: More casual, punchy, build hype
- **No emojis** unless explicitly requested
- Always mention the food (people love this)
- Make "why it matters" specific and compelling
- Use active voice and clear language

## Audience Customization

### All-Agency Blast
- Broad appeal messaging
- Highlight value for multiple disciplines
- General invite

### Department-Specific (Media, Strategy, Creative)
- Tailor "why it matters" to that department
- Explain specific relevance to their work
- Can be more technical/specific

### VIP List
- More personalized
- Can mention specific projects or pitches
- Highlight strategic value

## Quality Checklist
Before sending, verify:
- [ ] Date and time are correct
- [ ] Location is specific and clear
- [ ] Speaker name and title are accurate
- [ ] Company name is spelled correctly
- [ ] Food is mentioned in all communications
- [ ] "Why it matters" is compelling and specific
- [ ] Subject lines are clear and scannable
- [ ] No typos or grammatical errors
- [ ] Tone matches TBWA culture (professional but not stuffy)

## Best Practices
- Send initial announcement exactly 1 week before
- Send day-before reminder in the morning (9-10 AM)
- Send day-of reminder in the morning (9-10 AM)
- Post Teams messages shortly after emails
- Include calendar invite with initial email
- Make subject lines scannable (people skim)
- Lead with the most exciting info

## Related Skills
- `draft-outreach-email.md` - Get the partner confirmed first
- `summarize-audio.md` - Create post-event recap
