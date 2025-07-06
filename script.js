// Состояние игры
let gameState = {
    credits: 0,
    creditsPerSecond: 0,
    clickPower: 1,
    difficulty: 'medium',
    bosses: [
        { name: "Дарт Мол", health: 100, maxHealth: 100, reward: 1000, defeated: false },
        { name: "Дарт Вейдер", health: 500, maxHealth: 500, reward: 5000, defeated: false },
        { name: "Император Палпатин", health: 2000, maxHealth: 2000, reward: 20000, defeated: false },
        { name: "Кайло Рен", health: 10000, maxHealth: 10000, reward: 100000, defeated: false }
    ],
    currentBossIndex: 0,
    upgrades: [
        { id: 1, name: "Дроид-рабочий", description: "Простой дроид, добывающий кредиты", baseCost: 15, baseCps: 0.1, owned: 0 },
        { id: 2, name: "Ферма влаги", description: "Добыча воды для продажи", baseCost: 100, baseCps: 0.5, owned: 0 },
        { id: 3, name: "TIE-истребитель", description: "Патрулирование торговых путей", baseCost: 500, baseCps: 2, owned: 0 },
        { id: 4, name: "Эскадрилья X-Wing", description: "Защита повстанческих грузов", baseCost: 3000, baseCps: 10, owned: 0 },
        { id: 5, name: "Звёздный Разрушитель", description: "Контроль целых систем", baseCost: 10000, baseCps: 50, owned: 0 },
        { id: 6, name: "Звезда Смерти", description: "Абсолютная экономическая власть", baseCost: 100000, baseCps: 500, owned: 0 }
    ],
    achievements: [
        { id: 1, name: "Первый кредит", description: "Заработайте свой первый кредит", earned: false, condition: (state) => state.credits >= 1 },
        { id: 2, name: "Новичок", description: "Заработайте 100 кредитов", earned: false, condition: (state) => state.credits >= 100 },
        { id: 3, name: "Мастер", description: "Заработайте 10,000 кредитов", earned: false, condition: (state) => state.credits >= 10000 },
        { id: 4, name: "Первый босс", description: "Победите Дарт Мола", earned: false, condition: (state) => state.bosses[0].defeated }
    ],
    leaderboard: []
};

// Интеграция с Telegram WebApp
let tg = window.Telegram.WebApp;

// Элементы DOM
const creditsDisplay = document.getElementById('credits');
const cpsDisplay = document.getElementById('cps');
const clickButton = document.getElementById('click-button');
const attackButton = document.getElementById('attack-button');
const upgradesList = document.getElementById('upgrades-list');
const bossesList = document.getElementById('bosses-list');
const currentBossDisplay = document.getElementById('current-boss');
const bossHealthBar = document.getElementById('boss-health-bar');
const bossHealthText = document.getElementById('boss-health-text');
const bossRewardDisplay = document.getElementById('boss-reward');
const achievementsList = document.getElementById('achievements-list');
const leaderboardBody = document.getElementById('leaderboard-body');
const difficultySelect = document.getElementById('difficulty');
const tabContents = document.querySelectorAll('.tab-content');
const tabButtons = document.querySelectorAll('.tab-button');

// Инициализация игры
function initGame() {
    loadGame();
    setupTabs();
    renderGame();
    setupClickButton();
    setupAttackButton();
    setupUpgrades();
    setupBosses();
    setupAchievements();
    setupLeaderboard();
    setupDifficulty();
    
    // Запуск игрового цикла
    setInterval(gameLoop, 1000);
    
    // Развернуть WebApp Telegram
    tg.expand();
}

// Игровой цикл
function gameLoop() {
    // Пассивный доход
    gameState.credits += gameState.creditsPerSecond;
    
    // Проверка достижений
    checkAchievements();
    
    // Сохранение игры
    saveGame();
    
    // Обновление интерфейса
    renderGame();
}

// Обновление интерфейса
function renderGame() {
    // Обновление кредитов
    creditsDisplay.textContent = formatNumber(gameState.credits);
    cpsDisplay.textContent = formatNumber(gameState.creditsPerSecond);
    
    // Обновление текущего босса
    const currentBoss = gameState.bosses[gameState.currentBossIndex];
    currentBossDisplay.textContent = currentBoss.name;
    bossHealthBar.style.width = `${(currentBoss.health / currentBoss.maxHealth) * 100}%`;
    bossHealthText.textContent = `${formatNumber(currentBoss.health)}/${formatNumber(currentBoss.maxHealth)}`;
    bossRewardDisplay.textContent = formatNumber(currentBoss.reward);
    
    // Обновление улучшений
    updateUpgradesDisplay();
    
    // Обновление рейтинга
    updateLeaderboard();
}

