// Полная игровая логика
class StarWarsClickerGame {
    constructor() {
        this.state = {
            credits: 0,
            creditsPerSecond: 0,
            clickPower: 1,
            xp: 0,
            level: 1,
            xpToNextLevel: 100,
            prestigeLevel: 0,
            prestigeBonus: 0,
            lastUpdate: Date.now(),
            
            empire: {
                upgrades: [
                    { id: 1, name: "Штурмовики", description: "Базовые солдаты Империи", baseCost: 15, baseCps: 0.1, owned: 0, unlockLevel: 1 },
                    { id: 2, name: "TIE-истребители", description: "Базовые истребители Империи", baseCost: 100, baseCps: 0.5, owned: 0, unlockLevel: 1 },
                    { id: 3, name: "Звёздные Разрушители", description: "Основные корабли Империи", baseCost: 500, baseCps: 2, owned: 0, unlockLevel: 3 },
                    { id: 4, name: "Суперзвездёт", description: "Личный корабль Императора", baseCost: 3000, baseCps: 10, owned: 0, unlockLevel: 5 },
                    { id: 5, name: "Звезда Смерти", description: "Ультимативное оружие Империи", baseCost: 10000, baseCps: 50, owned: 0, unlockLevel: 10 }
                ],
                bosses: [
                    { id: 1, name: "Офицер Империи", health: 100, maxHealth: 100, reward: 1000, xp: 50, defeated: false, unlockLevel: 1 },
                    { id: 2, name: "Капитан Фазма", health: 500, maxHealth: 500, reward: 5000, xp: 100, defeated: false, unlockLevel: 2 },
                    { id: 3, name: "Гранд Мофф Таркин", health: 2000, maxHealth: 2000, reward: 20000, xp: 200, defeated: false, unlockLevel: 4 },
                    { id: 4, name: "Дарт Вейдер", health: 10000, maxHealth: 10000, reward: 100000, xp: 500, defeated: false, unlockLevel: 7 },
                    { id: 5, name: "Император Палпатин", health: 50000, maxHealth: 50000, reward: 500000, xp: 2000, defeated: false, unlockLevel: 10 }
                ],
                currentBossIndex: 0
            },
            
            rebels: {
                upgrades: [
                    { id: 1, name: "Повстанцы", description: "Базовые бойцы Альянса", baseCost: 20, baseCps: 0.2, owned: 0, unlockLevel: 1 },
                    { id: 2, name: "X-Wing", description: "Основные истребители Повстанцев", baseCost: 150, baseCps: 0.8, owned: 0, unlockLevel: 2 },
                    { id: 3, name: "Грузовые корабли", description: "Перевозка ресурсов", baseCost: 750, baseCps: 3, owned: 0, unlockLevel: 3 },
                    { id: 4, name: "Крейсеры", description: "Боевые корабли Альянса", baseCost: 4000, baseCps: 15, owned: 0, unlockLevel: 5 },
                    { id: 5, name: "Мон-Каламари", description: "Флагманские корабли", baseCost: 15000, baseCps: 75, owned: 0, unlockLevel: 8 }
                ],
                missions: [
                    { id: 1, name: "Спасение принцессы", description: "Спасти принцессу Лею", reward: 5000, xp: 100, progress: 0, required: 100, completed: false, unlockLevel: 2 },
                    { id: 2, name: "Уничтожение Звезды Смерти", description: "Атака на Звезду Смерти", reward: 25000, xp: 300, progress: 0, required: 300, completed: false, unlockLevel: 4 },
                    { id: 3, name: "Битва на Хоте", description: "Защита базы Эхо", reward: 100000, xp: 800, progress: 0, required: 500, completed: false, unlockLevel: 6 },
                    { id: 4, name: "Битва на Эндоре", description: "Уничтожение щита", reward: 500000, xp: 2000, progress: 0, required: 1000, completed: false, unlockLevel: 9 }
                ],
                fleet: [
                    { id: 1, name: "Тысячелетний Сокол", description: "Самый быстрый корабль в галактике", bonus: "x2 к доходу от кликов", unlocked: false, unlockLevel: 3 },
                    { id: 2, name: "Главный флот", description: "Основные силы Альянса", bonus: "x1.5 к доходу от улучшений", unlocked: false, unlockLevel: 6 },
                    { id: 3, name: "Эскадрилья Сопротивления", description: "Элитные пилоты", bonus: "+25% к урону по боссам", unlocked: false, unlockLevel: 9 }
                ]
            },
            
            jedi: {
                powers: [
                    { id: 1, name: "Телекинез", description: "Увеличивает силу клика", bonus: "+1 к силе клика", unlocked: false, unlockLevel: 2, cost: 5000 },
                    { id: 2, name: "Предвидение", description: "Увеличивает доход от улучшений", bonus: "+10% к доходу от улучшений", unlocked: false, unlockLevel: 3, cost: 15000 },
                    { id: 3, name: "Контроль разума", description: "Увеличивает награды от боссов", bonus: "+20% к наградам от боссов", unlocked: false, unlockLevel: 5, cost: 50000 },
                    { id: 4, name: "Молниеносная атака", description: "Увеличивает урон по боссам", bonus: "+50% к урону по боссам", unlocked: false, unlockLevel: 7, cost: 150000 },
                    { id: 5, name: "Мастер-джедай", description: "Удваивает весь доход", bonus: "x2 ко всем доходам", unlocked: false, unlockLevel: 10, cost: 500000 }
                ],
                achievements: [
                    { id: 1, name: "Первый кредит", description: "Заработайте свой первый кредит", earned: false, condition: (state) => state.credits >= 1, reward: 100, xp: 10 },
                    { id: 2, name: "Новичок", description: "Заработайте 100 кредитов", earned: false, condition: (state) => state.credits >= 100, reward: 500, xp: 25 },
                    { id: 3, name: "Инвестор", description: "Заработайте 1,000 кредитов", earned: false, condition: (state) => state.credits >= 1000, reward: 2000, xp: 50 },
                    { id: 4, name: "Магнат", description: "Заработайте 10,000 кредитов", earned: false, condition: (state) => state.credits >= 10000, reward: 10000, xp: 100 },
                    { id: 5, name: "Первый босс", description: "Победите первого босса", earned: false, condition: (state) => state.empire.bosses[0].defeated, reward: 5000, xp: 75 },
                    { id: 6, name: "Охотник на боссов", description: "Победите 3 боссов", earned: false, condition: (state) => state.empire.bosses.filter(b => b.defeated).length >= 3, reward: 25000, xp: 150 },
                    { id: 7, name: "Повстанец", description: "Выполните первую миссию", earned: false, condition: (state) => state.rebels.missions[0].completed, reward: 10000, xp: 100 },
                    { id: 8, name: "Герой Альянса", description: "Выполните все миссии", earned: false, condition: (state) => state.rebels.missions.every(m => m.completed), reward: 100000, xp: 500 },
                    { id: 9, name: "Падаван", description: "Достигните 5 уровня", earned: false, condition: (state) => state.level >= 5, reward: 25000, xp: 200 },
                    { id: 10, name: "Мастер-джедай", description: "Достигните 10 уровня", earned: false, condition: (state) => state.level >= 10, reward: 100000, xp: 500 }
                ]
            },
            
            leaderboard: [
                { name: "Люк Скайуокер", credits: 1500000, level: 30, power: 5000 },
                { name: "Хан Соло", credits: 1200000, level: 28, power: 4500 },
                { name: "Лея Органа", credits: 900000, level: 25, power: 4000 },
                { name: "Йода", credits: 800000, level: 24, power: 3800 },
                { name: "Оби-Ван Кеноби", credits: 750000, level: 23, power: 3700 },
                { name: "R2-D2", credits: 500000, level: 20, power: 3000 },
                { name: "C-3PO", credits: 300000, level: 18, power: 2500 },
                { name: "Чубакка", credits: 250000, level: 16, power: 2200 },
                { name: "Дарт Вейдер", credits: 200000, level: 15, power: 2000 },
                { name: "Император Палпатин", credits: 100000, level: 12, power: 1500 }
            ]
        };
        
        this.tg = window.Telegram.WebApp;
        this.playerName = this.tg.initDataUnsafe?.user?.first_name || "Игрок";
        this.initElements();
        this.loadGame();
        this.initEventListeners();
        this.render();
        this.startGameLoop();
    }
    
