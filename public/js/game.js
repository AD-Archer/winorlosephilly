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
                // Play background music after starting the game
                await soundManager.playBackgroundMusic();
            } catch (error) {
                console.error('Error starting game:', error);
            }
        });

        // Create mute button for music
        const musicMuteButton = document.createElement('button');
        musicMuteButton.id = 'toggleMusic';
        musicMuteButton.textContent = '🎵'; // Music note icon
        musicMuteButton.addEventListener('click', () => {
            soundManager.toggleMusic();
            musicMuteButton.textContent = soundManager.musicMuted ? '🔇' : '🎵'; // Update button text
        });

        // Set styles for the music mute button
        musicMuteButton.style.position = 'fixed';
        musicMuteButton.style.top = '10px';
        musicMuteButton.style.right = '10px';
        musicMuteButton.style.zIndex = '1000';
        musicMuteButton.style.padding = '10px';
        musicMuteButton.style.fontSize = '20px';
        musicMuteButton.style.cursor = 'pointer';

        // Append the music mute button to the body
        document.body.appendChild(musicMuteButton);

        // Create mute button for sound effects
        const effectsMuteButton = document.createElement('button');
        effectsMuteButton.id = 'toggleEffects';
        effectsMuteButton.textContent = '🔊'; // Initial state (unmuted)
        effectsMuteButton.addEventListener('click', () => {
            soundManager.toggleEffects();
            effectsMuteButton.textContent = soundManager.effectsMuted ? '🔇' : '🔊'; // Update button text
        });

        // Set styles for the effects mute button
        effectsMuteButton.style.position = 'fixed';
        effectsMuteButton.style.top = '50px'; // Adjust position as needed
        effectsMuteButton.style.right = '10px';
        effectsMuteButton.style.zIndex = '1000';
        effectsMuteButton.style.padding = '10px';
        effectsMuteButton.style.fontSize = '20px';
        effectsMuteButton.style.cursor = 'pointer';

        // Append the effects mute button to the body
        document.body.appendChild(effectsMuteButton);
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

        // Add sound controls
        const gameStats = document.getElementById('gameStats');
        if (gameStats) {
            gameStats.appendChild(uiManager.createSoundControls());
        }

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