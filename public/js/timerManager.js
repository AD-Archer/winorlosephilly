export class TimerManager {
    constructor() {
        this.timer = null;
        this.timeLeft = 0;
        this.baseTime = 30; // Base time in seconds
        this.timerDisplay = null;
    }

    init() {
        // Create timer display if it doesn't exist
        if (!document.getElementById('timerContainer')) {
            const gameStats = document.getElementById('gameStats');
            const timerContainer = document.createElement('div');
            timerContainer.id = 'timerContainer';
            timerContainer.innerHTML = `Time: <span id="timerDisplay">0</span>s`;
            gameStats.appendChild(timerContainer);
        }
        this.timerDisplay = document.getElementById('timerDisplay');
    }

    startTimer(level) {
        this.clearTimer();
        
        // Calculate time based on level (more time for higher levels)
        this.timeLeft = this.baseTime + Math.floor(level * 1.5);
        this.updateDisplay();

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.onTimeUp();
            }
        }, 1000);
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateDisplay() {
        if (this.timerDisplay) {
            this.timerDisplay.textContent = this.timeLeft;
            
            // Add warning class when time is low
            if (this.timeLeft <= 10) {
                this.timerDisplay.classList.add('timer-warning');
            } else {
                this.timerDisplay.classList.remove('timer-warning');
            }
        }
    }

    onTimeUp() {
        this.clearTimer();
        alert(`Time's up! Game Over!\nFinal Score: ${gameState.score}`);
        location.reload(); // Restart the game
    }
}

export const timerManager = new TimerManager(); 