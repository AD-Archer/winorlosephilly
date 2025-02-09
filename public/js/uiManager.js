import { soundManager } from './soundManager.js';

export class UIManager {
    showWelcomeScreen() {
        document.getElementById('output').innerHTML = `
            <h1 class="eagles-font">The big game is over ready to see the results?</h1>
            <div class="warning-message">
                ⚠️ PLEASE NOTE: This is a parody game. We love Philadelphia! 
                Please celebrate responsibly and keep our city safe! ⚠️
            </div>
            <div class="info-section">
                <h2>How To Play</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <h3>Power-Ups</h3>
                        <ul>
                            <li>🦅 Eagle Boost - 2x Damage</li>
                            <li>🔔 Bell Ringer - 3x Damage</li>
                            <li>🥖 Cheesesteak - 1.5x Damage</li>
                            <li>📱 Shake Smash - 2.5x Damage (Mobile Only)</li>
                        </ul>
                    </div>
                    <div class="info-item">
                        <h3>Controls</h3>
                        <ul>
                            <li>🖱️ Click targets to damage them</li>
                            <li>📱 Swipe to hit multiple targets (Mobile)</li>
                            <li>📱 Shake device for special attack (Mobile)</li>
                            <li>🔊 Toggle sound with the speaker icon</li>
                        </ul>
                    </div>
                    <div class="info-item">
                        <h3>Scoring</h3>
                        <ul>
                            <li>🎯 Chain hits to build combos</li>
                            <li>⭐ Higher combos = More points</li>
                            <li>🏆 Current High Score: ${localStorage.getItem('highScore') || '0'}</li>
                        </ul>
                    </div>
                    <div class="info-item">
                        <h3>Sound Settings</h3>
                        <div class="sound-controls">
                            <div class="sound-row">
                                <label>🎵 Music Volume:</label>
                                <input type="range" id="musicVolume" min="0" max="100" 
                                    value="${(localStorage.getItem('musicVolume') || 30)}"
                                />
                                <button id="toggleMusic" class="control-button">
                                    ${soundManager.musicMuted ? '🔇' : '🎵'}
                                </button>
                            </div>
                            <div class="sound-row">
                                <label>🔊 Effects Volume:</label>
                                <input type="range" id="effectsVolume" min="0" max="100" 
                                    value="${(localStorage.getItem('effectsVolume') || 50)}"
                                />
                                <button id="toggleEffects" class="control-button">
                                    ${soundManager.effectsMuted ? '🔇' : '🔊'}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="info-item disclaimer">
                        <h3>⚠️ Disclaimer</h3>
                        <p>This site is a parody and is not meant to cause harm to anyone or anything. 
                        It's all in good fun and celebration of sports rivalry.</p>
                        <p>If you have concerns about this content, please contact: 
                        <a href="mailto:aarch0004@launchpadphilly.org">aarch0004@launchpadphilly.org</a></p>
                        <p>The site can and will be removed upon request.</p>
                    </div>
                </div>
            </div>
        `;

        // Set up sound control listeners
        this.setupSoundControls();
    }

    setupSoundControls() {
        const musicVolume = document.getElementById('musicVolume');
        const effectsVolume = document.getElementById('effectsVolume');
        const toggleMusic = document.getElementById('toggleMusic');
        const toggleEffects = document.getElementById('toggleEffects');

        if (musicVolume) {
            musicVolume.addEventListener('input', (e) => {
                soundManager.setMusicVolume(e.target.value / 100);
                localStorage.setItem('musicVolume', e.target.value);
            });
        }

        if (effectsVolume) {
            effectsVolume.addEventListener('input', (e) => {
                soundManager.setEffectsVolume(e.target.value / 100);
                localStorage.setItem('effectsVolume', e.target.value);
            });
        }

        if (toggleMusic) {
            toggleMusic.addEventListener('click', () => {
                soundManager.toggleMusic();
                toggleMusic.textContent = soundManager.musicMuted ? '🔇' : '🎵';
            });
        }

        if (toggleEffects) {
            toggleEffects.addEventListener('click', () => {
                soundManager.toggleEffects();
                toggleEffects.textContent = soundManager.effectsMuted ? '🔇' : '🔊';
            });
        }
    }

    createStartButton(onStart) {
        console.log('Creating start button');
        const startBtn = document.createElement('button');
        startBtn.id = 'startButton';
        startBtn.className = 'start-button';
        startBtn.textContent = 'RESULTS!';
        startBtn.addEventListener('click', async () => {
            console.log('Start button clicked');
            try {
                await onStart();
            } catch (error) {
                console.error('Error in start button handler:', error);
            }
        });
        document.getElementById('output').appendChild(startBtn);
        console.log('Start button added to DOM');
    }

    removeStartButton() {
        const startBtn = document.getElementById('startButton');
        if (startBtn) {
            startBtn.remove();
        }
    }
}

export const uiManager = new UIManager(); 