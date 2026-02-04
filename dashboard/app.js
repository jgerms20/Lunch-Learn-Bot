// Global data storage
let partnersData = null;
let eventsData = null;
let outreachData = null;
let suggestionsData = null;
let goalsData = null;
let currentEditingPartner = null;
let currentResearchPartner = null;

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
        showLoading('Loading data...');
        const [partners, events, outreach, suggestions, goals] = await Promise.all([
            fetch('../data/partner-database.json').then(r => r.json()),
            fetch('../data/events-log.json').then(r => r.json()),
            fetch('../data/outreach-tracker.json').then(r => r.json()),
            fetch('../data/suggestions-log.json').then(r => r.json()),
            fetch('../data/goals.json').then(r => r.json())
        ]);

        partnersData = partners;
        eventsData = events;
        outreachData = outreach;
        suggestionsData = suggestions;
        goalsData = goals;

        updateHeaderStats();
        updateLastRefreshedTime();
        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('Error loading data:', error);
        showToast('Error loading data. Make sure you are running a local server.', 'error');
    }
}

// Refresh data function
async function refreshData() {
    showToast('Refreshing data...', 'info');
    await loadAllData();

    // Re-render all views
    renderDashboard();
    renderPartners();
    renderOutreach();
    renderEvents();

    showToast('Data refreshed successfully!', 'success');
}

// Update last refreshed timestamp
function updateLastRefreshedTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('last-updated-time').textContent = `Last updated: ${timeString}`;
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
    renderGoals();
    renderUrgentOpportunities();
    renderUpcomingEvents();
    renderVerticalDistribution();
    renderRecentActivity();
}

