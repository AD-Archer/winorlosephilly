import { SOUNDS } from './constants.js';

export class SoundManager {
    constructor() {
        this.sounds = {};
        this.soundsLoaded = false;
        this.backgroundMusic = null;
        
        // Separate mute states for music and effects
        this.musicMuted = localStorage.getItem('musicMuted') === 'true';
        this.effectsMuted = localStorage.getItem('effectsMuted') === 'true';
        
        // Volume levels
        this.musicVolume = localStorage.getItem('musicVolume') / 100 || 0.3;
        this.effectsVolume = localStorage.getItem('effectsVolume') / 100 || 0.5;
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
            this.musicMuted = true; // Mute if audio fails to initialize
            this.effectsMuted = true; // Mute if audio fails to initialize
            return false;
        }
    }

    async loadSounds() {
        console.log('Loading sounds...');
        const loadPromises = Object.entries(SOUNDS).map(async ([key, config]) => {
            try {
                const audio = new Audio(config.src);
                audio.volume = config.volume;
                
                if (config.loop) {
                    audio.loop = true;
                }
                
                await new Promise((resolve, reject) => {
                    audio.addEventListener('canplaythrough', resolve);
                    audio.addEventListener('error', (e) => {
                        console.error(`Error loading sound ${key}:`, e);
                        reject(e);
                    });
                    audio.load(); // Explicitly load the audio
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
            this.playBackgroundMusic();
            console.log('All sounds loaded successfully');
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
            muteBtn.innerHTML = this.musicMuted ? '🔇' : '🎵';
            muteBtn.onclick = () => this.toggleMusic();
            gameStats.appendChild(muteBtn);
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = volume * SOUNDS.background.volume;
        }
    }

    setEffectsVolume(volume) {
        this.effectsVolume = volume;
    }

    toggleMusic() {
        this.musicMuted = !this.musicMuted;
        localStorage.setItem('musicMuted', this.musicMuted);
        
        if (this.musicMuted) {
            this.backgroundMusic?.pause();
        } else {
            this.playBackgroundMusic();
        }
    }

    toggleEffects() {
        this.effectsMuted = !this.effectsMuted;
        localStorage.setItem('effectsMuted', this.effectsMuted);
    }

    play(soundName) {
        if (this.effectsMuted || !this.sounds[soundName] || !this.soundsLoaded || soundName === 'background') {
            return;
        }
        
        try {
            const sound = this.sounds[soundName].cloneNode();
            sound.volume = SOUNDS[soundName].volume * this.effectsVolume;
            
            const promise = sound.play();
            if (promise) {
                promise.catch(err => {
                    console.warn(`Failed to play sound ${soundName}:`, err);
                });
            }
            
            // Clean up after sound finishes
            sound.onended = () => {
                sound.remove();
            };
        } catch (error) {
            console.warn(`Error playing sound ${soundName}:`, error);
        }
    }

    playBackgroundMusic() {
        if (!this.backgroundMusic || this.musicMuted) return;
        
        this.backgroundMusic.currentTime = 0;
        this.backgroundMusic.volume = this.musicVolume * SOUNDS.background.volume;
        
        const promise = this.backgroundMusic.play();
        if (promise) {
            promise.catch(err => console.warn('Failed to play background music:', err));
        }
    }
}

export const soundManager = new SoundManager(); 