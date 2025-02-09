import { targets, powerUps, BOSS_IMAGES } from './constants.js';
import { gameState } from './gameState.js';
import { soundManager } from './soundManager.js';
import { createExplosion } from './effects.js';
import { powerUpManager } from './powerUpManager.js';
import { timerManager } from './timerManager.js';

export class TargetManager {
    constructor() {
        this.clickArea = null;
        this.bossMovementInterval = null;
        this.targetMovementInterval = null;
    }

    init() {
        this.clickArea = document.getElementById('clickArea');
        if (!this.clickArea) {
            console.error('Click area not found');
            return false;
        }
        this.startTargetMovement();
        return true;
    }

    spawnNewWave() {
        if (gameState.activeTargets.length === 0) {
            gameState.level++;
            soundManager.play('levelUp');
            
            // Start new level timer
            timerManager.startTimer(gameState.level);
            
            if (gameState.level % 5 === 0) {
                this.spawnBossWave();
            } else {
                const numBasic = Math.min(3 + Math.floor(gameState.level/2), 8);
                const numSpecial = Math.min(Math.floor(gameState.level/3), 3);
                
                this.spawnTargets('basic', numBasic);
                this.spawnTargets('special', numSpecial);
            }
        }
    }

    spawnBossWave() {
        const areaRect = this.clickArea.getBoundingClientRect();
        const targetSize = 120; // Bigger size for bosses
        const padding = targetSize / 2;
        
        // Choose random boss and image
        const bossData = targets.boss[Math.floor(Math.random() * targets.boss.length)];
        const bossImage = BOSS_IMAGES[Math.floor(Math.random() * BOSS_IMAGES.length)];
        
        const target = this.createBossElement(bossData, bossImage, areaRect, targetSize, padding);
        
        gameState.activeTargets.push({
            element: target,
            health: bossData.health * (1 + (gameState.level - 1) * 0.2),
            maxHealth: bossData.health * (1 + (gameState.level - 1) * 0.2),
            points: bossData.points,
            type: 'boss',
            dx: 2, // Movement speed X
            dy: 2  // Movement speed Y
        });

        // Start boss movement
        this.startBossMovement();
    }

    spawnTargets(type, count) {
        const areaRect = this.clickArea.getBoundingClientRect();
        const targetSize = 60;
        const padding = targetSize / 2;
        
        for (let i = 0; i < count; i++) {
            const targetData = targets[type][Math.floor(Math.random() * targets[type].length)];
            const currentHealth = targetData.health * (1 + (gameState.level - 1) * 0.2);
            
            const target = this.createTargetElement(targetData, currentHealth, areaRect, targetSize, padding, type);
            gameState.activeTargets.push({
                element: target,
                health: currentHealth,
                maxHealth: currentHealth,
                points: targetData.points,
                type: type,
                moves: targetData.moves,
                speed: targetData.speed || 0,
                dx: targetData.moves ? (Math.random() > 0.5 ? 1 : -1) * targetData.speed : 0,
                dy: targetData.moves ? (Math.random() > 0.5 ? 1 : -1) * targetData.speed : 0
            });
        }
    }

