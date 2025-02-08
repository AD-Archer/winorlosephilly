const scenarios = {
    win: [
        "SMASH THE LIBERTY BELL WITH JALEN HURTS' HELMET!",
        "BOWL OVER CITY HALL WITH A FLYING EAGLE!",
        "COVER THE ART MUSEUM IN MIDNIGHT GREEN CONFETTI!"
    ],
    lose: [
        "ACCIDENTALLY START A SOFT PRETZEL RIOT!",
        "TRIGGER A CHEESESTEAK GREASE TSUNAMI!",
        "RELEASE A HORDE OF ANGRY PHILLY PHANATICS!"
    ]
};

const powerUps = {
    eagleBoost: { icon: '🦅', multiplier: 2, duration: 5000 },
    bellRinger: { icon: '🔔', multiplier: 3, duration: 3000 },
    cheesesteak: { icon: '🥖', multiplier: 1.5, duration: 7000 }
};

const targets = {
    basic: [
        { name: 'trash_can', icon: '🗑️', points: 10, health: 2 },
        { name: 'street_light', icon: '🏮', points: 15, health: 3 },
        { name: 'hydrant', icon: '🚰', points: 20, health: 4 }
    ],
    special: [
        { name: 'pretzel_cart', icon: '🥨', points: 50, health: 8 },
        { name: 'news_stand', icon: '📰', points: 75, health: 10 },
        { name: 'food_truck', icon: '🚚', points: 100, health: 15 }
    ],
    boss: [
        { name: 'city_hall', icon: '🏛️', points: 500, health: 50 },
        { name: 'liberty_bell', icon: '🔔', points: 750, health: 75 },
        { name: 'art_museum', icon: '🏛️', points: 1000, health: 100 }
    ]
};

let destructionCount = 0;
let combo = 1;
let gameResult;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let activePowerUp = null;
let level = 1;
let activeTargets = [];

// Add these constants at the top of the file
const MOBILE_BREAKPOINT = 768; // pixels
const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

function startGame() {
    gameResult = Math.random() < 0.85 ? 'win' : 'lose';
    
    document.getElementById('output').innerHTML = `
        <h1 class="${gameResult}">EAGLES ${gameResult.toUpperCase()}!</h1>
        <div id="gameStats">
            <div>Level: <span id="levelDisplay">${level}</span></div>
            <div>Score: <span id="scoreDisplay">${score}</span></div>
            <div>High Score: <span id="highScoreDisplay">${highScore}</span></div>
        </div>
        <div id="clickArea"></div>
        <div id="comboDisplay"></div>
    `;

    setupGame();
}

function setupGame() {
    const clickArea = document.getElementById('clickArea');
    spawnNewWave();
    
    // Handle missed clicks/taps
    clickArea.addEventListener('click', (e) => {
        if (e.target === clickArea) {
            combo = 1;
            updateComboDisplay();
        }
    });
    
    // Prevent default touch behaviors
    clickArea.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    // Handle orientation changes
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= MOBILE_BREAKPOINT;
        if (newIsMobile !== isMobile) {
            location.reload(); // Refresh to adjust sizes
        }
    });
    
    // Add viewport meta tag for mobile
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(viewport);
    }
}

function spawnNewWave() {
    if (activeTargets.length === 0) {
        level++;
        document.getElementById('levelDisplay').textContent = level;
        
        // Spawn targets based on level
        const numBasic = Math.min(3 + Math.floor(level/2), 8);
        const numSpecial = Math.min(Math.floor(level/3), 3);
        const numBoss = level % 5 === 0 ? 1 : 0;
        
        spawnTargets('basic', numBasic);
        spawnTargets('special', numSpecial);
        if (numBoss > 0) spawnTargets('boss', numBoss);
    }
}

function spawnTargets(type, count) {
    const clickArea = document.getElementById('clickArea');
    const areaRect = clickArea.getBoundingClientRect();
    const targetSize = isMobile ? 50 : 60;
    const padding = targetSize / 2;
    
    for (let i = 0; i < count; i++) {
        const targetData = targets[type][Math.floor(Math.random() * targets[type].length)];
        const target = document.createElement('div');
        const currentHealth = targetData.health * (1 + (level - 1) * 0.2);
        
        // Calculate position ensuring targets don't spawn too close to edges
        const maxLeft = areaRect.width - targetSize - padding;
        const maxTop = areaRect.height - targetSize - padding;
        const left = Math.max(padding, Math.random() * maxLeft);
        const top = Math.max(padding, Math.random() * maxTop);
        
        target.className = `target ${type}`;
        target.innerHTML = `
            <div class="target-icon">${targetData.icon}</div>
            <div class="health-bar">
                <div class="health-fill" style="width: 100%"></div>
            </div>
        `;
        target.style.left = `${left}px`;
        target.style.top = `${top}px`;
        
        const targetInfo = {
            element: target,
            health: currentHealth,
            maxHealth: currentHealth,
            points: targetData.points,
            type: type
        };
        
        activeTargets.push(targetInfo);
        
        // Add both click and touch handlers
        target.addEventListener('click', (e) => {
            e.preventDefault();
            hitTarget(targetInfo);
        });
        target.addEventListener('touchstart', (e) => {
            e.preventDefault();
            hitTarget(targetInfo);
        });
        
        clickArea.appendChild(target);
    }
}