    initElements() {
        // Основные элементы
        this.creditsDisplay = document.getElementById('credits');
        this.cpsDisplay = document.getElementById('cps');
        this.clickButton = document.getElementById('click-button');
        this.attackButton = document.getElementById('attack-button');
        this.playerLevelDisplay = document.getElementById('player-level');
        this.xpBar = document.getElementById('xp-bar');
        this.xpText = document.getElementById('xp-text');
        this.clickPowerDisplay = document.getElementById('click-power');
        this.attackPowerDisplay = document.getElementById('attack-power');
        
        // Престиж
        this.prestigeButton = document.getElementById('prestige-button');
        this.prestigeBonusDisplay = document.getElementById('prestige-bonus');
        this.prestigeRequirementDisplay = document.getElementById('prestige-requirement');
        
        // Вкладки
        this.tabContents = document.querySelectorAll('.tab-content');
        this.tabButtons = document.querySelectorAll('.tab-button');
        
        // Империя
        this.empireUpgradesList = document.getElementById('empire-upgrades');
        this.empireBossesList = document.getElementById('empire-bosses');
        this.currentBossDisplay = document.getElementById('current-boss');
        this.bossHealthBar = document.getElementById('boss-health-bar');
        this.bossHealthText = document.getElementById('boss-health-text');
        this.bossRewardDisplay = document.getElementById('boss-reward');
        this.bossXpDisplay = document.getElementById('boss-xp');
        
        // Повстанцы
        this.rebelsUpgradesList = document.getElementById('rebels-upgrades');
        this.missionsList = document.getElementById('missions-list');
        this.fleetDisplay = document.getElementById('fleet-display');
        
        // Джедаи
        this.jediPowersList = document.getElementById('jedi-powers');
        this.achievementsList = document.getElementById('achievements-list');
        this.leaderboardBody = document.getElementById('leaderboard-body');
        
        // Уведомления
        this.notificationContainer = document.getElementById('notification-container');
    }
    
