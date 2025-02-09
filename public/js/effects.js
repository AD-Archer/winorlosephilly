export function createExplosion(element) {
    const rect = element.getBoundingClientRect();
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = `${rect.left}px`;
    explosion.style.top = `${rect.top}px`;
    document.body.appendChild(explosion);
    setTimeout(() => explosion.remove(), 1000);
}

export function createSwipeEffect(direction) {
    const effect = document.createElement('div');
    effect.className = `swipe-effect ${direction}`;
    document.getElementById('clickArea').appendChild(effect);
    setTimeout(() => effect.remove(), 500);
}

export function createShakeEffect() {
    const shakeContainer = document.getElementById('clickArea');
    shakeContainer.style.transform = 'translate(10px, 10px)';
    setTimeout(() => {
        shakeContainer.style.transform = 'translate(0, 0)';
    }, 100);
} 