// Данные кейсов
const cases = [
    {
        id: 1,
        name: "Обычный кейс",
        price: 100,
        image: "./images/case1.png",
        items: [
            { name: "Пистолет", price: 50, rare: 1, image: "./images/pistol.png" },
            { name: "Пиво", price: 30, rare: 1, image: "./images/beer.png" },
            { name: "Флешка", price: 80, rare: 2, image: "./images/flashdrive.png" }
        ]
    },
    {
        id: 2,
        name: "Премиум кейс",
        price: 500,
        image: "./images/case2.png",
        items: [
            { name: "Золотой нож", price: 2000, rare: 5, image: "./images/knife.png" },
            { name: "Перчатки", price: 1500, rare: 4, image: "./images/gloves.png" },
            { name: "AK-47", price: 800, rare: 3, image: "./images/ak47.png" }
        ]
    }
];

// Данные игрока
let balance = 5000;
let inventory = [];
let isProcessing = false;

// Инициализация кейсов
function initCases() {
    const grid = document.getElementById('casesGrid');
    grid.innerHTML = '';
    
    cases.forEach(caseItem => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.innerHTML = `
            <img src="${caseItem.image}" alt="${caseItem.name}" class="case-image">
            <h3>${caseItem.name}</h3>
            <div class="item-price">Цена: $${caseItem.price}</div>
            <button class="btn-small" onclick="openCase(${caseItem.id})">
                🎁 Открыть за $${caseItem.price}
            </button>
        `;
        grid.appendChild(card);
    });
}

// Открытие кейса
function openCase(caseId) {
    if (isProcessing) return;
    
    const selectedCase = cases.find(c => c.id === caseId);
    if (!selectedCase || balance < selectedCase.price) {
        alert('Недостаточно средств!');
        return;
    }
    
    isProcessing = true;
    balance -= selectedCase.price;
    updateBalance();
    
    // Выбор случайного предмета
    const randomItem = selectedCase.items[
        Math.floor(Math.random() * selectedCase.items.length)
    ];
    
    // Добавление в инвентарь
    inventory.push(randomItem);
    updateInventory();
    
    // Анимация
    setTimeout(() => {
        isProcessing = false;
        alert(`Вы получили: ${randomItem.name} ($${randomItem.price})`);
    }, 1000);
}

// Продажа предмета
function sellItem(index) {
    if (isProcessing) return;
    
    const item = inventory[index];
    if (!item) return;
    
    if (confirm(`Продать ${item.name} за $${item.price}?`)) {
        balance += item.price;
        inventory.splice(index, 1);
        updateBalance();
        updateInventory();
    }
}

// Обновление интерфейса
function updateBalance() {
    document.getElementById('balance').textContent = balance;
}

function updateInventory() {
    const grid = document.getElementById('itemsGrid');
    grid.innerHTML = '';
    
    inventory.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `item-card rare-${item.rare}`;
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <h4>${item.name}</h4>
            <div class="item-price">Цена: $${item.price}</div>
            <button class="sell-btn" onclick="sellItem(${index})">
                💰 Продать
            </button>
        `;
        grid.appendChild(card);
    });
    
    document.getElementById('itemsCount').textContent = inventory.length;
}

// Переключение вида
function toggleView() {
    const casesSection = document.getElementById('casesSection');
    const inventorySection = document.getElementById('inventorySection');
    const toggleText = document.getElementById('viewToggle');
    
    if (casesSection.classList.contains('active-view')) {
        casesSection.classList.remove('active-view');
        inventorySection.classList.add('active-view');
        toggleText.textContent = 'Кейсы';
    } else {
        inventorySection.classList.remove('active-view');
        casesSection.classList.add('active-view');
        toggleText.textContent = 'Инвентарь';
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initCases();
    updateInventory();
    
    // Для мобильных устройств
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            btn.click();
        });
    });
});