    initEventListeners() {
        // Кнопка клика
        this.clickButton.addEventListener('click', () => this.handleClick());
        this.clickButton.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        
        // Кнопка атаки
        this.attackButton.addEventListener('click', () => this.attackBoss());
        
        // Кнопка престижа
        this.prestigeButton.addEventListener('click', () => this.prestige());
        
        // Переключение вкладок
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }
    
    startGameLoop() {
        setInterval(() => {
            const now = Date.now();
            const deltaTime = (now - this.state.lastUpdate) / 1000; // в секундах
            this.state.lastUpdate = now;
            
            // Пассивный доход
            this.state.credits += this.state.creditsPerSecond * deltaTime;
            
            // Прогресс миссий
            this.updateMissions(deltaTime);
            
            // Проверка достижений
            this.checkAchievements();
            
            // Сохранение игры
            this.saveGame();
            
            // Обновление интерфейса
            this.render();
        }, 1000 / 30); // 30 FPS
    }
    
    handleClick() {
        // Базовый доход от клика
        let clickValue = this.state.clickPower;
        
        // Множитель от престижа
        clickValue *= 1 + this.state.prestigeBonus / 100;
        
        // Бонус от Тысячелетнего Сокола
        if (this.state.rebels.fleet[0].unlocked) {
            clickValue *= 2;
        }
        
        this.state.credits += clickValue;
        
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
        let damage = this.state.clickPower;
        
        // Бонус от эскадрильи Сопротивления
        if (this.state.rebels.fleet[2].unlocked) {
            damage *= 1.25;
        }
        
        // Бонус от силы джедаев
        if (this.state.jedi.powers[3].unlocked) {
            damage *= 1.5;
        }
        
        boss.health -= damage;
        
        if (boss.health <= 0) {
            boss.health = 0;
            boss.defeated = true;
            
            // Награда за босса
            let reward = boss.reward;
            if (this.state.jedi.powers[2].unlocked) {
                reward *= 1.2;
            }
            this.state.credits += reward;
            
            // Опыт за босса
            this.addXp(boss.xp);
            
            this.showNotification(`Босс побеждён: ${boss.name}`);
            
            // Переход к следующему боссу, если есть
            if (this.state.empire.currentBossIndex < this.state.empire.bosses.length - 1) {
                const nextBoss = this.state.empire.bosses[this.state.empire.currentBossIndex + 1];
                if (this.state.level >= nextBoss.unlockLevel) {
                    this.state.empire.currentBossIndex++;
                }
            }
        }
        
        this.render();
    }
    
