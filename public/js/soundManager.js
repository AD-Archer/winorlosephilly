import { SOUNDS } from './constants.js';

export class SoundManager {
    constructor() {
        this.sounds = {};
        this.muted = localStorage.getItem('soundMuted') === 'true';
    }

    async initAudio() {
        // Play a silent sound to enable audio
        const silentSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV");
        await silentSound.play();
        return this.init();
    }

    init() {
        Object.entries(SOUNDS).forEach(([key, config]) => {
            console.log(`Loading sound: ${key}`);
            const audio = new Audio(config.src);
            audio.volume = config.volume;
            
            audio.addEventListener('error', (e) => {
                console.error(`Error loading sound ${key}:`, e);
            });
            
            audio.addEventListener('canplaythrough', () => {
                console.log(`Sound ${key} loaded successfully`);
            });
            
            this.sounds[key] = audio;
        });
        
        this.addMuteButton();
    }

    addMuteButton() {
        const muteBtn = document.createElement('button');
        muteBtn.id = 'muteButton';
        muteBtn.className = 'control-button';
        muteBtn.innerHTML = this.muted ? '🔇' : '🔊';
        muteBtn.onclick = () => this.toggleMute();
        document.getElementById('gameStats').appendChild(muteBtn);
    }

    play(soundName) {
        if (this.muted || !this.sounds[soundName]) {
            console.log(`Sound ${soundName} not played: ${this.muted ? 'muted' : 'not found'}`);
            return;
        }
        
        const sound = this.sounds[soundName].cloneNode();
        sound.volume = SOUNDS[soundName].volume;
        
        sound.play()
            .then(() => {
                console.log(`Playing sound: ${soundName}`);
            })
            .catch(this.handlePlayError.bind(this));
            
        sound.onended = () => {
            console.log(`Sound ${soundName} finished playing`);
            sound.remove();
        };
    }

    handlePlayError(err) {
        console.error('Sound play failed:', err);
        if (err.name === 'NotAllowedError') {
            this.createStartButton();
        }
    }

    createStartButton() {
        if (!document.getElementById('startButton')) {
            const startBtn = document.createElement('button');
            startBtn.id = 'startButton';
            startBtn.className = 'start-button';
            startBtn.textContent = 'RESULTS!';
            startBtn.onclick = this.handleStartClick.bind(this);
            
            // Add some extra styling for better visibility
            startBtn.style.fontSize = '2em';
            startBtn.style.padding = '20px 40px';
            startBtn.style.marginTop = '30px';
            
            document.getElementById('output').appendChild(startBtn);
        }
    }

    handleStartClick() {
        const silentSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV");
        silentSound.play().then(() => {
            document.getElementById('startButton').remove();
            if (typeof window.startGame === 'function') {
                window.startGame();
            } else {
                console.error('startGame function not found');
            }
        });
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('soundMuted', this.muted);
        document.getElementById('muteButton').innerHTML = this.muted ? '🔇' : '🔊';
    }
}

export const soundManager = new SoundManager(); 