// Настройка вкладок
function setupTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Скрыть все вкладки
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Деактивировать все кнопки
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Показать выбранную вкладку
            document.getElementById(tabId).classList.add('active');
            button.classList.add('active');
        });
    });
}

// Настройка кнопки клика
function setupClickButton() {
    clickButton.addEventListener('click', () => {
        gameState.credits += gameState.clickPower;
        renderGame();
        
        // Анимация клика
        clickButton.classList.add('clicked');
        setTimeout(() => {
            clickButton.classList.remove('clicked');
        }, 100);
    });
    
    // Отключение масштабирования при двойном тапе
    clickButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });
}

// Настройка кнопки атаки
function setupAttackButton() {
    attackButton.addEventListener('click', () => {
        const currentBoss = gameState.bosses[gameState.currentBossIndex];
        const damage = gameState.clickPower * getDifficultyMultiplier();
        
        currentBoss.health -= damage;
        
        if (currentBoss.health <= 0) {
            currentBoss.health = 0;
            currentBoss.defeated = true;
            gameState.credits += currentBoss.reward;
            
            // Переход к следующему боссу, если есть
            if (gameState.currentBossIndex < gameState.bosses.length - 1) {
                gameState.currentBossIndex++;
            }
        }
        
        // Анимация атаки
        attackButton.classList.add('attacking');
        setTimeout(() => {
            attackButton.classList.remove('attacking');
        }, 200);
        
        renderGame();
    });
}

// Настройка улучшений
function setupUpgrades() {
    gameState.upgrades.forEach(upgrade => {
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade';
        upgradeElement.innerHTML = `
            <h3>${upgrade.name}</h3>
            <p>${upgrade.description}</p>
            <p>Цена: <span class="cost">${formatNumber(getUpgradeCost(upgrade))}</span></p>
            <p>Производит: <span class="cps">${formatNumber(upgrade.baseCps)}</span> кредитов/сек</p>
            <p>Куплено: <span class="owned">${upgrade.owned}</span></p>
        `;
        
        upgradeElement.addEventListener('click', () => {
            const cost = getUpgradeCost(upgrade);
            
            if (gameState.credits >= cost) {
                gameState.credits -= cost;
                upgrade.owned++;
                
                // Пересчёт CPS
                calculateCPS();
                
                renderGame();
            }
        });
        
        upgradesList.appendChild(upgradeElement);
    });
}

// Обновление отображения улучшений
function updateUpgradesDisplay() {
    const upgradeElements = document.querySelectorAll('.upgrade');
    
    gameState.upgrades.forEach((upgrade, index) => {
        const cost = getUpgradeCost(upgrade);
        const canAfford = gameState.credits >= cost;
        
        upgradeElements[index].querySelector('.cost').textContent = formatNumber(cost);
        upgradeElements[index].querySelector('.owned').textContent = upgrade.owned;
        
        if (canAfford) {
            upgradeElements[index].classList.add('affordable');
        } else {
            upgradeElements[index].classList.remove('affordable');
        }
    });
}

// Расчёт кредитов в секунду
function calculateCPS() {
    gameState.creditsPerSecond = gameState.upgrades.reduce((total, upgrade) => {
        return total + (upgrade.baseCps * upgrade.owned);
    }, 0);
}

// Получение стоимости улучшения
function getUpgradeCost(upgrade) {
    return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned));
}

// Настройка боссов
function setupBosses() {
    gameState.bosses.forEach((boss, index) => {
        const bossElement = document.createElement('div');
        bossElement.className = 'boss';
        bossElement.innerHTML = `
            <h3>${boss.name}</h3>
            <p>Здоровье: ${formatNumber(boss.maxHealth)}</p>
            <p>Награда: ${formatNumber(boss.reward)}</p>
            <p>Статус: <span class="status">${boss.defeated ? 'Побеждён' : index === gameState.currentBossIndex ? 'Текущий' : 'Заблокирован'}</span></p>
        `;
        
        bossesList.appendChild(bossElement);
    });
}

