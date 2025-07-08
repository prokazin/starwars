class StarWarsClicker {
    constructor() {
        this.state = {
            credits: 0,
            creditsPerSecond: 0,
            clickPower: 1,
            xp: 0,
            level: 1,
            xpToNextLevel: 100,
            
            empire: {
                upgrades: [
                    { id: 1, name: "Штурмовики", description: "Базовые солдаты Империи", baseCost: 15, baseCps: 0.1, owned: 0 },
                    { id: 2, name: "TIE-истребители", description: "Базовые истребители", baseCost: 100, baseCps: 0.5, owned: 0 },
                    { id: 3, name: "Звёздные Разрушители", description: "Основные корабли", baseCost: 500, baseCps: 2, owned: 0 }
                ],
                bosses: [
                    { id: 1, name: "Офицер Империи", health: 100, maxHealth: 100, reward: 1000, xp: 50, defeated: false },
                    { id: 2, name: "Дарт Вейдер", health: 500, maxHealth: 500, reward: 5000, xp: 100, defeated: false }
                ],
                currentBossIndex: 0
            },
            
            rebels: {
                upgrades: [
                    { id: 1, name: "Повстанцы", description: "Базовые бойцы", baseCost: 20, baseCps: 0.2, owned: 0 },
                    { id: 2, name: "X-Wing", description: "Основные истребители", baseCost: 150, baseCps: 0.8, owned: 0 }
                ],
                missions: [
                    { id: 1, name: "Спасение принцессы", description: "Спасти принцессу Лею", reward: 5000, xp: 100, progress: 0, required: 100, completed: false }
                ]
            }
        };
        
        this.tg = window.Telegram?.WebApp;
        this.initElements();
        this.initEventListeners();
        this.loadGame();
        this.render();
        this.startGameLoop();
    }
    
    initElements() {
        this.creditsDisplay = document.getElementById('credits');
        this.cpsDisplay = document.getElementById('cps');
        this.clickButton = document.getElementById('click-button');
        this.attackButton = document.getElementById('attack-button');
        this.playerLevelDisplay = document.getElementById('player-level');
        this.xpBar = document.getElementById('xp-bar');
        this.xpText = document.getElementById('xp-text');
        this.clickPowerDisplay = document.getElementById('click-power');
        this.attackPowerDisplay = document.getElementById('attack-power');
        this.empireUpgradesList = document.getElementById('empire-upgrades');
        this.rebelsUpgradesList = document.getElementById('rebels-upgrades');
        this.empireBossesList = document.getElementById('empire-bosses');
        this.missionsList = document.getElementById('missions-list');
        this.currentBossDisplay = document.getElementById('current-boss');
        this.bossHealthBar = document.getElementById('boss-health-bar');
        this.bossHealthText = document.getElementById('boss-health-text');
        this.bossRewardDisplay = document.getElementById('boss-reward');
        this.bossXpDisplay = document.getElementById('boss-xp');
        this.closeButton = document.getElementById('close-button');
        this.notificationContainer = document.getElementById('notification-container');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.tabButtons = document.querySelectorAll('.tab-button');
    }
    
    initEventListeners() {
        // Клик по основной кнопке
        this.clickButton.addEventListener('click', () => this.handleClick());
        this.clickButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleClick();
        }, { passive: false });
        
        // Атака босса
        this.attackButton.addEventListener('click', () => this.attackBoss());
        this.attackButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.attackBoss();
        }, { passive: false });
        
        // Переключение вкладок
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });
            
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            }, { passive: false });
        });
        
        // Кнопка закрытия для Telegram WebApp
        if (this.tg) {
            this.closeButton.style.display = 'block';
            this.closeButton.addEventListener('click', () => this.tg.close());
        }
    }
    
    startGameLoop() {
        setInterval(() => {
            const now = Date.now();
            const deltaTime = (now - (this.lastUpdate || now)) / 1000;
            this.lastUpdate = now;
            
            // Пассивный доход
            this.state.credits += this.state.creditsPerSecond * deltaTime;
            
            // Прогресс миссий
            this.updateMissions(deltaTime);
            
            // Сохранение и рендер
            this.saveGame();
            this.render();
        }, 1000 / 30);
    }
    
    handleClick() {
        this.state.credits += this.state.clickPower;
        
        // Прогресс миссий
        this.state.rebels.missions.forEach(mission => {
            if (!mission.completed) {
                mission.progress += 1;
                if (mission.progress >= mission.required) {
                    mission.completed = true;
                    this.state.credits += mission.reward;
                    this.addXp(mission.xp);
                    this.showNotification(`Миссия выполнена: ${mission.name}`);
                }
            }
        });
        
        this.render();
    }
    
    attackBoss() {
        const boss = this.state.empire.bosses[this.state.empire.currentBossIndex];
        boss.health -= this.state.clickPower;
        
        if (boss.health <= 0) {
            boss.health = 0;
            boss.defeated = true;
            this.state.credits += boss.reward;
            this.addXp(boss.xp);
            this.showNotification(`Босс побеждён: ${boss.name}`);
            
            // Переход к следующему боссу
            if (this.state.empire.currentBossIndex < this.state.empire.bosses.length - 1) {
                this.state.empire.currentBossIndex++;
            }
        }
        
        this.render();
    }
    
    buyEmpireUpgrade(upgradeId) {
        const upgrade = this.state.empire.upgrades.find(u => u.id === upgradeId);
        const cost = this.getUpgradeCost(upgrade);
        
        if (this.state.credits >= cost) {
            this.state.credits -= cost;
            upgrade.owned++;
            this.calculateCps();
            this.render();
        }
    }
    
    buyRebelsUpgrade(upgradeId) {
        const upgrade = this.state.rebels.upgrades.find(u => u.id === upgradeId);
        const cost = this.getUpgradeCost(upgrade);
        
        if (this.state.credits >= cost) {
            this.state.credits -= cost;
            upgrade.owned++;
            this.calculateCps();
            this.render();
        }
    }
    
    getUpgradeCost(upgrade) {
        return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned));
    }
    
    calculateCps() {
        // Доход от Имперских улучшений
        let empireCps = this.state.empire.upgrades.reduce((total, upgrade) => {
            return total + (upgrade.baseCps * upgrade.owned);
        }, 0);
        
        // Доход от Повстанческих улучшений
        let rebelsCps = this.state.rebels.upgrades.reduce((total, upgrade) => {
            return total + (upgrade.baseCps * upgrade.owned);
        }, 0);
        
        this.state.creditsPerSecond = empireCps + rebelsCps;
    }
    
    addXp(amount) {
        this.state.xp += amount;
        if (this.state.xp >= this.state.xpToNextLevel) {
            this.state.level++;
            this.state.xp -= this.state.xpToNextLevel;
            this.state.xpToNextLevel = Math.floor(this.state.xpToNextLevel * 1.5);
            this.showNotification(`Новый уровень: ${this.state.level}`);
        }
    }
    
    updateMissions(deltaTime) {
        this.state.rebels.missions.forEach(mission => {
            if (!mission.completed) {
                mission.progress += this.state.creditsPerSecond * deltaTime * 0.1;
                if (mission.progress >= mission.required) {
                    mission.completed = true;
                    this.state.credits += mission.reward;
                    this.addXp(mission.xp);
                    this.showNotification(`Миссия выполнена: ${mission.name}`);
                }
            }
        });
    }
    
    switchTab(tabId) {
        this.tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        this.tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(tabId).classList.add('active');
        this.tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            }
        });
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        this.notificationContainer.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
    
    render() {
        // Основная информация
        this.creditsDisplay.textContent = this.formatNumber(this.state.credits);
        this.cpsDisplay.textContent = this.formatNumber(this.state.creditsPerSecond);
        this.playerLevelDisplay.textContent = this.state.level;
        this.clickPowerDisplay.textContent = this.state.clickPower;
        
        // Опыт
        const xpPercent = (this.state.xp / this.state.xpToNextLevel) * 100;
        this.xpBar.style.setProperty('--xp-percent', `${xpPercent}%`);
        this.xpText.textContent = `${this.formatNumber(this.state.xp)}/${this.formatNumber(this.state.xpToNextLevel)}`;
        
        // Империя
        this.renderEmpireUpgrades();
        this.renderBosses();
        
        // Повстанцы
        this.renderRebelsUpgrades();
        this.renderMissions();
    }
    
    renderEmpireUpgrades() {
        this.empireUpgradesList.innerHTML = '';
        
        this.state.empire.upgrades.forEach(upgrade => {
            const cost = this.getUpgradeCost(upgrade);
            const canAfford = this.state.credits >= cost;
            
            const upgradeElement = document.createElement('div');
            upgradeElement.className = `upgrade ${canAfford ? 'affordable' : ''}`;
            upgradeElement.innerHTML = `
                <h3>${upgrade.name}</h3>
                <p>${upgrade.description}</p>
                <p>Цена: <span class="cost">${this.formatNumber(cost)}</span></p>
                <p>Производит: <span class="cps">${this.formatNumber(upgrade.baseCps)}</span>/сек</p>
                <p>Куплено: ${upgrade.owned}</p>
            `;
            
            if (canAfford) {
                upgradeElement.addEventListener('click', () => this.buyEmpireUpgrade(upgrade.id));
                upgradeElement.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.buyEmpireUpgrade(upgrade.id);
                }, { passive: false });
            }
            
            this.empireUpgradesList.appendChild(upgradeElement);
        });
    }
    
    renderBosses() {
        const currentBoss = this.state.empire.bosses[this.state.empire.currentBossIndex];
        
        // Текущий босс
        this.currentBossDisplay.textContent = currentBoss.name;
        const healthPercent = (currentBoss.health / currentBoss.maxHealth) * 100;
        this.bossHealthBar.style.setProperty('--health-percent', `${healthPercent}%`);
        this.bossHealthText.textContent = `${this.formatNumber(currentBoss.health)}/${currentBoss.maxHealth}`;
        this.bossRewardDisplay.textContent = this.formatNumber(currentBoss.reward);
        this.bossXpDisplay.textContent = currentBoss.xp;
        this.attackPowerDisplay.textContent = this.state.clickPower;
        
        // Список боссов
        this.empireBossesList.innerHTML = '';
        
        this.state.empire.bosses.forEach((boss, index) => {
            const bossElement = document.createElement('div');
            bossElement.className = `boss ${boss.defeated ? 'defeated' : ''} ${index === this.state.empire.currentBossIndex ? 'current' : ''}`;
            bossElement.innerHTML = `
                <h3>${boss.name}</h3>
                <p>Здоровье: ${boss.maxHealth}</p>
                <p>Награда: ${this.formatNumber(boss.reward)}</p>
                <p>Опыт: ${boss.xp}</p>
                <p>Статус: ${boss.defeated ? 'Побеждён' : index === this.state.empire.currentBossIndex ? 'Текущий' : 'Заблокирован'}</p>
            `;
            
            if (!boss.defeated && index !== this.state.empire.currentBossIndex && this.state.empire.bosses[index - 1]?.defeated) {
                bossElement.addEventListener('click', () => {
                    this.state.empire.currentBossIndex = index;
                    this.render();
                });
                
                bossElement.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.state.empire.currentBossIndex = index;
                    this.render();
                }, { passive: false });
            }
            
            this.empireBossesList.appendChild(bossElement);
        });
    }
    
    renderRebelsUpgrades() {
        this.rebelsUpgradesList.innerHTML = '';
        
        this.state.rebels.upgrades.forEach(upgrade => {
            const cost = this.getUpgradeCost(upgrade);
            const canAfford = this.state.credits >= cost;
            
            const upgradeElement = document.createElement('div');
            upgradeElement.className = `upgrade ${canAfford ? 'affordable' : ''}`;
            upgradeElement.innerHTML = `
                <h3>${upgrade.name}</h3>
                <p>${upgrade.description}</p>
                <p>Цена: <span class="cost">${this.formatNumber(cost)}</span></p>
                <p>Производит: <span class="cps">${this.formatNumber(upgrade.baseCps)}</span>/сек</p>
                <p>Куплено: ${upgrade.owned}</p>
            `;
            
            if (canAfford) {
                upgradeElement.addEventListener('click', () => this.buyRebelsUpgrade(upgrade.id));
                upgradeElement.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.buyRebelsUpgrade(upgrade.id);
                }, { passive: false });
            }
            
            this.rebelsUpgradesList.appendChild(upgradeElement);
        });
    }
    
    renderMissions() {
        this.missionsList.innerHTML = '';
        
        this.state.rebels.missions.forEach(mission => {
            const progressPercent = (mission.progress / mission.required) * 100;
            
            const missionElement = document.createElement('div');
            missionElement.className = `mission ${mission.completed ? 'completed' : ''}`;
            missionElement.innerHTML = `
                <h3>${mission.name}</h3>
                <p>${mission.description}</p>
                <p>Награда: ${this.formatNumber(mission.reward)} кредитов</p>
                <p>Опыт: ${mission.xp}</p>
                ${mission.completed ? '' : `
                    <div class="progress">
                        <div class="progress-bar" style="width: ${progressPercent}%"></div>
                    </div>
                    <p>Прогресс: ${this.formatNumber(mission.progress)}/${this.formatNumber(mission.required)}</p>
                `}
            `;
            
            this.missionsList.appendChild(missionElement);
        });
    }
    
    formatNumber(num) {
        return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
    saveGame() {
        localStorage.setItem('swClickerSave', JSON.stringify(this.state));
    }
    
    loadGame() {
        const savedGame = localStorage.getItem('swClickerSave');
        if (savedGame) {
            this.state = JSON.parse(savedGame);
            this.calculateCps();
        }
        
        // Инициализация Telegram WebApp
        if (this.tg) {
            this.tg.expand();
            this.tg.enableClosingConfirmation();
        }
    }
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    const game = new StarWarsClicker();
    window.game = game; // Для отладки
});