    buyEmpireUpgrade(upgradeId) {
        const upgrade = this.state.empire.upgrades.find(u => u.id === upgradeId);
        if (!upgrade || this.state.level < upgrade.unlockLevel) return;
        
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
        if (!upgrade || this.state.level < upgrade.unlockLevel) return;
        
        const cost = this.getUpgradeCost(upgrade);
        if (this.state.credits >= cost) {
            this.state.credits -= cost;
            upgrade.owned++;
            this.calculateCps();
            this.render();
        }
    }
    
    unlockJediPower(powerId) {
        const power = this.state.jedi.powers.find(p => p.id === powerId);
        if (!power || this.state.level < power.unlockLevel || power.unlocked) return;
        
        if (this.state.credits >= power.cost) {
            this.state.credits -= power.cost;
            power.unlocked = true;
            
            // Применение бонусов
            if (powerId === 1) this.state.clickPower += 1;
            
            this.showNotification(`Сила разблокирована: ${power.name}`);
            this.render();
        }
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
        
        // Бонус от Предвидения
        if (this.state.jedi.powers[1].unlocked) {
            empireCps *= 1.1;
            rebelsCps *= 1.1;
        }
        
        // Бонус от Главного флота
        if (this.state.rebels.fleet[1].unlocked) {
            rebelsCps *= 1.5;
        }
        
        // Бонус от Мастер-джедая
        if (this.state.jedi.powers[4].unlocked) {
            empireCps *= 2;
            rebelsCps *= 2;
        }
        
        // Множитель от престижа
        const totalCps = (empireCps + rebelsCps) * (1 + this.state.prestigeBonus / 100);
        this.state.creditsPerSecond = totalCps;
    }
    
