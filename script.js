/* Анимации */
@keyframes slotSpin {
    0% { transform: translateY(0); }
    100% { transform: translateY(-1000%); }
}

@keyframes itemGlow {
    0% { filter: drop-shadow(0 0 5px gold); }
    50% { filter: drop-shadow(0 0 20px gold); }
    100% { filter: drop-shadow(0 0 5px gold); }
}

.slot-machine {
    position: relative;
    height: 200px;
    width: 300px;
    margin: 20px auto;
    overflow: hidden;
    border-radius: 15px;
    background: rgba(0, 0, 0, 0.5);
    border: 3px solid #444;
}

.slot-items {
    position: absolute;
    width: 100%;
    transition: transform 0.1s;
}

.slot-item {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.slot-item img {
    max-width: 100%;
    max-height: 100%;
    filter: grayscale(0.8);
    transition: all 0.3s;
}

.slot-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background: linear-gradient(180deg, 
        rgba(0,0,0,0.8) 0%, 
        rgba(0,0,0,0) 30%, 
        rgba(0,0,0,0) 70%, 
        rgba(0,0,0,0.8) 100%);
}

.winning-animation {
    animation: itemGlow 1s infinite;
    }
