# Dashboard Setup Instructions

## Running the Dashboard

The dashboard is a lightweight HTML/CSS/JavaScript application that reads from the JSON data files.

### Option 1: Using Python (Recommended)

```bash
# From the root directory of the project
python3 -m http.server 8000
```

Then open your browser to: `http://localhost:8000/dashboard/`

### Option 2: Using Node.js

```bash
# Install http-server globally if you don't have it
npm install -g http-server

# From the root directory
http-server -p 8000
```

Then open your browser to: `http://localhost:8000/dashboard/`

### Option 3: OneDrive

1. Copy the entire `Lunch-Learn-Bot` folder to your OneDrive
2. Open `dashboard/index.html` directly in your browser
3. Note: Some browsers may block local file access. If this happens, use Option 1 or 2.

## Dashboard Features

### Dashboard Tab
- Urgent opportunities (high-priority partners)
- Upcoming events
- Vertical distribution chart
- Recent activity log

### Partner Database Tab
- Full searchable partner database
- Filter by vertical, status
- Search by company, contact, or notes
- View all partner details

### Outreach Tracker Tab
- Kanban-style board showing outreach pipeline
- Stages: Researching → Contacted → In Conversation → Scheduled
- View priority and next steps for each

### Events Tab
- Past events with attendance and feedback
- Event details and ratings

### Templates Tab
- All email templates (outreach, follow-up, scheduling, confirmation, thank you)
- All internal communication templates (announcements, reminders, Teams messages)
- Click to view full template with variables and examples

## Updating Data

The dashboard reads from the JSON files in the `data/` directory. To update:

1. Edit the JSON files directly, or
2. Use the Python suggestion engine to analyze and update data
3. Refresh the dashboard in your browser to see changes

## Customization

- **Colors**: Edit `styles.css` to change color scheme
- **Layout**: Modify `index.html` for structure changes
- **Data Display**: Edit `app.js` for how data is rendered

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

## Troubleshooting

**Dashboard shows "Error loading data":**
- Make sure you're running a local server (Options 1 or 2 above)
- Don't open `index.html` directly from file system

**Templates not loading:**
- Check that template files exist in `templates/` directory
- Ensure file paths are correct in the dashboard

**Data not updating:**
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
