# Skill: Summarize Audio and Extract Action Items

## Purpose
Transform voice notes, recorded conversations, and messy verbal brainstorming into clean, actionable summaries with clear next steps.

## How to Use This Skill

### Trigger Phrase
- "Summarize this audio"
- "Turn this voice note into action items"
- "Clean up this conversation"
- "Extract decisions from this recording"

### What You Can Provide
1. **Audio Recording** - Upload audio file (MP3, M4A, WAV, etc.)
2. **Transcript** - If you already have text transcript
3. **Context** - What the conversation was about (optional but helpful)

### Example Usage

**User:**
"Summarize this voice note. It's from our team meeting about potential L&L partners for Q2."
[Uploads audio file]

**Claude Will:**
1. Listen to/read the audio
2. Identify main topics discussed
3. Extract key decisions made
4. List action items with owners
5. Note open questions
6. Provide clean summary in structured format

## Output Format

Return a structured summary:

```
=== SUMMARY: [TOPIC/MEETING NAME] ===
Date: [Date]
Participants: [If known]
Duration: [If known]

OVERVIEW:
[2-3 sentence summary of what was discussed]

KEY POINTS:
- [Main point 1]
- [Main point 2]
- [Main point 3]
[etc.]

DECISIONS MADE:
- [Decision 1]
- [Decision 2]
[etc.]

ACTION ITEMS:
[ ] [Task 1] - Owner: [Name] - Due: [Date if mentioned]
[ ] [Task 2] - Owner: [Name] - Due: [Date if mentioned]
[etc.]

OPEN QUESTIONS:
- [Question 1]
- [Question 2]
[etc.]

NEXT STEPS:
[What happens next - next meeting, follow-up needed, etc.]

RELEVANT CONTEXT/NOTES:
[Any additional context that doesn't fit above but is useful]
```

## Example Output

```
=== SUMMARY: Q2 Lunch & Learn Planning ===
Date: February 3, 2026
Participants: Joshua, Elliot, John
Duration: ~15 minutes

OVERVIEW:
Team discussed potential Lunch & Learn partners for Q2 (March-May 2026). Focus is on balancing verticals while prioritizing AI/emerging tech per director request. Team wants to maintain mix of educational sessions and relationship-building opportunities.

KEY POINTS:
- OpenAI is top priority due to recent ads platform announcement
- Need to balance away from heavy social media focus from Q4 2025
- Should target 1 L&L per month in Q2 (3 total)
- LA-based partners preferred for in-person sessions
- Team wants to do one "cultural" partner that's less obvious

DECISIONS MADE:
- OpenAI will be pursued as March priority
- Elliot will take lead on streaming partners (Netflix, Hulu research)
- John will explore OOH partners for April
- Joshua handles AI partner research and outreach

ACTION ITEMS:
[ ] Research OpenAI contact (partnerships or ads team) - Owner: Joshua - Due: This week
[ ] Draft OpenAI outreach email - Owner: Joshua - Due: After contact found
[ ] Compile list of 3 streaming options - Owner: Elliot - Due: Next week
[ ] Research Netflix and Hulu contacts - Owner: Elliot - Due: Next week
[ ] Suggest cultural/trend partners for May - Owner: John - Due: Next meeting
[ ] Update partner database with assignments - Owner: Joshua - Due: End of week

OPEN QUESTIONS:
- Do we have any internal connections at OpenAI?
- What's our budget for food in Q2?
- Should we do any virtual sessions or all in-person?
- When is the best time to bring in Netflix given they're still developing their ad tier?

NEXT STEPS:
Team meets next Monday to review progress. Joshua will send update on OpenAI contact research by Friday. Elliot and John will present their respective research at next meeting.

RELEVANT CONTEXT/NOTES:
- Director specifically mentioned wanting AI content ASAP after seeing OpenAI ads announcement
- Genius, Pinterest, and Outfront were most successful L&Ls in 2025 - use as benchmarks
- Team wants to avoid too many Zoom sessions - energy is better in-person
```

## Use Cases

### 1. Post-Lunch & Learn Debrief
**When:** Right after an L&L session
**Extract:**
- Key takeaways from presentation
- Questions asked by team
- Potential follow-up opportunities
- Ideas generated
- Partner feedback

### 2. Planning Sessions
**When:** Team brainstorming L&L ideas
**Extract:**
- Partners discussed
- Vertical focus decisions
- Timeline and scheduling
- Who owns what
- Next meeting topics

### 3. Partner Phone Calls
**When:** Coordination calls with potential speakers
**Extract:**
- What was confirmed
- Logistics discussed
- Deck/materials needed
- Follow-up required
- Open items

### 4. Quick Voice Notes
**When:** Individual brainstorming or ideas
**Extract:**
- Main idea/thought
- Why it matters
- What to do about it
- Connections to current work

### 5. Client Relevance Discussions
**When:** Talking about which partners fit client needs
**Extract:**
- Client mentioned
- Partner suggestions
- Relevance reasoning
- Timing considerations

## Quality Checklist
- [ ] All key decisions are captured
- [ ] Action items have clear owners
- [ ] Deadlines are noted (even if approximate)
- [ ] Open questions are listed
- [ ] Summary is scannable (bullet points, headers)
- [ ] Context is preserved
- [ ] No important details lost

## Best Practices

### Do:
- **Be specific** in action items (not vague like "follow up")
- **Name owners** for every action item
- **Capture dates** mentioned, even if loose ("next week")
- **Preserve reasoning** behind decisions
- **Note dissenting opinions** if valuable
- **Flag urgent items** clearly
- **Include next steps** so momentum continues

### Don't:
- Editorialize or add opinions not in the audio
- Skip small details that might matter later
- Lose important context by over-summarizing
- Forget to note who said what (if it matters)
- Make up action items that weren't discussed
- Assume - if unclear, note it as open question

## Advanced Use Cases

### Create Event Recap
After an L&L, summarize:
- Speaker's main points
- Attendee questions and discussion
- Key insights for future reference
- Follow-up opportunities with partner

**Use For:** Post-event emails, database updates, sharing with leadership

### Turn Brainstorm into Strategy Doc
Take messy team discussion and create:
- Structured strategy document
- Clear phases and timeline
- Ownership model
- Success metrics

**Use For:** Formalizing plans, getting buy-in, project documentation

### Generate Meeting Notes for Stakeholders
Clean up conversation to share with:
- Team members who couldn't attend
- Leadership who needs executive summary
- Partners being discussed
- Cross-functional collaborators

**Use For:** Communication, alignment, transparency

## Tips for Better Audio
- Record in quiet environment if possible
- Speak clearly and mention names
- State decisions explicitly ("We decided...")
- Verbalize action items ("So Josh will...")
- Recap at end if you can
- Note date/time at beginning

## Related Skills
- `draft-outreach-email.md` - Turn action items into outreach
- `generate-internal-invite.md` - Use recap to create promo materials
- `suggest-partners.md` - Reference when discussing strategy
