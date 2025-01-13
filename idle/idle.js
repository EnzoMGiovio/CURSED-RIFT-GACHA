class IdleCoinsManager {
    constructor() {
        this.maxCoins = 6000;
        this.maxTime = 12 * 60 * 60 * 1000;
        this.coinsPerHour = this.maxCoins / 12;
        this.coinsPerMillisecond = this.coinsPerHour / (60 * 60 * 1000);
        
        this.initializeLastCollectionTime();
        this.setupElements();
        this.setupEventListeners();
        this.startTimer();
    }

    async initializeLastCollectionTime() {
        const userData = await window.electronAPI.getUserData();
        this.lastCollectionTime = userData.lastCollectionTime || Date.now();
        if (!userData.lastCollectionTime) {
            userData.lastCollectionTime = this.lastCollectionTime;
            await window.electronAPI.updateUserData(userData);
        }
    }

    setupElements() {
        this.currentCoinsElement = document.getElementById('current-coins');
        this.timeRemainingElement = document.getElementById('time-remaining');
        this.progressBar = document.getElementById('coins-progress');
        this.collectButton = document.getElementById('collect-btn');
    }

    setupEventListeners() {
        this.collectButton.addEventListener('click', () => this.collectCoins());
    }

    startTimer() {
        this.updateDisplay();
        setInterval(() => this.updateDisplay(), 1000);
    }

    calculateCurrentCoins() {
        const timeDiff = Date.now() - this.lastCollectionTime;
        const coins = Math.min(
            this.maxCoins,
            Math.floor(timeDiff * this.coinsPerMillisecond)
        );
        return coins;
    }

    formatTimeRemaining(milliseconds) {
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    async updateDisplay() {
        const currentCoins = this.calculateCurrentCoins();
        const progress = (currentCoins / this.maxCoins) * 100;
        
        this.currentCoinsElement.textContent = currentCoins.toLocaleString();
        this.progressBar.style.width = `${progress}%`;

        if (currentCoins < this.maxCoins) {
            const timeUntilMax = this.maxTime - (Date.now() - this.lastCollectionTime);
            this.timeRemainingElement.textContent = this.formatTimeRemaining(timeUntilMax);
        } else {
            this.timeRemainingElement.textContent = '00:00:00';
        }

        this.collectButton.disabled = currentCoins === 0;
        this.collectButton.classList.toggle('ready', currentCoins > 0);
    }

    async collectCoins() {
        const coinsToCollect = this.calculateCurrentCoins();
        if (coinsToCollect > 0) {
            try {
                const userData = await window.electronAPI.getUserData();
                userData.currency += coinsToCollect;
                userData.lastCollectionTime = Date.now();
                this.lastCollectionTime = userData.lastCollectionTime;
                await window.electronAPI.updateUserData(userData);
                this.updateDisplay();
            } catch (error) {
                console.error('Error collecting coins:', error);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const manager = new IdleCoinsManager();
    await manager.initializeLastCollectionTime();
});