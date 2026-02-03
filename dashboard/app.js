// Global data storage
let partnersData = null;
let eventsData = null;
let outreachData = null;
let suggestionsData = null;

// Initialize dashboard on load
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllData();
    renderDashboard();
    renderPartners();
    renderOutreach();
    renderEvents();
});

// Load all JSON data
async function loadAllData() {
    try {
        const [partners, events, outreach, suggestions] = await Promise.all([
            fetch('../data/partner-database.json').then(r => r.json()),
            fetch('../data/events-log.json').then(r => r.json()),
            fetch('../data/outreach-tracker.json').then(r => r.json()),
            fetch('../data/suggestions-log.json').then(r => r.json())
        ]);

        partnersData = partners;
        eventsData = events;
        outreachData = outreach;
        suggestionsData = suggestions;

        updateHeaderStats();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Make sure you are running a local server.');
    }
}

// Update header statistics
function updateHeaderStats() {
    document.getElementById('total-partners').textContent = partnersData.partners.length;
    document.getElementById('active-outreach').textContent = outreachData.outreach.length;
    document.getElementById('completed-events').textContent =
        eventsData.events.filter(e => e.status === 'Completed').length;
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Render Dashboard Tab
function renderDashboard() {
    renderUrgentOpportunities();
    renderUpcomingEvents();
    renderVerticalDistribution();
    renderRecentActivity();
}

function renderUrgentOpportunities() {
    const container = document.getElementById('urgent-opportunities');
    const urgent = partnersData.partners
        .filter(p => p.tags.some(tag => ['Current Priority', 'Urgent', 'High Priority'].includes(tag)))
        .filter(p => p.status !== 'Completed')
        .slice(0, 3);

    if (urgent.length === 0) {
        container.innerHTML = '<p style="color: #666;">No urgent opportunities at this time.</p>';
        return;
    }

    container.innerHTML = urgent.map(partner => `
        <div class="card">
            <h3>${partner.company}</h3>
            <p><strong>Vertical:</strong> ${partner.vertical}</p>
            <p><strong>Status:</strong> ${partner.status}</p>
            <p><strong>Next Action:</strong> ${partner.nextAction}</p>
            <div>
                ${partner.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderUpcomingEvents() {
    const container = document.getElementById('upcoming-events');
    const upcoming = eventsData.upcoming || [];

    if (upcoming.length === 0) {
        container.innerHTML = '<p style="color: #666;">No upcoming events scheduled. Time to plan the next one!</p>';
        return;
    }

    container.innerHTML = upcoming.map(event => `
        <div class="event-item">
            <h3>${event.company}</h3>
            <div class="event-meta">
                <strong>${event.date}</strong> at ${event.time} | ${event.location}
            </div>
            <p>${event.topic}</p>
        </div>
    `).join('');
}

function renderVerticalDistribution() {
    const container = document.getElementById('vertical-distribution');
    const distribution = {};

    partnersData.partners.forEach(p => {
        distribution[p.vertical] = (distribution[p.vertical] || 0) + 1;
    });

    const max = Math.max(...Object.values(distribution));
    const sorted = Object.entries(distribution).sort((a, b) => b[1] - a[1]);

    container.innerHTML = sorted.map(([vertical, count]) => {
        const percentage = (count / max) * 100;
        return `
            <div class="chart-bar">
                <div class="chart-label">
                    <span>${vertical}</span>
                    <span>${count} partners</span>
                </div>
                <div class="chart-fill" style="width: ${percentage}%;"></div>
            </div>
        `;
    }).join('');
}

function renderRecentActivity() {
    const container = document.getElementById('recent-activity');
    const activities = [];

    // Add recent partner additions
    partnersData.partners
        .filter(p => p.dateAdded)
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, 5)
        .forEach(p => {
            activities.push({
                date: p.dateAdded,
                description: `Added ${p.company} to ${p.vertical} vertical`
            });
        });

    if (activities.length === 0) {
        container.innerHTML = '<p style="color: #666;">No recent activity.</p>';
        return;
    }

    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="date">${formatDate(activity.date)}</div>
            <div class="description">${activity.description}</div>
        </div>
    `).join('');
}

// Render Partners Tab
function renderPartners() {
    // Populate filters
    const verticalFilter = document.getElementById('vertical-filter');
    const statusFilter = document.getElementById('status-filter');

    partnersData.verticals.forEach(vertical => {
        const option = document.createElement('option');
        option.value = vertical;
        option.textContent = vertical;
        verticalFilter.appendChild(option);
    });

    partnersData.statusOptions.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusFilter.appendChild(option);
    });

    // Render table
    filterPartners();
}

