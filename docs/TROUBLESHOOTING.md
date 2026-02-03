# Lunch & Learn System - Troubleshooting Guide

**Purpose:** Document common errors, their causes, and solutions. Update this when you encounter and fix issues to prevent future headaches.

---

## Dashboard Issues

### Error: "Error loading data"

**Symptom:** Dashboard shows error message instead of loading partner data

**Cause:**
- Opening `index.html` directly from file system instead of via web server
- Browser security blocks local file access (CORS policy)

**Solution:**
```bash
# Option 1: Python (recommended)
cd /path/to/Lunch-Learn-Bot
python3 -m http.server 8000
# Then open http://localhost:8000/dashboard/

# Option 2: Node.js
npm install -g http-server
http-server -p 8000
# Then open http://localhost:8000/dashboard/
```

**Prevention:**
- Always use a local web server for the dashboard
- Add to workflow documentation
- Consider creating a startup script

---

### Dashboard not updating after data changes

**Symptom:** Made changes to JSON files but dashboard still shows old data

**Cause:**
- Browser cache holding old data
- JSON file not saved properly

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on Mac)
2. Clear browser cache
3. Verify JSON file was actually saved (open in text editor)
4. Check for JSON syntax errors (trailing commas, missing brackets)

**Prevention:**
- Always hard refresh after data updates
- Use a JSON validator before saving
- Consider adding timestamp to data files for cache busting

---

### Templates not displaying in modal

**Symptom:** Clicking "View Template" opens modal but shows blank or error

**Cause:**
- Template file path incorrect
- Template file doesn't exist
- Markdown rendering issue

**Solution:**
1. Check file exists at `templates/emails/[filename].md` or `templates/internal-comms/[filename].md`
2. Verify path in `app.js` matches actual file location
3. Check browser console for specific error

**Prevention:**
- Don't move template files without updating paths
- Keep consistent naming conventions

---

## Data Issues

### JSON syntax errors

**Symptom:** Dashboard won't load or shows partial data

**Cause:**
- Trailing commas in JSON
- Missing brackets or braces
- Unescaped quotes in strings

**Solution:**
```bash
# Validate JSON files
python3 -m json.tool data/partner-database.json
python3 -m json.tool data/events-log.json
python3 -m json.tool data/outreach-tracker.json
```

If errors are shown, open the file and fix the syntax issue.

**Prevention:**
- Use a JSON validator/linter when editing
- Copy existing entries as templates
- Test after each edit

---

### Partner not showing up in dashboard

**Symptom:** Added partner to database but not visible in dashboard

**Cause:**
- Filters hiding the partner
- JSON syntax error preventing full file load
- Browser cache

**Solution:**
1. Reset all filters in dashboard to "All"
2. Validate JSON syntax
3. Hard refresh browser
4. Check partner entry has all required fields

**Prevention:**
- Use existing partner entry as template
- Validate JSON after adding
- Check filters before assuming data issue

---

## Email Template Issues

### Missing variables in generated emails

**Symptom:** Email has `[VARIABLE_NAME]` placeholders instead of actual content

**Cause:**
- Forgot to fill in that variable
- Variable name misspelled

**Solution:**
1. Review template's "Variables to Fill" section
2. Check that all variables were provided
3. Verify variable names match exactly (case-sensitive)

**Prevention:**
- Use template checklist before sending
- Create a preflight process
- Consider building a template generator script

---

### Email tone feels off

**Symptom:** Generated email doesn't match TBWA voice/style

**Cause:**
- Template wasn't customized enough
- Used wrong template variation
- Didn't adjust for context

**Solution:**
1. Review tone guidelines in template
2. Add personality while keeping professional base
3. Read out loud - does it sound natural?
4. Reference past successful emails (Genius, Pinterest, Outfront)

**Prevention:**
- Save examples of well-received emails
- Get team feedback on new templates
- Iterate based on response rates

---

## Suggestion Engine Issues

### Suggestion script fails to run

**Symptom:** `python3 suggest-partners.py` shows error

**Cause:**
- Not in correct directory
- JSON files corrupted
- Python version issue

**Solution:**
```bash
# Make sure you're in project root
cd /path/to/Lunch-Learn-Bot

# Check Python version (needs 3.6+)
python3 --version

# Run script
python3 suggest-partners.py

# If permission error
chmod +x suggest-partners.py
```

**Prevention:**
- Always run from project root
- Document required Python version

---

### Suggestions seem irrelevant

**Symptom:** Suggested partners don't match current needs

**Cause:**
- Partner database tags/notes not updated
- Suggestion algorithm doesn't know current priorities
- Completed L&Ls not marked in database

**Solution:**
1. Update partner database with current context
2. Add tags like "Current Priority" for urgent needs
3. Mark completed L&Ls in events log
4. Update partner status fields

