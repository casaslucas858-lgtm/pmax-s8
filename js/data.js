// ===========================
// PMAX S8 - DATA LOADER
// Load data from JSON files
// ===========================

const PMAX_DATA = {
    teams: null,
    standings: null,
    schedule: null,
    faq: null
};

// Load JSON data
async function loadData(type) {
    if (PMAX_DATA[type]) {
        return PMAX_DATA[type];
    }
    
    try {
        const response = await fetch(`../data/${type}.json`);
        if (!response.ok) throw new Error(`Failed to load ${type}`);
        
        PMAX_DATA[type] = await response.json();
        return PMAX_DATA[type];
    } catch (error) {
        console.error(`Error loading ${type}:`, error);
        return null;
    }
}

// Render standings table
async function renderStandings(groupName = null) {
    const standings = await loadData('standings');
    if (!standings) return;
    
    const container = document.getElementById('standings-container');
    if (!container) return;
    
    const groups = groupName ? 
        [standings.groups.find(g => g.name === groupName)] : 
        standings.groups;
    
    groups.forEach(group => {
        if (!group) return;
        
        const groupHTML = `
            <h3 class="mb-md mt-lg" style="color: var(--primary); font-size: 1.5rem; text-transform: uppercase; letter-spacing: 2px;">
                ${group.name}
            </h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Equipo</th>
                        <th>PJ</th>
                        <th>PTS</th>
                        <th>1°</th>
                        <th>2°</th>
                        <th>3°</th>
                    </tr>
                </thead>
                <tbody>
                    ${group.teams.map((team, index) => `
                        <tr>
                            <td class="rank">${index + 1}</td>
                            <td class="team-name">${team.name}</td>
                            <td>${team.played}</td>
                            <td>${team.points}</td>
                            <td>${team.first}</td>
                            <td>${team.second}</td>
                            <td>${team.third}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML += groupHTML;
    });
}

// Render teams list
async function renderTeams() {
    const teams = await loadData('teams');
    if (!teams) return;
    
    const container = document.getElementById('teams-container');
    if (!container) return;
    
    const teamsHTML = teams.map(team => `
        <div class="card">
            <h3 class="card-title">${team.name}</h3>
            <div class="card-content">
                <p><strong>Grupo:</strong> ${team.group}</p>
                <p><strong>Jugadores:</strong> ${team.players.join(', ')}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = teamsHTML;
}

// Render FAQ
async function renderFAQ() {
    const faq = await loadData('faq');
    if (!faq) return;
    
    const container = document.getElementById('faq-container');
    if (!container) return;
    
    const faqHTML = faq.map((item, index) => `
        <div class="card mb-md">
            <h3 class="card-title">${item.question}</h3>
            <div class="card-content">
                <p>${item.answer}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = faqHTML;
}

// Render calendar
async function renderCalendar() {
    const schedule = await loadData('schedule');
    if (!schedule) return;
    
    const container = document.getElementById('calendar-container');
    if (!container) return;
    
    const calendarHTML = schedule.jornadas.map(jornada => `
        <div class="card mb-md">
            <div class="badge mb-sm">${jornada.fecha}</div>
            <h3 class="card-title">Jornada ${jornada.numero}</h3>
            <div class="card-content">
                <p><strong>Fase:</strong> ${jornada.fase}</p>
                <p><strong>Juego:</strong> ${jornada.juego || 'TBD'}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = calendarHTML;
}

// Export functions
window.PMAX_DATA = {
    loadData,
    renderStandings,
    renderTeams,
    renderFAQ,
    renderCalendar
};