// Render Goals Section
function renderGoals() {
    const container = document.getElementById('goals-grid');

    if (!goalsData || !goalsData.goals) {
        container.innerHTML = '<p>No goals data available.</p>';
        return;
    }

    container.innerHTML = goalsData.goals.map(goal => {
        const percentage = Math.round((goal.current / goal.target) * 100);
        const isComplete = percentage >= 100;

        return `
            <div class="goal-card ${isComplete ? 'goal-complete' : ''}">
                <div class="goal-icon">${goal.icon}</div>
                <div class="goal-content">
                    <h3>${goal.category}</h3>
                    <p class="goal-description">${goal.description}</p>
                    <div class="goal-stats">
                        <div class="goal-numbers">
                            <span class="current">${goal.current}</span>
                            <span class="separator">/</span>
                            <span class="target">${goal.target}</span>
                            <span class="unit">${goal.unit}</span>
                        </div>
                        <div class="goal-percentage">${percentage}%</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
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
        <div class="card urgent-card">
            <div class="urgent-badge">URGENT</div>
            <h3>${partner.company}</h3>
            <p><strong>Vertical:</strong> ${partner.vertical}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${partner.status.toLowerCase().replace(/\s+/g, '-')}">${partner.status}</span></p>
            <p><strong>Next Action:</strong> ${partner.nextAction}</p>
            <div class="card-tags">
                ${partner.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="card-actions">
                ${partner.status === 'Researching' ? `<button class="btn-action" onclick="openResearchModal('${partner.id}')">🔍 Research Contact</button>` : ''}
                <button class="btn-action" onclick="openEditPartnerModal('${partner.id}')">✏️ Edit</button>
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

    container.innerHTML = upcoming.slice(0, 5).map(event => `
        <div class="event-item upcoming-event">
            <div class="event-status ${event.status.toLowerCase()}">${event.status}</div>
            <h3>${event.company} - ${event.proposedTopic}</h3>
            <div class="event-meta">
                <strong>📅 ${event.proposedDate}</strong> ${event.estimatedTime ? `| ⏰ ${event.estimatedTime}` : ''} ${event.location !== 'TBD' ? `| 📍 ${event.location}` : ''}
            </div>
            <p>${event.description}</p>
            ${event.priority ? `<span class="priority-badge priority-${event.priority.toLowerCase()}">${event.priority} Priority</span>` : ''}
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
                    <span class="chart-count">${count} partners</span>
                </div>
                <div class="chart-bar-bg">
                    <div class="chart-fill" style="width: ${percentage}%;"></div>
                </div>
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
                description: `Added ${p.company} to ${p.vertical} vertical`,
                type: 'partner'
            });
        });

    if (activities.length === 0) {
        container.innerHTML = '<p style="color: #666;">No recent activity.</p>';
        return;
    }

    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.type === 'partner' ? '🤝' : '📅'}</div>
            <div class="activity-content">
                <div class="activity-description">${activity.description}</div>
                <div class="activity-date">${formatDate(activity.date)}</div>
            </div>
        </div>
    `).join('');
}

// Render Partners Tab
function renderPartners() {
    // Populate filters
    const verticalFilter = document.getElementById('vertical-filter');
    const statusFilter = document.getElementById('status-filter');

    // Clear existing options (keep "All" option)
    verticalFilter.innerHTML = '<option value="all">All Verticals</option>';
    statusFilter.innerHTML = '<option value="all">All Statuses</option>';

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
            p.notes.toLowerCase().includes(searchTerm) ||
            p.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        return matchesVertical && matchesStatus && matchesSearch;
    });

    const container = document.getElementById('partners-table');

    if (filtered.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">No partners found matching your filters.</p>';
        return;
    }

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
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.map(p => `
                    <tr class="partner-row" data-partner-id="${p.id}">
                        <td><strong>${p.company}</strong></td>
                        <td>${p.vertical}</td>
                        <td>${p.contact.name || '<em>TBD</em>'}<br>
                            <small style="color: #666;">${p.contact.title || 'Contact needed'}</small>
                        </td>
                        <td><span class="status-badge status-${p.status.toLowerCase().replace(/\s+/g, '-')}">${p.status}</span></td>
                        <td><small>${p.nextAction || 'N/A'}</small></td>
                        <td>${p.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}</td>
                        <td class="actions-cell">
                            ${p.status === 'Researching' ? `<button class="btn-icon" onclick="openResearchModal('${p.id}')" title="Research Contact">🔍</button>` : ''}
                            <button class="btn-icon" onclick="openEditPartnerModal('${p.id}')" title="Edit Partner">✏️</button>
                        </td>
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
            <div class="kanban-header">
                <h3>${stage}</h3>
                <span class="kanban-count">${items.length}</span>
            </div>
            <div class="kanban-cards">
                ${items.map(item => `
                    <div class="kanban-card">
                        <h4>${item.company}</h4>
                        <p><strong>Sender:</strong> ${item.sender}</p>
                        <p><strong>Priority:</strong> <span class="priority-badge priority-${item.priority.toLowerCase()}">${item.priority}</span></p>
                        <p class="kanban-next-step"><small>${item.nextStep}</small></p>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Render Events Tab
function renderEvents() {
    const container = document.getElementById('past-events');
    const past = eventsData.events.filter(e => e.status === 'Completed');

    if (past.length === 0) {
        container.innerHTML = '<p style="color: #666;">No past events yet.</p>';
        return;
    }

    container.innerHTML = past.map(event => `
        <div class="event-card">
            <div class="event-header">
                <h3>${event.company}</h3>
                ${event.feedback ? `<div class="event-rating">⭐ ${event.feedback.rating}/5</div>` : ''}
            </div>
            <h4>${event.topic}</h4>
            <div class="event-meta">
                <span>📅 ${event.date}</span>
                <span>👥 ${event.actualAttendees} attendees</span>
                <span>🍴 ${event.food}</span>
                <span>📍 ${event.location}</span>
            </div>
            <p class="event-description">${event.description}</p>
            ${event.feedback ? `
                <div class="event-feedback">
                    <strong>Key Takeaways:</strong>
                    <ul>
                        ${event.feedback.keyTakeaways.map(takeaway => `<li>${takeaway}</li>`).join('')}
                    </ul>
                    <p><strong>Notes:</strong> ${event.feedback.notes}</p>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Partner Modal Functions
function openAddPartnerModal() {
    document.getElementById('add-partner-modal').classList.add('active');
}

function closeAddPartnerModal() {
    document.getElementById('add-partner-modal').classList.remove('active');
    document.getElementById('add-partner-form').reset();
}

function saveNewPartner(event) {
    event.preventDefault();

    const newPartner = {
        id: String(partnersData.partners.length + 1).padStart(3, '0'),
        company: document.getElementById('partner-company').value,
        vertical: document.getElementById('partner-vertical').value,
        contact: {
            name: document.getElementById('partner-contact-name').value,
            title: document.getElementById('partner-contact-title').value,
            email: document.getElementById('partner-contact-email').value,
            phone: '',
            linkedinUrl: '',
            geography: document.getElementById('partner-geography').value,
            source: 'Manual Entry'
        },
        status: 'Researching',
        lastContactDate: '',
        nextAction: 'Research contact information',
        notes: document.getElementById('partner-notes').value,
        tags: document.getElementById('partner-tags').value.split(',').map(t => t.trim()).filter(t => t),
        lunchLearnHistory: [],
        dateAdded: new Date().toISOString().split('T')[0]
    };

    partnersData.partners.push(newPartner);
    partnersData.metadata.totalPartners = partnersData.partners.length;

    closeAddPartnerModal();
    renderPartners();
    updateHeaderStats();

    showToast(`${newPartner.company} added successfully!`, 'success');
}

function openEditPartnerModal(partnerId) {
    const partner = partnersData.partners.find(p => p.id === partnerId);
    if (!partner) return;

    currentEditingPartner = partner;

    // Populate form
    document.getElementById('edit-partner-id').value = partner.id;
    document.getElementById('edit-partner-company').value = partner.company;
    document.getElementById('edit-partner-vertical').value = partner.vertical;
    document.getElementById('edit-partner-status').value = partner.status;
    document.getElementById('edit-partner-contact-name').value = partner.contact.name || '';
    document.getElementById('edit-partner-contact-title').value = partner.contact.title || '';
    document.getElementById('edit-partner-contact-email').value = partner.contact.email || '';
    document.getElementById('edit-partner-geography').value = partner.contact.geography || '';
    document.getElementById('edit-partner-notes').value = partner.notes;
    document.getElementById('edit-partner-tags').value = partner.tags.join(', ');

    document.getElementById('edit-partner-modal').classList.add('active');
}

function closeEditPartnerModal() {
    document.getElementById('edit-partner-modal').classList.remove('active');
    currentEditingPartner = null;
}

function savePartnerEdits(event) {
    event.preventDefault();

    const partnerId = document.getElementById('edit-partner-id').value;
    const partner = partnersData.partners.find(p => p.id === partnerId);

    if (!partner) return;

    partner.company = document.getElementById('edit-partner-company').value;
    partner.vertical = document.getElementById('edit-partner-vertical').value;
    partner.status = document.getElementById('edit-partner-status').value;
    partner.contact.name = document.getElementById('edit-partner-contact-name').value;
    partner.contact.title = document.getElementById('edit-partner-contact-title').value;
    partner.contact.email = document.getElementById('edit-partner-contact-email').value;
    partner.contact.geography = document.getElementById('edit-partner-geography').value;
    partner.notes = document.getElementById('edit-partner-notes').value;
    partner.tags = document.getElementById('edit-partner-tags').value.split(',').map(t => t.trim()).filter(t => t);

    closeEditPartnerModal();
    renderPartners();
    renderDashboard(); // Re-render in case it affects urgent opportunities

    showToast(`${partner.company} updated successfully!`, 'success');
}

// Research Contact Modal
function openResearchModal(partnerId) {
    const partner = partnersData.partners.find(p => p.id === partnerId);
    if (!partner) return;

    currentResearchPartner = partner;

    document.getElementById('research-modal').classList.add('active');
    document.getElementById('research-results').style.display = 'none';
    document.getElementById('apply-research-btn').style.display = 'none';

    // Start simulated research
    simulateResearch(partner);
}

function closeResearchModal() {
    document.getElementById('research-modal').classList.remove('active');
    currentResearchPartner = null;
}

async function simulateResearch(partner) {
    const stepsContainer = document.getElementById('research-steps');
    const statusText = document.getElementById('research-status-text');
    const resultsContainer = document.getElementById('research-results');
    const queriesContainer = document.getElementById('search-queries');

    const steps = [
        { text: `Searching LinkedIn for ${partner.company} partnerships...`, delay: 1000 },
        { text: `Analyzing ${partner.company} website...`, delay: 1500 },
        { text: `Finding email patterns...`, delay: 1200 },
        { text: `Checking agency relations contacts...`, delay: 1000 },
    ];

    stepsContainer.innerHTML = '';

    for (let i = 0; i < steps.length; i++) {
        statusText.textContent = steps[i].text;

        await new Promise(resolve => setTimeout(resolve, steps[i].delay));

        const stepItem = document.createElement('li');
        stepItem.className = 'research-step-complete';
        stepItem.innerHTML = `✓ ${steps[i].text}`;
        stepsContainer.appendChild(stepItem);
    }

    // Show mock results
    statusText.textContent = 'Research complete!';

    const mockResults = generateMockResults(partner);

    resultsContainer.innerHTML = `
        <h3>Research Results</h3>
        <div class="confidence-score">
            <div class="confidence-label">Confidence: ${mockResults.confidence}%</div>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${mockResults.confidence}%"></div>
            </div>
        </div>
        <div class="research-findings">
            <h4>Suggested Contacts:</h4>
            ${mockResults.contacts.map((contact, idx) => `
                <div class="contact-suggestion">
                    <input type="radio" name="contact-choice" id="contact-${idx}" value="${idx}" ${idx === 0 ? 'checked' : ''}>
                    <label for="contact-${idx}">
                        <strong>${contact.name}</strong> - ${contact.title}<br>
                        <small>📧 ${contact.email} | 📍 ${contact.location}</small><br>
                        <small style="color: #666;">Source: ${contact.source}</small>
                    </label>
                </div>
            `).join('')}
        </div>
    `;

    queriesContainer.innerHTML = `
        <div class="search-query">
            <code>"${partner.company}" partnerships manager site:linkedin.com</code>
            <button class="btn-copy" onclick="copyToClipboard('${partner.company} partnerships manager site:linkedin.com')">Copy</button>
        </div>
        <div class="search-query">
            <code>"${partner.company}" agency relations contact</code>
            <button class="btn-copy" onclick="copyToClipboard('${partner.company} agency relations contact')">Copy</button>
        </div>
    `;

    resultsContainer.style.display = 'block';
    document.getElementById('apply-research-btn').style.display = 'inline-block';
}

function generateMockResults(partner) {
    const commonTitles = [
        'Partnership Manager',
        'Agency Relations Manager',
        'Business Development Manager',
        'Strategic Partnerships Lead',
        'Agency Partnerships Director'
    ];

    const emailPattern = partner.company.toLowerCase().replace(/\s+/g, '');

    return {
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        contacts: [
            {
                name: 'Sarah Johnson',
                title: commonTitles[Math.floor(Math.random() * commonTitles.length)],
                email: `sjohnson@${emailPattern}.com`,
                location: partner.contact.geography || 'Los Angeles, CA',
                source: 'LinkedIn Search'
            },
            {
                name: 'Michael Chen',
                title: commonTitles[Math.floor(Math.random() * commonTitles.length)],
                email: `mchen@${emailPattern}.com`,
                location: partner.contact.geography || 'New York, NY',
                source: 'Company Website'
            }
        ]
    };
}

function applyResearchResults() {
    const selectedContact = document.querySelector('input[name="contact-choice"]:checked');
    if (!selectedContact) {
        showToast('Please select a contact to apply', 'warning');
        return;
    }

    const contactIdx = parseInt(selectedContact.value);
    const resultsContainer = document.getElementById('research-results');
    const contactLabels = resultsContainer.querySelectorAll('.contact-suggestion label');
    const selectedLabel = contactLabels[contactIdx];

    // Parse the selected contact data
    const nameMatch = selectedLabel.innerHTML.match(/<strong>(.*?)<\/strong>/);
    const titleMatch = selectedLabel.innerHTML.match(/- (.*?)<br>/);
    const emailMatch = selectedLabel.innerHTML.match(/📧 (.*?) \|/);

    if (currentResearchPartner && nameMatch && titleMatch && emailMatch) {
        currentResearchPartner.contact.name = nameMatch[1];
        currentResearchPartner.contact.title = titleMatch[1];
        currentResearchPartner.contact.email = emailMatch[1];
        currentResearchPartner.status = 'Contacted';
        currentResearchPartner.nextAction = 'Send initial outreach email';

        closeResearchModal();
        renderPartners();
        renderDashboard();

        showToast(`Contact information updated for ${currentResearchPartner.company}!`, 'success');
    }
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
                .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/\n/g, '<br>');

            content.innerHTML = `<div style="font-family: inherit;">${html}</div>`;
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

// Loading Overlay
function showLoading(message = 'Loading...') {
    document.getElementById('loading-text').textContent = message;
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    }[type] || 'ℹ';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = [
        'template-modal',
        'add-partner-modal',
        'edit-partner-modal',
        'research-modal'
    ];

    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key closes modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Ctrl/Cmd + R for refresh (prevent default and use custom refresh)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshData();
    }
});