function filterPartners() {
    const verticalFilter = document.getElementById('vertical-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    let filtered = partnersData.partners.filter(p => {
        const matchesVertical = verticalFilter === 'all' || p.vertical === verticalFilter;
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchesSearch = !searchTerm ||
            p.company.toLowerCase().includes(searchTerm) ||
            (p.contact.name && p.contact.name.toLowerCase().includes(searchTerm)) ||
            p.notes.toLowerCase().includes(searchTerm);

        return matchesVertical && matchesStatus && matchesSearch;
    });

    const container = document.getElementById('partners-table');
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Company</th>
                    <th>Vertical</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Next Action</th>
                    <th>Tags</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.map(p => `
                    <tr>
                        <td><strong>${p.company}</strong></td>
                        <td>${p.vertical}</td>
                        <td>${p.contact.name || 'TBD'}<br>
                            <small style="color: #666;">${p.contact.title || 'Contact needed'}</small>
                        </td>
                        <td><span class="status-badge status-${p.status.toLowerCase().replace(/\s+/g, '-')}">${p.status}</span></td>
                        <td><small>${p.nextAction || 'N/A'}</small></td>
                        <td>${p.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Render Outreach Tab
function renderOutreach() {
    const container = document.getElementById('outreach-board');
    const stages = {
        'Researching': [],
        'Contacted': [],
        'In Conversation': [],
        'Scheduled': []
    };

    outreachData.outreach.forEach(item => {
        if (stages[item.stage]) {
            stages[item.stage].push(item);
        }
    });

    container.innerHTML = Object.entries(stages).map(([stage, items]) => `
        <div class="kanban-column">
            <h3>${stage} (${items.length})</h3>
            ${items.map(item => `
                <div class="kanban-card">
                    <h4>${item.company}</h4>
                    <p><strong>Sender:</strong> ${item.sender}</p>
                    <p><strong>Priority:</strong> ${item.priority}</p>
                    <p><small>${item.nextStep}</small></p>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// Render Events Tab
function renderEvents() {
    const container = document.getElementById('past-events');
    const past = eventsData.events.filter(e => e.status === 'Completed');

    container.innerHTML = past.map(event => `
        <div class="event-item">
            <h3>${event.company} - ${event.topic}</h3>
            <div class="event-meta">
                <strong>${event.date}</strong> | ${event.actualAttendees} attendees | ${event.food}
            </div>
            <p>${event.description}</p>
            ${event.feedback ? `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                    <strong>Rating:</strong> ${event.feedback.rating}/5<br>
                    <strong>Notes:</strong> ${event.feedback.notes}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Template Modal
function viewTemplate(templatePath) {
    const modal = document.getElementById('template-modal');
    const content = document.getElementById('template-content');

    fetch(`../${templatePath}`)
        .then(r => r.text())
        .then(text => {
            // Simple markdown to HTML conversion
            const html = text
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

            content.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit;">${html}</pre>`;
            modal.classList.add('active');
        })
        .catch(error => {
            content.innerHTML = '<p>Error loading template.</p>';
            modal.classList.add('active');
        });
}

function closeModal() {
    document.getElementById('template-modal').classList.remove('active');
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('template-modal');
    if (event.target === modal) {
        closeModal();
    }
}