    createTargetElement(targetData, currentHealth, areaRect, targetSize, padding, type) {
        const target = document.createElement('div');
        const maxLeft = areaRect.width - targetSize - padding;
        const maxTop = areaRect.height - targetSize - padding;
        
        target.className = `target ${type}`;
        if (targetData.moves) {
            target.setAttribute('data-moves', 'true');
        }
        
        target.innerHTML = `
            <div class="target-icon">${targetData.icon}</div>
            <div class="health-bar">
                <div class="health-fill" style="width: 100%"></div>
            </div>
        `;
        target.style.left = `${Math.max(padding, Math.random() * maxLeft)}px`;
        target.style.top = `${Math.max(padding, Math.random() * maxTop)}px`;
        
        target.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetInfo = gameState.activeTargets.find(t => t.element === target);
            if (targetInfo) {
                this.hitTarget(targetInfo);
            }
        });
        
        this.clickArea.appendChild(target);
        return target;
    }

    createBossElement(bossData, imageUrl, areaRect, targetSize, padding) {
        const target = document.createElement('div');
        const maxLeft = areaRect.width - targetSize - padding;
        const maxTop = areaRect.height - targetSize - padding;
        
        target.className = 'target boss';
        target.innerHTML = `
            <img src="${imageUrl}" alt="Boss" class="boss-image"/>
            <div class="health-bar">
                <div class="health-fill" style="width: 100%"></div>
            </div>
        `;
        
        target.style.cssText = `
            left: ${Math.max(padding, Math.random() * maxLeft)}px;
            top: ${Math.max(padding, Math.random() * maxTop)}px;
            width: ${targetSize}px;
            height: ${targetSize}px;
        `;
        
        target.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetInfo = gameState.activeTargets.find(t => t.element === target);
            if (targetInfo) {
                this.hitTarget(targetInfo);
            }
        });
        
        this.clickArea.appendChild(target);
        return target;
    }

    startBossMovement() {
        if (this.bossMovementInterval) {
            clearInterval(this.bossMovementInterval);
        }

        this.bossMovementInterval = setInterval(() => {
            gameState.activeTargets.forEach(target => {
                if (target.type === 'boss') {
                    this.moveBoss(target);
                }
            });
        }, 16); // ~60fps
    }

    moveBoss(bossTarget) {
        const element = bossTarget.element;
        const rect = this.clickArea.getBoundingClientRect();
        const bossRect = element.getBoundingClientRect();
        
        let left = parseFloat(element.style.left);
        let top = parseFloat(element.style.top);
        
        // Update position
        left += bossTarget.dx;
        top += bossTarget.dy;
        
        // Bounce off walls
        if (left <= 0 || left + bossRect.width >= rect.width) {
            bossTarget.dx *= -1;
        }
        if (top <= 0 || top + bossRect.height >= rect.height) {
            bossTarget.dy *= -1;
        }
        
        // Apply new position
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
    }

    startTargetMovement() {
        if (this.targetMovementInterval) {
            clearInterval(this.targetMovementInterval);
        }

        this.targetMovementInterval = setInterval(() => {
            gameState.activeTargets.forEach(target => {
                if (target.moves) {
                    this.moveTarget(target);
                }
            });
        }, 16); // ~60fps
    }

    moveTarget(target) {
        const element = target.element;
        const rect = this.clickArea.getBoundingClientRect();
        const targetRect = element.getBoundingClientRect();
        
        let left = parseFloat(element.style.left);
        let top = parseFloat(element.style.top);
        
        // Create trail effect
        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.left = `${left + targetRect.width / 2}px`;
        trail.style.top = `${top + targetRect.height / 2}px`;
        this.clickArea.appendChild(trail);
        setTimeout(() => trail.remove(), 500);
        
        // Update position
        left += target.dx;
        top += target.dy;
        
        // Bounce off walls
        if (left <= 0 || left + targetRect.width >= rect.width) {
            target.dx *= -1;
            this.flipTargetIcon(element, target.dx > 0);
        }
        if (top <= 0 || top + targetRect.height >= rect.height) {
            target.dy *= -1;
        }
        
        // Apply new position
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
    }

    flipTargetIcon(element, facingRight) {
        const icon = element.querySelector('.target-icon');
        if (icon) {
            icon.style.transform = facingRight ? 'scaleX(1)' : 'scaleX(-1)';
        }
    }

    hitTarget(targetInfo) {
        const damage = gameState.combo * (gameState.activePowerUp ? 
            powerUps[gameState.activePowerUp].multiplier : 1);
        targetInfo.health -= damage;
        
        this.updateTargetVisuals(targetInfo, damage);
        soundManager.play('click');
        
        // Add special hit effect for moving targets
        if (targetInfo.moves) {
            const element = targetInfo.element;
            const iconContainer = element.querySelector('.target-icon');
            
            // Add flash effect to the icon container instead of the whole target
            const flash = document.createElement('div');
            flash.className = 'flash';
            iconContainer.appendChild(flash);
            
            // Remove flash after animation
            flash.addEventListener('animationend', () => flash.remove());
        }
        
        if (targetInfo.health <= 0) {
            soundManager.play('destroy');
            this.destroyTarget(targetInfo);
        } else {
            powerUpManager.spawnPowerUp();
        }
        
        gameState.increaseCombo();
    }

    updateTargetVisuals(targetInfo, damage) {
        const healthPercent = (targetInfo.health / targetInfo.maxHealth) * 100;
        targetInfo.element.querySelector('.health-fill').style.width = 
            `${Math.max(0, healthPercent)}%`;
        
        this.showDamageText(targetInfo.element, damage);
    }

    showDamageText(element, damage) {
        const damageText = document.createElement('div');
        damageText.className = 'damage-text';
        damageText.textContent = `-${Math.round(damage)}`;
        element.appendChild(damageText);
        setTimeout(() => damageText.remove(), 1000);
    }

    destroyTarget(targetInfo) {
        const pointsGained = Math.round(targetInfo.points * gameState.combo);
        gameState.updateScore(pointsGained);
        
        createExplosion(targetInfo.element);
        targetInfo.element.remove();
        
        gameState.activeTargets = gameState.activeTargets.filter(t => t !== targetInfo);
        this.spawnNewWave();
        
        // Clear boss movement if it was the last boss
        if (gameState.activeTargets.length === 0 && this.bossMovementInterval) {
            clearInterval(this.bossMovementInterval);
            this.bossMovementInterval = null;
        }
        
        // Clear movement intervals if no targets left
        if (gameState.activeTargets.length === 0) {
            if (this.bossMovementInterval) {
                clearInterval(this.bossMovementInterval);
                this.bossMovementInterval = null;
            }
            if (this.targetMovementInterval) {
                clearInterval(this.targetMovementInterval);
                this.targetMovementInterval = null;
            }
            timerManager.clearTimer(); // Clear timer before spawning new wave
        }
    }
}

export const targetManager = new TargetManager(); 