import { createStyles } from './styles.js';
import { gameState } from './gameState.js';
import { targetManager } from './targetManager.js';
import { powerUpManager } from './powerUpManager.js';
import { soundManager } from './soundManager.js';
import { mobileControls } from './mobileControls.js';
import { scenarios } from './constants.js';
import { uiManager } from './uiManager.js';

class Game {
    constructor() {
        createStyles();
        this.initializeUI();
    }

    initializeUI() {
        document.getElementById('output').innerHTML = `
            <h1 class="eagles-font">The big game is over ready to see the results?</h1>
            <div id="gameStats">
                <div>High Score: <span id="highScoreDisplay">${gameState.highScore}</span></div>
            </div>
        `;
        
        // Create start button that will enable sound and start game
        uiManager.createStartButton(() => {
            soundManager.initAudio().then(() => {
                uiManager.removeStartButton();
                this.setupGame();
            });
        });
    }

    setupGame() {
        gameState.gameResult = Math.random() < 0.85 ? 'win' : 'lose';
        const scenario = scenarios[gameState.gameResult][
            Math.floor(Math.random() * scenarios[gameState.gameResult].length)
        ];
        
        document.getElementById('output').innerHTML = `
            <h1 class="${gameState.gameResult}">THE BIRDS ${gameState.gameResult.toUpperCase()}!</h1>
            <p class="scenario">${scenario}</p>
            <div id="gameStats">
                <div>Level: <span id="levelDisplay">${gameState.level}</span></div>
                <div>Score: <span id="scoreDisplay">${gameState.score}</span></div>
                <div>High Score: <span id="highScoreDisplay">${gameState.highScore}</span></div>
            </div>
            <div id="clickArea"></div>
            <div id="comboDisplay"></div>
        `;

        // Initialize all game systems
        soundManager.init();
        mobileControls.init();
        targetManager.init();
        
        // Setup click area events
        const clickArea = document.getElementById('clickArea');
        clickArea.addEventListener('click', (e) => {
            if (e.target === clickArea) {
                gameState.resetCombo();
            }
        });

        // Start first wave
        targetManager.spawnNewWave();
        this.startPowerUpSpawning();
    }

    startPowerUpSpawning() {
        setInterval(() => {
            powerUpManager.spawnPowerUp();
        }, 3000);
    }
}

window.onload = () => new Game(); 