// Конфигурация
const cases = [
    {
        id: 1,
        name: "Базовый кейс",
        price: 100,
        image: "case1.png",
        items: [
            { name: "Пистолет", price: 50, rare: 1, image: "pistol.png" },
            { name: "Нож", price: 300, rare: 3, image: "knife.png" },
            { name: "AK-47", price: 200, rare: 2, image: "ak47.png" },
            { name: "Снайперка", price: 500, rare: 4, image: "awp.png" },
            { name: "Золотой ключ", price: 1000, rare: 5, image: "key.png" }
        ]
    }
];

let balance = 5000;
let inventory = [];
let isSpinning = false;

// Инициализация
function init() {
    renderCases();
    updateBalance();
}

// Рендер кейсов
function renderCases() {
    const grid = document.getElementById('caseGrid');
    grid.innerHTML = '';
    
    cases.forEach(caseItem => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.innerHTML = `
            <img src="${caseItem.image}" class="case-image" alt="${caseItem.name}">
            <h3>${caseItem.name}</h3>
            <p>Цена: $${caseItem.price}</p>
            <button onclick="startSpin(${caseItem.id})">Открыть</button>
        `;
        grid.appendChild(card);
    });
}

// Запуск анимации
async function startSpin(caseId) {
    if (isSpinning) return;
    
    const caseItem = cases.find(c => c.id === caseId);
    if (balance < caseItem.price) {
        alert('Недостаточно средств!');
        return;
    }
    
    isSpinning = true;
    balance -= caseItem.price;
    updateBalance();
    
    // Анимация
    const spinBox = document.getElementById('spinBox');
    spinBox.style.display = 'block';
    
    // Выбор предмета
    const targetItem = getRandomItem(caseItem.items);
    
    // Имитация вращения
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Результат
    spinBox.style.display = 'none';
    inventory.push(targetItem);
    updateInventory();
    showResult(targetItem);
    isSpinning = false;
}

// Генерация предмета
function getRandomItem(items) {
    const chances = [60, 25, 10, 4, 1]; // Вероятности для 1-5 звезд
    const total = chances.reduce((a, b) => a + b);
    const random = Math.random() * total;
    
    let cumulative = 0;
    for (let i = 0; i < chances.length; i++) {
        cumulative += chances[i];
        if (random <= cumulative) {
            const filtered = items.filter(item => item.rare === (i + 1));
            return filtered[Math.floor(Math.random() * filtered.length)];
        }
    }
}

// Обновление интерфейса
function updateBalance() {
    document.getElementById('balance').textContent = balance;
}

function updateInventory() {
    const grid = document.getElementById('inventoryGrid');
    grid.innerHTML = '';
    
    inventory.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <img src="${item.image}" class="item-image" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>Цена: $${item.price}</p>
            <button onclick="sellItem(${index})">Продать</button>
        `;
        grid.appendChild(card);
    });
}

// Продажа предмета
function sellItem(index) {
    const item = inventory[index];
    if (confirm(`Продать ${item.name} за $${item.price}?`)) {
        balance += item.price;
        inventory.splice(index, 1);
        updateBalance();
        updateInventory();
    }
}

// Переключение вида
function toggleView() {
    document.querySelectorAll('section').forEach(section => {
        section.classList.toggle('active');
    });
}

// Показ результата
function showResult(item) {
    const resultBox = document.createElement('div');
    resultBox.className = 'result-popup';
    resultBox.innerHTML = `
        <h2>🎉 ВЫ ВЫИГРАЛИ!</h2>
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>Цена: $${item.price}</p>
    `;
    document.body.appendChild(resultBox);
    
    setTimeout(() => resultBox.remove(), 3000);
}

// Запуск
document.addEventListener('DOMContentLoaded', init);
