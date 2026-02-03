# Skill: Suggest Partners for Lunch & Learn

## Purpose
Generate intelligent partner suggestions based on strategic priorities, vertical balance, industry trends, and team needs.

## How to Use This Skill

### Trigger Phrase
- "Suggest partners for [VERTICAL]"
- "What partners should we bring in?"
- "Balance our L&L verticals"
- "Suggest partners for [CLIENT/TOPIC]"

### Information to Provide
Depending on the request type:

**For Vertical-Specific:**
- Target vertical (Social Media, Streaming, AI, OOH, etc.)
- Timeframe (Q1, next month, etc.)

**For Balance Analysis:**
- Recent L&L history (or Claude will analyze database)

**For Client-Relevant:**
- Client name or industry
- Current projects or pitches
- Specific challenges or opportunities

### Example Usage

**User:**
"Suggest AI and emerging tech partners. We want to bring someone in ASAP because our director is prioritizing AI."

**Claude Will:**
1. Analyze partner database for AI/Emerging Tech vertical
2. Check current trends and recent announcements
3. Prioritize by urgency, relevance, and feasibility
4. Provide ranked suggestions with reasoning
5. Include contact research needs
6. Suggest timing and approach

## Suggestion Criteria

### Priority Factors
1. **Urgency/Timeliness** - Recent launches, announcements, trending topics
2. **Client Relevance** - Aligns with current client work or pitches
3. **Team Gaps** - Fills knowledge or skill gaps
4. **Vertical Balance** - Ensures diverse programming
5. **Relationship Value** - Core platforms we should know well
6. **Accessibility** - LA-based preferred, existing connections helpful

### Scoring System
Each suggestion gets rated on:
- **Priority Level**: Urgent / High / Medium / Low
- **Ease of Contact**: Easy (have contact) / Medium (need research) / Hard (cold outreach)
- **LA Preference**: Yes / No / Flexible
- **Team Relevance**: All Agency / Specific Departments

## Types of Suggestions

### 1. Vertical-Focused
**Request:** "Suggest streaming partners"

**Claude Will Suggest:**
- All streaming platforms in database (Netflix, Hulu, etc.)
- Prioritize by: Not yet contacted > Contacted > Completed
- Add relevant new platforms not in database
- Explain timing and relevance for each

### 2. Balance-Focused
**Request:** "Balance our verticals"

**Claude Will:**
1. Analyze current distribution
2. Identify underrepresented verticals
3. Suggest partners from those verticals
4. Explain why balance matters

### 3. Trend-Focused
**Request:** "What's hot right now?"

**Claude Will:**
1. Identify recent industry news/launches
2. Match to partners in database
3. Suggest new partners based on trends
4. Flag urgent opportunities

### 4. Client-Focused
**Request:** "Suggest partners for our Gatorade work"

**Claude Will:**
1. Identify relevant verticals (sports, social, gaming, etc.)
2. Match to partners who can inform sports marketing
3. Prioritize platforms Gatorade uses or should consider
4. Suggest specific topics for each

### 5. Gap Analysis
**Request:** "What are we missing?"

**Claude Will:**
1. Analyze past L&Ls by vertical
2. Identify underrepresented categories
3. Spot emerging areas we haven't covered
4. Suggest strategic additions

## Output Format

Return suggestions in this structure:

```
=== PARTNER SUGGESTIONS: [CATEGORY/REQUEST] ===

CONTEXT:
[Brief analysis of current situation, gaps, or trends]

TOP SUGGESTIONS:

1. [COMPANY NAME] - [VERTICAL]
   Priority: [Urgent/High/Medium/Low]
   Reasoning: [Why this partner, why now]
   Relevant To: [Which teams/clients/projects]
   Contact Status: [Have contact / Need research / Cold outreach]
   LA-Based: [Yes/No]
   Suggested Topic: [What they should present on]
   Next Action: [What to do next]

2. [COMPANY NAME] - [VERTICAL]
   [Same structure]

3. [Continue for 3-5 suggestions]

EMERGING OPPORTUNITIES:
[New partners not in database but worth considering]

TIMING RECOMMENDATIONS:
[When to pursue each, in what order]

VERTICAL BALANCE UPDATE:
[If applicable - show how these suggestions affect balance]
```

