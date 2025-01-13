async function loadProfile() {
    try {
        const userData = await window.electronAPI.getUserData();
        const characters = await window.electronAPI.getCharacters();

        const { updated } = await window.electronAPI.checkAchievements();
        if (updated) {
            console.log('Achievements updated during profile load.');
        }
        
        document.getElementById('usernameDisplay').textContent = userData.username;
        document.getElementById('userIcon').src = userData.icon;

        
        
        // Group characters by name or id
        const inventoryCounts = userData.inventory.reduce((acc, charId) => {
            const char = characters[charId];
            if (!acc[char.id]) {
                acc[char.id] = { char, count: 0 };
            }
            acc[char.id].count++;
            return acc;
        }, {});

        // characters without repeating
        const uniqueInventory = Object.values(inventoryCounts);

        // Show char with fav button
        const inventoryList = document.getElementById('inventoryList');
        inventoryList.innerHTML = '';
        uniqueInventory.forEach(item => {
            const charDiv = document.createElement('div');
            const isFavorite = (userData.favorites || []).includes(item.char.id);
            charDiv.className = 'character-card';
            charDiv.innerHTML = `
                <h4>${item.char.rarity} (x${item.count})</h4>
                <img src="../${item.char.image}" alt="${item.char.name}">
                <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" data-charid="${item.char.id}">
                    ${isFavorite ? '-' : '+'}
                </button>
            `;
            inventoryList.appendChild(charDiv);
        });

        // Show Not Obtained
        const missing = Object.values(characters).filter(char => !userData.inventory.includes(char.id));
        const missingList = document.getElementById('missingList');
        missingList.innerHTML = '';
        missing.forEach(char => {
            const charDiv = document.createElement('div');
            charDiv.className = 'character-card';
            charDiv.innerHTML = `
                <img src="../${char.image}" alt="${char.name}">
            `;
            missingList.appendChild(charDiv);
        });

        // Show Fav
        const favoriteList = document.getElementById('favoriteList');
        favoriteList.innerHTML = '';
        const favorites = userData.favorites || [];

        favorites.forEach(favId => {
            const favChar = characters[favId];
            if (favChar) {
                const favDiv = document.createElement('div');
                favDiv.className = 'character-splashart';
                favDiv.innerHTML = `
                    <div class="splashart-wrapper">
                        <img class="splashart-image" src="../${favChar.image}" alt="${favChar.name}">
                        <button class="favorite-btn favorited" data-charid="${favChar.id}">-</button>
                    </div>
                `;
                favoriteList.appendChild(favDiv);
            }
        });

        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const charId = parseInt(this.dataset.charid);
                const currentFavorites = userData.favorites || [];
                const isFavorited = currentFavorites.includes(charId);

                let newFavorites;
                if (isFavorited) {
                    newFavorites = currentFavorites.filter(id => id !== charId);
                } else {
                    newFavorites = [...currentFavorites, charId];
                }

                await window.electronAPI.setFavorites(newFavorites);
                loadProfile();
            });
        });

    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadAchievements() {
    try {
        
        const { updated, achievements } = await window.electronAPI.checkAchievements();
        if (updated) {
            console.log('Achievements updated during achievements load.');
        }

        const achievementsList = document.getElementById('achievementsList');
        achievementsList.innerHTML = '';

        Object.values(achievements).forEach(achievement => {
            const progress = (achievement.progress / achievement.target) * 100;
            const achievementDiv = document.createElement('div');
            achievementDiv.className = `achievement-item ${achievement.completed ? 'completed' : ''}`;
            achievementDiv.innerHTML = `
                <h3>${achievement.title}</h3>
                <p>${achievement.description}</p>
                <p>Progress: ${achievement.progress}/${achievement.target}</p>
                <div class="achievement-progress">
                    <div class="achievement-progress-bar" style="width: ${progress}%"></div>
                </div>
                ${achievement.completed ? `<p>Reward claimed: ${achievement.reward} coins</p>` : ''}
            `;
            achievementsList.appendChild(achievementDiv);
        });
    } catch (error) {
        console.error('Error loading achievements:', error);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('profile.html')) {
        loadProfile();
        
        const achievementsPopup = document.getElementById('achievementsPopup');
        const showAchievementsBtn = document.getElementById('showAchievements');
        const closeAchievementsBtn = document.getElementById('closeAchievements');
        
        showAchievementsBtn.addEventListener('click', () => {
            achievementsPopup.style.display = 'flex';
            loadAchievements();
        });
        
        closeAchievementsBtn.addEventListener('click', () => {
            achievementsPopup.style.display = 'none';
        });
        
        // Close popup when clicking outside
        achievementsPopup.addEventListener('click', (e) => {
            if (e.target === achievementsPopup) {
                achievementsPopup.style.display = 'none';
            }
        });
    }
});