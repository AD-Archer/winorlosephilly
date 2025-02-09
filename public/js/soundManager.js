import { SOUNDS } from './constants.js';

export class SoundManager {
    constructor() {
        this.sounds = {};
        this.muted = localStorage.getItem('soundMuted') === 'true';
        this.soundsLoaded = false;
    }

    async initAudio() {
        try {
            console.log('Initializing audio');
            const silentSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV");
            await silentSound.play();
            console.log('Silent sound played successfully');
            await this.loadSounds();
            console.log('Audio initialization complete');
            return true;
        } catch (error) {
            console.error('Error initializing audio:', error);
            this.muted = true; // Mute if audio fails to initialize
            return false;
        }
    }

    async loadSounds() {
        const loadPromises = Object.entries(SOUNDS).map(async ([key, config]) => {
            try {
                const audio = new Audio(config.src);
                audio.volume = config.volume;
                
                // Create a promise that resolves when the audio is loaded
                await new Promise((resolve, reject) => {
                    audio.addEventListener('canplaythrough', resolve);
                    audio.addEventListener('error', reject);
                    // Set a timeout in case loading takes too long
                    setTimeout(reject, 5000);
                });
                
                this.sounds[key] = audio;
                console.log(`Sound ${key} loaded successfully`);
            } catch (error) {
                console.warn(`Failed to load sound ${key}:`, error);
            }
        });

        try {
            await Promise.all(loadPromises);
            this.soundsLoaded = true;
        } catch (error) {
            console.error('Error loading sounds:', error);
            this.soundsLoaded = false;
        }
    }

    addMuteButton() {
        const gameStats = document.getElementById('gameStats');
        if (!gameStats) {
            console.error('gameStats element not found');
            return;
        }

        if (!document.getElementById('muteButton')) {
            const muteBtn = document.createElement('button');
            muteBtn.id = 'muteButton';
            muteBtn.className = 'control-button';
            muteBtn.innerHTML = this.muted ? '🔇' : '🔊';
            muteBtn.onclick = () => this.toggleMute();
            gameStats.appendChild(muteBtn);
        }
    }

    play(soundName) {
        if (this.muted || !this.sounds[soundName] || !this.soundsLoaded) {
            return;
        }
        
        try {
            const sound = this.sounds[soundName].cloneNode();
            sound.volume = SOUNDS[soundName].volume;
            sound.play().catch(err => {
                console.warn(`Failed to play sound ${soundName}:`, err);
            });
            sound.onended = () => sound.remove();
        } catch (error) {
            console.warn(`Error playing sound ${soundName}:`, error);
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('soundMuted', this.muted);
        const muteButton = document.getElementById('muteButton');
        if (muteButton) {
            muteButton.innerHTML = this.muted ? '🔇' : '🔊';
        }
    }
}

export const soundManager = new SoundManager(); 