function hitTarget(targetInfo) {
    const damage = combo * (activePowerUp ? powerUps[activePowerUp].multiplier : 1);
    targetInfo.health -= damage;
    
    // Visual feedback
    const healthPercent = (targetInfo.health / targetInfo.maxHealth) * 100;
    targetInfo.element.querySelector('.health-fill').style.width = `${Math.max(0, healthPercent)}%`;
    
    // Floating damage number
    const damageText = document.createElement('div');
    damageText.className = 'damage-text';
    damageText.textContent = `-${Math.round(damage)}`;
    targetInfo.element.appendChild(damageText);
    setTimeout(() => damageText.remove(), 1000);
    
    if (targetInfo.health <= 0) {
        destroyTarget(targetInfo);
    }
    
    // Increase combo
    combo = Math.min(combo + 0.2, 5);
    updateComboDisplay();
    spawnPowerUp();
}

function destroyTarget(targetInfo) {
    const pointsGained = Math.round(targetInfo.points * combo);
    score += pointsGained;
    
    // Update displays
    document.getElementById('scoreDisplay').textContent = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScoreDisplay').textContent = highScore;
    }
    
    // Explosion effect
    createExplosion(targetInfo.element);
    
    // Remove target
    targetInfo.element.remove();
    activeTargets = activeTargets.filter(t => t !== targetInfo);
    
    // Check for new wave
    spawnNewWave();
}

function createExplosion(element) {
    const rect = element.getBoundingClientRect();
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = `${rect.left}px`;
    explosion.style.top = `${rect.top}px`;
    document.body.appendChild(explosion);
    setTimeout(() => explosion.remove(), 1000);
}

function spawnPowerUp() {
    if(Math.random() < 0.1 && !activePowerUp) { // 10% chance to spawn
        const powerUpTypes = Object.keys(powerUps);
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        const powerUp = document.createElement('div');
        powerUp.className = 'power-up';
        powerUp.textContent = powerUps[type].icon;
        powerUp.style.left = `${Math.random() * 260}px`;
        powerUp.style.top = `${Math.random() * 100}px`;
        powerUp.dataset.type = type;
        
        powerUp.addEventListener('click', (e) => {
            activatePowerUp(type);
            e.stopPropagation();
            powerUp.remove();
        });
        
        document.getElementById('clickArea').appendChild(powerUp);
        
        // Remove power-up if not collected
        setTimeout(() => powerUp.remove(), 3000);
    }
}

function activatePowerUp(type) {
    const powerUp = powerUps[type];
    activePowerUp = type;
    combo *= powerUp.multiplier;
    
    // Visual feedback
    document.getElementById('clickArea').classList.add('powered-up');
    
    setTimeout(() => {
        combo /= powerUp.multiplier;
        activePowerUp = null;
        document.getElementById('clickArea').classList.remove('powered-up');
    }, powerUp.duration);
}

function updateComboDisplay() {
    document.getElementById('comboDisplay').innerHTML = `
        COMBO MULTIPLIER: x${combo.toFixed(1)}<br>
        ${'🦅'.repeat(Math.floor(combo))}
    `;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    /* Mobile-friendly base styles */
    * {
        touch-action: manipulation;
        user-select: none;
        -webkit-touch-callout: none;
    }
    
    #clickArea {
        background: rgba(0, 76, 84, 0.8);
        height: ${isMobile ? '70vh' : '400px'};
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        touch-action: none; /* Prevents scrolling while playing */
    }
    
    #gameStats {
        display: flex;
        justify-content: space-around;
        margin: 10px;
        font-size: ${isMobile ? '1em' : '1.2em'};
        flex-wrap: wrap;
    }
    
    .target {
        position: absolute;
        width: ${isMobile ? '50px' : '60px'};
        height: ${isMobile ? '50px' : '60px'};
        cursor: pointer;
        transition: transform 0.2s;
        touch-action: manipulation;
    }
    
    .target-icon {
        font-size: ${isMobile ? '1.5em' : '2em'};
        text-align: center;
    }
    
    /* Adjust hit areas for touch */
    .target:hover {
        transform: ${isMobile ? 'scale(1.05)' : 'scale(1.1)'};
    }
    
    /* Larger health bars for mobile */
    .health-bar {
        height: ${isMobile ? '8px' : '5px'};
    }
    
    /* Adjust text sizes for mobile */
    h1 {
        font-size: ${isMobile ? '1.5em' : '2em'};
    }
    
    #comboDisplay {
        font-size: ${isMobile ? '0.9em' : '1em'};
    }
    
    /* Prevent scrolling on mobile */
    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        body {
            position: fixed;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        
        #game {
            height: 100vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }
    }
`;
document.head.appendChild(style);

// Start game immediately
window.onload = startGame;