## Example Output

```
=== PARTNER SUGGESTIONS: AI & EMERGING TECH ===

CONTEXT:
AI is top priority per director request. Current database shows only 1 AI partner (OpenAI) in research phase. With recent AI advertising announcements and client interest growing, this vertical needs immediate attention.

TOP SUGGESTIONS:

1. OpenAI - AI/Emerging Tech
   Priority: URGENT
   Reasoning: Just announced advertising platform - highly timely. Director specifically requested. First-mover in AI ads space.
   Relevant To: All teams - media (new ad platform), creative (AI tools), strategy (AI integration)
   Contact Status: Need research - targeting partnerships/marketing lead
   LA-Based: No (San Francisco) but worth the ask for remote/in-person
   Suggested Topic: "AI-Powered Advertising: OpenAI's New Platform and What It Means for Brands"
   Next Action: Research contact ASAP, send outreach this week

2. Anthropic (Claude AI) - AI/Emerging Tech
   Priority: HIGH
   Reasoning: Claude is becoming major OpenAI alternative. Focus on enterprise and safety. Different approach worth understanding.
   Relevant To: Strategy, Technology teams - less advertising-focused, more about AI integration
   Contact Status: Cold outreach needed
   LA-Based: No (San Francisco)
   Suggested Topic: "Enterprise AI: How Brands Can Leverage Claude for Customer Service and Content"
   Next Action: Research business development contacts, target for Q2

3. Midjourney - AI/Emerging Tech
   Priority: MEDIUM
   Reasoning: AI image generation is critical for creative teams. Understanding capabilities and limitations valuable.
   Relevant To: Creative, Art direction, Strategy
   Contact Status: Cold outreach needed
   LA-Based: Unknown
   Suggested Topic: "AI Image Generation: Creative Possibilities and Practical Applications"
   Next Action: Research contact, consider for after OpenAI session

EMERGING OPPORTUNITIES:
- Runway ML (AI video generation - very hot right now)
- Perplexity AI (search + AI, potential advertising platform)
- ElevenLabs (AI voice - relevant for audio/podcast work)

TIMING RECOMMENDATIONS:
1. OpenAI - Immediate (this month if possible)
2. Anthropic - Q2 (March-April)
3. Midjourney - Q2 (April-May)

VERTICAL BALANCE UPDATE:
Adding 2-3 AI partners would bring AI/Emerging Tech to 3-4 total, putting it on par with Social Media (4) and ahead of Streaming (1). This feels appropriate given current industry momentum and director priority.
```

## Best Practices

### Do:
- **Be specific** about why each partner matters
- **Consider timing** - what's urgent vs. can wait
- **Think strategically** - how do suggestions work together
- **Balance** short-term needs with long-term goals
- **Flag LA-based** partners for easier coordination
- **Mention relevant clients** when applicable
- **Suggest specific topics** not just companies

### Don't:
- Suggest partners we just had (check recent history)
- Ignore director/leadership priorities
- Recommend too many from one vertical
- Forget about accessibility (some companies are hard to reach)
- Suggest without reasoning

## Common Request Types

### "We need ideas for next quarter"
Provide 8-10 suggestions across verticals, balanced mix, timing spread out

### "Emergency - need someone ASAP"
Focus on urgent opportunities, partners with existing contacts, LA-based preferred

### "What about [specific platform]?"
Deep dive on that one partner - why they make sense, when to bring them in, what to cover

### "We keep doing social media, what else?"
Identify underrepresented verticals, make case for diversifying

## Related Skills
- `research-contact.md` - Use after selecting a partner
- `draft-outreach-email.md` - Next step after research
