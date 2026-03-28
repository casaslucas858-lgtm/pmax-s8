// ===========================
// PMAX S8 - DATA LOADER V2
// Ultra defensive approach
// ===========================

const PMAX_DATA = {
    teams: null,
    standings: null,
    schedule: null,
    faq: null
};

// Configuración de rutas base
const getBasePath = () => {
    const currentPath = window.location.pathname;
    
    // GitHub Pages: /pmax-s8/
    if (currentPath.includes('/pmax-s8/')) {
        return '/pmax-s8/data/';
    }
    
    // Local
    return '/data/';
};

// Load JSON data - versión ultra defensiva
async function loadData(type) {
    if (PMAX_DATA[type]) {
        console.log(`✓ ${type} ya cargado (cache)`);
        return PMAX_DATA[type];
    }
    
    // Intentar múltiples rutas posibles
    const possiblePaths = [
        `${getBasePath()}${type}.json`,
        `../data/${type}.json`,
        `data/${type}.json`,
        `./data/${type}.json`
    ];
    
    console.log(`Intentando cargar ${type}.json...`);
    
    for (const path of possiblePaths) {
        try {
            console.log(`  Probando: ${path}`);
            const response = await fetch(path);
            
            if (response.ok) {
                const data = await response.json();
                PMAX_DATA[type] = data;
                console.log(`  ✓ ÉXITO: ${type} cargado desde ${path}`);
                return data;
            } else {
                console.log(`  ✗ Error ${response.status}: ${path}`);
            }
        } catch (error) {
            console.log(`  ✗ Falló: ${path}`);
        }
    }
    
    console.error(`❌ ERROR: No se pudo cargar ${type}.json`);
    return null;
}

// Render standings table
async function renderStandings(groupName = null) {
    console.log(`renderStandings: ${groupName || 'todos'}`);
    
    const standings = await loadData('standings');
    if (!standings) return;
    
    const container = document.getElementById('standings-container');
    if (!container) {
        console.error('❌ #standings-container no existe');
        return;
    }
    
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
    
    console.log(`✓ Standings OK`);
}

// Render teams list
async function renderTeams() {
    console.log('renderTeams llamado');
    
    const teams = await loadData('teams');
    if (!teams) return;
    
    const container = document.getElementById('teams-container');
    if (!container) {
        console.error('❌ #teams-container no existe');
        return;
    }
    
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
    console.log(`✓ Teams OK: ${teams.length}`);
}

// Render FAQ
async function renderFAQ() {
    console.log('renderFAQ llamado');
    
    const faq = await loadData('faq');
    if (!faq) return;
    
    const container = document.getElementById('faq-container');
    if (!container) {
        console.error('❌ #faq-container no existe');
        return;
    }
    
    const faqHTML = faq.map(item => `
        <div class="card mb-md">
            <h3 class="card-title">${item.question}</h3>
            <div class="card-content">
                <p>${item.answer}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = faqHTML;
    console.log(`✓ FAQ OK: ${faq.length}`);
}

// Render calendar
async function renderCalendar() {
    console.log('renderCalendar llamado');
    
    const schedule = await loadData('schedule');
    if (!schedule) return;
    
    const container = document.getElementById('calendar-container');
    if (!container) {
        console.error('❌ #calendar-container no existe');
        return;
    }
    
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
    console.log(`✓ Calendario OK: ${schedule.jornadas.length}`);
}

// Export
window.PMAX_DATA = {
    loadData,
    renderStandings,
    renderTeams,
    renderFAQ,
    renderCalendar
};

console.log('✓ PMAX_DATA cargado');
