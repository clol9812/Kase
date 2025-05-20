const items = [
    { 
        name: 'Золотой нож', 
        rare: 5, 
        image: './images/knife.png'
    },
    { 
        name: 'Боевые перчатки', 
        rare: 4, 
        image: './images/gloves.png'
    },
    { 
        name: 'AK-47 Огненная', 
        rare: 3, 
        image: './images/ak47.png'
    },
    { 
        name: 'AWP Дракон', 
        rare: 3, 
        image: './images/awp.png'
    },
    { 
        name: 'Пистолет Кобальт', 
        rare: 2, 
        image: './images/pistol.png'
    },
    { 
        name: 'Glock Сумеречный', 
        rare: 2, 
        image: './images/glock.png'
    },
    { 
        name: 'Секретный ключ', 
        rare: 1, 
        image: './images/key.png'
    },
    { 
        name: 'Золотая флешка', 
        rare: 1, 
        image: './images/flashdrive.png'
    }
];

let balance = 1000;
let isSpinning = false;

const getRandomItem = () => {
    const chances = [5, 4, 3, 2, 1];
    const weights = [2, 8, 15, 30, 45];
    const total = weights.reduce((a, b) => a + b, 0);
    const random = Math.random() * total;
    
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (random <= cumulative) {
            const filtered = items.filter(item => item.rare === chances[i]);
            return filtered[Math.floor(Math.random() * filtered.length)];
        }
    }
};

const updateBalance = () => {
    document.getElementById('balance').textContent = balance;
};

const animateCase = () => {
    const caseElement = document.getElementById('case');
    const button = document.getElementById('openButton');
    
    caseElement.classList.add('spin-animation');
    button.disabled = true;
    button.innerHTML = '🌀 Открываем...';
};

const showPrize = (item) => {
    const caseImage = document.getElementById('caseImage');
    const button = document.getElementById('openButton');
    
    caseImage.src = item.image;
    caseImage.style.transform = 'scale(1.1)';
    button.innerHTML = '🎉 Открыто!';
    
    setTimeout(() => {
        caseImage.style.transform = 'scale(1)';
        button.innerHTML = '🔓 Открыть кейс';
    }, 1000);
};

const addToInventory = (item) => {
    const grid = document.getElementById('itemsGrid');
    const card = document.createElement('div');
    
    card.className = `item-card rare-${item.rare}`;
    card.innerHTML = `
        <img src="${item.image}" 
             alt="${item.name}" 
             loading="lazy"
             width="80"
             height="80">
        <div class="item-name">${item.name}</div>
        <div class="item-rarity">${'★'.repeat(item.rare)}</div>
    `;
    
    grid.prepend(card);
};

const openCase = () => {
    if (isSpinning || balance < 100) return;
    
    isSpinning = true;
    balance -= 100;
    updateBalance();
    animateCase();
    
    setTimeout(() => {
        const prize = getRandomItem();
        isSpinning = false;
        
        document.getElementById('case').classList.remove('spin-animation');
        document.getElementById('openButton').disabled = false;
        
        showPrize(prize);
        addToInventory(prize);
        
        new Notification('Вы выиграли:', {
            body: `${prize.name} (${prize.rare}★)`,
            icon: prize.image
        });
    }, 2000);
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Обработчики для мобильных устройств
    const caseElement = document.getElementById('case');
    caseElement.addEventListener('touchstart', openCase);
    
    // Инициализация уведомлений
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    
    // Первоначальная загрузка предметов
    items.forEach(addToInventory);
});
