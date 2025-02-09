import { MOBILE_GESTURES, isMobile } from './constants.js';
import { gameState } from './gameState.js';
import { soundManager } from './soundManager.js';
import { createSwipeEffect, createShakeEffect } from './effects.js';
import { powerUpManager } from './powerUpManager.js';
import { targetManager } from './targetManager.js';

export class MobileControls {
    constructor() {
        this.lastTouchX = 0;
        this.lastTouchY = 0;
        this.lastShakeTime = 0;
        this.setupMobileControls();
    }

    setupMobileControls() {
        if (!isMobile) return;

        const clickArea = document.getElementById('clickArea');
        
        clickArea.addEventListener('touchstart', (e) => {
            this.lastTouchX = e.touches[0].clientX;
            this.lastTouchY = e.touches[0].clientY;
        });

        clickArea.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleSwipeGesture(e);
        }, { passive: false });

        window.addEventListener('devicemotion', this.handleShake.bind(this));
    }

    handleSwipeGesture(e) {
        const deltaX = e.touches[0].clientX - this.lastTouchX;
        const deltaY = e.touches[0].clientY - this.lastTouchY;

        if (Math.abs(deltaX) > MOBILE_GESTURES.SWIPE_THRESHOLD) {
            this.applySwipeDamage(deltaX > 0 ? 'right' : 'left');
            this.lastTouchX = e.touches[0].clientX;
        }

        if (Math.abs(deltaY) > MOBILE_GESTURES.SWIPE_THRESHOLD) {
            this.applySwipeDamage(deltaY > 0 ? 'down' : 'up');
            this.lastTouchY = e.touches[0].clientY;
        }
    }

    applySwipeDamage(direction) {
        soundManager.play('swipe');
        const swipeMultiplier = 1.5;
        gameState.activeTargets.forEach(target => {
            const damage = gameState.combo * swipeMultiplier;
            target.health -= damage;
            targetManager.updateTargetVisuals(target, damage);
            if (target.health <= 0) {
                targetManager.destroyTarget(target);
            }
        });
        createSwipeEffect(direction);
    }

    handleShake(e) {
        const acceleration = e.accelerationIncludingGravity;
        const now = Date.now();
        
        if (now - this.lastShakeTime > 1000) {
            const totalAcceleration = Math.abs(acceleration.x) + 
                                    Math.abs(acceleration.y) + 
                                    Math.abs(acceleration.z);
            
            if (totalAcceleration > MOBILE_GESTURES.SHAKE_THRESHOLD) {
                this.lastShakeTime = now;
                powerUpManager.activatePowerUp('shakeSmash');
                createShakeEffect();
            }
        }
    }

    init() {
        if (!isMobile) return;
        this.setupMobileControls();
    }
}

export const mobileControls = new MobileControls(); 