**Prevention:**
- Keep database updated in real-time
- Weekly review of partner statuses
- Tag partners strategically

---

## Contact Research Issues

### Can't find email address

**Symptom:** Found the right person but no email

**Cause:**
- Email not public
- Company uses uncommon email pattern
- Contact is very senior (assistant handles email)

**Solution:**
1. Try LinkedIn InMail instead
2. Call company main line, ask for partnership team
3. Use company's general partnerships email
4. Check Hunter.io or similar tools for email pattern
5. Find someone else at company who's more accessible

**Prevention:**
- Don't spend too long on one contact
- Have backup contacts ready
- Sometimes calling is faster than searching

---

### LinkedIn profile doesn't match current role

**Symptom:** LinkedIn shows old job, unsure if still at company

**Cause:**
- Profile not updated
- Person left company

**Solution:**
1. Check recent LinkedIn activity (posts, comments)
2. Google "[Person name] [Company]" for recent mentions
3. Check company website team page
4. Call company to verify
5. Find replacement if they left

**Prevention:**
- Always check profile update date
- Verify through multiple sources
- Have backup contacts

---

## Workflow Issues

### Lost track of where we are with a partner

**Symptom:** Can't remember if we contacted them, what was said, etc.

**Cause:**
- Didn't update outreach tracker
- Email lost in inbox
- No central tracking

**Solution:**
1. Search email for company name
2. Check outreach-tracker.json
3. Update tracker with current status
4. Going forward, log every interaction

**Prevention:**
- Update tracker immediately after each interaction
- Use status updates in real-time
- Weekly review of all active outreach

---

### Scheduled L&L but forgot to send reminders

**Symptom:** Day of event, attendance is low

**Cause:**
- No reminder emails sent
- Team forgot about event
- Calendar invites not sent

**Solution:**
For this event (damage control):
1. Send urgent "Today!" email and Teams message
2. Slack/call key people personally
3. Post in visible channels

**Prevention:**
- Set calendar reminders for:
  - 1 week before: Send announcement
  - Day before: Send reminder
  - Day of: Send reminder
- Use internal comms templates
- Consider automating reminder sequence

---

### Multiple people reaching out to same partner

**Symptom:** Confusion, looks unprofessional

**Cause:**
- No coordination
- Outreach tracker not checked
- Vertical ownership unclear

**Solution:**
1. Check outreach tracker before any outreach
2. Team huddle to clarify who owns what
3. Update tracker with "owner" field

**Prevention:**
- Single source of truth (outreach tracker)
- Assign vertical ownership
- Weekly sync on active outreach

---

## OneDrive Sync Issues

### Changes not syncing across devices

**Symptom:** Updated on desktop, not showing on laptop

**Cause:**
- OneDrive not syncing
- Conflict between versions
- Network issue

**Solution:**
1. Check OneDrive sync status
2. Force sync if needed
3. Resolve any conflicts (keep most recent)
4. Wait a minute and refresh

**Prevention:**
- Don't edit same file simultaneously on different devices
- Let OneDrive fully sync before closing laptop
- Check sync status regularly

---

## Common Error Messages

### "File not found" errors

**What it means:** System can't find a file it's looking for

**Common causes:**
- File was moved or renamed
- Path is wrong
- Typo in filename

**How to fix:**
- Check file exists where system expects
- Verify spelling exactly matches
- Update paths if files moved

---

### "Permission denied" errors

**What it means:** Don't have permission to access/edit file

**Common causes:**
- File opened in another program
- Read-only file
- OneDrive sync conflict

**How to fix:**
- Close file in other programs
- Check file properties, remove read-only
- Resolve OneDrive conflicts

---

## When to Ask for Help

### You should troubleshoot yourself when:
- Error message is clear and searchable
- It's in this troubleshooting guide
- You can test simple fixes quickly

### You should ask for help when:
- Same error happens repeatedly after trying fixes
- Data loss risk (backup first!)
- Error message is cryptic/unhelpful
- System-wide issue affecting team

### Who to ask:
- Team members (might have seen same issue)
- IT/technical support for infrastructure issues
- Developer community for code issues

---

## Adding to This Guide

When you encounter and fix a new issue:

1. **Document the problem**
   - Symptom (what you saw)
   - Cause (why it happened)
   - Solution (how you fixed it)
   - Prevention (how to avoid it)

2. **Add it to this file**
   - Under relevant section
   - Clear formatting
   - Include code/commands if applicable

3. **Update PROJECT_LOG.md**
   - Note that you added to troubleshooting
   - Link to this doc

4. **Tell the team**
   - Share the fix
   - Update everyone to prevent spread

---

**Last Updated:** 2026-02-03
**Total Issues Documented:** 15
**Next Review:** When new issues arise
