'use strict';

// Конфигурация
const CASES = [
    {
        id: 1,
        name: "🔥 Горячий кейс",
        price: 200,
        image: "case.png",
        items: [
            { name: "Обычный нож", price: 150, rare: 1, image: "knife1.png" },
            { name: "Золотой пистолет", price: 500, rare: 3, image: "pistol_gold.png" },
            { name: "Эпический меч", price: 1200, rare: 4, image: "sword_epic.png" },
            { name: "Легендарный щит", price: 2500, rare: 5, image: "shield_legendary.png" }
        ]
    }
];

// Состояние приложения
const state = {
    balance: 5000,
    inventory: [],
    isProcessing: false,
    currentView: 'cases'
};

// DOM элементы
const dom = {
    balance: document.getElementById('balance'),
    caseGrid: document.getElementById('caseGrid'),
    inventoryGrid: document.getElementById('inventoryGrid'),
    preloader: document.getElementById('preloader'),
    viewToggle: document.getElementById('viewToggle')
};

// Инициализация
function init() {
    renderCases();
    updateBalance();
    addTouchListeners();
}

// Рендер кейсов
function renderCases() {
    dom.caseGrid.innerHTML = CASES.map(caseItem => `
        <div class="case-card" data-case-id="${caseItem.id}">
            <img src="${caseItem.image}" class="case-image" alt="${caseItem.name}">
            <h3>${caseItem.name}</h3>
            <p>💰 ${caseItem.price}</p>
            <button onclick="handleOpenCase(${caseItem.id})">
                Открыть
            </button>
        </div>
    `).join('');
}

// Обработчик открытия кейса
async function handleOpenCase(caseId) {
    if (state.isProcessing) return;
    
    const caseItem = CASES.find(c => c.id === caseId);
    if (!caseItem || state.balance < caseItem.price) {
        showError('Недостаточно средств!');
        return;
    }

    try {
        state.isProcessing = true;
        showLoader();
        
        state.balance -= caseItem.price;
        updateBalance();
        
        const item = getRandomItem(caseItem.items);
        await simulateSpinAnimation(item);
        
        state.inventory.push(item);
        updateInventory();
        showResult(item);
    } finally {
        state.isProcessing = false;
        hideLoader();
    }
}

// Генерация предмета
function getRandomItem(items) {
    const weights = [50, 30, 15, 4, 1];
    const total = weights.reduce((a, b) => a + b);
    const random = Math.random() * total;

    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (random <= cumulative) {
            return items.find(item => item.rare === i + 1) || items[0];
        }
    }
    return items[0];
}

// Анимация открытия
async function simulateSpinAnimation(item) {
    return new Promise(resolve => {
        dom.preloader.style.display = 'flex';
        setTimeout(() => {
            dom.preloader.style.display = 'none';
            resolve();
        }, 1500);
    });
}

// Обновление интерфейса
function updateBalance() {
    dom.balance.textContent = state.balance;
}

function updateInventory() {
    dom.inventoryGrid.innerHTML = state.inventory.map((item, index) => `
        <div class="item-card">
            <img src="${item.image}" class="item-image" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>💎 ${item.price}</p>
            <button onclick="sellItem(${index})">
                Продать
            </button>
        </div>
    `).join('');
}

// Продажа предмета
function sellItem(index) {
    const item = state.inventory[index];
    if (item && confirm(`Продать ${item.name} за $${item.price}?`)) {
        state.balance += item.price;
        state.inventory.splice(index, 1);
        updateBalance();
        updateInventory();
    }
}

// Переключение вида
function toggleView() {
    const casesSection = document.querySelector('.cases-section');
    const inventorySection = document.querySelector('.inventory-section');
    
    casesSection.classList.toggle('active');
    inventorySection.classList.toggle('active');
    
    dom.viewToggle.textContent = state.currentView === 'cases' ? 'Инвентарь' : 'Кейсы';
    state.currentView = state.currentView === 'cases' ? 'inventory' : 'cases';
}

// Вспомогательные функции
function showLoader() {
    dom.preloader.style.display = 'flex';
}

function hideLoader() {
    dom.preloader.style.display = 'none';
}

function showError(message) {
    alert(message);
}

function showResult(item) {
    const resultHTML = `
        <div class="result-popup">
            <h2>🎉 ${item.name}</h2>
            <p>Получено: $${item.price}</p>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', resultHTML);
    setTimeout(() => document.querySelector('.result-popup')?.remove(), 2000);
}

// Обработчики касаний
function addTouchListeners() {
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            btn.classList.add('active');
        });
        
        btn.addEventListener('touchend', () => {
            btn.classList.remove('active');
        });
    });
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);
