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

let destructionCount = 0;
let combo = 1;
let gameResult;

function startGame() {
    // 85% chance Eagles win scenario
    gameResult = Math.random() < 0.85 ? 'win' : 'lose';
    
    document.getElementById('output').innerHTML = `
        <h1 class="${gameResult}">EAGLES ${gameResult.toUpperCase()}!<br>DESTROY PHILLY!</h1>
        <div class="scenario">${scenarios[gameResult][Math.floor(Math.random()*3)]}</div>
        <div id="clickArea">
            <button id="destroyButton">SMASH!</button>
            <div id="chaosMeter"></div>
            <div id="comboDisplay"></div>
        </div>
    `;

    setupClicker();
}

function setupClicker() {
    let lastClick = 0;
    const button = document.getElementById('destroyButton');
    const meter = document.getElementById('chaosMeter');
    
    button.addEventListener('click', () => {
        // Combo system
        const now = Date.now();
        if(now - lastClick < 500) { // Half-second combo window
            combo = Math.min(combo + 0.2, 5);
        } else {
            combo = 1;
        }
        lastClick = now;

        // Add destruction
        destructionCount += 5 * combo;
        
        // Visual feedback
        button.style.transform = `scale(${0.9 + (combo * 0.1)})`;
        setTimeout(() => { button.style.transform = 'scale(1)'; }, 100);
        
        // Create explosion effect
        const explosion = document.createElement('div');
        explosion.textContent = ['💥','🏈','🦅','🔥'][Math.floor(Math.random()*4)];
        explosion.style.position = 'absolute';
        explosion.style.left = `${Math.random() * 300}px`;
        explosion.style.animation = 'explode 0.5s';
        document.getElementById('clickArea').appendChild(explosion);

        updateMeter(meter);
        checkCompletion();
    });
}

function updateMeter(meter) {
    meter.innerHTML = `
        <div class="meter">
            <div class="progress" style="width: ${destructionCount}%"></div>
        </div>
        <div class="count">DESTRUCTION: ${Math.min(destructionCount, 100)}%</div>
    `;
    
    document.getElementById('comboDisplay').innerHTML = `
        COMBO MULTIPLIER: x${combo.toFixed(1)}<br>
        ${'🦅'.repeat(Math.floor(combo))}
    `;
}

function checkCompletion() {
    if(destructionCount >= 100) {
        document.getElementById('output').innerHTML += `
            <div class="result">
                <h2>PHILLY DESTROYED!</h2>
                <p>${gameResult === 'win' ? 'SUPER BOWL CHAMPS!' : 'PHILLY SPECIAL FAIL!'}</p>
                <button onclick="location.reload()">TRY AGAIN</button>
            </div>
        `;
        document.getElementById('destroyButton').disabled = true;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    #clickArea {
        background: #004C54;
        padding: 20px;
        border-radius: 10px;
        margin: 20px;
        position: relative;
    }
    
    #destroyButton {
        background: #ACC0C6;
        color: #004C54;
        font-size: 2em;
        padding: 20px 40px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: transform 0.1s;
    }
    
    .meter {
        width: 300px;
        height: 30px;
        background: #222;
        margin: 20px auto;
        border-radius: 15px;
        overflow: hidden;
    }
    
    .progress {
        height: 100%;
        background: ${gameResult === 'win' ? '#4CAF50' : '#FF5722'};
        transition: width 0.3s;
    }
    
    @keyframes explode {
        0% { transform: scale(1); opacity: 1 }
        100% { transform: scale(3); opacity: 0 }
    }
    
    .win { color: #4CAF50; }
    .lose { color: #FF5722; }
`;
document.head.appendChild(style);

// Start game immediately
window.onload = startGame;