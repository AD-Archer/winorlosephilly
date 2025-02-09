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
                </div>
            </div>
        `;
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