    getUpgradeCost(upgrade) {
        return Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.owned));
    }
    
    addXp(amount) {
        this.state.xp += amount;
        if (this.state.xp >= this.state.xpToNextLevel) {
            this.state.level++;
            this.state.xp -= this.state.xpToNextLevel;
            this.state.xpToNextLevel = Math.floor(this.state.xpToNextLevel * 1.5);
            this.showNotification(`Новый уровень: ${this.state.level}`);
            
            // Проверка разблокировки контента
            this.checkUnlocks();
        }
    }
    
    checkUnlocks() {
        // Проверка улучшений Империи
        this.state.empire.upgrades.forEach(upgrade => {
            if (this.state.level >= upgrade.unlockLevel && upgrade.owned === 0) {
                this.showNotification(`Доступно новое улучшение: ${upgrade.name}`);
            }
        });
        
        // Проверка улучшений Повстанцев
        this.state.rebels.upgrades.forEach(upgrade => {
            if (this.state.level >= upgrade.unlockLevel && upgrade.owned === 0) {
                this.showNotification(`Доступно новое улучшение: ${upgrade.name}`);
            }
        });
        
        // Проверка боссов
        const nextBoss = this.state.empire.bosses[this.state.empire.currentBossIndex + 1];
        if (nextBoss && this.state.level >= nextBoss.unlockLevel) {
            this.state.empire.currentBossIndex++;
            this.showNotification(`Новый босс: ${nextBoss.name}`);
        }
        
        // Проверка миссий
        this.state.rebels.missions.forEach(mission => {
            if (this.state.level >= mission.unlockLevel && !mission.completed && mission.progress === 0) {
                this.showNotification(`Доступна новая миссия: ${mission.name}`);
            }
        });
        
        // Проверка флота
        this.state.rebels.fleet.forEach(ship => {
            if (this.state.level >= ship.unlockLevel && !ship.unlocked) {
                ship.unlocked = true;
                this.showNotification(`Корабль разблокирован: ${ship.name}`);
            }
        });
        
        // Проверка сил джедаев
        this.state.jedi.powers.forEach(power => {
            if (this.state.level >= power.unlockLevel && !power.unlocked) {
                this.showNotification(`Доступна новая сила: ${power.name}`);
            }
        });
    }
    
    updateMissions(deltaTime) {
        this.state.rebels.missions.forEach(mission => {
            if (!mission.completed) {
                // Пассивный прогресс миссий
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
    
    checkAchievements() {
        this.state.jedi.achievements.forEach(achievement => {
            if (!achievement.earned && achievement.condition(this.state)) {
                achievement.earned = true;
                this.state.credits += achievement.reward;
                this.addXp(achievement.xp);
                this.showNotification(`Достижение: ${achievement.name}`);
            }
        });
    }
    
    prestige() {
        const requirement = this.getPrestigeRequirement();
        if (this.state.credits >= requirement) {
            this.state.prestigeLevel++;
            this.state.prestigeBonus += 10;
            this.state.credits = 0;
            this.state.creditsPerSecond = 0;
            this.state.clickPower = 1;
            this.state.xp = 0;
            this.state.level = 1;
            this.state.xpToNextLevel = 100;
            
            // Сброс улучшений
            this.state.empire.upgrades.forEach(u => u.owned = 0);
            this.state.rebels.upgrades.forEach(u => u.owned = 0);
            
            // Сброс боссов (но сохраняем победы)
            this.state.empire.currentBossIndex = 0;
            
            // Сброс миссий
            this.state.rebels.missions.forEach(m => {
                m.completed = false;
                m.progress = 0;
            });
            
            // Сохранение флота и сил джедаев
            this.calculateCps();
            this.showNotification(`Престиж ${this.state.prestigeLevel}! +10% к доходу`);
            this.render();
        }
    }
    
    getPrestigeRequirement() {
        return 1000000 * Math.pow(2, this.state.prestigeLevel);
    }
    
    switchTab(tabId) {
        // Скрыть все вкладки
        this.tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Деактивировать все кнопки
        this.tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Показать выбранную вкладку
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
        this.clickPowerDisplay.textContent = this.formatNumber(this.state.clickPower);
        
        // Опыт
        const xpPercent = (this.state.xp / this.state.xpToNextLevel) * 100;
        this.xpBar.style.setProperty('--xp-percent', `${xpPercent}%`);
        this.xpText.textContent = `${this.formatNumber(this.state.xp)}/${this.formatNumber(this.state.xpToNextLevel)}`;
        
        // Престиж
        this.prestigeBonusDisplay.textContent = this.state.prestigeBonus;
        const prestigeReq = this.getPrestigeRequirement();
        this.prestigeRequirementDisplay.textContent = this.formatNumber(prestigeReq);
        this.prestigeButton.disabled = this.state.credits < prestigeReq;
        
        // Империя
        this.renderEmpireUpgrades();
        this.renderBosses();
        
        // Повстанцы
        this.renderRebelsUpgrades();
        this.renderMissions();
        this.renderFleet();
        
        // Джедаи
        this.renderJediPowers();
        this.renderAchievements();
        this.renderLeaderboard();
    }
    
    renderEmpireUpgrades() {
        this.empireUpgradesList.innerHTML = '';
        
        this.state.empire.upgrades.forEach(upgrade => {
            if (this.state.level < upgrade.unlockLevel) return;
            
            const cost = this.getUpgradeCost(upgrade);
            const canAfford = this.state.credits >= cost;
            
            const upgradeElement = document.createElement('div');
            upgradeElement.className = `upgrade ${canAfford ? 'affordable' : ''}`;
            upgradeElement.innerHTML = `
                <h3>${upgrade.name}</h3>
                <p>${upgrade.description}</p>
                <p>Цена: <span class="cost">${this.formatNumber(cost)}</span></p>
                <p>Производит: <span class="cps">${this.formatNumber(upgrade.baseCps)}</span> кредитов/сек</p>
                <p>Куплено: <span class="owned">${upgrade.owned}</span></p>
            `;
            
            if (canAfford) {
                upgradeElement.addEventListener('click', () => this.buyEmpireUpgrade(upgrade.id));
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
        this.bossHealthText.textContent = `${this.formatNumber(currentBoss.health)}/${this.formatNumber(currentBoss.maxHealth)}`;
        this.bossRewardDisplay.textContent = this.formatNumber(currentBoss.reward);
        this.bossXpDisplay.textContent = currentBoss.xp;
        
        // Рассчёт урона
        let attackPower = this.state.clickPower;
        if (this.state.rebels.fleet[2].unlocked) attackPower *= 1.25;
        if (this.state.jedi.powers[3].unlocked) attackPower *= 1.5;
        this.attackPowerDisplay.textContent = this.formatNumber(attackPower);
        
        // Список боссов
        this.empireBossesList.innerHTML = '';
        
        this.state.empire.bosses.forEach((boss, index) => {
            if (this.state.level < boss.unlockLevel) return;
            
            const bossElement = document.createElement('div');
            bossElement.className = `boss ${boss.defeated ? 'defeated' : ''} ${index === this.state.empire.currentBossIndex ? 'current' : ''}`;
            bossElement.innerHTML = `
                <h3>${boss.name}</h3>
                <p>Здоровье: ${this.formatNumber(boss.maxHealth)}</p>
                <p>Награда: ${this.formatNumber(boss.reward)}</p>
                <p>Опыт: ${boss.xp}</p>
                <p>Статус: <span class="status">${boss.defeated ? 'Побеждён' : index === this.state.empire.currentBossIndex ? 'Текущий' : 'Заблокирован'}</span></p>
            `;
            
            if (!boss.defeated && index !== this.state.empire.currentBossIndex && this.state.level >= boss.unlockLevel) {
                bossElement.addEventListener('click', () => {
                    this.state.empire.currentBossIndex = index;
                    this.render();
                });
            }
            
            this.empireBossesList.appendChild(bossElement);
        });
    }
    
    renderRebelsUpgrades() {
        this.rebelsUpgradesList.innerHTML = '';
        
        this.state.rebels.upgrades.forEach(upgrade => {
            if (this.state.level < upgrade.unlockLevel) return;
            
            const cost = this.getUpgradeCost(upgrade);
            const canAfford = this.state.credits >= cost;
            
            const upgradeElement = document.createElement('div');
            upgradeElement.className = `upgrade ${canAfford ? 'affordable' : ''}`;
            upgradeElement.innerHTML = `
                <h3>${upgrade.name}</h3>
                <p>${upgrade.description}</p>
                <p>Цена: <span class="cost">${this.formatNumber(cost)}</span></p>
                <p>Производит: <span class="cps">${this.formatNumber(upgrade.baseCps)}</span> кредитов/сек</p>
                <p>Куплено: <span class="owned">${upgrade.owned}</span></p>
            `;
            
            if (canAfford) {
                upgradeElement.addEventListener('click', () => this.buyRebelsUpgrade(upgrade.id));
            }
            
            this.rebelsUpgradesList.appendChild(upgradeElement);
        });
    }
    
    renderMissions() {
        this.missionsList.innerHTML = '';
        
        this.state.rebels.missions.forEach(mission => {
            if (this.state.level < mission.unlockLevel) return;
            
            const progressPercent = (mission.progress / mission.required) * 100;
            
            const missionElement = document.createElement('div');
            missionElement.className = `mission ${mission.completed ? 'completed' : ''}`;
            missionElement.innerHTML = `
                <h3>${mission.name}</h3>
                <p>${mission.description}</p>
                <p>Награда: <span class="reward">${this.formatNumber(mission.reward)}</span> кредитов</p>
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
    
    renderFleet() {
        this.fleetDisplay.innerHTML = '';
        
        this.state.rebels.fleet.forEach(ship => {
            if (this.state.level < ship.unlockLevel) return;
            
            const shipElement = document.createElement('div');
            shipElement.className = `ship ${ship.unlocked ? 'unlocked' : ''}`;
            shipElement.innerHTML = `
                <h3>${ship.name}</h3>
                <img src="https://via.placeholder.com/80" alt="${ship.name}">
                <p>${ship.description}</p>
                <p><strong>Бонус:</strong> ${ship.bonus}</p>
                ${ship.unlocked ? '' : '<p class="unlock-info">Разблокируется на уровне ' + ship.unlockLevel + '</p>'}
            `;
            
            this.fleetDisplay.appendChild(shipElement);
        });
    }
    
    renderJediPowers() {
        this.jediPowersList.innerHTML = '';
        
        this.state.jedi.powers.forEach(power => {
            if (this.state.level < power.unlockLevel) return;
            
            const canAfford = this.state.credits >= power.cost && !power.unlocked;
            
            const powerElement = document.createElement('div');
            powerElement.className = `power ${power.unlocked ? 'unlocked' : ''} ${canAfford ? 'affordable' : ''}`;
            powerElement.innerHTML = `
                <h3>${power.name}</h3>
                <p class="description">${power.description}</p>
                <p class="bonus">${power.bonus}</p>
                ${power.unlocked ? '' : `
                    <p class="requirements">Требуется: ${this.formatNumber(power.cost)} кредитов</p>
                    <p class="requirements">Уровень ${power.unlockLevel}</p>
                `}
            `;
            
            if (canAfford) {
                powerElement.addEventListener('click', () => this.unlockJediPower(power.id));
            }
            
            this.jediPowersList.appendChild(powerElement);
        });
    }
    
    renderAchievements() {
        this.achievementsList.innerHTML = '';
        
        this.state.jedi.achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement ${achievement.earned ? 'earned' : ''}`;
            achievementElement.innerHTML = `
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
                <p>Награда: ${this.formatNumber(achievement.reward)} кредитов</p>
                <p>Опыт: ${achievement.xp}</p>
            `;
            
            this.achievementsList.appendChild(achievementElement);
        });
    }
    
    renderLeaderboard() {
        // Обновление текущего игрока в рейтинге
        const playerIndex = this.state.leaderboard.findIndex(p => p.name === this.playerName);
        const playerPower = this.calculatePlayerPower();
        
        if (playerIndex !== -1) {
            this.state.leaderboard[playerIndex].credits = Math.floor(this.state.credits);
            this.state.leaderboard[playerIndex].level = this.state.level;
            this.state.leaderboard[playerIndex].power = playerPower;
        } else {
            this.state.leaderboard.push({
                name: this.playerName,
                credits: Math.floor(this.state.credits),
                level: this.state.level,
                power: playerPower
            });
        }
        
        // Сортировка по силе
        this.state.leaderboard.sort((a, b) => b.power - a.power);
        
        // Отрисовка таблицы
        this.leaderboardBody.innerHTML = '';
        
        this.state.leaderboard.forEach((player, index) => {
            const row = document.createElement('tr');
            row.className = player.name === this.playerName ? 'current-player' : '';
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${this.formatNumber(player.credits)}</td>
                <td>${player.level}</td>
                <td>${this.formatNumber(player.power)}</td>
            `;
            
            this.leaderboardBody.appendChild(row);
        });
    }
    
    calculatePlayerPower() {
        // Рассчёт "силы" игрока для рейтинга
        let power = this.state.credits / 1000;
        power += this.state.level * 100;
        power += this.state.creditsPerSecond * 10;
        power += this.state.clickPower * 5;
        power += this.state.prestigeLevel * 500;
        return Math.floor(power);
    }
    
    formatNumber(num) {
        return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
    saveGame() {
        const saveData = {
            state: this.state,
            version: 1,
            timestamp: Date.now()
        };
        localStorage.setItem('swClickerSave', JSON.stringify(saveData));
    }
    
    loadGame() {
        const savedGame = localStorage.getItem('swClickerSave');
        if (savedGame) {
            try {
                const saveData = JSON.parse(savedGame);
                if (saveData.version === 1) {
                    // Миграция сохранений при необходимости
                    this.state = saveData.state;
                    this.state.lastUpdate = Date.now();
                    this.calculateCps();
                }
            } catch (e) {
                console.error('Ошибка загрузки сохранения:', e);
            }
        }
        
        // Добавление текущего игрока в рейтинг, если его там нет
        const playerExists = this.state.leaderboard.some(p => p.name === this.playerName);
        if (!playerExists) {
            this.state.leaderboard.push({
                name: this.playerName,
                credits: Math.floor(this.state.credits),
                level: this.state.level,
                power: this.calculatePlayerPower()
            });
        }
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const game = new StarWarsClickerGame();
    window.game = game; // Для отладки
    
    // Развернуть Telegram WebApp
    if (window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
    }
});