// Настройка достижений
function setupAchievements() {
    gameState.achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement ${achievement.earned ? 'earned' : 'locked'}`;
        achievementElement.innerHTML = `
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
            <div class="status">${achievement.earned ? '✓' : '✗'}</div>
        `;
        
        achievementsList.appendChild(achievementElement);
    });
}

// Проверка достижений
function checkAchievements() {
    let needsUpdate = false;
    
    gameState.achievements.forEach(achievement => {
        if (!achievement.earned && achievement.condition(gameState)) {
            achievement.earned = true;
            needsUpdate = true;
            
            // Уведомление о достижении
            showNotification(`Достижение: ${achievement.name}`);
        }
    });
    
    if (needsUpdate) {
        setupAchievements();
    }
}

// Настройка рейтинга
function setupLeaderboard() {
    // Демо-данные (в реальном приложении будут с сервера)
    gameState.leaderboard = [
        { name: "Люк Скайуокер", credits: 1500000, level: 30 },
        { name: "Хан Соло", credits: 1200000, level: 28 },
        { name: "Лея Органа", credits: 900000, level: 25 },
        { name: "Йода", credits: 800000, level: 24 },
        { name: "Оби-Ван Кеноби", credits: 750000, level: 23 },
        { name: "R2-D2", credits: 500000, level: 20 },
        { name: "C-3PO", credits: 300000, level: 18 },
        { name: "Чубакка", credits: 250000, level: 16 },
        { name: "Дарт Вейдер", credits: 200000, level: 15 },
        { name: "Император Палпатин", credits: 100000, level: 12 }
    ];
    
    // Добавление текущего игрока
    const playerName = tg.initDataUnsafe?.user?.first_name || "Игрок";
    const playerExists = gameState.leaderboard.some(player => player.name === playerName);
    
    if (!playerExists) {
        gameState.leaderboard.push({
            name: playerName,
            credits: gameState.credits,
            level: calculatePlayerLevel()
        });
    }
    
    updateLeaderboard();
}

// Обновление рейтинга
function updateLeaderboard() {
    // Сортировка по кредитам
    gameState.leaderboard.sort((a, b) => b.credits - a.credits);
    
    // Обновление статистики игрока
    const playerName = tg.initDataUnsafe?.user?.first_name || "Игрок";
    const playerIndex = gameState.leaderboard.findIndex(player => player.name === playerName);
    
    if (playerIndex !== -1) {
        gameState.leaderboard[playerIndex].credits = gameState.credits;
        gameState.leaderboard[playerIndex].level = calculatePlayerLevel();
    }
    
    // Отрисовка таблицы
    leaderboardBody.innerHTML = '';
    
    gameState.leaderboard.forEach((player, index) => {
        const row = document.createElement('tr');
        row.className = player.name === playerName ? 'current-player' : '';
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${formatNumber(player.credits)}</td>
            <td>${player.level}</td>
        `;
        
        leaderboardBody.appendChild(row);
    });
}

// Расчёт уровня игрока
function calculatePlayerLevel() {
    return Math.floor(Math.log10(gameState.credits + 1) * 10);
}

// Настройка сложности
function setupDifficulty() {
    difficultySelect.value = gameState.difficulty;
    
    difficultySelect.addEventListener('change', () => {
        gameState.difficulty = difficultySelect.value;
        saveGame();
    });
}

// Множитель сложности
function getDifficultyMultiplier() {
    switch (gameState.difficulty) {
        case 'easy': return 1.5;
        case 'medium': return 1;
        case 'hard': return 0.7;
        default: return 1;
    }
}

// Показать уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Форматирование чисел
function formatNumber(num) {
    return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Сохранение игры
function saveGame() {
    localStorage.setItem('swClickerSave', JSON.stringify(gameState));
}

// Загрузка игры
function loadGame() {
    const savedGame = localStorage.getItem('swClickerSave');
    if (savedGame) {
        const parsed = JSON.parse(savedGame);
        
        // Объединение сохранённого состояния с дефолтным
        gameState = {
            ...gameState,
            ...parsed,
            upgrades: parsed.upgrades || gameState.upgrades,
            bosses: parsed.bosses || gameState.bosses,
            achievements: parsed.achievements || gameState.achievements
        };
        
        // Пересчёт CPS
        calculateCPS();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);
