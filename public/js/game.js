import { createStyles } from './styles.js';
import { gameState } from './gameState.js';
import { targetManager } from './targetManager.js';
import { powerUpManager } from './powerUpManager.js';
import { soundManager } from './soundManager.js';
import { mobileControls } from './mobileControls.js';
import { scenarios } from './constants.js';
import { uiManager } from './uiManager.js';
import { timerManager } from './timerManager.js';

class Game {
    constructor() {
        createStyles();
        this.initializeUI();
        // Bind the setupGame method to this instance
        this.boundSetupGame = this.setupGame.bind(this);
    }

    initializeUI() {
        uiManager.showWelcomeScreen();
        
        // Create start button with proper binding
        uiManager.createStartButton(async () => {
            try {
                console.log('Start button clicked');
                await soundManager.initAudio();
                console.log('Audio initialized');
                uiManager.removeStartButton();
                this.boundSetupGame();
            } catch (error) {
                console.error('Error starting game:', error);
            }
        });
    }

    setupGame() {
        console.log('Setting up game');
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

        // Add mute button after gameStats exists
        soundManager.addMuteButton();

        console.log('Initializing game systems');
        timerManager.init();
        targetManager.init();
        powerUpManager.init();
        mobileControls.init();
        
        const clickArea = document.getElementById('clickArea');
        clickArea.addEventListener('click', (e) => {
            if (e.target === clickArea) {
                gameState.resetCombo();
            }
        });

        targetManager.spawnNewWave();
        this.startPowerUpSpawning();
        console.log('Game setup complete');
    }

    startPowerUpSpawning() {
        setInterval(() => {
            powerUpManager.spawnPowerUp();
        }, 3000);
    }
}

// Create game instance
window.onload = () => {
    console.log('Window loaded, creating game instance');
    new Game();
}; 