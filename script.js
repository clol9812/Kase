const items = [
    { name: 'Нож', rare: 5, image: 'https://via.placeholder.com/100/ffd700' },
    { name: 'Перчатки', rare: 4, image: 'https://via.placeholder.com/100/c0c0c0' },
    { name: 'AK-47', rare: 3, image: 'https://via.placeholder.com/100/cd7f32' },
    { name: 'AWP', rare: 3, image: 'https://via.placeholder.com/100/cd7f32' },
    { name: 'Pistol', rare: 2, image: 'https://via.placeholder.com/100/4CAF50' },
    { name: 'Glock', rare: 2, image: 'https://via.placeholder.com/100/4CAF50' },
    { name: 'Флешка', rare: 1, image: 'https://via.placeholder.com/100/666' },
    { name: 'Ключ', rare: 1, image: 'https://via.placeholder.com/100/666' },
];

let balance = 1000;
let isSpinning = false;

// Оптимизированная функция для тач-устройств
function handleCaseInteraction() {
    if (!isSpinning) openCase();
}

function getRandomItem() {
    const random = Math.random() * 100;
    const chances = {
        5: 2,
        4: 8,
        3: 15,
        2: 30,
        1: 45
    };
    
    let cumulative = 0;
    for (let rare = 5; rare >= 1; rare--) {
        cumulative += chances[rare];
        if (random <= cumulative) {
            return items.find(item => item.rare === rare);
        }
    }
}

function openCase() {
    if (isSpinning || balance < 100) return;
    
    isSpinning = true;
    balance -= 100;
    updateBalance();
    startSpinAnimation();

    setTimeout(() => {
        const wonItem = getRandomItem();
        endSpinAnimation();
        showWonItem(wonItem);
        addItemToGrid(wonItem);
    }, 2000);
}

function updateBalance() {
    document.getElementById('balance').textContent = balance;
}

function startSpinAnimation() {
    const caseElement = document.getElementById('case');
    const button = document.getElementById('openButton');
    caseElement.classList.add('spin-animation');
    button.disabled = true;
}

function endSpinAnimation() {
    const caseElement = document.getElementById('case');
    const button = document.getElementById('openButton');
    caseElement.classList.remove('spin-animation');
    button.disabled = false;
    isSpinning = false;
}

function showWonItem(item) {
    const caseImage = document.getElementById('caseImage');
    caseImage.src = item.image;
    caseImage.style.transform = 'scale(1.1)';
    setTimeout(() => caseImage.style.transform = 'scale(1)', 200);
    showItemNotification(item);
}

function showItemNotification(item) {
    const notification = document.createElement('div');
    notification.className = `item-notification rare-${item.rare}`;
    notification.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>${item.name}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

function addItemToGrid(item) {
    const grid = document.getElementById('itemsGrid');
    const card = document.createElement('div');
    card.className = `item-card rare-${item.rare}`;
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <h3>${item.name}</h3>
        <p>Редкость: ${item.rare}★</p>
    `;
    grid.prepend(card);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('case').addEventListener('touchstart', handleCaseInteraction);
    items.forEach(item => addItemToGrid(item));
});
