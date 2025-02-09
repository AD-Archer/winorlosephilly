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
            // Create and play a silent audio context to enable audio
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await audioContext.resume();
            
            // Load all sounds after audio is enabled
            await this.loadSounds();
            return true;
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            return false;
        }
    }

    async loadSounds() {
        console.log('Loading sounds...');
        const loadPromises = Object.entries(SOUNDS).map(async ([key, config]) => {
            try {
                const audio = new Audio(config.src);
                audio.volume = config.volume;
                
                if (key === 'background') {
                    audio.loop = true;
                    this.backgroundMusic = audio;
                    console.log('Background music loaded:', this.backgroundMusic);
                }
                
                await new Promise((resolve, reject) => {
                    audio.addEventListener('canplaythrough', resolve);
                    audio.addEventListener('error', (e) => {
                        console.error(`Error loading sound ${key}:`, e);
                        reject(e);
                    });
                    audio.load();
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
            if (!this.musicMuted) {
                await this.playBackgroundMusic();
            }
            console.log('All sounds loaded successfully');
        } catch (error) {
            console.error('Error loading sounds:', error);
            this.soundsLoaded = false;
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
        
        // Update all music toggle buttons
        document.querySelectorAll('#toggleMusic').forEach(btn => {
            btn.textContent = this.musicMuted ? '🔇' : '🎵';
        });
        
        if (this.musicMuted) {
            this.backgroundMusic?.pause();
        } else {
            this.playBackgroundMusic();
        }
    }

    toggleEffects() {
        this.effectsMuted = !this.effectsMuted;
        localStorage.setItem('effectsMuted', this.effectsMuted);
        
        // Update all effects toggle buttons
        document.querySelectorAll('#toggleEffects').forEach(btn => {
            btn.textContent = this.effectsMuted ? '🔇' : '🔊';
        });
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

    async playBackgroundMusic() {
        if (!this.backgroundMusic || this.musicMuted) {
            console.log('Background music is muted or not loaded. Mute state:', this.musicMuted);
            return;
        }
        
        try {
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.volume = this.musicVolume * SOUNDS.background.volume;
            
            await this.backgroundMusic.play();
            console.log('Background music started successfully');
        } catch (err) {
            console.warn('Failed to play background music:', err);
        }
    }
}

export const soundManager = new SoundManager(); 