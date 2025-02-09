// Manages game state and core variables
export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.level = 1; // Ensure the level starts at 1
        console.log(`Game reset: Score = ${this.score}, Level = ${this.level}`); // Debug log
        this.combo = 1;
        this.misses = 0;  // Add miss counter
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        this.activeTargets = [];
        this.activePowerUp = null;
    }

    updateScore(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }
        
        // Check if the score warrants a level increase
        if (this.score >= 100 * this.level) {
            this.increaseLevel(); // Call to increase level
        }

        document.getElementById('scoreDisplay').textContent = this.score;
        document.getElementById('highScoreDisplay').textContent = this.highScore;
    }

    updateDisplay() {
        document.getElementById('scoreDisplay').textContent = this.score;
        document.getElementById('highScoreDisplay').textContent = this.highScore;
        document.getElementById('levelDisplay').textContent = this.level;
    }

    updateComboDisplay() {
        const comboDisplay = document.getElementById('comboDisplay');
        if (comboDisplay) {
            comboDisplay.innerHTML = `
                COMBO MULTIPLIER: x${this.combo.toFixed(1)}<br>
                ${'🦅'.repeat(Math.floor(this.combo))}
                ${this.misses > 0 ? `<br><span class="misses">(${3 - this.misses} misses left)</span>` : ''}
            `;
        }
    }

    increaseCombo() {
        this.combo = Math.min(this.combo + 0.2, 5); // Increment by 0.2, max of 5
        this.misses = 0;  // Reset misses on successful hit
        this.updateComboDisplay();
    }

    resetCombo() {
        this.misses++;
        if (this.misses >= 3) {  // Only reset combo after 3 misses
            this.combo = 1;
            this.misses = 0;
        }
        this.updateComboDisplay();
    }

    increaseLevel() {
        this.level++;
        console.log(`Level increased to: ${this.level}`); // Log the new level to the console
        this.updateDisplay(); // Ensure the display updates when the level increases
    }
}

export const gameState = new GameState(); 