import { powerUps } from './constants.js';
import { gameState } from './gameState.js';
import { soundManager } from './soundManager.js';

export class PowerUpManager {
    constructor() {
        this.clickArea = document.getElementById('clickArea');
    }

    spawnPowerUp() {
        if(Math.random() < 0.1 && !gameState.activePowerUp) {
            const powerUpTypes = Object.keys(powerUps);
            const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
            const powerUp = this.createPowerUpElement(type);
            
            this.clickArea.appendChild(powerUp);
            setTimeout(() => powerUp.remove(), 3000);
        }
    }

    createPowerUpElement(type) {
        const powerUp = document.createElement('div');
        powerUp.className = 'power-up';
        powerUp.textContent = powerUps[type].icon;
        powerUp.style.left = `${Math.random() * 260}px`;
        powerUp.style.top = `${Math.random() * 100}px`;
        powerUp.dataset.type = type;
        
        powerUp.addEventListener('click', (e) => {
            this.activatePowerUp(type);
            e.stopPropagation();
            powerUp.remove();
        });

        return powerUp;
    }

    activatePowerUp(type) {
        soundManager.play('powerup');
        if (type === 'eagleBoost') {
            soundManager.play('eagleScream');
        }

        const powerUp = powerUps[type];
        gameState.activePowerUp = type;
        gameState.combo *= powerUp.multiplier;
        
        this.clickArea.classList.add('powered-up');
        
        setTimeout(() => {
            gameState.combo /= powerUp.multiplier;
            gameState.activePowerUp = null;
            this.clickArea.classList.remove('powered-up');
        }, powerUp.duration);
    }
}

export const powerUpManager = new PowerUpManager(); 