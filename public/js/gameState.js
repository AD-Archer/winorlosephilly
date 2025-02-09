// Manages game state and core variables
export class GameState {
    constructor() {
        this.destructionCount = 0;
        this.combo = 1;
        this.gameResult = null;
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.activePowerUp = null;
        this.level = 1;
        this.activeTargets = [];
    }

    updateScore(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }
        this.updateDisplay();
    }

    updateDisplay() {
        document.getElementById('scoreDisplay').textContent = this.score;
        document.getElementById('highScoreDisplay').textContent = this.highScore;
        document.getElementById('levelDisplay').textContent = this.level;
    }

    updateComboDisplay() {
        document.getElementById('comboDisplay').innerHTML = `
            COMBO MULTIPLIER: x${this.combo.toFixed(1)}<br>
            ${'🦅'.repeat(Math.floor(this.combo))}
        `;
    }

    resetCombo() {
        this.combo = 1;
        this.updateComboDisplay();
    }

    increaseCombo() {
        this.combo = Math.min(this.combo + 0.2, 5);
        this.updateComboDisplay();
    }
}

export const gameState = new GameState(); 