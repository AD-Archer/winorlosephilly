import { MOBILE_BREAKPOINT, isMobile } from './constants.js';

export function createStyles() {
    const style = document.createElement('style');
    
    style.textContent = `
    /* Mobile-friendly base styles */
    * {
        touch-action: manipulation;
        user-select: none;
        -webkit-touch-callout: none;
    }
    
    #clickArea {
        background: rgba(0, 76, 84, 0.8);
        height: ${isMobile ? '70vh' : '400px'};
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        touch-action: none;
    }
    
    #gameStats {
        display: flex;
        justify-content: space-around;
        margin: 10px;
        font-size: ${isMobile ? '1em' : '1.2em'};
        flex-wrap: wrap;
    }
    
    .target {
        position: absolute;
        width: ${isMobile ? '50px' : '60px'};
        height: ${isMobile ? '50px' : '60px'};
        cursor: pointer;
        transition: transform 0.2s;
        touch-action: manipulation;
    }
    
    .target-icon {
        font-size: ${isMobile ? '1.5em' : '2em'};
        text-align: center;
    }
    
    .target:hover {
        transform: ${isMobile ? 'scale(1.05)' : 'scale(1.1)'};
    }
    
    .health-bar {
        height: ${isMobile ? '8px' : '5px'};
        width: 100%;
        background: #333;
        border-radius: 2px;
        overflow: hidden;
    }
    
    .health-fill {
        height: 100%;
        background: #4CAF50;
        transition: width 0.2s;
    }
    
    .damage-text {
        position: absolute;
        color: #ff4444;
        font-weight: bold;
        animation: float-up 1s forwards;
        pointer-events: none;
    }
    
    .explosion {
        position: absolute;
        width: 60px;
        height: 60px;
        background: radial-gradient(circle, #ff4444, transparent);
        animation: explode 1s forwards;
        pointer-events: none;
    }
    
    h1 {
        font-size: ${isMobile ? '1.5em' : '2em'};
    }
    
    #comboDisplay {
        font-size: ${isMobile ? '0.9em' : '1em'};
    }
    
    /* Mobile-specific styles */
    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        body {
            position: fixed;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        
        #game {
            height: 100vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }
    }

    /* Responsive layout */
    :root {
        --target-size: ${isMobile ? '50px' : '60px'};
        --button-padding: ${isMobile ? '20px' : '15px'};
    }

    @media (orientation: landscape) {
        #clickArea {
            height: 60vh;
        }
        .target {
            width: calc(var(--target-size) - 10px);
            height: calc(var(--target-size) - 10px);
        }
    }

    @media (orientation: portrait) {
        #clickArea {
            height: 50vh;
        }
    }

    /* Effects */
    .swipe-effect {
        position: absolute;
        background: rgba(172, 192, 198, 0.3);
        pointer-events: none;
        width: 100%;
        height: 100%;
    }

    .swipe-effect.right {
        animation: swipeRight 0.3s;
    }

    .swipe-effect.left {
        animation: swipeLeft 0.3s;
    }

    .power-up {
        font-size: 2em;
        animation: float 2s infinite;
        touch-action: none;
    }

    /* Controls */
    .control-button {
        background: none;
        border: 2px solid #ACC0C6;
        color: #ACC0C6;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 1.2em;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 10px;
        right: 10px;
        transition: all 0.2s;
    }
    
    .control-button:hover {
        background: #ACC0C6;
        color: #004C54;
    }
    
    .start-button {
        background: #ACC0C6;
        color: #004C54;
        border: none;
        padding: 20px 40px;
        font-size: 2em;
        border-radius: 10px;
        cursor: pointer;
        margin: 30px;
        transition: all 0.3s;
        font-family: 'Impact', sans-serif;
        text-transform: uppercase;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .start-button:hover {
        background: #004C54;
        color: #ACC0C6;
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    }

    /* Animations */
    @keyframes swipeRight {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes swipeLeft {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes float {
        0% { transform: translateY(0) }
        50% { transform: translateY(-20px) }
        100% { transform: translateY(0) }
    }

    @keyframes float-up {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
    }

    @keyframes explode {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }

    /* Target tiers */
    .basic { filter: brightness(1); }
    .special { filter: brightness(1.2) drop-shadow(0 0 5px gold); }
    .boss { 
        filter: brightness(1.5) drop-shadow(0 0 10px red);
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }

    .eagles-font {
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        margin-bottom: 30px;
    }

    .scenario {
        font-size: 1.2em;
        color: #ACC0C6;
        margin: 20px 0;
        font-style: italic;
    }

    .warning-message {
        background: #ffeb3b;
        color: #000;
        padding: 15px;
        margin: 20px auto;
        max-width: 600px;
        border-radius: 8px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .info-section {
        background: rgba(0, 76, 84, 0.9);
        padding: 20px;
        margin: 20px auto;
        max-width: 800px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    .info-section h2 {
        color: #ACC0C6;
        margin-bottom: 20px;
        font-family: 'Impact', sans-serif;
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        text-align: left;
    }

    .info-item {
        background: rgba(172, 192, 198, 0.1);
        padding: 15px;
        border-radius: 8px;
    }

    .info-item h3 {
        color: #ACC0C6;
        margin-bottom: 10px;
        font-family: 'Impact', sans-serif;
    }

    .info-item ul {
        list-style: none;
        padding: 0;
    }

    .info-item li {
        margin: 8px 0;
        color: #fff;
    }

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        .info-grid {
            grid-template-columns: 1fr;
        }
        
        .info-item {
            padding: 10px;
        }
    }
    `;

    document.head.appendChild(style);
} 