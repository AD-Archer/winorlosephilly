export class UIManager {
    createStartButton(onStart) {
        if (!document.getElementById('startButton')) {
            const startBtn = document.createElement('button');
            startBtn.id = 'startButton';
            startBtn.className = 'start-button';
            startBtn.textContent = 'RESULTS!';
            startBtn.onclick = onStart;
            
            startBtn.style.fontSize = '2em';
            startBtn.style.padding = '20px 40px';
            startBtn.style.marginTop = '30px';
            
            document.getElementById('output').appendChild(startBtn);
        }
    }

    removeStartButton() {
        const startBtn = document.getElementById('startButton');
        if (startBtn) {
            startBtn.remove();
        }
    }
}

export const uiManager = new UIManager(); 