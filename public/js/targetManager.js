import { targets, powerUps } from './constants.js';
import { gameState } from './gameState.js';
import { soundManager } from './soundManager.js';
import { createExplosion } from './effects.js';
import { powerUpManager } from './powerUpManager.js';

export class TargetManager {
    constructor() {
        this.clickArea = null;
    }

    init() {
        this.clickArea = document.getElementById('clickArea');
        if (!this.clickArea) {
            console.error('Click area not found');
            return false;
        }
        return true;
    }

    spawnNewWave() {
        if (gameState.activeTargets.length === 0) {
            gameState.level++;
            soundManager.play('levelUp');
            
            const numBasic = Math.min(3 + Math.floor(gameState.level/2), 8);
            const numSpecial = Math.min(Math.floor(gameState.level/3), 3);
            const numBoss = gameState.level % 5 === 0 ? 1 : 0;
            
            this.spawnTargets('basic', numBasic);
            this.spawnTargets('special', numSpecial);
            if (numBoss > 0) this.spawnTargets('boss', numBoss);
        }
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
                type: type
            });
        }
    }

    createTargetElement(targetData, currentHealth, areaRect, targetSize, padding, type) {
        const target = document.createElement('div');
        const maxLeft = areaRect.width - targetSize - padding;
        const maxTop = areaRect.height - targetSize - padding;
        
        target.className = `target ${type}`;
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

    hitTarget(targetInfo) {
        const damage = gameState.combo * (gameState.activePowerUp ? 
            powerUps[gameState.activePowerUp].multiplier : 1);
        targetInfo.health -= damage;
        
        this.updateTargetVisuals(targetInfo, damage);
        soundManager.play('click');
        
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
    }
}

export const targetManager = new TargetManager(); 